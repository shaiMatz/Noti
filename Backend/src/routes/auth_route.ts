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
 *     Post:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user who created the post
 *           format: objectId
 *         content:
 *           type: string
 *           description: The content of the post
 *           nullable: true
 *         location:
 *           type: string
 *           description: Location where the post was made
 *         image:
 *           type: string
 *           description: URL to an image associated with the post
 *           nullable: true
 *         geo:
 *           type: object
 *           required:
 *             - type
 *             - coordinates
 *           properties:
 *             type:
 *               type: string
 *               description: Type of the geo object, must be 'Point'
 *               enum:
 *                 - Point
 *             coordinates:
 *               type: array
 *               description: Coordinates array [longitude, latitude]
 *               items:
 *                 type: number
 *               minItems: 2
 *               maxItems: 2
 *       required:
 *         - userId
 *         - location
 *         - geo
 *       additionalProperties: false
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the user
 *         firstName:
 *           type: string
 *           description: First name of the user
 *         lastName:
 *           type: string
 *           description: Last name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         profilePicture:
 *           type: string
 *           description: URL to the user's profile picture
 *           nullable: true
 *         level:
 *           type: number
 *           default: 1
 *           description: Level of the user
 *         points:
 *           type: number
 *           default: 0
 *           description: Points accumulated by the user
 *         carType:
 *           type: string
 *           description: Type of car owned by the user
 *           nullable: true
 *         tokens:
 *           type: array
 *           items:
 *             type: string
 *           description: List of auth tokens for the user
 *         passwordHash:
 *           type: string
 *           description: Hashed password of the user
 *       required:
 *         - _id
 *         - firstName
 *         - lastName
 *         - email
 *         - passwordHash
 *       additionalProperties: false
 * 
 * 
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

/**
 * @swagger
 * /auth/googleLogin:
 *   post:
 *     summary: Authenticates a user via Google OAuth token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google OAuth access token received from the frontend
 *     responses:
 *       200:
 *         description: Authentication successful, returns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Bad request, possible issues with the token provided
 *       401:
 *         description: Unauthorized, token validation failed
 */
router.post("/googleLogin", auth.googleLogin);

export default router;
