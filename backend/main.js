const WebSocket = require('./websocket.js')

const port = process.env.PORT || 8080
const connection = new WebSocket(port)
connection.start()