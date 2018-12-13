import json
import database
import ssl
import sys
from SimpleWebSocketServer import SimpleWebSocketServer, SimpleSSLWebSocketServer, WebSocket
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


if __name__ == "__main__":

    parser = OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
    parser.add_option(
        "--host",
        default="0.0.0.0",
        type="string",
        action="store",
        dest="host",
        help="hostname (localhost)",
    )
    parser.add_option(
        "--port",
        default=8000,
        type="int",
        action="store",
        dest="port",
        help="port (8000)",
    )
    parser.add_option(
        "--ssl",
        default=0,
        type="int",
        action="store",
        dest="ssl",
        help="ssl (1: on, 0: off (default))",
    )
    parser.add_option(
        "--cert",
        default="./cert.pem",
        type="string",
        action="store",
        dest="cert",
        help="cert (./cert.pem)",
    )
    parser.add_option(
        "--key",
        default="./key.pem",
        type="string",
        action="store",
        dest="key",
        help="key (./key.pem)",
    )
    parser.add_option(
        "--ver",
        default=ssl.PROTOCOL_TLSv1,
        type=int,
        action="store",
        dest="ver",
        help="ssl version",
    )

    (options, args) = parser.parse_args()

    if options.ssl == 1:
        server = SimpleSSLWebSocketServer(
            options.host,
            options.port,
            Chatroom,
            options.cert,
            options.key,
            version=options.ver,
        )
    else:
        server = SimpleWebSocketServer(options.host, options.port, Chatroom)

    server.serveforever()
