# `TYPES` — Dependency Injection Identifiers (Inversify)

This file defines **unique identifiers (tokens)** used by the Dependency Injection (DI) container to register and resolve dependencies across the application.

---

## Code

```ts
export const TYPES = {
  // Database
  Database: Symbol.for("Database"),

  // Repositories
  TaskRepository: Symbol.for("TaskRepository"),
  UserRepository: Symbol.for("UserRepository"),

  // Services
  TaskService: Symbol.for("TaskService"),
  AuthService: Symbol.for("AuthService"),
};
```

---

## What Problem This Solves

In TypeScript/JavaScript, **interfaces do not exist at runtime**.
So the DI container cannot inject dependencies using interfaces directly.

➡️ **Solution:** Use symbols as runtime identifiers.

---

## Why `Symbol.for(...)`?

- `Symbol.for("Name")` creates a **global, unique symbol**
- The same string always maps to the same symbol
- Prevents name collisions
- Works reliably across files and modules

Example:

```ts
Symbol.for("AuthService") === Symbol.for("AuthService"); // true
```

---

## Role of `TYPES`

`TYPES` acts as a **central registry of public dependency tokens**.

Think of it as:

- A **contract**
- A **public API**
- A **lookup table** for DI

Other parts of the app depend on these tokens — **not on concrete classes**

---

## Category Breakdown

### 1. Database

```ts
Database: Symbol.for("Database");
```

Used to inject a database connection or database wrapper class.

Example usage:

```ts
@inject(TYPES.Database)
private database: Database;
```

---

### 2. Repositories

```ts
TaskRepository: Symbol.for("TaskRepository");
UserRepository: Symbol.for("UserRepository");
```

Repositories:

- Handle data access
- Talk directly to MongoDB / SQL / APIs
- Are injected into services

Example:

```ts
@inject(TYPES.TaskRepository)
private taskRepository: ITaskRepository;
```

---

### 3. Services

```ts
TaskService: Symbol.for("TaskService");
AuthService: Symbol.for("AuthService");
```

Services:

- Contain business logic
- Orchestrate repositories
- Are injected into controllers

Example:

```ts
@inject(TYPES.AuthService)
private authService: IAuthService;
```

---

## How This Fits in the DI Flow

1. **Bind implementation to token**

```ts
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
```

2. **Request dependency using token**

```ts
@inject(TYPES.AuthService)
authService: IAuthService;
```

3. **Container resolves the correct implementation**

---

## Important Design Rule

> **Never change these tokens casually**

- These are **public identifiers**
- Changing them breaks injections across the app
- Internal module tokens can change, but `TYPES` should remain stable

---

## Mental Model

- `TYPES` = **What the app exposes**
- Implementations = **How it works internally**
- Controllers & services depend on **tokens, not classes**

---

## Summary

- `TYPES` defines **runtime identifiers** for DI
- Uses `Symbol.for` for safety and consistency
- Separates **interface from implementation**
- Enables loose coupling and scalability
- Foundation for clean architecture

---

This file is small, but it is **architecturally critical**.
