const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');
const client = require('../elasticsearch'); // Import your Elasticsearch client

// Utility function to handle rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchEmailsWithRateLimitHandling = async (url, accessToken) => {
  let emailData = [];
  let nextLink = url;

  try {
    while (nextLink) {
      const response = await axios.get(nextLink, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 429) {
        const retryAfter = response.headers['retry-after'] || 30; // Default to 30 seconds if not specified
        console.log(`Rate limit hit. Retrying in ${retryAfter} seconds.`);
        await delay(retryAfter * 1000); // Retry after the specified delay
        continue;
      }

      emailData = [...emailData, ...response.data.value];
      nextLink = response.data['@odata.nextLink']; // Continue if there's more data
    }

    return emailData;
  } catch (error) {
    console.error(
      'Error during email synchronization:',
      error.response?.data || error.message
    );
    throw new Error('Failed to fetch emails from Outlook.');
  }
};

// Function for initial email sync
const syncEmailsForUser = async (accessToken, userId) => {
  const url = 'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages';

  // Fetch emails with rate limit handling
  let emailData = await fetchEmailsWithRateLimitHandling(url, accessToken);

  if (emailData.length === 0) {
    console.log('No emails found for user:', userId);
    return { success: false, message: 'No emails found.' };
  }

  // Store or update emails in Elasticsearch
  for (const email of emailData) {
    await client.index({
      index: `emails-${userId}`,
      id: email.id, // Email ID is used as a unique identifier
      body: email, // Store the email data
    });
  }

  return { success: true, count: emailData.length };
};

// Function to handle delta sync for continuous monitoring
const syncEmailsWithDelta = async (accessToken, userId, deltaLink = null) => {
  let url =
    deltaLink ||
    'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages/delta';

  const emailData = await fetchEmailsWithRateLimitHandling(url, accessToken);

  // Store or update the emails in Elasticsearch with unique identifiers
  for (const email of emailData) {
    await client.index({
      index: `emails-${userId}`,
      id: email.id,
      body: email,
    });
  }

  // Return the deltaLink to continue monitoring future changes
  const nextDeltaLink = emailData['@odata.nextLink'] || null;
  return nextDeltaLink;
};

module.exports = { syncEmailsForUser, syncEmailsWithDelta };
