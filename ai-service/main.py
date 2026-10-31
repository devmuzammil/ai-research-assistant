from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph import graph
from database import save_conversation
from pymongo.errors import PyMongoError


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
            },
            "recursion_limit": 10
        }
    )
    answer = response["messages"][-1].content
    try:
        save_conversation(request.thread_id, request.message, answer)
    except PyMongoError as error:
        raise HTTPException(
            status_code=503,
            detail="The response was generated, but could not be saved to MongoDB.",
        ) from error

    return {"response": answer}