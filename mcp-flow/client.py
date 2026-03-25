from langchain.agents import AgentExecutor, create_tool_calling_agent
# from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.tools import tool, Tool
import asyncio
import os

# os.environ["USER_AGENT"] = "my-langchain-agent/1.0"
# os.environ["GROQ_API_KEY"] = "your_key"
# os.environ["TAVILY_API_KEY"] = "your_key"
os.environ["CURL_CA_BUNDLE"] = ""


async def main():
    client = MultiServerMCPClient({
        "math": {
            "command": "python3",
            "args": ["/home/hp/Documents/gen-ai-samples/mcp-calculator/calculator.py"],
            "transport": "stdio",
        }
    })

    # Get tools
    tools = await client.get_tools()

    # Custom tool
    @tool
    def reverse_string(text: str) -> str:
        """Reverses the input string."""
        return text[::-1]

    # Optional web search tool
    '''
    search_tool = Tool(
        name="web_search",
        func=TavilySearchResults().run,
        description="Use for all general web searches EXCEPT DASA."
    )
    tools = [reverse_string, search_tool] + tools
    '''

    tools = [reverse_string] + tools

    llm = ChatOllama(
        model="qwen2.5:0.5b",
        temperature=0
    )

    # Prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a helpful assistant with access to these tools:
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
"""),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ])

    agent = create_tool_calling_agent(
        llm=llm,
        tools=tools,
        prompt=prompt
    )

    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True
    )

    # Run agent
    result = await agent_executor.ainvoke({
        "input": "Reverse the string 'hello world'. What is 3 multiplied by 2? Then, what is 5 plus the result? Plese give me a joke on mathematics."
    })

    print("\nResult:")
    print(result["output"])


if __name__ == "__main__":
    asyncio.run(main())