from django.contrib import admin

from .models import Evaluation, EvaluationResponse


@admin.register(EvaluationResponse)
class EvaluationResponseAdmin(admin.ModelAdmin):
    list_display = ("id", "sample_id", "country", "consent", "email", "gender", "submitted_at")
    list_filter = ("country", "consent", "submitted_at")
    search_fields = ("sample_id", "email")


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "annotator_id",
        "article_id",
        "sample_id",
        "q5_final_label",
        "submitted_at",
    )
    list_filter = ("annotator_id", "article_id", "q5_final_label", "submitted_at")
    search_fields = ("annotator_id", "article_id", "sample_id", "q6_comment")
    ordering = ("-submitted_at",)
