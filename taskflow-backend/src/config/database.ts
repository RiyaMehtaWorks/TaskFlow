/* This file is:
- A MongoDB connection manager
- Written using the official MongoDB Node.js driver
- Implemented as a singleton (one shared database connection)
-  Designed to be initialized once at server startup 
 */
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/taskflow";
    this.client = new MongoClient(uri);
  }

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

  getDb(): Db {
    if (!this.db) {
      throw new Error("Database not initialized. Call connect() first.");
    }
    return this.db;
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }
}

export const database = new Database();
