from django.db import IntegrityError
from django.http import JsonResponse
from rest_framework.decorators import api_view

from .models import Evaluation
from .serializers import EvaluationCreateSerializer, EvaluationReadSerializer
from .utils.samples import get_random_sample
from .utils.storage import now_iso


def _extract_article_id(sample_id: str) -> str:
    # sample_id 예: ART_0001_S001 또는 0001-003 등 다양한 경우를 대비한 최소 규칙
    s = (sample_id or "").strip()
    if not s:
        return "unknown"

    # ART_0001_S001 -> ART_0001
    if "_S" in s:
        return s.split("_S", 1)[0]

    # 그 외에는 첫 구분자(- or _) 앞을 article로 간주
    for sep in ("-", "_"):
        if sep in s:
            return s.split(sep, 1)[0]

    return s


@api_view(["GET"])
def get_random_news_sample(request):
    try:
        sample = get_random_sample()
    except FileNotFoundError as e:
        return JsonResponse({"error": str(e)}, status=404)
    except Exception as e:
        return JsonResponse({"error": "failed_to_load_samples", "detail": str(e)}, status=500)

    return JsonResponse(sample, safe=False)


@api_view(["GET", "POST"])
def evaluations(request):
    if request.method == "POST":
        serializer = EvaluationCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse(
                {"error": "validation_error", "details": serializer.errors}, status=400
            )

        data = serializer.validated_data

        sample_id = str(data["sample_id"])
        annotator_id = str(data["annotator_id"])

        incoming_article_id = data.get("article_id")
        article_id = str(incoming_article_id).strip() if incoming_article_id else ""
        if not article_id:
            article_id = _extract_article_id(sample_id)

        try:
            obj = Evaluation.objects.create(
                annotator_id=annotator_id,
                article_id=article_id,
                sample_id=sample_id,
                q1_label_appropriateness=data["q1_label_appropriateness"],
                q2_need_segmentation=data.get("q2_need_segmentation"),
                q3_segmentation_quality=data.get("q3_segmentation_quality"),
                q4_segment_1_label_quality=data.get("q4_segment_1_label_quality"),
                q4_segment_2_label_quality=data.get("q4_segment_2_label_quality"),
                q5_final_label=data["q5_final_label"],
            )
        except IntegrityError:
            return JsonResponse(
                {
                    "error": "duplicate",
                    "detail": "Evaluation already exists for this annotator_id and sample_id",
                    "annotator_id": annotator_id,
                    "sample_id": sample_id,
                },
                status=409,
            )

        return JsonResponse(
            {
                "message": "saved",
                "id": obj.id,
                "annotator_id": obj.annotator_id,
                "article_id": obj.article_id,
                "sample_id": obj.sample_id,
                "submitted_at": obj.submitted_at,
            },
            status=201,
        )

    # GET: list with filters
    qs = Evaluation.objects.all().order_by("-submitted_at")

    annotator_id = request.query_params.get("annotator_id")
    article_id = request.query_params.get("article_id")
    sample_id = request.query_params.get("sample_id")

    if annotator_id:
        qs = qs.filter(annotator_id=annotator_id)
    if article_id:
        qs = qs.filter(article_id=article_id)
    if sample_id:
        qs = qs.filter(sample_id=sample_id)

    # pagination은 MVP에서는 생략(추후 DRF pagination으로 확장)
    data = EvaluationReadSerializer(qs[:500], many=True).data
    return JsonResponse({"count": qs.count(), "results": data}, status=200)


@api_view(["GET"])
def evaluations_summary(request):
    # annotator별로 article 진행상황을 보기 위한 최소 요약
    annotator_id = request.query_params.get("annotator_id")
    qs = Evaluation.objects.all()
    if annotator_id:
        qs = qs.filter(annotator_id=annotator_id)

    # Python에서 groupby (MVP). 데이터가 커지면 ORM aggregation으로 변경.
    summary = {}
    for e in qs.only("annotator_id", "article_id", "sample_id"):
        a = e.annotator_id
        art = e.article_id
        summary.setdefault(a, {}).setdefault(art, set()).add(e.sample_id)

    out = []
    for a, arts in summary.items():
        out.append(
            {
                "annotator_id": a,
                "articles": [
                    {"article_id": art, "submitted_samples": len(samples)}
                    for art, samples in sorted(arts.items(), key=lambda x: x[0])
                ],
            }
        )

    return JsonResponse({"results": out}, status=200)


# 기존 엔드포인트 이름 호환: /api/evaluations/ -> evaluations 뷰로 라우팅
create_evaluation = evaluations
