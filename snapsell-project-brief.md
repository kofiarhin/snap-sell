# SnapSell — Updated Canonical Project Brief

## Project Overview
**SnapSell** is an image-first marketplace web application where sellers create profiles, upload product listings with images, and manage buyer inquiries from a dedicated dashboard. Buyers browse available products, filter by category, view item details, and contact sellers through listing-linked inquiry threads stored inside the platform.

The platform has two authenticated roles in v1:

- **Admin** — manages sellers, listings, and platform activity
- **Seller** — creates a profile, uploads items, manages listings, and replies to buyer inquiries

Public marketplace users in v1 are **buyers/visitors**. They can browse products and submit inquiries without creating an account.

The goal is to create a clean, simple selling platform focused on image-based listings, backend-controlled categories, production-safe media handling, and organized buyer-seller communication.

---

## Core Product Goal
Build a marketplace where:

- Sellers can easily list products for sale
- Buyers can discover products quickly
- Communication between buyers and sellers is simple and organized
- Admin has control over sellers, listings, and moderation-ready structures
- Product and profile images are uploaded via **Cloudinary**
- Categories come from a backend-controlled, database-backed source of truth

---

## Locked Product Decisions
These decisions are canonical across the project brief, execution plan, and technical specification:

- Authenticated roles are `admin` and `seller`
- Buyers do not require accounts in v1
- Authentication uses JWT issued by the backend and stored in **HTTP-only cookies**
- MVP communication uses a **thread-based inquiry system**, not real-time chat
- Categories come from a backend-controlled **`categories` collection** seeded at setup
- Media uploads use a **backend-signed direct-to-Cloudinary upload flow**
- Sold items are removed from the public marketplace, remain in seller history, block new inquiries, and open inquiries should auto-close

---

## Main User Roles

### 1. Admin
Admin manages the whole platform.

**Admin capabilities in v1:**
- View all sellers
- View individual seller profiles
- View all products by a seller
- Edit seller details if needed
- Edit or manage listings
- Monitor platform activity
- Suspend or reactivate sellers
- Remove problematic listings
- Work with moderation-ready structures for future reporting/message moderation

---

### 2. Seller
Seller is the main content creator on the platform.

**Seller capabilities:**
- Sign up and log in
- Upload required profile picture during registration
- Manage profile details:
  - Full name
  - Email
  - Password
  - Profile picture
- Create product listings
- Upload multiple product images to Cloudinary
- Edit listings
- Update price, quantity, description, and category
- Mark item as sold
- Archive or deactivate listings
- View inquiries for each item
- Reply to buyer messages
- Manage sold item history

---

### 3. Buyer / Visitor
Buyers do not require complex account behavior in v1.

**Buyer capabilities in v1:**
- Browse homepage listings
- Filter products by category
- Search products
- Open product details
- Contact seller from item detail page
- Send inquiry with contact details and message

**Out of scope for v1:**
- Buyer authentication
- Buyer dashboards
- Favorites/wishlists
- Real-time chat

---

## Core Features

## 1. Seller Authentication and Profile Management
### Requirements
- Seller registration
- Seller login/logout
- Secure password hashing
- Authentication via JWT in **HTTP-only cookies**
- Profile picture required at sign-up
- Profile picture uploaded to Cloudinary using backend-issued signed upload parameters
- Seller profile editable after signup

### Seller profile fields
- Full name
- Email
- Password
- Profile image URL
- Cloudinary public ID for image management
- Created at / updated at

---

## 2. Product Listing Management
Each seller can manage their own products through their dashboard.

### Product fields
- Title / product name
- Description
- Price
- Quantity / amount available
- Category
- Product images
- Seller reference
- Status
- Slug
- Created at / updated at

### Product status options
- `active`
- `sold`
- `archived`
- `inactive`

### Seller actions
- Create new listing
- Upload one or multiple images
- Edit listing
- Delete listing
- Mark listing as sold
- Archive listing
- Reactivate inactive listing

---

## 3. Homepage Product Feed
Homepage should display active products from sellers.

### Homepage includes
- Featured/latest products
- Category-based browsing
- Product cards
- Search bar
- Filters
- Pagination or lazy loading / infinite scroll

### Product card details
- Product image
- Product name
- Price
- Category
- Seller name

---

## 4. Product Details Page
Each product should have a dedicated detail page.

### Product detail page includes
- Product images gallery
- Product title
- Description
- Price
- Quantity available
- Category
- Seller info
- Contact seller CTA
- Related items
- Status awareness

### Contact seller section
- Buyer name
- Buyer email or phone
- Message
- Optional offer amount
- Submit inquiry button

---

## 5. Messaging / Inquiry System
This is the main communication layer between buyer and seller for v1.

### Flow
- Buyer opens item detail page
- Buyer fills inquiry form
- Inquiry is linked to the specific product
- Seller sees inquiry in dashboard
- Seller opens inquiry thread
- Seller responds in the inquiry thread

### Messaging requirements
- Inquiry tied to:
  - product
  - seller
  - buyer contact details
- Seller can view all inquiries by listing
- Seller can reply
- Message history stored per inquiry thread
- Inquiry status can be:
  - `new`
  - `responded`
  - `closed`

### Optional later improvements
- Real-time chat with Socket.IO
- Email notifications
- Read/unread indicators
- Reporting abuse

---

## 6. Seller Dashboard
The seller dashboard is the control center for sellers.

### Dashboard sections
- Overview
- My Listings
- Add Product
- Edit Product
- Sold Items
- Archived/Inactive Items
- Messages / Inquiries
- Profile Settings
- Change Password

### Dashboard functionality
- See total products
- See active products
- See sold products
- See recent inquiries
- Open a product and view related inquiries
- Update profile
- Change password

---

## 7. Admin Dashboard
Admin needs a higher-level management panel.

### Admin sections in v1
- Overview
- Sellers list
- Seller details
- Seller listings
- Products list
- Listing moderation actions

### Admin sections later
- Messages / reports
- Category management
- Moderation tools

### Admin capabilities
- View all sellers
- Search sellers
- Open seller profile
- See all items posted by seller
- Edit or remove seller listings
- Suspend or reactivate sellers
- Extend into reports/moderation later without breaking the core model

---

## 8. Category System
Categories must come from the backend as the source of truth.

### Category requirements
- Stored centrally on backend in a dedicated **`categories` collection**
- Seeded at setup
- Exposed through API
- Used in seller create/edit product forms
- Used in frontend filters
- Used as slugs for category URLs/search
- Synchronized across frontend and backend

### Category structure
Each category should include:
- label
- value
- slug
- isActive
- sortOrder

### Example categories
- tech
- pets
- building
- fashion
- home
- furniture
- vehicles
- beauty
- toys
- services
- electronics
- phones
- laptops
- appliances
- gaming
- books
- health
- sports
- baby
- accessories

---

## 9. Sold Item Workflow
This behavior is locked into the project.

### When a seller sells an item
- Seller marks item as `sold`
- Item is removed from public active listings
- Item remains visible in seller dashboard under sold items
- Seller keeps sales history
- Buyers can no longer send new inquiries on sold items
- Open inquiries should auto-close
- Sold badge may appear in seller history/admin view

---

## 10. Image Upload Management with Cloudinary
Cloudinary will be used for:

- Seller profile pictures
- Product images

### Canonical upload flow
- Frontend requests upload signature from backend
- Backend validates upload intent and returns signed parameters
- Frontend uploads image directly to Cloudinary
- Frontend submits returned `url` and `publicId` to the application API
- Backend stores validated media references in the database

### Requirements
- Store secure URL in database
- Store public ID for deletion/replacement
- Support replacement when editing profile or products
- Clean up old images when deleted or replaced

### Important handling
- Required profile image during seller signup
- Product image validation
- Delete old Cloudinary assets if listing/profile image is replaced or removed

---

## Key Pages Required

## Public Pages
1. **Home Page**
   - Featured products
   - Categories
   - Search/filter UI

2. **Product Listing Page**
   - All products
   - Filtering by category
   - Search and sorting

3. **Category Page**
   - Products by category slug

4. **Product Details Page**
   - Full product info
   - Contact seller form

5. **Seller Public Profile Page** *(optional but valuable later)*
   - Seller info
   - Other active listings by seller

---

## Auth Pages
6. **Seller Sign Up Page**
   - Full name
   - Email
   - Password
   - Confirm password
   - Required profile image upload

7. **Seller Login Page**

8. **Forgot Password / Reset Password Page** *(recommended)*

---

## Seller Dashboard Pages
9. **Seller Dashboard Overview**
10. **My Listings Page**
11. **Create Listing Page**
12. **Edit Listing Page**
13. **Sold Items Page**
14. **Archived/Inactive Items Page**
15. **Messages / Inquiries Page**
16. **Inquiry Detail / Thread Page**
17. **Profile Settings Page**
18. **Change Password Page**

---

## Admin Pages
19. **Admin Dashboard Overview**
20. **Manage Sellers Page**
21. **Seller Detail Page**
22. **Manage Listings Page**
23. **Listing Detail/Edit Page**
24. **Category Management Page** *(later if categories become admin-editable)*
25. **Reports / Moderation Page** *(later)*

---

## Recommended Tech Stack

## Frontend
- **React + Vite**
- **Tailwind CSS**
- **React Router**
- **TanStack Query**
- **Redux Toolkit** for auth/UI-only global state
- **Axios**
- **React Hook Form**
- **Zod** where useful for validation

## Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT authentication**
- **bcrypt**
- **Cloudinary SDK**
- **Zod** for request and environment validation

## Optional later
- **Socket.IO** for real-time messaging
- **Nodemailer** for notifications

---

## Suggested Database Models

## User / Seller Model
Fields:
- fullName
- email
- password
- role (`admin` or `seller`)
- profileImage
  - url
  - publicId
- isActive
- createdAt
- updatedAt

---

## Product Model
Fields:
- seller
- title
- slug
- description
- price
- quantity
- category
  - label
  - value
  - slug
- status
- images[]
  - url
  - publicId
- createdAt
- updatedAt

---

## Inquiry / Conversation Model
Fields:
- product
- seller
- buyer
  - name
  - email
  - phone
- status
- messages[]
  - senderType (`buyer` / `seller`)
  - text
  - createdAt
- createdAt
- updatedAt

---

## Recommended API Areas

## Auth
- register seller
- login seller/admin
- logout
- get current user
- update profile
- change password

## Products
- create product
- update product
- delete product
- get all active products
- get single product
- get seller products
- mark sold
- archive product
- reactivate product
- filter by category
- search products

## Categories
- get all categories

## Inquiries / Messages
- create inquiry
- get seller inquiries
- get inquiries by product
- get inquiry detail
- reply to inquiry
- close inquiry

## Admin
- get all sellers
- get seller details
- get seller products
- edit/remove seller listing
- suspend seller
- activate seller

---

## Edge Cases to Account For

### Listing lifecycle
- Seller accidentally marks item sold
- Seller wants to reactivate an unsold item
- Seller wants to archive without deleting
- Quantity reaches zero

### Image handling
- Upload fails
- Oversized file
- Invalid file type
- Seller replaces image
- Cloudinary cleanup after delete

### Messaging
- Buyer sends incomplete contact details
- Spam inquiries
- Seller never responds
- Item is sold while inquiry is still open
- Message thread needs closing

### Auth/Profile
- Duplicate email
- Missing required profile image on signup
- Password change flow
- Suspended seller with existing listings

### Admin
- Seller posts prohibited content
- Seller account suspended with existing listings
- Moderation of flagged items or abuse

### Performance
- Too many products on homepage
- Need pagination/infinite scroll
- Slow image-heavy pages

---

## Business Rules
- Seller profile image is mandatory at registration
- Only authenticated sellers can create/manage listings
- Only listing owner can edit their own listings
- Sold items are removed from active public feed
- Categories must come from backend source of truth
- Buyers contact sellers through listing-linked inquiries
- Admin can manage sellers and listings platform-wide

---

## UX Goals
- Simple browsing
- Fast product discovery
- Easy listing creation for sellers
- Clear inquiry workflow
- Mobile-friendly experience
- Clean dashboards for seller and admin
- Strong visual emphasis on product images

---

## Security and Validation Requirements
- Validate all inputs on backend
- Protect seller/admin routes
- Role-based authorization
- Hash passwords securely
- Validate Cloudinary uploads
- Sanitize form input
- Rate-limit auth and inquiry submissions
- Prevent unauthorized product editing/deleting

---

## Recommended MVP Scope
For version one, build:

- Seller auth
- JWT auth in HTTP-only cookies
- Seller profile with required Cloudinary image
- Signed Cloudinary upload flow
- Seller dashboard
- Product CRUD
- Backend-driven categories from database
- Homepage product feed
- Product details page
- Inquiry/contact seller flow
- Seller inquiry management
- Sold item workflow
- Admin seller/listing management basics

---

## Phase 2 Enhancements
Later you can add:

- Real-time chat
- Buyer accounts
- Favorites / wishlists
- Email notifications
- Reports and moderation tools
- Seller ratings/reviews
- Featured listings
- Payments/checkout
- Analytics dashboard
- Saved searches
- Recently viewed items

---

## Final Product Summary
**SnapSell** is an image-first marketplace platform where sellers create profiles, upload listings, manage inquiry threads, and mark products as sold, while buyers browse by category and contact sellers through listing-linked inquiries. The app is powered by a database-backed backend category system, Cloudinary-based signed uploads, seller/admin dashboards, and a clean listing + messaging workflow.
