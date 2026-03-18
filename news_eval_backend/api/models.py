from django.db import models


class EvaluationResponse(models.Model):
    """뉴스 문장 인간평가 응답.

    최소 구현 버전이라 json_data에 폼 응답 전체를 통째로 저장합니다.
    (추후 질문별 컬럼 분리 가능)
    """

    # annotator info
    email = models.EmailField(blank=True, default="")
    gender = models.CharField(max_length=32, blank=True, default="")
    country = models.CharField(max_length=64, blank=True, default="")
    consent = models.BooleanField(default=True)

    # task/sample
    sample_id = models.CharField(max_length=128)

    # responses
    json_data = models.JSONField()

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.sample_id} ({self.submitted_at:%Y-%m-%d %H:%M:%S})"


class Evaluation(models.Model):
    """인간평가 결과(정규화된 DB 저장).

    핵심 조회 축: annotator_id / article_id / sample_id
    - annotator별 진행상황
    - article별 결과
    - sample별 중복 제출 방지

    MVP에서는 로그인 없이 annotator_id 문자열만 받습니다.
    """

    class FinalLabel(models.TextChoices):
        F = "F"
        C = "C"
        M = "M"
        UNSURE = "Unsure"

    annotator_id = models.CharField(max_length=128, db_index=True)
    article_id = models.CharField(max_length=256, db_index=True)
    sample_id = models.CharField(max_length=256, db_index=True)

    q1_label_appropriateness = models.PositiveSmallIntegerField()
    q2_need_segmentation = models.PositiveSmallIntegerField(null=True, blank=True)
    q3_segmentation_quality = models.PositiveSmallIntegerField(null=True, blank=True)
    q4_segment_1_label_quality = models.PositiveSmallIntegerField(null=True, blank=True)
    q4_segment_2_label_quality = models.PositiveSmallIntegerField(null=True, blank=True)

    q5_final_label = models.CharField(max_length=16, choices=FinalLabel.choices)

    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["annotator_id", "sample_id"],
                name="uniq_evaluation_per_annotator_sample",
            )
        ]
        indexes = [
            models.Index(fields=["annotator_id", "article_id"]),
            models.Index(fields=["article_id", "sample_id"]),
        ]

    def __str__(self) -> str:
        return f"{self.annotator_id}:{self.sample_id}"
