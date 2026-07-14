from django.db import models


class ResearchHistory(models.Model):

    STATUS_CHOICES = [
        ("running", "Running"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    topic = models.CharField(max_length=300)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="running"
    )

    runtime = models.IntegerField(default=0)

    search_results = models.TextField(blank=True)

    research_summary = models.TextField(blank=True)

    report = models.TextField(blank=True)

    critique = models.TextField(blank=True)

    score = models.FloatField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        ordering = ["-created_at"]

    def __str__(self):

        return self.topic