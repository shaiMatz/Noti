import express from "express";
const router = express.Router();
import UserController from "../controllers/user_controller";
import authenticate from "../common/auth_middleware";


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Retrieve the authenticated user's details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, token required
 */
router.get("/", authenticate, UserController.getUser.bind(UserController));

/**
 * @swagger
 * /user/:
 *   put:
 *     summary: Edit the authenticated user's details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, token required
 */
router.put("/", authenticate, UserController.editUser.bind(UserController));

/**
 * @swagger
 * /user/:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized, token required
 */
router.delete("/", authenticate, UserController.deleteUser.bind(UserController));

/**
 * @swagger
 * /user/points:
 *   get:
 *     summary: Increase points for the authenticated user as a reminder
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Points increased successfully, user level might be updated
 *       401:
 *         description: Unauthorized, token required
 */
router.get(
  "/points",
  authenticate,
  UserController.increasePointsForReminder.bind(UserController)
);



export default router;

