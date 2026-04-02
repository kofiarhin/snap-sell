# Phase 5 — Auth Extras (Forgot/Reset Password)

## Goal
Implement forgot password and reset password flows (backend + frontend).

## Current State
- Backend: No forgot/reset password routes, no token generation, no email service
- Frontend: Placeholder pages from Phase 1
- User model has no `resetToken` or `resetTokenExpiry` fields

## Tasks

### 5.1 Add reset token fields to User model
**File:** `server/models/User.js`

Add fields:
- `resetPasswordToken` (String)
- `resetPasswordExpires` (Date)

Add instance method: `createPasswordResetToken()` that generates a crypto token, hashes it, sets expiry (e.g., 1 hour), and returns the unhashed token.

### 5.2 Choose email transport
**Decision needed:** Use Nodemailer with one of:
- SMTP (e.g., Gmail, Mailtrap for dev, SendGrid/Mailgun for prod)
- Resend (simple API)

**Recommended:** Nodemailer + environment-driven SMTP config. Use Mailtrap for dev.

### 5.3 Create email utility
**File:** `server/utils/email.js`

- Configure Nodemailer transport from env vars (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`)
- `sendPasswordResetEmail(to, resetUrl)` function
- HTML + text email template

### 5.4 Add env vars for email
Update `server/config/env.js` Zod schema to include email config vars.
Update `server/.env.example`.

### 5.5 Backend routes + controller + service
**Routes:** Add to `server/routes/auth.routes.js`:
- `POST /forgot-password` (public)
- `POST /reset-password/:token` (public)

**Controller:** Add to `server/controllers/auth.controller.js`:
- `forgotPassword` — validate email, generate token, send email
- `resetPassword` — validate token, update password, clear token

**Service:** Add to `server/services/auth.service.js`:
- `forgotPassword(email)` — find user, generate token, send email
- `resetPassword(token, newPassword)` — hash token, find user with valid token, update password

**Validators:** Add to `server/validators/auth.validators.js`:
- `forgotPasswordSchema` — email required
- `resetPasswordSchema` — password + confirmPassword

### 5.6 Frontend: ForgotPasswordPage
**File:** `client/src/pages/ForgotPasswordPage.jsx`

- Email input form
- Submit calls `POST /api/auth/forgot-password`
- Success: show "Check your email" message
- Error: show error message
- Link back to login

### 5.7 Frontend: ResetPasswordPage
**File:** `client/src/pages/ResetPasswordPage.jsx`

- Read `:token` from URL params
- New password + confirm password form
- Submit calls `POST /api/auth/reset-password/:token`
- Success: redirect to login with success message
- Error: show error (invalid/expired token)

### 5.8 Update auth service + hooks
- `client/src/services/authService.js` — add `forgotPassword(email)`, `resetPassword(token, data)`
- `client/src/hooks/mutations/useAuthMutations.js` — add `useForgotPassword`, `useResetPassword`

### 5.9 Update LoginPage
Add "Forgot password?" link to `/forgot-password`.

## New Dependencies
- `nodemailer` (backend)

## New Env Vars
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`

## Files Created
- `server/utils/email.js`

## Files Modified
- `server/models/User.js`
- `server/routes/auth.routes.js`
- `server/controllers/auth.controller.js`
- `server/services/auth.service.js`
- `server/validators/auth.validators.js`
- `server/config/env.js`
- `server/.env.example`
- `client/src/pages/ForgotPasswordPage.jsx` (replace stub)
- `client/src/pages/ResetPasswordPage.jsx` (replace stub)
- `client/src/services/authService.js`
- `client/src/hooks/mutations/useAuthMutations.js`
- `client/src/pages/LoginPage.jsx` (add forgot link)

## Acceptance Criteria
- User submits email → receives reset email
- Reset link with valid token → can set new password
- Expired/invalid token → clear error message
- After reset → redirect to login
- Rate-limited to prevent abuse
