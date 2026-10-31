import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

mongodb_uri = os.getenv("MONGODB_URI")
if not mongodb_uri:
    raise RuntimeError("MONGODB_URI is not set in ai-service/.env")

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
db = client["ai_research_assistant"]
conversations_collection = db["conversations"]

client.admin.command("ping")
conversations_collection.create_index("thread_id", unique=True)
print("MongoDB connected successfully!")


def save_conversation(thread_id: str, user_message: str, assistant_message: str) -> None:
    now = datetime.now(timezone.utc)
    conversations_collection.update_one(
        {"thread_id": thread_id},
        {
            "$setOnInsert": {
                "thread_id": thread_id,
                "created_at": now,
            },
            "$set": {"updated_at": now},
            "$push": {
                "messages": {
                    "$each": [
                        {"role": "user", "content": user_message, "created_at": now},
                        {
                            "role": "assistant",
                            "content": assistant_message,
                            "created_at": now,
                        },
                    ]
                }
            },
        },
        upsert=True,
    )