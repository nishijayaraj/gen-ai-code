import sys
import os
from typing import Any, Dict, List, Optional

import httpx
from mcp.server import Server
import mcp.types as types
from mcp.server import stdio

sys.path.insert (0, os.path.dirname(os.path.abspath(__file__)))

BASE_URL = os.getenv("REPORTS_API_BASE_URL", "http://localhost:3000/reports")
TIMEOUT_SECS = float(os.getenv("REPORTS_API_TIMEOUT", "10"))

server = Server("Reports API Server")

def _http_client() -> httpx.Client:
    return httpx.Client(timeout=TIMEOUT_SECS)

def _query_reports_impl() -> Dict[str, Any]:
    """Fetch the full reports list from the REST API and return a simple
    items list. This implementation does NOT perform server-side filtering,
    sorting or pagination — it returns the raw list for the LLM to search
    locally."""
    url = BASE_URL
    with _http_client() as client:
        resp = client.get(url)
        resp.raise_for_status()
        data = resp.json()

    # Support several API shapes:
    # - a flat list (most local json-server setups)
    # - an object with `content` (Spring Page)
    # - an object with `items` (alternative)
    if isinstance(data, list):
        reports = data
    elif isinstance(data, dict):
        reports = data.get("content") or data.get("items") or []
    else:
        reports = []

    items = [
        {
            "id": item.get("id"),
            "priority": item.get("priority"),
            "title": item.get("title"),
            "description": item.get("description"),
        }
        for item in reports
    ]

    return {"items": items, "raw": {"fetchedCount": len(items)}}

_QUERY_REPORTS_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "properties": {},
    "additionalProperties": True,
}

@server.list_tools()
async def list_tools() -> List[types.Tool]:
    return [
        types.Tool(
            name="query_reports",
            description="Return the full reports list (no server-side filtering/sorting/pagination). LLM will search priority/title/description.",
            inputSchema=_QUERY_REPORTS_SCHEMA,
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: Any) -> List[types.TextContent]:
    if name != "query_reports":
        raise ValueError(f"Unknown tool: {name}")

    # We ignore any paging/sort/filter arguments on the server — the tool
    # returns the full list for the LLM to search locally.
    result = _query_reports_impl()
    return [types.TextContent(type="text", text=str(result))]


@server.list_resources()
async def list_resources() -> List[types.Resource]:
    return [types.Resource(name="Reports API Usage", uri="reports://usage", mimeType="text/markdown", description="Usage instructions for Reports API MCP server")]

@server.read_resource()
async def read_resource(uri: str) -> str:
    uri_str = str (uri)
    if uri_str == "reports://usage":
        try:
            with open (os.path.join (os.path.dirname(__file__), "resources", "ReportsApiUsage.md"), "r") as f:
                return f.read()
        except Exception as e:
            raise ValueError (f"Error reading ReportsApiUsage: {str (e)}")
    raise ValueError (f"Unknown resource: {uri}")

if __name__ == "__main__":
    import asyncio
    async def main() -> None:
        async with stdio.stdio_server() as (read_stream, write_stream):
            await server.run(read_stream, write_stream, server.create_initialization_options())
    asyncio.run(main())
