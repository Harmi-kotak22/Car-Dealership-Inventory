# Sprint 3 – Inventory Management

## Sprint Goal

Implement inventory management functionality while maintaining Test-Driven Development (TDD), clean architecture, SOLID principles, and secure role-based access.

---

# Features Implemented

## Purchase Vehicle

Endpoint

POST /api/vehicles/:id/purchase

Access

Authenticated CUSTOMER users only.

Business Rules

- Customers can purchase one vehicle at a time.
- Vehicle quantity decreases by one.
- Purchase is rejected if stock reaches zero.
- Vehicle must exist.
- Changes are persisted in MongoDB.

---

## Restock Vehicle

Endpoint

POST /api/vehicles/:id/restock

Access

Authenticated ADMIN users only.

Business Rules

- Quantity must be positive.
- Vehicle must exist.
- Inventory updates immediately.
- Changes persist in MongoDB.

---

# Tests Written

## Purchase Endpoint

### Authentication

- Reject unauthenticated requests

### Authorization

- Reject ADMIN users
- Allow CUSTOMER users

### Validation

- Reject invalid vehicle ID
- Reject non-existing vehicle
- Reject purchase when quantity is zero

### Business Logic

- Decrease quantity by one
- Persist changes to database
- Return updated DTO

---

## Restock Endpoint

### Authentication

- Reject unauthenticated requests

### Authorization

- Reject CUSTOMER users
- Allow ADMIN users

### Validation

- Reject invalid quantity
- Reject negative quantity
- Reject invalid vehicle ID
- Reject non-existing vehicle

### Business Logic

- Increase inventory
- Persist changes
- Return updated vehicle

---

# Refactoring

- Repository pattern maintained
- DTO reused
- Validation centralized using Zod
- Business logic isolated in service layer
- Controllers remain thin

---

# Outcome

Inventory management is production-ready, follows REST principles, enforces role-based authorization, and satisfies all functional requirements.