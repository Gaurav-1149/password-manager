# SecureVault — Personal Password Manager

SecureVault is a full-stack password manager built with React, Express, MongoDB, JWT auth, bcrypt, AES-256-CBC encryption, zxcvbn password scoring, Tailwind CSS, and optional Nodemailer OTP login.

## Security Notes

- Master passwords are bcrypt-hashed with 12 salt rounds.
- Vault passwords and notes are encrypted with AES-256-CBC before storage.
- Encryption keys are derived at runtime from the master password with PBKDF2 and 100,000 iterations.
- JWTs expire in 1 hour.
- Login is rate-limited to 5 attempts per 15 minutes.
- The frontend logs users out after 15 minutes of inactivity.
- 2FA OTP codes expire after 10 minutes.
- Audit logs are written for sensitive actions.

## Setup

1. Install MongoDB locally and start it.
2. Copy `.env.example` to `.env` and update secrets:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
npm run install:all
```

4. Seed demo data:

```bash
npm run seed
```

Demo login:

- Email: `demo@securevault.test`
- Master password: `DemoMasterPassword!2026`

5. Start the API:

```bash
npm run dev
```

6. In a second terminal, start the frontend:

```bash
npm run client
```

Open `http://localhost:3000`. The API runs on `http://localhost:5050`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-otp`
- `POST /api/auth/logout`
- `PUT /api/auth/change-master-password`
- `PUT /api/auth/2fa`
- `DELETE /api/auth/account`
- `GET /api/vault`
- `POST /api/vault`
- `PUT /api/vault/:id`
- `DELETE /api/vault/:id`
- `GET /api/vault/search`
- `GET /api/vault/health`
- `GET /api/vault/export`
- `POST /api/vault/import`
- `POST /api/tools/generate`
- `POST /api/tools/check-breach`
- `GET /api/audit`

## HaveIBeenPwned

The breach-check route supports `HIBP_API_KEY` in `.env`. Without a valid key, the external API may reject authenticated breach account checks.
# password-manager
