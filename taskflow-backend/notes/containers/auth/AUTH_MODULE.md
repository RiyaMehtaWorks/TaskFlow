# Auth Module Full Notes

This document explains the Auth module setup in a TypeScript + Inversify + routing-controllers backend project.

---

## Create First Module - Auth

### What you need to know

- Module structure
- Decorators
- Dependency Injection (DI)

---

### 1. Create Auth Module Structure

Command to create directories:

```bash
mkdir -p src/modules/auth/{controllers,services,interfaces}
```

**Structure:**

```
src/modules/auth/
├── controllers/
│   └── AuthController.ts   # Handles HTTP routes for auth
├── services/
│   └── AuthService.ts      # Business logic for authentication
├── interfaces/
│   └── IAuthService.ts     # Defines service contract
├── container.ts            # Module-specific DI container registration
└── types.ts                # Symbols for DI binding
```

**Explanation:**

- Each module has its own structure for separation of concerns.
- `controllers` handle HTTP requests.
- `services` contain business logic.
- `interfaces` define contracts for services, allowing multiple implementations.
- `container.ts` registers module bindings to the main DI container.
- `types.ts` stores `Symbol`s used for dependency injection.

---

### 2. Create Auth Types

```typescript
// src/modules/auth/types.ts
export const AUTH_TYPES = {
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
};
```

**Explanation line by line:**

1. `export const AUTH_TYPES = { ... }` → Exports a constant object holding DI symbols.
2. `AuthService: Symbol.for('AuthService')` → Unique identifier for `AuthService`. Ensures Inversify knows what to inject.
3. `AuthController: Symbol.for('AuthController')` → Unique identifier for `AuthController`.

**Why:**

- Symbols prevent naming conflicts.
- Required for Inversify to correctly inject dependencies.

**Common Error:**

- If you use a string instead of `Symbol.for()`, DI might fail or inject the wrong instance.

---

### 3. Create Auth Service Interface

```typescript
// src/modules/auth/interfaces/IAuthService.ts
export interface IAuthService {
  verifyToken(token: string): Promise<{ uid: string; email: string }>;
  getCurrentUser(uid: string): Promise<any>;
}
```

**Line by line:**

1. `export interface IAuthService` → Defines a contract the AuthService must implement.
2. `verifyToken(token: string)` → Method to verify an auth token, returns UID and email.
3. `getCurrentUser(uid: string)` → Method to fetch user info by UID.

**Concepts:**

- Interfaces define expected behavior without implementation.
- Services implement the interface, allowing multiple implementations (e.g., Firebase, JWT).

**Common Error:**

- Forgetting to implement interface methods in the service will result in TypeScript errors.

---

### 4. Install Firebase Admin

```bash
npm install firebase-admin
```

**Setup:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project
3. Generate service account key JSON
4. Save as `firebase-service-account.json` in backend root
5. Add to `.gitignore`
6. Add to `.env`:

```
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

**Why:**

- Backend service account allows server-to-server communication with Firebase.
- Separate from client-side Firebase SDK.

---

### 5. Create Firebase Config

```typescript
// src/config/firebase.ts
import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
export default admin;
```

**Line by line:**

1. `import admin from 'firebase-admin'` → Firebase Admin SDK.
2. `readFileSync` → Reads service account JSON.
3. `JSON.parse(...)` → Parses JSON credentials.
4. `admin.initializeApp(...)` → Initializes Firebase Admin.
5. `export const auth = admin.auth()` → Exports Auth API for token verification.

**Common Error:**

- Wrong path in `.env` → `readFileSync` fails.
- Forgetting `export const auth` → Cannot use auth in services.

---

### 6. Create Auth Service

```typescript
import { injectable } from "inversify";
import { auth } from "../../../config/firebase.js";
import { IAuthService } from "../interfaces/IAuthService.js";

@injectable()
export class AuthService implements IAuthService {
  async verifyToken(token: string): Promise<{ uid: string; email: string }> {
    const decodedToken = await auth.verifyIdToken(token);
    return { uid: decodedToken.uid, email: decodedToken.email || "" };
  }

  async getCurrentUser(uid: string): Promise<any> {
    const userRecord = await auth.getUser(uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    };
  }
}
```

**Line by line:**

1. `@injectable()` → Marks class for DI.
2. `implements IAuthService` → Enforces interface contract.
3. `verifyToken` → Verifies Firebase token, returns user info.
4. `getCurrentUser` → Fetches user info from Firebase.

**Common Error:**

- Forgetting `@injectable()` → Inversify cannot inject this service.
- Not implementing all interface methods → TypeScript error.

---

### 7. Create Auth Controller

```typescript
import {
  JsonController,
  Get,
  Authorized,
  CurrentUser,
} from "routing-controllers";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../types.js";
import { IAuthService } from "../interfaces/IAuthService.js";

@injectable()
@JsonController("/auth")
export class AuthController {
  constructor(
    @inject(AUTH_TYPES.AuthService) private authService: IAuthService
  ) {}

  @Get("/me")
  @Authorized()
  async getCurrentUser(@CurrentUser() user: any) {
    return this.authService.getCurrentUser(user.uid);
  }

  @Get("/health")
  health() {
    return { status: "ok", service: "auth" };
  }
}
```

**Line by line:**

- `@injectable()` → Inversify can inject this class.
- `@JsonController('/auth')` → All routes prefixed with `/auth`.
- `constructor(@inject(...))` → Injects `AuthService`.
- `@Get('/me')` → Maps GET request.
- `@Authorized()` → Route requires authentication.
- `@CurrentUser()` → Injects authenticated user.
- `health()` → Public health check route.

**Common Errors:**

- Forgetting `@inject` → Service not injected.
- Forgetting `@Authorized` → Security hole.

---

### 8. Create Auth Module Container

```typescript
import { Container } from "inversify";
import { AUTH_TYPES } from "./types.js";
import { AuthService } from "./services/AuthService.js";
import { AuthController } from "./controllers/AuthController.js";
import { IAuthService } from "./interfaces/IAuthService.js";

export function registerAuthModule(container: Container) {
  container
    .bind<IAuthService>(AUTH_TYPES.AuthService)
    .to(AuthService)
    .inSingletonScope();
  container
    .bind<AuthController>(AUTH_TYPES.AuthController)
    .to(AuthController)
    .inSingletonScope();
}
```

**Line by line:**

- `container.bind<Interface>(Symbol).to(Class)` → Register binding of interface to implementation.
- `inSingletonScope()` → One instance for entire app.

**Why:**

- Ensures DI works across the module.
- Allows controller and other services to get the same service instance.

**Common Errors:**

- Forgetting `inSingletonScope()` → Multiple instances, unexpected behavior.
- Wrong Symbol → DI fails, `undefined` injected.

---

This setup allows:

- Separation of concerns
- Dependency Injection using Inversify
- Auth services using Firebase Admin
- Type safety via interfaces
- Easy extension with multiple implementations
