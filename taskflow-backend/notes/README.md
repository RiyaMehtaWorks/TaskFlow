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

# tsconfig.json – Detailed Explanation (Backend)

This document explains **what each part of the tsconfig.json does in practice**, not just definitions. It reflects a **modern Node.js + TypeScript backend** using **ES modules, decorators, and dependency injection**.

---

## 1. Purpose of This tsconfig

This configuration tells TypeScript:

- How to **compile TypeScript to JavaScript**
- Which **JavaScript features** are allowed
- How **modules and imports** are resolved
- How **strict** type-checking should be
- How **decorators and DI frameworks** should work
- How the **project structure** is organized

It is optimized for:

- Backend / Node.js projects
- Decorator-based frameworks (`routing-controllers`, `typedi`, `inversify`)
- Clean, alias-based imports

---

## 2. Target & Module System

### `target: "ES2020"`

Controls **which JavaScript version** TypeScript outputs.

- Enables modern JS features like:

  - async / await
  - optional chaining (`?.`)
  - nullish coalescing (`??`)

- Assumes your Node runtime supports ES2020

**Example**

```ts
const port = config?.port ?? 3000;
```

No downlevel transpilation happens.

---

### `module: "ESNext"`

- Outputs **native ES modules** (`import` / `export`)
- Does NOT convert to CommonJS

**Emitted JavaScript**

```js
import express from "express";
```

This is required for modern Node setups and bundlers.

---

### `moduleResolution: "node"`

- Makes TypeScript resolve imports the same way Node.js does
- Looks into:

  - `node_modules`
  - file extensions
  - `package.json` fields

Prevents mismatches between TS and runtime behavior.

---

## 3. Standard Library Selection

### `lib: ["ES2020"]`

Provides global type definitions for:

- Promise
- Map / Set
- Async APIs

❗ DOM is intentionally excluded:

- No `window`
- No `document`

Correct for backend projects.

---

## 4. Project Structure

### `rootDir: "./src"`

- All source TypeScript files must live inside `src`
- Prevents accidental compilation of unrelated files

---

### `outDir: "./build"`

- Compiled JavaScript output goes into `/build`
- Keeps source and output clearly separated

**Example**

```
src/app.ts  → build/app.js
```

---

## 5. Strictness & Type Safety

### `strict: true`

Enables all major TypeScript safety checks:

- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`

Result: safer code and fewer runtime bugs.

---

### `strictPropertyInitialization: false`

Disabled to support:

- Dependency Injection
- Constructor injection
- Decorator-based frameworks

**Example**

```ts
class UserService {
  constructor(private repo: UserRepository) {}
}
```

Without this flag, TypeScript would complain.

---

## 6. Interoperability & Build Stability

### `esModuleInterop: true`

Allows clean default imports from CommonJS modules.

**Without it**

```ts
import * as express from "express";
```

**With it**

```ts
import express from "express";
```

---

### `skipLibCheck: true`

- Skips type-checking of `node_modules`
- Faster builds
- Avoids broken third-party typings

Safe and recommended for most projects.

---

### `forceConsistentCasingInFileNames: true`

Prevents case-sensitive import bugs across operating systems.

**Example**

```ts
import user from "./user"; // ❌ if file is User.ts
```

---

### `resolveJsonModule: true`

Allows importing JSON files directly.

**Example**

```ts
import config from "./config.json";
```

---

## 7. Decorators & Dependency Injection

### `experimentalDecorators: true`

Enables class, method, and parameter decorators.

**Example**

```ts
@Controller("/users")
class UserController {}
```

---

### `emitDecoratorMetadata: true`

- Emits runtime type metadata
- Required for DI frameworks like:

  - `typedi`
  - `inversify`
  - `routing-controllers`

Without this, dependency injection fails at runtime.

---

## 8. Path Aliases (Clean Imports)

### `paths`

```json
{
  "#shared/*": ["./src/shared/*"],
  "#modules/*": ["./src/modules/*"]
}
```

Allows semantic, absolute imports.

**Example**

```ts
import { Logger } from "#shared/logger";
import { UserService } from "#modules/user/service";
```

⚠ TypeScript understands this at compile-time.
Node.js needs additional configuration at runtime.

---

## 9. Included & Excluded Files

### `include: ["src/**/*"]`

Only files inside `src` are compiled.

---

### `exclude: ["node_modules"]`

Prevents unnecessary processing.

---

## 10. Mental Model Summary

This tsconfig tells TypeScript:

> “Compile a strict, modern ES-module-based Node backend with decorator support, clean project structure, and alias-based imports.”

---

## 11. Important Runtime Note

Path aliases work **only at compile time**.

To make them work at runtime, you must also configure:

- `tsconfig-paths`
- or a bundler (tsup, esbuild, Vite)

---

This configuration strongly implies:

- Modular backend architecture
- Dependency Injection
- Production-grade TypeScript setup
