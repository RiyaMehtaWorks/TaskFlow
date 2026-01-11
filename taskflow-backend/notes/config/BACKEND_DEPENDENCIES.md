# Backend Dependencies

These notes explain **what each dependency does, why it is used, and how it fits into a TypeScript-based Node.js backend**. The focus is on clarity and architectural understanding.

---

## 1. Core Runtime Dependencies

These packages are required when the application is **running in production**.

Each section includes a **practical example** to show how the dependency is typically used.

These packages are required when the application is **running in production**.

---

### express

**What it is:**
A minimal and flexible Node.js web framework.

**What it does:**

- Handles HTTP requests and responses
- Provides routing and middleware support

**Example:**

```ts
import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000);
```

**Why it is important:**
It is the foundation of the backend server.

---

### cors

**What it is:**
Middleware for handling Cross-Origin Resource Sharing (CORS).

**Example:**

```ts
import cors from "cors";
app.use(cors({ origin: "http://localhost:5173" }));
```

Allows the frontend to safely call backend APIs.

---

### dotenv

**What it is:**
Loads environment variables from a `.env` file into `process.env`.

**Example:**

```env
PORT=3000
DB_URL=mongodb://localhost:27017/app
```

```ts
import "dotenv/config";
console.log(process.env.PORT);
```

---

### mongodb

**What it is:**
Official MongoDB Node.js driver.

**Example:**

```ts
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DB_URL!);
await client.connect();

const db = client.db("app");
```

Provides low-level database access.

---

### firebase-admin

**What it is:**
Firebase Admin SDK for backend servers.

**Used for:**

- Verifying Firebase authentication tokens
- Secure server-side Firebase operations

**Important:**
Must only be used in backend code.

---

### routing-controllers

**What it is:**
A decorator-based abstraction over Express.

**Example:**

```ts
@Controller("/users")
export class UserController {
  @Get("/")
  getAll() {
    return [];
  }
}
```

Improves structure and readability.

---

### class-validator

**What it is:**
A validation library using decorators.

**Example:**

```ts
import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Length(6)
  password: string;
}
```

Automatically validates request data.

---

### class-transformer

**What it is:**
Transforms plain JavaScript objects into class instances.

**Example:**

```ts
import { plainToInstance } from "class-transformer";

const dto = plainToInstance(CreateUserDto, req.body);
```

Works with validation and DTOs.

---

### inversify

**What it is:**
A Dependency Injection (DI) container.

**Example:**

```ts
@injectable()
class UserService {}
```

Promotes loose coupling and testability.

---

### typedi

**What it is:**
A lightweight Dependency Injection container.

**Example:**

```ts
@Service()
class AuthService {}
```

Integrates well with routing-controllers.

---

### reflect-metadata

**What it is:**
Enables runtime reflection for decorators.

**Example:**

```ts
import "reflect-metadata";
```

Must be imported once at app startup.

---

## 2. TypeScript & Development Dependencies

These packages are used **only during development** and improve type safety and developer experience.

These packages are used **only during development**.

---

### typescript

**What it is:**
The TypeScript compiler.

**Purpose:**

- Type checking
- Transpiling TypeScript to JavaScript

**Why dev dependency:**
Not required at runtime after compilation.

---

### @types/node

**What it is:**
Type definitions for Node.js.

**Provides typing for:**

- `process`
- `__dirname`
- Built-in modules like `fs`, `path`

---

### @types/express

**What it is:**
Type definitions for Express.

**Benefits:**

- Typed `Request` and `Response`
- Better IntelliSense and safety

---

### @types/cors

**What it is:**
Type definitions for the `cors` package.

Ensures correct typing when configuring CORS middleware.

---

### ts-node

**What it is:**
Runs TypeScript directly in Node.js.

**Example:**

```bash
ts-node src/index.ts
```

Eliminates manual build steps during development.

---

### nodemon

**What it is:**
Automatically restarts the server on file changes.

**Example:**

```bash
nodemon --exec ts-node src/index.ts
```

Improves development speed.

---

### concurrently

**What it is:**
Runs multiple scripts in parallel.

**Example:**

```json
"scripts": {
  "dev": "concurrently \"npm:server\" \"npm:client\""
}
```

Useful for full-stack development.

---

## 3. Development Flow (How they work together)

```text
nodemon
  → ts-node
    → typescript
      → @types/*
```

This setup enables:

- Live reload
- Type safety
- Fast iteration

---

## One-line Summary

This dependency stack provides a **clean, scalable, and strongly-typed backend architecture** with excellent developer experience.
