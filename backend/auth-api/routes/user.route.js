import express from "express";
import {
  test,
  update,
  deleteUser,
  signout,
  getUsers,
  getUserById,
  updatePassword,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         photoURL:
 *           type: string
 *         isAdmin:
 *           type: boolean
 *       required:
 *         - id
 *         - username
 *         - email
 */

/**
 * @swagger
 * /api/user/test:
 *   get:
 *     summary: Test API endpoint
 *     description: Returns a test message to verify the API is working.
 *     responses:
 *       200:
 *         description: API is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is working.
 */
router.get("/test", test);

/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Update user details
 *     description: Update user details such as username, email, or password.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       403:
 *         description: Forbidden (e.g., unauthorized user)
 *       500:
 *         description: Internal server error
 */
router.put("/update/:id", verifyToken, update);

/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a specific user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account was deleted.
 *       403:
 *         description: Forbidden (e.g., unauthorized user)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", verifyToken, deleteUser);

/**
 * @swagger
 * /api/user/signout:
 *   get:
 *     summary: Sign out a user
 *     description: Clear the user's authentication token and sign them out.
 *     responses:
 *       200:
 *         description: User signed out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signed out user.
 *       500:
 *         description: Internal server error
 */
router.get("/signout", signout);

/**
 * @swagger
 * /api/user/get-users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users (admin only).
 *     parameters:
 *       - in: query
 *         name: startIndex
 *         schema:
 *           type: integer
 *         description: The starting index for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of users to return per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 totalUsers:
 *                   type: integer
 *                 lastMonthUsers:
 *                   type: integer
 *       403:
 *         description: Forbidden (e.g., unauthorized user)
 *       500:
 *         description: Internal server error
 */
router.get("/get-users", verifyToken, getUsers);

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", getUserById);

/**
 * @swagger
 * /api/user/update-password/{id}:
 *   put:
 *     summary: Update user password
 *     description: Update the password for a specific user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., invalid password length or incorrect current password)
 *       403:
 *         description: Forbidden (e.g., unauthorized user)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/update-password/:id", verifyToken, updatePassword);

export default router;
