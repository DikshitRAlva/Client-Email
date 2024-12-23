const express = require('express');
const { getAuthUrl, handleCallback } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /api/auth/outlook:
 *   get:
 *     summary: Get authentication URL for Outlook.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Authentication URL generated.
 *       500:
 *         description: Failed to generate authentication URL.
 */
router.get('/outlook', getAuthUrl);

/**
 * @swagger
 * /api/auth/callback:
 *   get:
 *     summary: Handle Outlook authentication callback.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Authentication successful.
 *       500:
 *         description: Failed to handle authentication callback.
 */
router.get('/callback', handleCallback);

module.exports = router;
