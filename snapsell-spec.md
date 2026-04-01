# SnapSell — Updated Production Technical Specification

## 1. System Architecture

### 1.1 High-Level Architecture
```text
Client (React + Vite + Tailwind)
  ↓
Query/Mutation Hooks (TanStack Query)
  ↓
Services/API Layer (Axios client)
  ↓
Backend (Node.js + Express)
  ↓
MongoDB (Mongoose)
  ↓
Cloudinary (media storage)
```

### 1.2 Separation of Concerns

#### Client
- UI rendering only
- TanStack Query manages server state
- Redux Toolkit manages auth/UI-only global state
- Raw API calls live in `services/`
- Components do not contain API business logic

#### Server
- Validates env and request input
- Handles auth and authorization
- Enforces business rules
- Owns DB access
- Owns Cloudinary signature generation and media lifecycle cleanup

---

## 2. Environment & Configuration

### 2.1 Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
COOKIE_NAME=snapsell_token
COOKIE_SECURE=false
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MAX_FILE_SIZE_MB=5
BCRYPT_SALT_ROUNDS=12
```

### 2.2 Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=
```

### 2.3 Configuration Rules
- Never read raw `process.env` outside `server/config/`
- Validate env vars at startup with Zod
- Fail fast on missing/invalid env values
- Provide `.env.example` for client and server
- Only expose safe `VITE_*` values to the client

### 2.4 Backend Config Modules
```text
server/config/
  env.js
  db.js
  cloudinary.js
  cookie.js
```

---

## 3. Authentication & Session Strategy

### 3.1 Auth Model
- Authenticated roles: `admin`, `seller`
- Public marketplace users are buyers/visitors without required accounts in v1
- Passwords hashed with bcrypt
- JWT issued by backend after login/register

### 3.2 Session Transport
- JWT stored in **HTTP-only cookie**
- `secure` enabled in production
- `sameSite` set to `strict` unless cross-site deployment requires `lax`/`none`
- No localStorage token persistence

### 3.3 Auth Rules
- Seller profile image is required at registration
- Suspended/inactive sellers cannot perform seller actions
- Role checks are enforced on the server only

---

## 4. Media Upload Strategy

### 4.1 Production Upload Flow
Use a **backend-signed direct-to-Cloudinary upload** flow.

### 4.2 Flow
1. Frontend requests upload signature from backend
2. Backend validates intent/folder/resource type and returns signed params
3. Frontend uploads file directly to Cloudinary
4. Frontend submits returned `url` and `publicId` to application API
5. Backend stores media references in MongoDB

### 4.3 Why this is the canonical approach
- Keeps Cloudinary secret off the client
- Avoids proxying large files through Express unnecessarily
- Supports replacement and cleanup using `publicId`

### 4.4 Media Rules
- Validate MIME type and file size before signing/upload acceptance
- Store media as `{ url, publicId }`
- Delete stale assets on replace/delete
- Require one profile image at seller registration
- Require at least one product image for product creation

---

## 5. Database Design

## 5.1 User Model
```js
{
  fullName: String,
  email: String, // unique, indexed, lowercase
  password: String,
  role: 'admin' | 'seller',
  profileImage: {
    url: String,
    publicId: String,
  },
  isActive: Boolean,
  timestamps: true,
}
```

### User indexes and rules
- unique index on `email`
- `isActive=false` blocks seller access

---

## 5.2 Category Model
```js
{
  label: String,
  value: String, // unique
  slug: String,  // unique
  isActive: Boolean,
  sortOrder: Number,
  timestamps: true,
}
```

### Category decision
Categories are **database-backed** and seeded initially. They are not hard-coded in frontend components.

---

## 5.3 Product Model
```js
{
  seller: ObjectId,
  title: String,
  slug: String, // unique, indexed
  description: String,
  price: Number,
  quantity: Number,
  category: {
    label: String,
    value: String,
    slug: String,
  },
  status: 'active' | 'sold' | 'archived' | 'inactive',
  images: [
    {
      url: String,
      publicId: String,
    }
  ],
  timestamps: true,
}
```

### Product indexes and rules
- index on `seller`
- unique index on `slug`
- compound indexes for public listing queries where useful, e.g. `status`, `category.slug`, `createdAt`
- public feeds return only `status='active'`
- sold products block new inquiries

---

## 5.4 Inquiry Model
```js
{
  product: ObjectId,
  seller: ObjectId,
  buyer: {
    name: String,
    email: String,
    phone: String,
  },
  offerAmount: Number, // optional
  status: 'new' | 'responded' | 'closed',
  messages: [
    {
      senderType: 'buyer' | 'seller',
      text: String,
      createdAt: Date,
    }
  ],
  timestamps: true,
}
```

### Inquiry rules
- inquiry must reference a valid product and seller
- inquiry creation allowed only when product status is `active`
- seller replies only on inquiries tied to their own listings
- open inquiries should auto-close when product becomes `sold`

---

## 6. API Design

### 6.1 Base Prefix
```text
/api
```

### 6.2 Standard Response Shape

#### Success
```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": {}
}
```

#### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {}
  }
}
```

---

## 6.3 Auth Endpoints
```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/password
```

### Auth notes
- register requires profile image reference from signed upload flow
- register/login set auth cookie
- logout clears cookie

---

## 6.4 Upload Endpoints
```text
POST   /api/uploads/sign
```

### Upload signing notes
- signed endpoint validates authenticated user and upload purpose
- separate upload intents may be enforced: `profile`, `product`

---

## 6.5 Product Endpoints
```text
POST   /api/products
GET    /api/products
GET    /api/products/:slug
PUT    /api/products/:id
DELETE /api/products/:id
PATCH  /api/products/:id/sold
PATCH  /api/products/:id/archive
PATCH  /api/products/:id/reactivate
GET    /api/products/seller/me
GET    /api/products/seller/:sellerId/public
```

### Product query support
`GET /api/products` supports:
- `page`
- `limit`
- `search`
- `category`
- `sort`
- `seller`

### Product rules
- seller-only mutation endpoints
- ownership enforced server-side
- sold/archive/reactivate handled via service-level status logic

---

## 6.6 Category Endpoints
```text
GET /api/categories
```

### Category notes
- returns active categories for public filters and seller forms
- admin category write endpoints can be added later without breaking the read contract

---

## 6.7 Inquiry Endpoints
```text
POST   /api/inquiries
GET    /api/inquiries/seller
GET    /api/inquiries/product/:productId
GET    /api/inquiries/:id
POST   /api/inquiries/:id/reply
PATCH  /api/inquiries/:id/close
```

### Inquiry rules
- buyer creates inquiry without account in v1
- seller-only access for seller inquiry list/detail/reply on owned listing inquiries
- no new inquiry allowed on non-active products

---

## 6.8 Admin Endpoints
```text
GET    /api/admin/sellers
GET    /api/admin/sellers/:id
PATCH  /api/admin/sellers/:id/suspend
PATCH  /api/admin/sellers/:id/activate
GET    /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
```

### Admin rules
- admin-only access
- suspension blocks seller from protected seller actions
- admin can moderate problematic listings

---

## 7. Backend Architecture

```text
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  tests/
```

### 7.1 Responsibilities by layer
- `config/` → env, db, cloudinary, cookies
- `controllers/` → request/response orchestration only
- `services/` → business rules and DB/media orchestration
- `middleware/` → auth, role, ownership, validation, error handling
- `models/` → schema and indexes
- `utils/` → helpers, response formatting, slug helpers

---

## 8. Frontend Architecture

```text
client/
  src/
    app/
    features/
    services/
    hooks/
      queries/
      mutations/
    pages/
    components/
    routes/
    lib/
    utils/
  test/
    setup/
    mocks/
    fixtures/
    utils/
    components/
    pages/
    routes/
    hooks/
    integration/
```

### 8.1 Frontend rules
- Keep API calls inside `services/`
- Keep read hooks inside `hooks/queries/`
- Keep write hooks inside `hooks/mutations/`
- Keep Redux slices inside `features/`
- Keep server state out of Redux
- Keep route pages thin and composed from hooks + components

---

## 9. Core Flows

## 9.1 Seller Registration
1. Seller requests signed upload for profile image
2. Frontend uploads image to Cloudinary
3. Frontend submits registration form + image reference
4. Backend validates payload
5. Password is hashed
6. User record is created
7. Auth cookie is issued

## 9.2 Product Creation
1. Seller requests signed upload for product images
2. Frontend uploads image(s) to Cloudinary
3. Frontend submits listing payload with image refs
4. Backend validates category against categories collection
5. Slug generated uniquely
6. Product saved with status `active`

## 9.3 Inquiry Flow
1. Buyer opens product detail page
2. Buyer submits inquiry form
3. Backend validates product is `active`
4. Inquiry is created with first buyer message
5. Seller views inquiry in dashboard
6. Seller replies in thread
7. Inquiry status updates accordingly

## 9.4 Sold Workflow
1. Seller marks product as `sold`
2. Backend updates product status
3. Product disappears from public feed
4. Product remains visible in seller sold history
5. New inquiries are blocked
6. Open inquiries are auto-closed

---

## 10. Validation and Data Contracts

### 10.1 Backend Validation
Validate all:
- request body
- request params
- request query
- environment variables

### 10.2 Validation Stack
- Zod schemas for env and request validation
- Mongoose schema constraints for DB integrity

### 10.3 Key validation examples
- register requires profile image reference
- product requires valid category from DB
- product requires at least one image
- inquiry requires buyer name + message + at least one contact channel
- offer amount is optional when present
- status mutations validate allowed transitions

---

## 11. Authorization Rules

### Seller
- can manage only own profile, listings, and listing inquiries

### Admin
- can manage all sellers and listings

### Buyer/User
- public browse + create inquiry only

### Enforcement
- authentication and authorization are separate middleware layers
- never rely on frontend-only permissions

---

## 12. Error Handling

### 12.1 Centralized Error Middleware
Must handle:
- validation errors
- auth errors
- forbidden errors
- not found errors
- duplicate key errors
- Cloudinary/media errors
- unexpected server errors

### 12.2 Frontend Async States
Critical pages and forms must support:
- loading
- empty
- error
- retry
- pending submit state

---

## 13. Security
- bcrypt password hashing
- JWT in HTTP-only cookies
- role-based access control
- input validation and sanitization
- Cloudinary secret kept on server only
- file size/type validation
- rate limiting for auth and inquiry endpoints
- never trust client-provided ownership or role data

---

## 14. Performance
- pagination required on public product endpoints
- indexed listing queries
- Cloudinary image transformations for delivery optimization
- lazy loading for image-heavy UI
- avoid N+1 query patterns in seller/admin views

---

## 15. Testing

### Backend: Jest
Cover:
- auth
- products
- inquiries
- categories
- authorization
- status transition rules
- sold workflow

### Frontend: Vitest
Cover:
- routes
- pages
- critical components
- query/mutation hooks
- auth flow states
- listing/inquiry flows

---

## 16. MVP Scope
- seller auth
- required seller profile image
- signed Cloudinary upload flow
- seller dashboard
- product CRUD
- backend-driven categories from DB
- homepage + product pages
- inquiry thread system
- sold item workflow
- admin seller/listing management basics

---

## 17. Phase 2
- real-time chat with Socket.IO
- buyer accounts
- notifications
- reports/moderation workflow
- reviews
- favorites
- payments
- analytics

---

## 18. Final Alignment Summary
This specification now aligns the project brief and execution plan around these canonical decisions:
- direct-to-Cloudinary **signed upload** strategy
- **HTTP-only cookie** auth
- **DB-backed categories** as source of truth
- **thread-based inquiries** for MVP
- public buyers/visitors in v1 rather than a buyer-auth role
- strict sold-item behavior and inquiry blocking
- production-safe env/config validation
