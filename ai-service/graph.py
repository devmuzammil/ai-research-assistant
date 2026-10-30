from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph,START,END
from state import AgentState

load_dotenv()

llm=ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0.6
    )

def chatbot_node(state:AgentState):
    question=state['question']
    response= llm.invoke(question)
    return {'answer':response.content}


builder=StateGraph(AgentState)

builder.add_node('chatbot',chatbot_node)

builder.add_edge(START,"chatbot")
builder.add_edge("chatbot",END)

graph=builder.compile()

response = graph.invoke({
    "question": "Explain LangGraph in simple words",
    "answer": ""
})

print(str(response))