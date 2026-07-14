from langchain.tools import tool
import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient
import os
from dotenv import load_dotenv
from rich import print

load_dotenv()
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def get_websearch_results(query: str) -> str:
    """
    Search web for recent information for a given query using Tavily API. return the results as a string, with Titles, information, related images and recent reddit posts of the query results.


    Args:
        query (str): The search query.

    Returns:
        str: The web search results.
    """
    response = tavily.search(query=query)

    out = []
    for result in response['results']:
        title = result.get('title', 'No Title')
        #snippet = result.get('snippet', 'No Snippet')
        content_url = result.get('content', 'No Content')
        url = result.get('url', 'No URL')
        #image_url = result.get('image_url', 'No Image URL')
        reddit_posts = result.get('reddit_posts', [])

        out.append(f"Title: {title}\nContent: {content_url}\nURL: {url}\nReddit Posts: {reddit_posts}\n")

    return "\n---\n".join(out)

@tool
def get_webpage_content(url: str) -> str:
    """
    Get the content of a webpage given its URL.

    Args:
        url (str): The URL of the webpage.

    Returns:
        str: The content of the webpage.
    """
    try:
        resp= requests.get(url, timeout=10, headers={'User-Agent': 'Mozilla/5.0'})
        resp.raise_for_status()  # Raise an error for bad responses
        soup = BeautifulSoup(resp.text, 'html.parser')
        for script in soup(["script", "style","noscript","nav","header","footer","aside"]):
            script.decompose()  # Remove scripts and styles
        return soup.get_text(separator="\n", strip=True)[:5000]  # Limit to first 5000 characters
    except requests.exceptions.RequestException as e:
        return f"Error fetching the webpage: {str(e)}"
    
