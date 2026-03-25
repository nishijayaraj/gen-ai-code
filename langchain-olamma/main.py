#!/usr/bin/env python3
from __future__ import annotations
import os
import sys
import json
import time
from typing import Optional

import requests
import typer
from rich import print
from rich.prompt import Prompt
from dotenv import load_dotenv

load_dotenv()

app = typer.Typer()

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:0.5b")
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "60"))


def call_ollama_via_http(prompt: str, model: str = OLLAMA_MODEL, temperature: float = 0.0, max_tokens: int = 512) -> str:
    """Call local Ollama HTTP API directly as a fallback if no official client is available."""
    url = f"{OLLAMA_API_URL}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "temperature": float(temperature),
        "max_tokens": int(max_tokens),
    }

    try:
        resp = requests.post(url, json=payload, timeout=OLLAMA_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()
        # The response shape may vary; try common fields
        if isinstance(data, dict):
            if "text" in data:
                return data["text"]
            if "results" in data and isinstance(data["results"], list) and data["results"]:
                # search for text
                for r in data["results"]:
                    if isinstance(r, dict) and "text" in r:
                        return r["text"]
        # Fallback dump
        return json.dumps(data, ensure_ascii=False, indent=2)
    except Exception as e:
        raise RuntimeError(f"HTTP call to Ollama failed: {e}")


def call_ollama_client(prompt: str, model: str = OLLAMA_MODEL, temperature: float = 0.0, max_tokens: int = 512) -> str:
    """Try to call the official ollama client if installed."""
    try:
        import ollama
    except Exception:
        raise

    try:
        import inspect
        gen = ollama.generate
        sig = inspect.signature(gen)
        # Build kwargs only for parameters the installed client supports
        kwargs = {}
        if 'model' in sig.parameters:
            kwargs['model'] = model
        if 'prompt' in sig.parameters:
            kwargs['prompt'] = prompt
        # temperature may be named differently in some versions
        if 'temperature' in sig.parameters:
            kwargs['temperature'] = float(temperature)
        elif 'temp' in sig.parameters:
            kwargs['temp'] = float(temperature)
        # max tokens may be named max_tokens or max_new_tokens
        if 'max_tokens' in sig.parameters:
            kwargs['max_tokens'] = int(max_tokens)
        elif 'max_new_tokens' in sig.parameters:
            kwargs['max_new_tokens'] = int(max_tokens)

        # Call with the filtered kwargs
        resp = gen(**kwargs)

        # ollama.generate may return a string or an object depending on version
        if isinstance(resp, str):
            return resp
        if isinstance(resp, dict) and "text" in resp:
            return resp["text"]
        # best-effort
        return str(resp)
    except TypeError as e:
        # Fallback: try minimal call signature
        try:
            resp = ollama.generate(model, prompt)
            if isinstance(resp, str):
                return resp
            if isinstance(resp, dict) and "text" in resp:
                return resp["text"]
            return str(resp)
        except Exception as e2:
            raise RuntimeError(f"ollama client call failed: {e}; fallback also failed: {e2}")
    except Exception as e:
        raise RuntimeError(f"ollama client call failed: {e}")


@app.command()
def main(
    prompt: Optional[str] = typer.Option(None, "-p", "--prompt", help="Prompt to send to the model."),
    model: str = typer.Option(OLLAMA_MODEL, "-m", "--model", help="Model name to use."),
    temperature: float = typer.Option(0.0, "-t", "--temperature", help="Sampling temperature."),
    max_tokens: int = typer.Option(512, "--max-tokens", help="Maximum tokens to generate."),
    use_http: bool = typer.Option(False, "--http", help="Force using HTTP fallback instead of client."),
):
    """Simple CLI to call Ollama model.

    The tool will attempt to use the `ollama` Python package first. If it's not
    installed or --http is specified, it will call the local HTTP API at
    OLLAMA_API_URL.
    """
    if prompt is None:
        prompt = Prompt.ask("Prompt")

    client_available = False
    if not use_http:
        try:
            import ollama  # type: ignore
            client_available = True
        except Exception:
            client_available = False

    try:
        if client_available and not use_http:
            print("[green]Using ollama Python client.[/green]")
            out = call_ollama_client(prompt, model=model, temperature=temperature, max_tokens=max_tokens)
        else:
            print("[yellow]Using HTTP fallback to Ollama API.[/yellow]")
            out = call_ollama_via_http(prompt, model=model, temperature=temperature, max_tokens=max_tokens)

        print("\n[bold]Model output:[/bold]\n")
        print(out)
    except Exception as e:
        print(f"[red]Error:[/red] {e}")
        raise typer.Exit(code=1)


if __name__ == "__main__":
    app()
