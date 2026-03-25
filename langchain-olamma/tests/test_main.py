import os
import subprocess
import sys


def test_main_help():
    # ensure script runs and returns help
    p = subprocess.run([sys.executable, "main.py", "--help"], capture_output=True, text=True)
    assert p.returncode == 0
    assert "Usage:" in p.stdout or "Usage" in p.stdout
