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
