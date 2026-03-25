sudo apt-get install python3-venv
python3 -m venv dev-env
source dev-env/bin/activate

# Install Libraries

pip install mcp mcp[cli]

#How to run
mcp dev calculator.py

This will open an inspector too . The url will be shown in terminal output. Open the displayed URL (mostly localhost) and press "Connect" in MCP Inspector tool
