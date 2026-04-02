# Phase 9 — Security

## Goal
Add rate limiting, input sanitization, secure headers, and audit security posture.

## Tasks

### 9.1 Rate limiting
**New dependency:** `express-rate-limit`

Apply rate limits:
- **Global:** 100 requests per 15 minutes per IP (generous default)
- **Auth routes:** 5 requests per 15 minutes (login, register, forgot-password)
- **Inquiry creation:** 10 per hour per IP (prevent spam)
- **Upload signature:** 20 per 15 minutes per IP

**File:** `server/middleware/rateLimiter.js` (new)

Create named limiters and apply in `server/app.js` or individual route files.

### 9.2 Input sanitization
**New dependency:** `express-mongo-sanitize`

- Add `mongoSanitize()` middleware in `app.js` to strip `$` and `.` from user input
- Prevents NoSQL injection attacks

### 9.3 Secure headers
**New dependency:** `helmet`

- Add `helmet()` middleware in `app.js`
- Sets security headers (X-Content-Type-Options, X-Frame-Options, etc.)

### 9.4 Cookie security audit
**File:** `server/config/cookie.js`

Verify:
- `httpOnly: true`
- `secure: true` in production
- `sameSite: 'strict'` or `'lax'`
- `maxAge` set appropriately

### 9.5 CORS audit
**File:** `server/app.js`

Verify:
- `origin` uses `CLIENT_URL` from env (not `*`)
- `credentials: true`
- No wildcard in production

### 9.6 No secrets in logs
Audit all `console.log` and error handler output to ensure:
- No JWT tokens logged
- No passwords logged
- No API keys logged
- Error handler doesn't leak stack traces in production

### 9.7 JWT security
- Verify token expiry is reasonable (e.g., 7 days)
- Verify secret is strong (env var, not hardcoded)

## New Dependencies
- `express-rate-limit`
- `express-mongo-sanitize`
- `helmet`

## Files Created
- `server/middleware/rateLimiter.js`

## Files Modified
- `server/app.js` (add helmet, mongoSanitize, rate limiters)
- `server/routes/auth.routes.js` (auth rate limiter)
- `server/routes/inquiry.routes.js` (inquiry rate limiter)
- `server/routes/upload.routes.js` (upload rate limiter)
- `server/config/cookie.js` (audit)
- `package.json` (new deps)

## Acceptance Criteria
- Rapid auth attempts get 429 responses
- NoSQL injection payloads are sanitized
- Security headers present in responses
- Cookies are secure in production
- No secrets in error responses or logs
