from django.shortcuts import render
from .models import ResearchHistory
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import json
import threading
import uuid

from research.pipeline import run_research_pipeline

TASKS = {}
TASKS_LOCK = threading.Lock()


def home(request):
    return render(request, "dashboard/index.html")


def _start_background_task(topic: str):
    task_id = str(uuid.uuid4())
    task = {
        "id": task_id,
        "status": "running",
        "topic": topic,
        "stage": "search",
        "message": "Starting search agent...",
        "progress": 10,
        "search_results": "",
        "research_information": "",
        "report": "",
        "critique": "",
        "error": "",
    }

    history = ResearchHistory.objects.create(
    topic=topic,
    status="running"
)

    task["db_id"] = history.id

    with TASKS_LOCK:
        TASKS[task_id] = task

    def runner():
        try:
            def on_progress(update):
                with TASKS_LOCK:
                    task["stage"] = update.get("stage", task["stage"])
                    task["message"] = update.get("message", task["message"])
                    task["progress"] = update.get("progress", task["progress"])

            result = run_research_pipeline(topic, callback=on_progress)

            with TASKS_LOCK:
                task["status"] = "completed"
                task["search_results"] = result.get("search_results", "")
                task["research_information"] = result.get("research_information", "")
                task["report"] = result.get("report", "")
                task["critique"] = result.get("critique", "")
                task["progress"] = 100
                task["message"] = "Research complete."

            history = ResearchHistory.objects.get(id=task["db_id"])
            history.status = "completed"
            history.search_results = task["search_results"]
            history.research_summary = task["research_information"]
            history.report = task["report"]
            history.critique = task["critique"]
            history.save()  

        except Exception as exc:
            with TASKS_LOCK:
                task["status"] = "failed"
                task["error"] = str(exc)
                task["message"] = "Research failed."
            history = ResearchHistory.objects.get(id=task["db_id"])
            history.status = "failed"
            history.save()
    threading.Thread(target=runner, daemon=True).start()
    return task


@csrf_exempt
def start_research(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405
        )

    try:
        data = json.loads(request.body)
        topic = data.get("topic", "").strip()

        if not topic:
            return JsonResponse(
                {"error": "Topic cannot be empty"},
                status=400
            )

        task = _start_background_task(topic)
        return JsonResponse({
            "success": True,
            "status": "running",
            "task_id": task["id"],
            "stage": task["stage"],
            "message": task["message"],
            "progress": task["progress"],
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)


@csrf_exempt
def research_status(request, task_id):
    task = TASKS.get(task_id)
    if not task:
        return JsonResponse({
            "success": False,
            "error": "Task not found"
        }, status=404)

    with TASKS_LOCK:
        payload = {
            "success": True,
            "task_id": task_id,
            "status": task["status"],
            "stage": task["stage"],
            "message": task["message"],
            "progress": task["progress"],
        }

        if task["status"] == "completed":
            payload.update({
                "search_results": task["search_results"],
                "research_information": task["research_information"],
                "report": task["report"],
                "critique": task["critique"],
            })
        elif task["status"] == "failed":
            payload["error"] = task["error"]

        return JsonResponse(payload)
    
def research_history(request):

    history = ResearchHistory.objects.all()[:20]

    data = []

    for item in history:

        data.append({
            "id": item.id,
            "topic": item.topic,
            "status": item.status,
            "created_at": item.created_at.strftime("%d %b %Y %H:%M"),
        })

    return JsonResponse({
        "history": data
    })

def research_detail(request, research_id):

    try:

        research = ResearchHistory.objects.get(id=research_id)

        return JsonResponse({

            "success": True,

            "id": research.id,

            "topic": research.topic,

            "status": research.status,

            "search_results": research.search_results,

            "research_information": research.research_summary,

            "report": research.report,

            "critique": research.critique,

            "created_at": research.created_at.strftime("%d %b %Y %H:%M"),

        })

    except ResearchHistory.DoesNotExist:

        return JsonResponse({

            "success": False,

            "error": "Research not found"

        }, status=404)