from django.urls import re_path

from .consumers import ResearchConsumer


websocket_urlpatterns = [

    re_path(

        r"ws/research/$",

        ResearchConsumer.as_asgi()

    ),

]