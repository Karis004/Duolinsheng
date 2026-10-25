"""Paths for learning records stored outside the application image."""

import os
from pathlib import Path


DATA_DIR = Path(os.environ.get("DUOLINSHENG_DATA_DIR", "."))


def data_path(filename):
    return DATA_DIR / filename
