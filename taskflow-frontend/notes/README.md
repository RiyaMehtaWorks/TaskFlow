# @types/node

## What it is

`@types/node` is a **TypeScript type definition package for Node.js**. It provides type information for Node.js APIs so TypeScript can understand and type-check Node-specific code.

---

## Why it is needed

Node.js is written in JavaScript, not TypeScript. Without `@types/node`, TypeScript does not recognize:

- Node globals (`process`, `Buffer`, `__dirname`)
- Built-in modules (`fs`, `path`, `http`, etc.)
- Node-specific behaviors (timers, streams, events)

---

## Installation

```bash
npm install -D @types/node
```

Installed as a **dev dependency** because it is used only at compile time.

---

## What it enables (Examples)

### 1. Node globals

```ts
process.env.PORT;
__dirname;
__filename;
```

Enables type safety and autocomplete.

---

### 2. Built-in modules

#### `fs`

```ts
import fs from "fs";
fs.readFileSync("file.txt", "utf-8");
```

#### `path`

```ts
import path from "path";
path.join(__dirname, "images", "logo.png");
```

---

### 3. Buffer

```ts
const buf = Buffer.from("Hello");
```

Provides correct typing for binary data handling.

---

### 4. HTTP server

```ts
import http from "http";

http.createServer((req, res) => {
  res.end("Hello");
});
```

Types:

- `req` → `IncomingMessage`
- `res` → `ServerResponse`

---

### 5. Timers (Node-specific)

```ts
const t = setTimeout(() => {}, 1000);
clearTimeout(t);
```

In Node, `setTimeout` returns a `Timeout` object (not a number).

---

### 6. EventEmitter

```ts
import { EventEmitter } from "events";

const emitter = new EventEmitter();
emitter.on("data", (msg: string) => {});
```

---

### 7. Streams

```ts
import fs from "fs";

fs.createReadStream("file.txt").on("data", (chunk) => {
  console.log(chunk.length);
});
```

`chunk` is typed as `Buffer`.

---

### 8. Environment variables

```ts
const port = Number(process.env.PORT) || 3000;
```

TypeScript knows `process.env.PORT` is `string | undefined`.

---

## tsconfig usage

```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

Explicitly includes Node types (useful in mixed DOM + Node projects).

---

## When you need it

- Backend (Express, NestJS, Fastify)
- Build tools (Vite, Webpack, ESLint configs)
- CLI tools
- Full-stack projects with Node tooling

---

## When you usually don’t

- Pure browser-only TypeScript projects
- No Node APIs or tooling involved

---

## One-line summary

`@types/node` allows TypeScript to understand Node.js APIs and correctly type-check Node-based code.
