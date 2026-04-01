import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";

import { getUserTool } from "./tools/userTool";
import { searchProductsTool } from "./tools/productTool";
import { createOrderTool } from "./tools/orderTool";

const server = new Server(
  {
    name: "rest-api-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Register tools
server.tool(
  getUserTool.name,
  getUserTool.description,
  getUserTool.schema,
  getUserTool.handler,
);

server.tool(
  searchProductsTool.name,
  searchProductsTool.description,
  searchProductsTool.schema,
  searchProductsTool.handler,
);

server.tool(
  createOrderTool.name,
  createOrderTool.description,
  createOrderTool.schema,
  createOrderTool.handler,
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP REST Server running...");
}

main();
