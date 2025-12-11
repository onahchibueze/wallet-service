# 💸 Wallet Service API

## Overview

A robust and secure backend service built with Node.js, Express, and Mongoose for managing user wallets, API keys, and facilitating secure transactions with Paystack integration. It features Google OAuth for user authentication and flexible API key management for programmatic access.

## Features

- **Google OAuth Integration**: Seamless user authentication through Google accounts.
- **JWT-Based Authentication**: Secure access to user-specific endpoints using JSON Web Tokens.
- **API Key Management**: Generate and manage API keys with granular permissions and expiry settings for external applications.
- **Secure Fund Transfers**: Facilitate transfers between internal wallets with robust transactional integrity using MongoDB sessions.
- **Paystack Deposit Integration**: Initialize and verify deposits into wallets via the Paystack payment gateway.
- **Idempotent Webhook Handling**: Process Paystack webhook notifications reliably to prevent double-spending or incorrect balance updates.
- **Wallet Balance Retrieval**: Easily fetch the current balance for an authenticated user's wallet.
- **Comprehensive Transaction History**: View a detailed record of all wallet activities, including deposits and transfers.
- **Dynamic Wallet Number Generation**: Automatically assigns unique 13-digit wallet numbers upon user registration.

## Technologies Used

| Technology                  | Description                                            | Link                                                                                                   |
| :-------------------------- | :----------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **Node.js**                 | JavaScript runtime for server-side development.        | [nodejs.org](https://nodejs.org/)                                                                      |
| **Express.js**              | Fast, unopinionated, minimalist web framework.         | [expressjs.com](https://expressjs.com/)                                                                |
| **Mongoose**                | MongoDB object modeling for Node.js.                   | [mongoosejs.com](https://mongoosejs.com/)                                                              |
| **MongoDB**                 | NoSQL database for flexible data storage.              | [mongodb.com](https://www.mongodb.com/)                                                                |
| **Passport.js**             | Authentication middleware for Node.js.                 | [passportjs.org](https://www.passportjs.org/)                                                          |
| **Passport-Google-OAuth20** | Google OAuth 2.0 strategy for Passport.js.             | [github.com/jaredhanson/passport-google-oauth2](https://github.com/jaredhanson/passport-google-oauth2) |
| **JSON Web Tokens (JWT)**   | Compact, URL-safe means of representing claims.        | [jwt.io](https://jwt.io/)                                                                              |
| **Paystack API**            | Payment gateway for online transactions.               | [paystack.com](https://paystack.com/)                                                                  |
| **Axios**                   | Promise-based HTTP client for the browser and Node.js. | [axios-http.com](https://axios-http.com/)                                                              |
| **Crypto**                  | Node.js built-in cryptography module.                  | [nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html)                                       |
| **Dotenv**                  | Loads environment variables from a `.env` file.        | [www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv)                                   |
| **Swagger-UI-Express**      | API documentation generation for Express apps.         | [www.npmjs.com/package/swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)           |

## Getting Started

### Installation

Follow these steps to set up the project locally:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/onahchibueze/wallet-service.git
    cd wallet-service
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Create `.env` file**:
    Create a `.env` file in the root directory and populate it with the required environment variables. See the "Environment Variables" section for details.

4.  **Run the application**:
    ```bash
    npm run dev
    # Or for production:
    # npm start
    ```
    The server will start on the specified port, usually `3000`.

### Environment Variables

All required environment variables must be defined in a `.env` file in the project root.

- `PORT`: The port on which the server will run.
  - Example: `PORT=3000`
- `MONGO_URI`: Your MongoDB connection string.
  - Example: `MONGO_URI=mongodb://localhost:27017/wallet-service-db`
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
  - Example: `GOOGLE_CLIENT_ID=your_google_client_id_here`
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret.
  - Example: `GOOGLE_CLIENT_SECRET=your_google_client_secret_here`
- `GOOGLE_CALLBACK_URL`: The callback URL configured for your Google OAuth application.
  - Example: `GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback`
- `JWT_SECRET`: A strong secret key for signing JWTs.
  - Example: `JWT_SECRET=supersecretjwtkey`
- `PAYSTACK_SECRET_KEY`: Your Paystack secret key.
  - Example: `PAYSTACK_SECRET_KEY=sk_test_yourpaystacksecretkey`

## Usage

After setting up and running the server, you can interact with the Wallet Service API.
First, authenticate using the Google OAuth flow to obtain a JWT. This JWT will be used for most authenticated endpoints. For programmatic access, you can create API keys with specific permissions.

The API documentation is available via Swagger UI once the server is running. Navigate to `http://localhost:3000/api-docs` (replace `3000` with your `PORT` if different) to explore all available endpoints and test them directly.

Most endpoints require authentication. You can authenticate either with a JWT in the `Authorization: Bearer <token>` header or with an API key in the `x-api-key: <your-api-key>` header, depending on the endpoint and required permissions.

## API Documentation

### Base URL

The base URL for all API endpoints is relative to your server's address. For local development, this is typically `http://localhost:3000`.

### Authentication

Endpoints are secured using either JWT (for user sessions) or API Keys (for programmatic access).

- **JWT**: Include in `Authorization` header as `Bearer <token>`.
- **API Key**: Include in `x-api-key` header. Some API key endpoints require specific permissions (`deposit`, `transfer`, `read`).

### Endpoints

#### GET /auth/google

**Overview**: Initiates the Google OAuth authentication flow.
**Request**:
N/A
**Response**:
Redirects the user to the Google login page.
**Errors**:
N/A (Client-side redirect)

#### GET /auth/google/callback

**Overview**: Handles the callback from Google OAuth after successful authentication, generating and returning a JWT.
**Request**:
N/A (Handled by Passport.js callback)
**Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjgzYTY5MjE0Mjc5NGE4YzI0MTQwMCIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcwNzExMTY5OSwiZXhwIjoxNzA3MTE1Mjk5fQ.signature"
}
```

**Errors**:

- `401 Unauthorized`: Google authentication failed or user could not be processed.
- `500 Internal Server Error`: Server error during user creation or token generation.

#### POST /keys/create

**Overview**: Creates a new API key for the authenticated user.
**Authentication**: JWT required.
**Request**:

```json
{
  "permissions": ["deposit", "transfer", "read"],
  "expiry": "1D"
}
```

- `permissions`: An array of strings specifying allowed actions (e.g., `"deposit"`, `"transfer"`, `"read"`). Optional, defaults to empty.
- `expiry`: A string defining the key's expiry duration. Optional. Valid values: `"1H"` (1 Hour), `"1D"` (1 Day), `"1M"` (1 Month), `"1Y"` (1 Year). If omitted, the key does not expire.
  **Response**:

```json
{
  "message": "API key created successfully",
  "apiKey": "sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  "expiresAt": "2024-10-27T10:00:00.000Z",
  "permissions": ["deposit", "transfer", "read"]
}
```

**Errors**:

- `400 Bad Request`: Maximum of 5 active API keys allowed per user reached, or invalid expiry format.
- `401 Unauthorized`: Missing or invalid JWT.
- `500 Internal Server Error`: Failed to create API key.

#### POST /keys/rollover

**Overview**: Revokes an existing API key and generates a new one for the authenticated user, optionally with new permissions and expiry.
**Authentication**: JWT required.
**Request**:

```json
{
  "oldKeyId": "sk_oldkeyvalue",
  "permissions": ["deposit", "transfer"],
  "expiry": "1M"
}
```

- `oldKeyId`: The API key string to be revoked. Required.
- `permissions`: An array of strings specifying allowed actions for the new key. Optional, defaults to empty.
- `expiry`: A string defining the new key's expiry duration. Optional. Valid values: `"1H"`, `"1D"`, `"1M"`, `"1Y"`. If omitted, the key does not expire.
  **Response**:

```json
{
  "message": "key rolled over successfully",
  "oldKeyId": "sk_oldkeyvalue",
  "newApiKey": "sk_newkeyvalue",
  "expiresAt": "2024-11-27T10:00:00.000Z"
}
```

**Errors**:

- `401 Unauthorized`: Missing or invalid JWT.
- `404 Not Found`: The `oldKeyId` was not found or does not belong to the authenticated user.
- `500 Internal Server Error`: Failed to rollover API key.

#### POST /wallet/transfer

**Overview**: Transfers a specified amount from the authenticated user's wallet to another wallet identified by its wallet number.
**Authentication**: JWT or API Key (`transfer` permission) required.
**Request**:

```json
{
  "amount": 5000,
  "wallet_number": "4123456789012"
}
```

- `amount`: The amount to transfer in NGN (minimum 100, i.e., ₦1.00). Required.
- `wallet_number`: The 13-digit wallet number of the recipient. Required.
  **Response**:

```json
{
  "status": "success",
  "message": "Transfer completed",
  "data": {
    "amount": 5000,
    "recipient_wallet_number": "4123456789012",
    "new_balance": 15000
  }
}
```

**Errors**:

- `400 Bad Request`: Invalid request (e.g., `amount` less than 100), "Sender wallet not found", "Recipient wallet not found", "Cannot transfer to your own wallet", "Insufficient balance", or "Transfer failed".
- `401 Unauthorized`: Missing or invalid JWT/API Key.
- `403 Forbidden`: API Key missing `transfer` permission.
- `500 Internal Server Error`: General server error.

#### POST /wallet/deposit

**Overview**: Initializes a deposit transaction through Paystack.
**Authentication**: JWT or API Key (`deposit` permission) required.
**Request**:

```json
{
  "amount": 10000
}
```

- `amount`: The amount to deposit in NGN. Required.
  **Response**:

```json
{
  "authorization_url": "https://checkout.paystack.com/abcdefgh",
  "reference": "your_paystack_reference_uuid"
}
```

- `authorization_url`: URL to redirect the user to complete the payment on Paystack.
- `reference`: A unique reference for this transaction.
  **Errors**:

* `401 Unauthorized`: Missing or invalid JWT/API Key.
* `403 Forbidden`: API Key missing `deposit` permission.
* `500 Internal Server Error`: Paystack initialization failed.

#### GET /wallet/deposit/status/:reference

**Overview**: Checks the verification status of a Paystack deposit transaction using its reference.
**Authentication**: JWT or API Key (`deposit` permission) required.
**Request**:
N/A (reference is part of the URL path)
**Response**:

```json
{
  "status": "success",
  "amount": 10000
}
```

- `status`: The current status of the deposit (`success`, `pending`, `failed`).
- `amount`: The amount deposited in NGN.
  **Errors**:

* `401 Unauthorized`: Missing or invalid JWT/API Key.
* `403 Forbidden`: API Key missing `deposit` permission.
* `500 Internal Server Error`: Paystack verification failed.

#### GET /wallet/balance

**Overview**: Retrieves the current balance of the authenticated user's wallet.
**Authentication**: JWT required.
**Request**:
N/A
**Response**:

```json
{
  "balance": 25000.5
}
```

- `balance`: The current balance in NGN.
  **Errors**:

* `401 Unauthorized`: Missing or invalid JWT.
* `404 Not Found`: Wallet not found for the authenticated user.
* `500 Internal Server Error`: Failed to fetch balance.

#### GET /wallet/transactions

**Overview**: Retrieves the transaction history for the authenticated user's wallet.
**Authentication**: JWT required.
**Request**:
N/A
**Response**:

```json
[
  {
    "type": "deposit",
    "amount": 5000,
    "status": "success"
  },
  {
    "type": "transfer",
    "amount": 1000,
    "status": "success"
  },
  {
    "type": "transfer",
    "amount": 2500,
    "status": "success"
  }
]
```

- `type`: Type of transaction (`deposit`, `transfer`).
- `amount`: The amount involved in the transaction.
- `status`: The status of the transaction (`success`, `pending`, `failed`).
  **Errors**:

* `401 Unauthorized`: Missing or invalid JWT.
* `404 Not Found`: Wallet not found for the authenticated user.
* `500 Internal Server Error`: Failed to fetch transactions.

#### POST /wallet/paystack/webhook

**Overview**: Endpoint for Paystack to send webhook notifications regarding transaction events (e.g., `charge.success`). This endpoint processes payment success events idempotently.
**Authentication**: Paystack `x-paystack-signature` header verification.
**Request**:
Raw JSON body sent by Paystack.

```json
{
  "event": "charge.success",
  "data": {
    "id": 1234567,
    "domain": "test",
    "status": "success",
    "reference": "your_paystack_reference_uuid",
    "amount": 1000000,
    "currency": "NGN",
    "customer": {
      "email": "customer@example.com"
    }
  }
}
```

**Response**:

- `200 OK`: If the webhook is successfully processed or has been processed previously (idempotent).
  **Errors**:
- `400 Bad Request`: Invalid `x-paystack-signature`, or an invalid transaction state (e.g., transaction not pending).
- `500 Internal Server Error`: Webhook processing failed due to server error.

## Contributing

We welcome contributions to enhance the Wallet Service API! If you're interested in contributing, please follow these guidelines:

1.  **Fork the repository** 🍴 and clone it to your local machine.
2.  **Create a new branch** 🌿 for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
3.  **Make your changes** ✨, ensuring they adhere to the project's coding standards.
4.  **Write clear and concise commit messages** 📝.
5.  **Test your changes thoroughly** ✅ to prevent regressions.
6.  **Push your branch** 🚀 to your forked repository.
7.  **Open a Pull Request** 💡 to the `main` branch of the original repository, describing your changes in detail.

## License

This project is licensed under the ISC License.
