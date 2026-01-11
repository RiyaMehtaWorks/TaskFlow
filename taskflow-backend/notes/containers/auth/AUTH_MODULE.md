# Create First Module - Auth

This step explains how to create a modular Auth system using **TypeScript**, **dependency injection**, and **decorators**.

---

## 1. Auth Module Structure

### Create Folder Structure

```bash
mkdir -p src/modules/auth/{controllers,services,interfaces}
```

### Resulting Structure

```
src/modules/auth/
├── controllers/
│   └── AuthController.ts      # Handles HTTP requests
├── services/
│   └── AuthService.ts         # Business logic for authentication
├── interfaces/
│   └── IAuthService.ts        # Service contract interface
├── container.ts               # Module-specific DI container
└── types.ts                   # Module dependency symbols
```

### Purpose of Each Folder

- **controllers/** → Expose endpoints, handle incoming requests/responses
- **services/** → Implement business logic
- **interfaces/** → Define contracts for services
- **container.ts** → Bind module dependencies for DI
- **types.ts** → Symbols used as DI identifiers

---

## 2. Create Auth Types

**File:** `src/modules/auth/types.ts`

```ts
export const AUTH_TYPES = {
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
};
```

### Explanation

- Symbols provide **unique runtime identifiers** for DI.
- `AUTH_TYPES` acts as a **module-level token registry**.
- Helps **decouple controllers from concrete implementations**.

---

## 3. Create Auth Service Interface

**File:** `src/modules/auth/interfaces/IAuthService.ts`

```ts
export interface IAuthService {
  verifyToken(token: string): Promise<{ uid: string; email: string }>;
  getCurrentUser(uid: string): Promise<any>;
}
```

### Explanation

- Interfaces define a **contract** for service implementations.
- Enables **multiple implementations**:

  - FirebaseAuthService
  - JwtAuthService
  - MockAuthService (for testing)

- Methods:

  - `verifyToken()` → Validate token and return user info
  - `getCurrentUser()` → Fetch user data by UID

### Benefits of Using Interfaces

1. **Decoupling**: Controllers depend on the interface, not the implementation.
2. **Swappability**: Easy to replace service implementation.
3. **Type Safety**: TypeScript ensures correct implementation of methods.

---

## Key Concepts

- **Module Structure**: Separation of controllers, services, interfaces.
- **Dependency Injection (DI)**: Inject dependencies via `Symbol`s instead of direct instantiation.
- **Decorators**: Used to automate DI into controllers or services.

---

## Real-World Analogy

- **Controllers** → Receptionist at a building (handles requests)
- **Services** → Department that does the actual work
- **Interfaces** → Job description contract that department must follow
- **Types / Symbols** → Employee ID cards (assign the right person to the right task)
