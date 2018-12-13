import pymongo
import json
from bson.json_util import dumps, loads


def get_all_messages():
    client = pymongo.MongoClient(
        ""
    )
    db = client["messages"]
    messages = db["messages"].find()
    message_array = list([message for message in messages])

    def sanitise_ids(message):
        return {
            "_id": str(message["_id"]),
            "text": message["text"],
            "sender": message["sender"],
            "timestamp": message["timestamp"],
        }

    messages_json = list(map(sanitise_ids, message_array))
    return messages_json


def create_message(newMsg):
    client = pymongo.MongoClient(
        ""
    )
    db = client["messages"]
    messages = db["messages"]

    message = messages.insert_one(newMsg)
    messageInstance = messages.find_one(message.inserted_id)

    msg = {
        "type": "message",
        "message": {
            "_id": str(messageInstance["_id"]),
            "text": messageInstance["text"],
            "sender": messageInstance["sender"],
            "timestamp": messageInstance["timestamp"],
        }
    }

    return json.dumps(msg)
