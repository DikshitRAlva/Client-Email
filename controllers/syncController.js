const {
  syncEmailsForUser,
  syncEmailsWithDelta,
} = require('../services/syncService');
const client = require('../elasticsearch');

// Handle sync request
const syncController = async (req, res) => {
  const { userId } = req.body; // Expecting userId in the request body

  try {
    // Fetch user from Elasticsearch to get the access token and deltaLink
    const user = await client.get({
      index: 'users',
      id: userId,
    });

    if (!user || !user._source || !user._source.accessToken) {
      throw new Error('Access token is missing or invalid in Elasticsearch');
    }

    const accessToken = user._source.accessToken;
    const deltaLink = user._source.deltaLink || null; // Retrieve deltaLink if available

    // If deltaLink exists, perform delta sync; otherwise, perform the initial sync
    let nextDeltaLink = null;
    if (deltaLink) {
      nextDeltaLink = await syncEmailsWithDelta(accessToken, userId, deltaLink);
    } else {
      await syncEmailsForUser(accessToken, userId); // First-time sync
    }

    // Update the user's deltaLink in Elasticsearch for the next sync (if deltaLink was used)
    if (nextDeltaLink) {
      await client.update({
        index: 'users',
        id: userId,
        body: {
          doc: {
            deltaLink: nextDeltaLink, // Store new deltaLink for future syncs
          },
        },
      });
    }

    res.json({ success: true, message: 'Synchronization completed.' });
  } catch (error) {
    console.error('Error during synchronization:', error.message);
    res
      .status(500)
      .json({ error: 'Synchronization failed', details: error.message });
  }
};

module.exports = { syncController };
