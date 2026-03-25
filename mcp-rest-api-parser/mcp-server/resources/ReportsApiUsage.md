# Reports API MCP Server Usage

This MCP tool returns the full list of reports from GET http://localhost:3000/reports. The backend DOES NOT perform server-side filtering, sorting or pagination. The LLM should search the returned items for matches in `priority`, `title`, and `description`.

## Tool: `query_reports`

Input JSON (all fields optional, but ignored by the server):

```
{ "priority": "(ignored)", "title": "(ignored)", "description": "(ignored)" }
```

### Examples

- Request the full list (LLM performs search):
  ```
  query_reports {}
  ```

**Notes**

- The MCP server returns the raw items array for the LLM to search.
- Output JSON shape:

  ```json
  {
    "items": [
      /* full reports list */
    ],
    "raw": { "fetchedCount": 3 }
  }
  ```

- Ensure your local REST API runs at http://localhost:3000/reports.
- Make the MCP server executable and have Python + httpx available.
