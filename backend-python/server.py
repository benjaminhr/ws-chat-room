import json
import database
from SimpleWebSocketServer import SimpleWebSocketServer, SimpleSSLWebSocketServer, WebSocket
import ssl
from optparse import OptionParser

clients = []


class Chatroom(WebSocket):
    print("Websocket server starting...")

    def handleConnected(self):
        print(self.address, "Joined the chat.")
        clients.append(self)

        msg = {
            "type": "message",
            "message": {
                "_id": 1111111111,
                "text": "Welcome to the chat room! 👀",
                "sender": "Server",
                "timestamp": 1293231923
            }
        }

        jsonStr = json.dumps(msg)
        self.sendMessage(jsonStr)

    def handleMessage(self):
        message = json.loads(self.data)
        msgType = message["type"]
        print(message)

        if msgType == "get_all":
            all_messages = database.get_all_messages()
            msg = {
                "type": "messages",
                "messages": all_messages
            }

            jsonString = json.dumps(msg)
            self.sendMessage(jsonString)

        elif msgType == "new":
            data = message["message"]
            timestamp = data["timestamp"]
            text = data["text"]
            sender = data["sender"]

            newMsg = {
                "timestamp": timestamp,
                "text": text,
                "sender": sender,
                "ip": self.address
            }

            msgInstance = database.create_message(newMsg)

            for client in clients:
                if client != self:
                    client.sendMessage(msgInstance)

    def handleClose(self):
        clients.remove(self)
        print(self.address, 'closed')
        for client in clients:
            msg = {
                "type": "message",
                "message": {
                    "_id": 2222222222,
                    "text": self.address[0] + u' - disconnected',
                    "sender": "Server 👋",
                    "timestamp": 1293231923
                }
            }

            msgJSON = json.dumps(msg)
            client.sendMessage(msgJSON)


server = SimpleWebSocketServer('0.0.0.0', 8000, Chatroom)
server.serveforever()
