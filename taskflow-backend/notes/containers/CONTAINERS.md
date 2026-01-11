# Inversify Dependency Injection Container (Notes)

This document explains the purpose, structure, and usage of an **Inversify Dependency Injection (DI) container** in a TypeScript backend project.

---

## Why This File Exists

The DI container is the **central registry** of your application. It manages how classes (services, repositories, controllers) are created and injected into each other.

Using a DI container allows you to:

- Avoid tight coupling between classes
- Improve testability
- Follow clean architecture principles
- Scale the application safely

---

## The File Being Explained

```ts
import { Container } from "inversify";
import "reflect-metadata";

const container = new Container();

export { container };
```

---

## Line-by-Line Explanation

### 1. Importing `Container`

```ts
import { Container } from "inversify";
```

- `Container` is the core class provided by **Inversify**
- It stores mappings between:

  - Dependencies (services, repositories)
  - Their implementations

Think of it as a **dependency warehouse**.

---

### 2. Importing `reflect-metadata` (Mandatory)

```ts
import "reflect-metadata";
```

This line is **critical** when using decorators in TypeScript.

#### Why it is required

- Inversify uses decorators like:

  - `@injectable()`
  - `@inject()`

- Decorators need runtime type information
- TypeScript removes type data at runtime
- `reflect-metadata` restores this information

#### If you forget this line

- Dependency injection will fail
- Common error:

```text
Missing required @injectable annotation
```

This import must run **before any decorated class is loaded**.

---

### 3. Creating the Container

```ts
const container = new Container();
```

- Creates a **single DI container instance**
- This container will:

  - Register dependencies
  - Resolve them automatically
  - Manage object lifecycles

Common lifecycles:

- Singleton
- Transient
- Request-scoped

---

### 4. Exporting the Container

```ts
export { container };
```

- Makes the container available throughout the app
- Ensures **one shared dependency graph**

Creating multiple containers can break dependency resolution.

---

## How This Is Used in a Real Project

### Example Folder Structure

```text
src/
├── container.ts
├── services/
│   └── UserService.ts
├── repositories/
│   └── UserRepository.ts
└── controllers/
    └── UserController.ts
```

---

## Example: Creating an Injectable Repository

```ts
import { injectable } from "inversify";

@injectable()
export class UserRepository {
  findAll() {
    return [];
  }
}
```

---

## Example: Injecting a Dependency into a Service

```ts
import { injectable, inject } from "inversify";
import { UserRepository } from "../repositories/UserRepository";

@injectable()
export class UserService {
  constructor(@inject(UserRepository) private repo: UserRepository) {}

  getUsers() {
    return this.repo.findAll();
  }
}
```

---

## Binding Dependencies to the Container

```ts
import { container } from "./container";
import { UserService } from "./services/UserService";
import { UserRepository } from "./repositories/UserRepository";

container.bind(UserRepository).toSelf().inSingletonScope();
container.bind(UserService).toSelf();
```

- `toSelf()` → binds the class to itself
- `inSingletonScope()` → one instance shared across the app

---

## Resolving a Dependency

```ts
const userService = container.get(UserService);
userService.getUsers();
```

No `new` keyword is needed.

---

## Without DI vs With DI

### Without DI (Not Recommended)

```ts
const repo = new UserRepository();
const service = new UserService(repo);
```

Problems:

- Tight coupling
- Hard to mock
- Poor scalability

---

### With DI (Recommended)

```ts
const service = container.get(UserService);
```

Benefits:

- Clean architecture
- Easy testing
- Flexible implementations

---

## Common Mistakes

1. Forgetting to import `reflect-metadata`
2. Missing `@injectable()` on classes
3. Creating multiple containers
4. Mixing Inversify with TypeDI unintentionally

---

## Summary

| Concept              | Description                       |
| -------------------- | --------------------------------- |
| Container            | Central DI registry               |
| reflect-metadata     | Enables decorator-based injection |
| Dependency Injection | Removes tight coupling            |
| Inversify            | Strong, explicit DI framework     |

---

## Recommendation

Since your project also uses **TypeDI** and **routing-controllers**, you should **choose one DI system** to avoid conflicts.

If you want next steps, you can:

- Integrate Inversify with routing-controllers
- Refactor to TypeDI-only setup
- Implement request-scoped dependencies
- Convert this into clean architecture layers

---
