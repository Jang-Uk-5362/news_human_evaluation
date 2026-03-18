import json
import os
import random
from typing import Any, Dict, List, Optional

from django.conf import settings


def repo_root() -> str:
    # settings.BASE_DIR == news_eval_backend/
    return os.path.abspath(os.path.join(settings.BASE_DIR, os.pardir))


def samples_json_path() -> str:
    return os.path.join(repo_root(), "news_samples.json")


def load_samples() -> List[Dict[str, Any]]:
    path = samples_json_path()
    if not os.path.isfile(path):
        raise FileNotFoundError(f"news_samples.json not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list) or not data:
        raise ValueError("news_samples.json must be a non-empty list")

    return [dict(x) for x in data]


def normalize_sample(sample: Dict[str, Any]) -> Dict[str, Any]:
    # (호환) 과거 데이터에 id만 있는 경우 -> sample_id로 매핑
    if "sample_id" not in sample and "id" in sample:
        sample["sample_id"] = sample.get("id")

    # llm_label이 없으면 gold_label을 llm_label로 노출(표시용)
    if "llm_label" not in sample and "gold_label" in sample:
        sample["llm_label"] = sample.get("gold_label")

    return sample


def select_random_sample(samples: List[Dict[str, Any]]) -> Dict[str, Any]:
    return random.choice(samples)


def get_random_sample() -> Dict[str, Any]:
    samples = load_samples()
    sample = select_random_sample(samples)
    return normalize_sample(sample)
