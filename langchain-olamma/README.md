# Ollama Qwen2.5:0.5b Python project

Simple Python project demonstrating how to call a local Ollama model (qwen2.5:0.5b).

Prerequisites

- Ollama installed and running locally (default HTTP API at http://127.0.0.1:11434)
- Model `qwen2.5:0.5b` pulled/loaded in Ollama
- Python 3.8+

Install

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Usage

Basic CLI usage:

```bash
python main.py --prompt "Write a friendly greeting"
```

You can override model, temperature and max tokens:

```bash
python main.py --model qwen2.5:0.5b --prompt "Summarize the following text..." --temperature 0.2 --max-tokens 256
```

Notes

- The script prefers the official `ollama` Python package if available. If not, it falls back to calling the local Ollama HTTP API directly.
- If the HTTP API schema changes in future versions of Ollama, the fallback will print the raw response so you can inspect it.

License: MIT
