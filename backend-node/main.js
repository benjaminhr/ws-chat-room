const WebSocket = require('./websocket.js')

const port = process.env.PORT || 8080
console.log('listening on: ' + port)
const connection = new WebSocket(port)
connection.start()