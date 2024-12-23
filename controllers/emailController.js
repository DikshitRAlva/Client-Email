const { Client } = require('@elastic/elasticsearch');
const client = require('../elasticsearch'); // Elasticsearch client setup

// Controller to get emails from Elasticsearch
const getEmails = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from route parameter

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Query Elasticsearch for emails related to this userId
    const result = await client.search({
      index: `emails-${userId}`, // Index specific to the userId
      body: {
        query: {
          match_all: {}, // Retrieve all emails for this user
        },
        size: 10, // Limit to the first 10 emails, can be adjusted
      },
    });
    const body = result;

    // Ensure 'body.hits' exists and has results
    if (!body.hits || body.hits.total.value === 0) {
      return res
        .status(404)
        .json({ message: 'No emails found for this user.' });
    }

    // Extract the emails from the response
    const emails = body.hits.hits.map((hit) => hit._source); // Extract _source (email data)

    return res.status(200).json({ success: true, emails });
  } catch (error) {
    console.error('Error retrieving emails:', error.message);
    return res
      .status(500)
      .json({ error: 'Failed to retrieve emails', details: error.message });
  }
};

module.exports = { getEmails };
