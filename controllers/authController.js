const authService = require('../services/authService');
const { v4: uuidv4 } = require('uuid');
const client = require('../elasticsearch');

const getAuthUrl = async (req, res) => {
  try {
    const authUrl = await authService.getAuthUrl();
    res.status(200).json({ authUrl });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate authentication URL',
      details: error.message,
    });
  }
};

const handleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const tokenResponse = await authService.acquireTokenByCode(code);

    if (!tokenResponse.accessToken) {
      return res.status(500).json({ error: 'Failed to fetch access token' });
    }

    const userId = uuidv4();

    // Store user data in Elasticsearch
    await client.index({
      index: 'users',
      id: userId,
      body: {
        userId,
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken || null,
        expiresOn: tokenResponse.expiresOn || null,
      },
    });

    res.status(200).json({
      message: 'Authentication successful',
      userId,
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken || null,
      expiresOn: tokenResponse.expiresOn || null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to handle callback', details: error.message });
  }
};

module.exports = { getAuthUrl, handleCallback };
