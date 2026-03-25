const express = require("express");
const axios = require("axios");
const { z } = require("zod");

// Simple in-memory user store
const users = {
  123: { id: "123", name: "Alice", email: "alice@example.com" },
};

const app = express();
app.use(express.json());

// Request validation schemas
const mcpRequestSchema = z.object({
  method: z.string(),
  params: z.object({
    tool: z.string(),
    arguments: z.any(),
  }),
});

const getUserInfoArgs = z.object({ userId: z.string() });
const updateUserEmailArgs = z.object({
  userId: z.string(),
  newEmail: z.string().email(),
});

app.post("/mcp", (req, res) => {
  try {
    const body = mcpRequestSchema.parse(req.body);
    const { method, params } = body;

    if (method !== "callTool") {
      return res.status(400).json({ error: "unsupported method" });
    }

    const { tool, arguments: args } = params;

    if (tool === "getUserInfo") {
      const parsed = getUserInfoArgs.parse(args);
      const user = users[parsed.userId] || null;
      return res.json({ result: user });
    }

    if (tool === "updateUserEmail") {
      const parsed = updateUserEmailArgs.parse(args);
      const user = users[parsed.userId];
      if (!user) return res.status(404).json({ error: "user not found" });
      user.email = parsed.newEmail;
      return res.json({ result: user });
    }

    return res.status(400).json({ error: "unknown tool" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

const port = 3000;
const server = app.listen(port, async () => {
  console.log(`MCP mock server listening on http://localhost:${port}`);

  // Client code that calls the /mcp endpoint
  async function callTool(tool, params) {
    const response = await axios.post(`http://localhost:${port}/mcp`, {
      method: "callTool",
      params: { tool, arguments: params },
    });
    return response.data;
  }

  (async () => {
    try {
      console.log("Fetching user info...");
      const response1 = await callTool("getUserInfo", { userId: "123" });
      console.log(response1);

      console.log("\nUpdating user email...");
      const response2 = await callTool("updateUserEmail", {
        userId: "123",
        newEmail: "alice.new@example.com",
      });
      console.log(response2);
    } catch (err) {
      console.error("Client error:", err.message);
    } finally {
      // Close server after demo
      server.close();
    }
  })();
});
