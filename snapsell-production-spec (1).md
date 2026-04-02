# SnapSell — Production Readiness Specification (v1)

## 1. System Overview

SnapSell is a MERN marketplace platform with:

- Seller-managed listings
- Buyer inquiry threads (no accounts in v1)
- Admin moderation layer
- Cloudinary-based media pipeline
- Cookie-based authentication

Architecture:

```text
React (Vite + Tailwind)
  ↓
TanStack Query + Services Layer
  ↓
Express API
  ↓
MongoDB (Mongoose)
  ↓
Cloudinary (media)
```

---

## 2. Current System State

### Implemented
- Auth system (JWT in HTTP-only cookies)
- Seller + Admin roles
- Product CRUD + status transitions
- Inquiry system (thread-based)
- Category model + seed
- Cloudinary signed upload flow
- Frontend dashboards (seller + admin)
- API structure + controllers/services split

### Missing for Production
- Test coverage (backend + frontend)
- Rate limiting + security middleware
- Provider bootstrapping (frontend runtime blocker)
- Full validation coverage
- Media verification + cleanup guarantees
- Pagination consistency
- CI/CD + deployment config
- Structured logging + observability

---

## 3. Production Requirements

### 3.1 Environment & Config

All secrets must be in `.env`, validated at startup, and never accessed directly outside config modules.

#### Backend
```env
NODE_ENV=
PORT=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Frontend
```env
VITE_API_URL=
VITE_CLOUDINARY_CLOUD_NAME=
```

---

### 3.2 Authentication

- JWT in HTTP-only cookies
- Roles: admin, seller
- Required profile image on registration

Must add:
- rate limiting
- brute-force protection
- token validation

---

### 3.3 Media Upload (Cloudinary)

Flow:
1. Request signature
2. Upload directly
3. Store `{ url, publicId }`

Must enforce:
- image validation
- cleanup on replace/delete
- prevent invalid payload injection

---

### 3.4 Product System

- Must have ≥1 image
- Slug unique
- Only owner can mutate

Missing:
- pagination for seller listings
- stricter validation

---

### 3.5 Inquiry System

- Only for active products
- Seller-only replies
- Auto-close on sold

Missing:
- pagination
- rate limiting
- contact validation

---

### 3.6 Category System

- DB-backed
- Seeded
- No frontend hardcoding

---

### 3.7 Admin System

- Manage sellers + listings

Missing:
- moderation tools
- category management
- audit logs

---

## 4. API Standards

### Base
`/api`

### Success
```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "",
    "message": "",
    "details": {}
  }
}
```

---

## 5. Security Requirements

Must include:
- helmet
- rate limiting
- validation
- role-based access

Missing:
- CSRF strategy
- logging strategy

---

## 6. Frontend Architecture

- services/
- hooks/
- features/
- components/
- pages/

Rules:
- no API in components
- use TanStack Query

Missing:
- Providers setup (critical)
- test coverage

---

## 7. Testing Requirements

Backend (Jest):
- auth
- products
- inquiries

Frontend (Vitest):
- routes
- auth flow
- product UI

Current: none implemented

---

## 8. Performance Requirements

- pagination required
- indexed queries
- image optimization

---

## 9. Observability

- request logging
- error logging

Missing:
- structured logs
- monitoring

---

## 10. Deployment Requirements

Must include:
- .env.example
- build scripts
- seed scripts

Missing:
- CI/CD
- health checks

---

## 11. Production Checklist

- App boots correctly
- Auth works via cookies
- Rate limiting enabled
- Validation complete
- Cloudinary secure
- Pagination implemented
- Tests passing
- Logging active

---

## Final Summary

SnapSell is feature-complete but requires hardening before production.

