import express from "express";
import auth from "../controllers/auth_controller";
import authenticate from "../common/auth_middleware";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Auth
 * description: User authentication
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         firstName:
 *          type: string
 *          description: The user first name
 *         lastName:
 *          type: string
 *          description: The user last name
 *       example:
 *         email: 'bob@gmail.com'
 *         password: '123456'
 *         firstName: 'Bob'
 *         lastName: 'Smith'
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: login existing user by email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The acess & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.post("/login", auth.login);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/register", auth.register);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: logout a user
 *     tags: [Auth]
 *     description: need to provide the access token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: logout completed successfully
 */
router.post("/logout", authenticate, auth.logout);
/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: get a new access and refresh tokens using the refresh token
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The acess & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.post("/refreshToken", auth.refreshToken);


router.post("/googleLogin", auth.googleLogin);

export default router;
