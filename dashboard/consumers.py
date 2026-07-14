from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ResearchConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.group_name = "research_group"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        print("✅ WebSocket Connected")


    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        print("❌ WebSocket Disconnected")


    async def receive(self, text_data):

        data = json.loads(text_data)

        print(data)


    async def research_update(self, event):

        await self.send(

            text_data=json.dumps(

                event["data"]

            )

        )