from langchain_core.tools import tool
import wikipedia

wikipedia.set_user_agent(
    "AIResearchAssistant/1.0 (contact: muzammilhussainabro@gmail.com)"
)

@tool
def search_wikipedia(query: str):
    """Search Wikipedia and return a short summary."""
    try:
        print("Wikipedia tool is being called!")
        summary = wikipedia.summary(query, sentences=3)
        return summary
    except Exception as e:
        print("WIKIPEDIA ERROR:", repr(e))
        return f"Wikipedia search failed: {str(e)}"