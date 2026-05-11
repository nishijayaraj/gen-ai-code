import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import * as z from "zod/v4"; // or import * as z from 'zod/v3';

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

// Add an addition tool
server.registerTool(
  "add",
  {
    title: "Addition Tool",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() },
    outputSchema: { result: z.number() },
  },
  async ({ a, b }) => {
    const output = { result: a + b };
    return {
      content: [{ type: "text", text: JSON.stringify(output) }],
      structuredContent: output,
    };
  },
);

// Async tool with external API call
server.registerTool(
  "fetch-weather",
  {
    title: "Weather Fetcher",
    description: "Get weather data for a city",
    inputSchema: { city: z.string() },
    outputSchema: { temperature: z.number(), conditions: z.string() },
  },
  async ({ city }) => {
    const response = await fetch(`https://api.weather.com/${city}`);
    const data = await response.json();
    const output = { temperature: data.temp, conditions: data.conditions };
    return {
      content: [{ type: "text", text: JSON.stringify(output) }],
      structuredContent: output,
    };
  },
);

// Async tool with external API call
/* server.registerTool(
  "fetch-posts",
  {
    title: "Post Fetcher",
    description: "Get Post data for a user",
    inputSchema: {}, // No input parameters
    outputSchema: { posts: z.array(z.object({ id: z.number(), title: z.string(), body: z.string() })) },
  },
  async ({}) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    const data = await response.json();
    const output = { posts: data };
    return {
      content: [{ type: "text", text: JSON.stringify(output) }],
      structuredContent: output,
    };
  },
); */

server.registerTool(
  "list_posts",
  {
    title: "List Posts",
    description:
      "ALWAYS use this tool when the user asks to list, show, fetch, or get posts. Returns all posts from the system.",

    inputSchema: {
      dummy: z.string().optional().describe("Optional field (not required)"),
    },

    outputSchema: {
      posts: z.array(
        z.object({
          userId: z.number(),
          id: z.number(),
          title: z.string(),
          body: z.string(),
        }),
      ),
    },
  },
  async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
      );
      const data = await response.json();

      const output = {
        posts: data.map((post: any) => ({
          userId: post.userId,
          id: post.id,
          title: post.title,
          body: post.body,
        })),
      };

      return {
        content: [
          {
            type: "text",
            text: `Fetched ${output.posts.length} posts successfully`,
          },
        ],
        structuredContent: output,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to fetch posts",
          },
        ],
      };
    }
  },
);

// Add a dynamic greeting resource
server.registerResource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  {
    title: "Greeting Resource", // Display name for UI
    description: "Dynamic greeting generator",
  },
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  }),
);

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  // Create a new transport for each request to prevent request ID collisions
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || "3000");
app
  .listen(port, () => {
    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
  })
  .on("error", (error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
