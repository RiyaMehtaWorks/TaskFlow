# Database Class Using MongoDB Driver – Detailed Explanation

This document explains a **Database class implemented using the official MongoDB driver**, with **code examples** and **comparisons to Mongoose**.

---

## 1. Imports

```ts
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
```

- `MongoClient`: Main entry point to connect to MongoDB (like `mongoose.connect`).
- `Db`: Handle to a specific database (like `mongoose.connection.db`).
- `dotenv`: Loads environment variables from `.env`.

---

## 2. Class Definition

```ts
class Database {
  private client: MongoClient;
  private db: Db | null = null;
```

- `client` stores the MongoClient instance.
- `db` stores the connected database object.
- In Mongoose, this is abstracted away; you only interact with models.

---

## 3. Constructor

```ts
constructor() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/taskflow";
  this.client = new MongoClient(uri);
}
```

- Reads the MongoDB URI from `.env`.
- Creates a MongoClient instance but **does not connect yet**.
- ✅ Mongoose equivalent: `mongoose.connect(uri)`.

---

## 4. Connect Method

```ts
async connect(): Promise<void> {
  try {
    await this.client.connect();
    this.db = this.client.db("taskflow");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}
```

- Establishes connection to MongoDB.
- Selects the database using `client.db(name)`.
- In Mongoose, connection is automatic via `mongoose.connect`.

**Example Usage**

```ts
await database.connect();
```

---

## 5. Get Database Instance

```ts
getDb(): Db {
  if (!this.db) {
    throw new Error("Database not initialized. Call connect() first.");
  }
  return this.db;
}
```

- Ensures database is connected before accessing collections.
- Mongoose abstracts this automatically via models.

**Example Usage**

```ts
const db = database.getDb();
const tasksCollection = db.collection("tasks");
```

---

## 6. Disconnect Method

```ts
async disconnect(): Promise<void> {
  await this.client.close();
}
```

- Closes the connection.
- Equivalent in Mongoose: `mongoose.disconnect()`.

**Example Usage**

```ts
await database.disconnect();
```

---

## 7. Exporting Singleton

```ts
export const database = new Database();
```

- Ensures only **one shared connection** across the app.
- Similar to Mongoose’s global connection.

**Usage in Other Modules**

```ts
import { database } from "./Database";
await database.connect();
const db = database.getDb();
```

---

## 8. Using Collections

- Access collections directly and perform operations manually.

```ts
const tasks = db.collection("tasks");
await tasks.insertOne({ title: "New Task" });
const task = await tasks.findOne({ _id: someId });
```

**Difference from Mongoose:**

- No schemas by default
- Manual validation
- No built-in hooks or middleware

Mongoose equivalent:

```ts
await TaskModel.create({ title: "New Task" });
const task = await TaskModel.findById(someId);
```

---

## 9. Summary of Differences vs Mongoose

| Feature              | Mongoose             | MongoDB Driver                   |
| -------------------- | -------------------- | -------------------------------- |
| Schema / Model       | Built-in             | Manual / optional TS interfaces  |
| Connection           | `mongoose.connect()` | `new MongoClient(uri).connect()` |
| Collection access    | `Model.find()`       | `db.collection("tasks").find()`  |
| Validation           | Automatic            | Manual                           |
| Lifecycle hooks      | Pre/post middleware  | None                             |
| Singleton connection | Global connection    | Must manage manually             |

---

✅ **Key Takeaways:**

- Using the **MongoDB driver** is lower-level and more flexible.
- Mongoose provides **schema validation, models, and convenience methods**.
- With the driver, you have full control but more responsibility.
- The `Database` class is a **clean singleton wrapper** around the MongoClient for modularity and reusability.
