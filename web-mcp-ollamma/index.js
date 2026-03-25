import { ollama } from "ollama-ai-provider";
import { generateText } from "ai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// 1. Setup SSE Transport
//const transport = new SSEClientTransport(new URL("http://localhost:3001/sse"));
// set transport for python MCP server
const transport = new StdioClientTransport({
  command: "python3",
  args: ["/home/hp/Documents/gen-ai/mcp-server/main.py"],
});

const mcpClient = new Client(
  { name: "my-app", version: "1.0.0" },
  { capabilities: {} },
);

try {
  await mcpClient.connect(transport);
} catch (err) {
  console.error("Failed to connect MCP transport:", err);
  process.exit(1);
}

// 2. Fetch tools from MCP server
const { tools } = await mcpClient.listTools();

// 3. Use with AI SDK and Ollama
const result = await generateText({
  model: ollama("qwen2.5:0.5b"),
  tools: tools.reduce((acc, tool) => {
    acc[tool.name] = {
      description: tool.description,
      parameters: tool.inputSchema,
      execute: async (args) =>
        await mcpClient.callTool({ name: tool.name, arguments: args }),
    };
    return acc;
  }, {}),
  prompt: "how many reports are of high priority and what is their title?",
});
result.text().then((text) => console.log("AI Response:", text));
