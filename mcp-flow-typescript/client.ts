import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { tool } from "@langchain/core/tools";
import { MultiServerMCPClient } from "langchain-mcp-adapters/client";

// Optional
// import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

import * as process from "process";

process.env.CURL_CA_BUNDLE = "";

async function main() {
  // MCP Client setup
  const client = new MultiServerMCPClient({
    math: {
      command: "python3",
      args: ["/home/hp/Documents/gen-ai-samples/mcp-calculator/calculator.py"],
      transport: "stdio",
    },
  });

  // Fetch tools from MCP
  const mcpTools = await client.getTools();

  // Custom tool
  const reverseString = tool(
    async ({ text }: { text: string }) => {
      return text.split("").reverse().join("");
    },
    {
      name: "reverse_string",
      description: "Reverses the input string",
      schema: {
        type: "object",
        properties: {
          text: { type: "string" },
        },
        required: ["text"],
      },
    }
  );

  // Optional web search tool
  /*
  const searchTool = new TavilySearchResults({
    maxResults: 5,
  });

  const tools = [reverseString, searchTool, ...mcpTools];
  */

  const tools = [reverseString, ...mcpTools];

  // LLM
  const llm = new ChatOllama({
    model: "qwen2.5:0.5b",
    temperature: 0,
  });

  // Prompt
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant with access to these tools:
- reverse_string: Use to reverse any string.
- add, subtract, multiply, divide: Use for math calculations.
- web_search: Use for general web searches.

Examples:
Q: What is 5 + 3?
A: [use add]
Q: Reverse the string 'hello world'
A: [use reverse_string]
Q: Search for the latest news about OpenAI
A: [use web_search]
`,
    ],
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  // Create agent
  const agent = await createToolCallingAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
    handleParsingErrors: true,
  });

  // Run agent
  const result = await agentExecutor.invoke({
    input:
      "Reverse the string 'hello world'. What is 3 multiplied by 2? Then, what is 5 plus the result? Please give me a joke on mathematics.",
  });

  console.log("\nResult:");
  console.log(result.output);
}

main().catch(console.error);
