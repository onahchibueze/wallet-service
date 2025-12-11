/**
 * @swagger
 * tags:
 *   - name: Wallet
 *     description: Wallet operations (balance, transfer, transactions, deposits)
 *   - name: Payments
 *     description: Deposit via Paystack
 *   - name: API Keys
 *     description: Manage API keys for service-to-service access
 *   - name: Auth
 *     description: User authentication
 */

/**
 * @swagger
 * /keys/rollover:
 *   post:
 *     summary: Rollover (regenerate) an existing API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldKeyId:
 *                 type: string
 *               expiry:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: API key rolled over successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newApiKey:
 *                   type: string
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */

/**
 * @swagger
 * /wallet/balance:
 *   get:
 *     summary: Get wallet balance (in kobo)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: integer
 *                   example: 1500000
 */

/**
 * @swagger
 * /wallet/transfer:
 *   post:
 *     summary: Transfer funds to another wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wallet_number:
 *                 type: string
 *                 example: '4566678954356'
 *               amount:
 *                 type: integer
 *                 example: 300000
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'Transfer completed'
 */

/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     summary: Get wallet transaction history
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   walletId:
 *                     type: string
 *                   type:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   counterparty:
 *                     type: string
 */

/**
 * @swagger
 * /wallet/deposit:
 *   post:
 *     summary: Initialize a deposit
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 example: 500000
 *     responses:
 *       200:
 *         description: Deposit initialized
 */

/**
 * @swagger
 * /wallet/deposit/{reference}/status:
 *   get:
 *     summary: Check deposit status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Deposit reference
 *     responses:
 *       200:
 *         description: Deposit status
 */

/**
 * @swagger
 * /wallet/paystack/webhook:
 *   post:
 *     summary: Paystack webhook handler
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */

/**
 * @swagger
 * /keys/create:
 *   post:
 *     summary: Create a new API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: API key created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["read", "deposit"]
 *                 expiry:
 *                   type: string
 *                   example: "1D"
 */
