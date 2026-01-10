import "reflect-metadata"; // MUST be first line!
import express from "express";
import cors from "cors";
import { database } from "./config/database.js";
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
// Test route
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});
// Start server
async function startServer() {
    try {
        // Connect to database first
        await database.connect();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
