from rest_framework import serializers


class EvaluationCreateSerializer(serializers.Serializer):
    sample_id = serializers.CharField(max_length=256)
    annotator_id = serializers.CharField(max_length=128)
    article_id = serializers.CharField(max_length=256, required=False, allow_blank=True, allow_null=True)

    q1_label_appropriateness = serializers.IntegerField(min_value=1, max_value=5)

    q2_need_segmentation = serializers.IntegerField(
        min_value=1, max_value=5, required=False, allow_null=True
    )
    q3_segmentation_quality = serializers.IntegerField(
        min_value=1, max_value=5, required=False, allow_null=True
    )

    q4_segment_1_label_quality = serializers.IntegerField(
        min_value=1, max_value=5, required=False, allow_null=True
    )
    q4_segment_2_label_quality = serializers.IntegerField(
        min_value=1, max_value=5, required=False, allow_null=True
    )

    q5_final_label = serializers.ChoiceField(choices=["F", "C", "M", "Unsure"])
    q6_comment = serializers.CharField(allow_blank=True, required=False, default="")

    def validate(self, attrs):
        return attrs


class EvaluationReadSerializer(serializers.Serializer):
    annotator_id = serializers.CharField()
    article_id = serializers.CharField()
    sample_id = serializers.CharField()
    q1_label_appropriateness = serializers.IntegerField()
    q2_need_segmentation = serializers.IntegerField(allow_null=True)
    q3_segmentation_quality = serializers.IntegerField(allow_null=True)
    q4_segment_1_label_quality = serializers.IntegerField(allow_null=True)
    q4_segment_2_label_quality = serializers.IntegerField(allow_null=True)
    q5_final_label = serializers.CharField()
    q6_comment = serializers.CharField()
    submitted_at = serializers.DateTimeField()
