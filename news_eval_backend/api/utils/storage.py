import json
import os
from datetime import datetime, timezone
from typing import Any, Dict

from django.conf import settings


def repo_root() -> str:
    return os.path.abspath(os.path.join(settings.BASE_DIR, os.pardir))


def default_output_path() -> str:
    # 레포 루트에 저장(백엔드 폴더 밖). 필요시 settings로 이동 가능.
    return os.path.join(repo_root(), "evaluations.jsonl")


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def append_jsonl(record: Dict[str, Any], output_path: str | None = None) -> str:
    path = output_path or default_output_path()

    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

    return path


def _safe_path_component(value: str) -> str:
    # 파일/폴더명으로 안전하게 사용하도록 최소한의 정리만 수행
    # (운영에서는 더 강한 sanitization/slugify 적용 권장)
    value = (value or "").strip()
    if not value:
        return "unknown"
    return "".join(ch if ch.isalnum() or ch in ("-", "_", ".") else "_" for ch in value)


def evaluations_dir() -> str:
    return os.path.join(repo_root(), "evaluations")


def evaluation_output_path(annotator_id: str, article_id: str) -> str:
    a = _safe_path_component(annotator_id)
    art = _safe_path_component(article_id)
    # 구조: evaluations/<annotator_id>/<article_id>.jsonl
    return os.path.join(evaluations_dir(), a, f"{art}.jsonl")


def append_evaluation_record(record: Dict[str, Any]) -> str:
    annotator_id = str(record.get("annotator_id", "unknown"))
    article_id = str(record.get("article_id", "unknown"))
    path = evaluation_output_path(annotator_id=annotator_id, article_id=article_id)
    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

    return path
