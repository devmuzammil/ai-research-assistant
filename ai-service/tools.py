from langchain_core.tools import tool
import wikipedia

@tool
def search_wikipedia(query:str):
    """Search Wikipedia and return a short summary"""
    summary=wikipedia.summary(query,sentences=3)
    return summary