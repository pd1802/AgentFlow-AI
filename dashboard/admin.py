from django.contrib import admin

from .models import ResearchHistory


@admin.register(ResearchHistory)
class ResearchHistoryAdmin(admin.ModelAdmin):

    list_display = (
        "topic",
        "status",
        "runtime",
        "created_at"
    )

    search_fields = (
        "topic",
    )

    list_filter = (
        "status",
        "created_at"
    )