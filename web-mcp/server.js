import express from "express";
import bodyParser from "body-parser";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const app = express();
app.use(bodyParser.json());

// Create MCP handler
const handler = createMcpHandler(
  (server) => {
    // Tool 1: Get user info
    server.tool(
      "getUserInfo",
      "Fetch user info by ID",
      {
        userId: z.string().min(1),
      },
      async ({ userId }) => {
        const users = {
          123: { id: "123", name: "Alice", email: "alice@example.com" },
          456: { id: "456", name: "Bob", email: "bob@example.com" },
        };
        const user = users[userId];
        if (!user) throw new Error("User not found");
        return { user };
      },
    );

    // Tool 2: Update user email
    server.tool(
      "updateUserEmail",
      "Update a user’s email",
      {
        userId: z.string().min(1),
        newEmail: z.string().email(),
      },
      async ({ userId, newEmail }) => {
        const users = {
          123: { id: "123", name: "Alice", email: "alice@example.com" },
          456: { id: "456", name: "Bob", email: "bob@example.com" },
        };
        const user = users[userId];
        if (!user) throw new Error("User not found");
        user.email = newEmail;
        return { user };
      },
    );
  },
  {},
  { basePath: "/mcp" },
);

// Attach to Express
app.post("/mcp", handler);

app.listen(3000, () => {
  console.log("MCP Server running on port 3000");
});
