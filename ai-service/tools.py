from langchain_core.tools import tool
import wikipedia

wikipedia.set_user_agent(
    "AIResearchAssistant/1.0 (contact: muzammilhussainabro@gmail.com)"
)

@tool
def search_wikipedia(query: str):
    """Search Wikipedia and return the full text of a matching article."""
    print("Wikipedia tool is being called!")
    titles = wikipedia.search(query, results=3)
    if not titles:
        return f"No Wikipedia pages were found for: {query}"

    for title in titles:
        try:
            page = wikipedia.page(title, auto_suggest=False)
        except (
            wikipedia.exceptions.PageError,
            wikipedia.exceptions.DisambiguationError,
        ):
            continue

        content = page.content[:12000]
        if len(page.content) > len(content):
            content += "\n\n[Article text truncated to fit the model's request limit.]"
        return f"Wikipedia page: {page.title}\n\n{content}"

    return f"No readable Wikipedia pages were found for: {query}"