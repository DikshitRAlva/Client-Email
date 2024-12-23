const express = require('express');
const { syncController } = require('../controllers/syncController');
const router = express.Router();

/**
 * @swagger
 * /api/sync:
 *   post:
 *     summary: Synchronize emails for a user.
 *     tags: [Synchronization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *               - userId
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: OAuth token for accessing the user's Outlook account.
 *               userId:
 *                 type: string
 *                 description: Local user ID for associating data.
 *     responses:
 *       200:
 *         description: Synchronization completed successfully.
 *       500:
 *         description: Synchronization failed.
 */
router.post('/', syncController);

module.exports = router;
