const express = require('express');
const { getEmails } = require('../controllers/emailController'); // Import the controller function
const router = express.Router();

// Route to get emails for a specific user
/**
 * @swagger
 * /api/emails/{userId}:
 *   get:
 *     summary: Retrieve locally stored emails for a specific user.
 *     tags: [Emails]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Local user ID to fetch the stored emails.
 *     responses:
 *       200:
 *         description: Successfully retrieved emails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 emails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       subject:
 *                         type: string
 *                         example: "Welcome to the service"
 *                       sender:
 *                         type: string
 *                         example: "support@example.com"
 *                       body:
 *                         type: string
 *                         example: "Hello, welcome to our service!"
 *                       receivedDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-23T10:00:00Z"
 *       404:
 *         description: No emails found for the provided user ID.
 *       500:
 *         description: Internal server error while fetching emails.
 */
router.get('/:userId', getEmails); // Accepts userId in the URL

module.exports = router;
