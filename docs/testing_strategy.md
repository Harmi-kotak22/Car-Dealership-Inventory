# Testing Strategy

## Objective

The backend was developed using Test-Driven Development (TDD).

Every feature followed:

Red → Green → Refactor

---

# Test Types

## Unit Tests

Focus

Business logic

Examples

- Password hashing
- Authentication Service

---

## Integration Tests

Focus

Complete API workflow

Examples

Authentication

- Register
- Login

Vehicles

- Create
- Get All
- Search
- Update
- Delete

Inventory

- Purchase
- Restock

---

# Testing Tools

- Jest
- Supertest
- MongoDB Test Database

---

# Test Principles

Each endpoint was tested for:

Authentication

Authorization

Validation

Business Rules

Database Persistence

Response Structure

Edge Cases

Error Handling

---

# Authentication Tests

✓ Register User

✓ Login User

✓ Duplicate Email

✓ Invalid Password

✓ Invalid Email

✓ Missing Fields

✓ Password Hashing

---

# Vehicle Tests

Create

✓ Admin access

✓ Customer rejection

✓ Validation

✓ DTO response

Get

✓ Empty list

✓ Vehicle listing

✓ Sorting

✓ DTO response

Search

✓ Make

✓ Model

✓ Category

✓ Price Range

✓ Empty results

Update

✓ Admin access

✓ Validation

✓ Database persistence

Delete

✓ Admin access

✓ Database deletion

---

# Inventory Tests

Purchase

✓ Customer only

✓ Stock decrement

✓ Out-of-stock rejection

Restock

✓ Admin only

✓ Quantity increment

✓ Validation

---

# Test Philosophy

Tests focus on observable behavior rather than implementation details, making them resistant to future refactoring.