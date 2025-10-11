import express from 'express';
import { 
  registerController, 
  confirmSignUpController, 
  loginController, 
  getUserInfoController,
  getLoginUrlController,
  getCognitoStatusController,
  enableMfaController,
  disableMfaController,
  getMfaStatusController,
  respondMfaChallengeController
} from '../controllers/cognitoAuthController';
import { authenticateToken } from '../middleware/cognitoAuthMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cognito Auth
 *   description: AWS Cognito authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user with AWS Cognito
 *     tags: [Cognito Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "luke.skywalker@rebellion.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "ForceAwakens123!"
 *               affiliation:
 *                 type: string
 *                 enum: [jedi, sith, rebel, empire, neutral]
 *                 example: "jedi"
 *     responses:
 *       201:
 *         description: User registered successfully - confirmation required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userSub:
 *                   type: string
 *                 codeDeliveryDetails:
 *                   type: object
 *       400:
 *         description: Bad request - invalid input or user already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerController);

/**
 * @swagger
 * /api/auth/confirm:
 *   post:
 *     summary: Confirm user registration with verification code
 *     tags: [Cognito Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - confirmationCode
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "luke.skywalker@rebellion.com"
 *               confirmationCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Account confirmed successfully
 *       400:
 *         description: Invalid or expired confirmation code
 *       500:
 *         description: Internal server error
 */
router.post('/confirm', confirmSignUpController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user with AWS Cognito
 *     tags: [Cognito Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "luke.skywalker@rebellion.com"
 *               password:
 *                 type: string
 *                 example: "ForceAwakens123!"
 *     responses:
 *       200:
 *         description: Login successful - returns JWT tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token for API authentication
 *                 idToken:
 *                   type: string
 *                   description: JWT ID token with user claims
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token for obtaining new access tokens
 *                 expiresIn:
 *                   type: number
 *                   description: Token expiration time in seconds
 *                 tokenType:
 *                   type: string
 *                   example: "Bearer"
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: User not confirmed or missing fields
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginController);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user information
 *     tags: [Cognito Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 affiliation:
 *                   type: string
 *                 groups:
 *                   type: array
 *                   items:
 *                     type: string
 *                 userStatus:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/me', authenticateToken, getUserInfoController);

/**
 * @swagger
 * /api/auth/login-url:
 *   get:
 *     summary: Get Cognito Hosted UI login URL
 *     tags: [Cognito Auth]
 *     parameters:
 *       - in: query
 *         name: redirect_uri
 *         schema:
 *           type: string
 *         description: URL to redirect after successful login
 *         example: "http://localhost:3000/dashboard"
 *     responses:
 *       200:
 *         description: Login URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loginUrl:
 *                   type: string
 *                   description: URL for Cognito Hosted UI login
 *                 message:
 *                   type: string
 *       500:
 *         description: Configuration error
 */
router.get('/login-url', getLoginUrlController);

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Check Cognito configuration status
 *     tags: [Cognito Auth]
 *     responses:
 *       200:
 *         description: Configuration status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cognitoConfigured:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 setupGuide:
 *                   type: string
 */
router.get('/status', getCognitoStatusController);

/**
 * @swagger
 * /api/auth/mfa/enable:
 *   post:
 *     summary: Enable MFA for authenticated user
 *     tags: [Cognito Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+5511999999999"
 *     responses:
 *       200:
 *         description: MFA enabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
router.post('/mfa/enable', authenticateToken, enableMfaController);

/**
 * @swagger
 * /api/auth/mfa/disable:
 *   post:
 *     summary: Disable MFA for authenticated user
 *     tags: [Cognito Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA disabled successfully
 */
router.post('/mfa/disable', authenticateToken, disableMfaController);

/**
 * @swagger
 * /api/auth/mfa/status:
 *   get:
 *     summary: Get MFA status for authenticated user
 *     tags: [Cognito Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA status retrieved
 */
router.get('/mfa/status', authenticateToken, getMfaStatusController);

/**
 * @swagger
 * /api/auth/mfa/verify:
 *   post:
 *     summary: Respond to MFA challenge
 *     tags: [Cognito Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session
 *               - mfaCode
 *               - username
 *             properties:
 *               session:
 *                 type: string
 *                 description: Session from initial login attempt
 *               mfaCode:
 *                 type: string
 *                 example: "123456"
 *               username:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: MFA verified successfully
 */
router.post('/mfa/verify', respondMfaChallengeController);

export default router;