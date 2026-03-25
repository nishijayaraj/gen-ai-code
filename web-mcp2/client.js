import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function invokeTool() {
  // 1. Set up transport to launch the server process
  const transport = new StdioClientTransport({
    command:
      "/home/hp/Documents/gen-ai-samples/mcp-calculator/dev-env/bin/python",
    args: ["/home/hp/Documents/gen-ai-samples/mcp-calculator/calculator.py"],
  });

  /*"command": "/home/hp/Documents/gen-ai-samples/mcp-calculator/dev-env/bin/python",
      "args": [
        "/home/hp/Documents/gen-ai-samples/mcp-calculator/calculator.py"
      ] */
  // 2. Initialize the client
  const client = new Client({
    name: "my-typescript-app",
    version: "1.0.0",
  });

  // 3. Connect to the server
  await client.connect(transport);

  // 4. Invoke a specific tool (e.g., 'calculate_sum', joke)
  /* const result = await client.callTool({
    name: "remainder",
    arguments: { a: 10, b: 10 },
  }); */

  const result = await client.callTool({
    name: "joke",
    arguments: {},
  });

  console.log("Tool Output:", result.content);

  // Clean up
  await client.close();
}

invokeTool().catch(console.error);
