const express = require('express');
const ctrlUsers = require('../../controller/users');
const auth = require('../../middleware/auth');
const checkBlacklist = require('../../middleware/checkBlacklist');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Endpoints related to user operations
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: e-mail
 *               password:
 *                 type: string
 *                 description: password
 *               name:
 *                 type: string
 *                 description: name
 *             example:
 *               email: noreply@mail.com
 *               password: UserPassword
 *               name: John
 *       required: true
 *     responses:
 *        '201':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: JWT token
 *                  refresh:
 *                    type: string
 *                    description: refresh token
 *                  user:
 *                    type: object
 *                    properties:
 *                      email:
 *                        type: string
 *                        description: e-mail
 *                      name:
 *                        type: string
 *                        description: name
 *                example:
 *                  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                  refresh: eyhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzBkZDk4NmE5MGRkMTUyMDNmNzA3MSIsImlhdCI6MTY5MDc5ODEyNiwiZXhwIjoxNjkxNDAyOTI2fQ.t8_R7mnTnme7g9cHAX8PU-uTeQrMnjGkxEUjBud6uvc
 *                  user:
 *                    email: noreply@mail.com
 *                    name: John
 *        '400':
 *          description: Invalid input
 *        '409':
 *          description: Email in use
 *        '500':
 *          description: Internal server error
 */

router.post('/signup', ctrlUsers.signup);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: e-mail
 *               password:
 *                 type: string
 *                 description: password
 *             example:
 *               email: noreply@mail.com
 *               password: UserPassword
 *       required: true
 *     responses:
 *        '200':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: JWT token
 *                  refresh:
 *                    type: string
 *                    description: refresh token
 *                  user:
 *                    type: object
 *                    properties:
 *                      email:
 *                        type: string
 *                        description: e-mail
 *                      name:
 *                        type: string
 *                        description: name
 *                example:
 *                  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                  refresh: eyhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzBkZDk4NmE5MGRkMTUyMDNmNzA3MSIsImlhdCI6MTY5MDc5ODEyNiwiZXhwIjoxNjkxNDAyOTI2fQ.t8_R7mnTnme7g9cHAX8PU-uTeQrMnjGkxEUjBud6uvc
 *                  user:
 *                    email: noreply@mail.com
 *                    name: John
 *        '400':
 *          description: Invalid input
 *        '401':
 *          description: Wrong email or password
 *        '500':
 *          description: Internal server error
 */

router.post('/login', ctrlUsers.login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Logs out current logged in user session
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT token in format 'Bearer [token]'
 *         required: true
 *         schema:
 *           type: string
 *           default: Bearer [token]
 *     responses:
 *        '204':
 *          description: The user is logged out
 *        '401':
 *          description: Not authorized
 *        '500':
 *          description: Internal server error
 */

router.post('/logout', checkBlacklist, auth, ctrlUsers.logout);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get information about current user
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT token in format 'Bearer [token]'
 *         required: true
 *         schema:
 *           type: string
 *           default: Bearer [token]
 *     responses:
 *        '200':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    type: object
 *                    properties:
 *                      email:
 *                        type: string
 *                        description: e-mail
 *                      name:
 *                        type: string
 *                        description: name
 *                example:
 *                  user:
 *                    email: noreply@mail.com
 *                    name: John
 *        '401':
 *          description: Not authorized
 *        '500':
 *          description: Internal server error
 */

router.get('/current', checkBlacklist, auth, ctrlUsers.getCurrent);

/**
 * @swagger
 * /api/users/refresh:
 *   post:
 *     tags:
 *       - Users
 *     summary: Refresh Access token by refresh token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh:
 *                 type: string
 *                 description: refresh token
 *             example:
 *               refresh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzBkZDk4NmE5MGRkMTUyMDNmNzA3MSIsImlhdCI6MTY5MDc5ODEyNiwiZXhwIjoxNjkxNDAyOTI2fQ.t8_R7mnTnme7g9cHAX8PU-uTeQrMnjGkxEUjBud6uvc
 *       required: true
 *     responses:
 *        '201':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: JWT token
 *                  refresh:
 *                    type: string
 *                    description: refresh token
 *                example:
 *                  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                  refresh: eyhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzBkZDk4NmE5MGRkMTUyMDNmNzA3MSIsImlhdCI6MTY5MDc5ODEyNiwiZXhwIjoxNjkxNDAyOTI2fQ.t8_R7mnTnme7g9cHAX8PU-uTeQrMnjGkxEUjBud6uvc
 *        '403':
 *          description: Invalid refresh token
 *        '500':
 *          description: Internal server error
 */

router.post('/refresh', ctrlUsers.refresh);

module.exports = router;
