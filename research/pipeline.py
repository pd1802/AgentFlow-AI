try:
    from research.agents import (
        build_search_agent,
        build_content_agent,
        writer_chain,
        critic_chain,
    )
except ModuleNotFoundError:
    from agents import (
        build_search_agent,
        build_content_agent,
        writer_chain,
        critic_chain,
    )
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from langchain_core.messages import HumanMessage
from typing import Callable
import time

def invoke_agent_with_prompt(agent, prompt: str):
    return agent.invoke({"messages": [HumanMessage(content=prompt)]})


def run_research_pipeline(
    topic: str,
    callback: Callable | None = None
) -> dict:

    state = {}

    def emit(stage, message, progress):

        payload = {
            "stage": stage,
            "message": message,
            "progress": progress,
    }

    # Existing polling callback
        if callback:
            callback(payload)

    # New WebSocket broadcast
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            "research_group",
            {
            "type": "research_update",

            "data": payload,
        }
    )

    emit("search", "Starting search agent...", 10)

    # Step 1: Use the search agent to get web search results
    search_agent = build_search_agent()
    search_results = invoke_agent_with_prompt(
        search_agent,
        f"Search for information on the topic: {topic}"
    )
    state["search_results"] = search_results['messages'][-1].content
    emit(

    "search",

    "Search complete.",

    25

)

    print("\nSearch results:  \n", state["search_results"])  # Debugging line to check the search results


    emit(

    "content",

    "Scraping website...",

    35

)

    # Step 2: Use the content agent to get webpage content based on search results
    content_agent = build_content_agent()
    research_information = invoke_agent_with_prompt(
        content_agent,
        f"Get content for the following search results: {topic},"
        f"pick most relevant url and scrape it for deeper information, provide a summary of the content"
        f"search results:\n{state['search_results'][:800]}"
    )
    state["research_information"] = research_information['messages'][-1].content
    emit(

    "content",

    "Content collected.",

    50

)

    print("\nResearch information:  \n", state["research_information"])  # Debugging line to check the research information       

    # Step 3: Generate a research report using the writer chain
    research_combined = (
        f"Search results: \n{state['search_results']}\n\n"
        f"Research information: \n{state['research_information']}\n\n"
    )


    emit(
        "writer",
        "Generating report...",
        70
    )

    print("\n========== WRITER START ==========")

    start = time.time()

    try:
        state["report"] = writer_chain.invoke({
            "topic": topic,
            "research": research_combined
        })

        elapsed = time.time() - start

        print(f"\nWriter completed in {elapsed:.2f} seconds")
        print("\n========== WRITER FINISHED ==========\n")

    except Exception as e:
        print("\n========== WRITER FAILED ==========")
        print(e)
        raise

    print("\nFinal research report:\n")
    print(state["report"])

    emit(
        "writer",
        "Report completed.",
        85
    )

    
        # Step 4: Critique the generated research report using the critic chain
    emit(

        "critic",

        "Reviewing report...",

        92

    )
    state["critique"] = critic_chain.invoke({
            "report": state["report"]
        })

    emit(

        "critic",

        "Critique completed.",

        100

    )
    print("\nFinal critique:  \n", state["critique"])  # Debugging line to check the generated critique
    return state

if __name__ == "__main__":
    topic = input("Enter the topic for research: ")
    result = run_research_pipeline(topic)
