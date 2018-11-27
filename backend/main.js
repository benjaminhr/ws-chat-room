const WebSocket = require('./websocket.js')

const connection = new WebSocket(8080)
connection.start()