https://github.com/typicode/json-server

npx json-server dbmcp.json

http://localhost:3000//reports?priority=high

Ref :
https://github.com/alcbotta/mcp-report

copy mcp-server folder from above repo and rin the following cmd from this mcp-server

## MCP Server Inspector

npx @modelcontextprotocol/inspector uv run main.py

## Now dockerize the mcp-server ( where Dockerfile present)

docker build -t mcp-server-reports .

## MCP Host

Install go
https://go.dev/doc/install

Download go1.26.1.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.26.1.linux-amd64.tar.gz

Note : Do not untar the archive into an existing /usr/local/go tree. This is known to produce broken Go installations.
In that case you need to try :
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.26.1.linux-amd64.tar.gz

## Set go in path variable

Add /usr/local/go/bin to the PATH environment variable.
export PATH=$PATH:/usr/local/go/bin

Check go version
(gen-ai) hp@hp-HP-Laptop-15s-fq4xxx:~/Downloads$ go version
go version go1.26.1 linux/amd64

# #3. Install MCPHost

go install github.com/mark3labs/mcphost@latest

mcphost version

This might throw mcphost not found. Then run
mcphost: command not found
hp@hp-HP-Laptop-15s-fq4xxx:~/Documents/gen-ai$ mcphost
mcphost: command not found
hp@hp-HP-Laptop-15s-fq4xxx:~/Documents/gen-ai$ go env GOPATH
/home/hp/go
hp@hp-HP-Laptop-15s-fq4xxx:~/Documents/gen-ai$ export PATH=$PATH:$(go env GOPATH)/bin
hp@hp-HP-Laptop-15s-fq4xxx:~/Documents/gen-ai$
hp@hp-HP-Laptop-15s-fq4xxx:~/Documents/gen-ai$ mcphost --version
mcphost version dev
hp@hp-HP-Laptop-15s-fq4xxx:~/Documents/gen-ai$

# #4. Run the AI Agent

cd mcp-client
mcphost -m ollama:qwen3 --config ./mcp-servers.config.json

You should see a message showing that the reports MCP Server has loaded successfully:

This was not loading due to insufficeinet memoory (at least 5MGB free memory need for qew3 model). So I used light weight model from Olamma

# ollama pull qwen2.5:0.5b

# # Corrected command

mcphost -m "ollama:qwen2.5:0.5b" --config ./mcp-servers.config.json

# Corrected command

mcphost -m "ollama:qwen2.5:0.5b" --config ./mcp-servers.config.json
This worked was able to pick up this llm model


Sample questions:

- how many reports are of high priority and what is their title?
- how many reports mention an outage in their title? Show me their description. Limit the search to 20.