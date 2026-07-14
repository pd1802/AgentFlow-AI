from django.urls import path

from . import views

urlpatterns = [

    path("", views.home, name="home"),

    path(
        "api/research/",
        views.start_research,
        name="research"
    ),
    path(
        "api/research/<str:task_id>/",
        views.research_status,
        name="research_status"
    ),

    path(
    "api/history/",
    views.research_history,
    name="history"
),

]