from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph import graph

app=FastAPI()

class ChatRequest(BaseModel):
    message:str
    thread_id:str

@app.get("/health")
def health_check():
    return {
        "status": "AI service is running"
    }

@app.post("/chat")
def chat(request:ChatRequest):
    response=graph.invoke(
        {
            "messages":[
                HumanMessage(content=request.message)
            ]
        },
        config={
            "configurable":{
                "thread_id":request.thread_id
            }
        }
    )

    
    for message in response["messages"]:
        print("\nTYPE:", type(message).__name__)
        print("CONTENT:", message.content)
    return{
        "response":response["messages"][-1].content
    }