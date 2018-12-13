const WebSocket = require('ws')
const database = require('./database.js')
const https = require('https')
const fs = require('fs')

module.exports = class Connection {
  constructor(port) {
    this.port = port
    this.wss = null
    this.ws = null
  }

  start() {
    console.log("Websocket server starting....")

    const httpsServer = https.createServer({
      hostname: '0.0.0.0',
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem')
    })

    this.wss = new WebSocket.Server({ 
      server: httpsServer
      //port: this.port
    })

    httpsServer.listen(this.port)
    this.wss.on('connection', this._onConnection.bind(this))
  }

  _onConnection(ws) {
    this.ws = ws;

    this.ws.send(JSON.stringify({
      type: "message",
      message: {
        _id: 1111111111,
        text: "Welcome to the chat room! 👀",
        sender: "Server",
        timestamp: 1293231923
      }
    }))
    this.ws.on('message', this._onMessage.bind(this))    
  }

  _onMessage(message) {
    const msg = JSON.parse(message)

    if (msg.type === "new") {
      console.log(msg)
      const { timestamp, text, sender } = msg.message
      const newMsg = {
        timestamp,
        text,
        sender,
        ip: this.ws._socket.remoteAddress.replace('::ffff:', '')
      }
      
      database.create(newMsg, (err, instance) => {
        if (err) throw new Error(err)
        console.log('Created new message: ', instance)

        const newMsg = JSON.stringify({
          type: "message",
          message: instance
        })

	this.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
	    console.log('broadcasted')
            client.send(newMsg)
      	  } else { console.log("didnt send") }
    	})
      })

    } else if (msg.type === "all") {
      database.find({}, (err, messages) => {
        if (err) throw new Error(err) 

        const allMessages = JSON.stringify({ 
          type: "messages",
          messages
        })

        this.ws.send(allMessages)
      })
    }
  }
}
