from django.urls import path

from . import views

urlpatterns = [
    path("news-samples/random/", views.get_random_news_sample, name="news-sample-random"),
    path("evaluations/", views.evaluations, name="evaluations"),
    path("evaluations/summary/", views.evaluations_summary, name="evaluations-summary"),
]
