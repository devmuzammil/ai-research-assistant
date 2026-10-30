from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.prebuilt import ToolNode,tools_condition
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import StateGraph,START,END
from state import AgentState
from tools import search_wikipedia

load_dotenv()

llm=ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0.6
)
tools=[search_wikipedia]
llm_with_tools=llm.bind_tools(tools=tools)

def chatbot_node(state:AgentState):
    response= llm_with_tools.invoke(state['messages'])
    print("TOOL CALLS:", response.tool_calls)
    return {'messages':[response]}

builder=StateGraph(AgentState)

#registering the nodes
builder.add_node('chatbot',chatbot_node)
builder.add_node('tools',ToolNode(tools))

#creating the WorkFlow
builder.add_edge(START,"chatbot")
builder.add_conditional_edges("chatbot",tools_condition)
builder.add_edge('tools',"chatbot")


checkpointer=InMemorySaver()
graph=builder.compile(checkpointer=checkpointer)

config = {
    "configurable": {
        "thread_id": "conversation_1"
    }
}

response = graph.invoke(
    {
        "messages": [
            HumanMessage(content="Search Wikipedia for the history of Pakistan and summarize it.")
        ]
    },
    config=config
)

print(str(response["messages"][-1].content))

for message in response["messages"]:
    print("\nTYPE:", type(message).__name__)
    print("CONTENT:", message.content)