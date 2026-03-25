"""Utility wrapper to call Ollama client if available, with a HTTP fallback."""
from __future__ import annotations
import os
import json
from typing import Optional

import requests

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://127.0.0.1:11434")
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "60"))


def generate(prompt: str, model: str = "qwen2.5:0.5b", temperature: float = 0.0, max_tokens: int = 512) -> str:
    """Try official client, otherwise use HTTP fallback."""
    try:
        import ollama
        try:
            import inspect
            gen = ollama.generate
            sig = inspect.signature(gen)
            kwargs = {}
            if 'model' in sig.parameters:
                kwargs['model'] = model
            if 'prompt' in sig.parameters:
                kwargs['prompt'] = prompt
            if 'temperature' in sig.parameters:
                kwargs['temperature'] = float(temperature)
            elif 'temp' in sig.parameters:
                kwargs['temp'] = float(temperature)
            if 'max_tokens' in sig.parameters:
                kwargs['max_tokens'] = int(max_tokens)
            elif 'max_new_tokens' in sig.parameters:
                kwargs['max_new_tokens'] = int(max_tokens)

            resp = gen(**kwargs)
            if isinstance(resp, str):
                return resp
            if isinstance(resp, dict) and "text" in resp:
                return resp["text"]
            return str(resp)
        except TypeError:
            # try minimal positional call
            resp = ollama.generate(model, prompt)
            if isinstance(resp, str):
                return resp
            if isinstance(resp, dict) and "text" in resp:
                return resp["text"]
            return str(resp)
        except Exception:
            # fall through to HTTP fallback
            pass
    except Exception:
        pass

    # HTTP fallback
    url = f"{OLLAMA_API_URL}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "temperature": float(temperature),
        "max_tokens": int(max_tokens),
    }
    resp = requests.post(url, json=payload, timeout=OLLAMA_TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    if isinstance(data, dict):
        if "text" in data:
            return data["text"]
        if "results" in data and isinstance(data["results"], list) and data["results"]:
            for r in data["results"]:
                if isinstance(r, dict) and "text" in r:
                    return r["text"]
    return json.dumps(data, ensure_ascii=False, indent=2)
