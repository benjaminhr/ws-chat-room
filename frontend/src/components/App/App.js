import React, { Component } from 'react'
import MessageForm from '../MessageForm/MessageForm.js'
import Messages from '../Messages/Messages.js'
import '../../styles/app.css'

class App extends Component {
  constructor() {
    super()
    
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    const socket = new WebSocket("ws://localhost:8080")

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: "all" }))
    })

    socket.addEventListener('error', (event) => {
      console.error('ERROR: ' + event)
    })

    socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)
      const { messages } = this.state

      if (msg.type === "messages") {
        this.setState({ messages: [...messages, ...msg.messages ]})
      } else {
        this.setState({ messages: [...messages, msg.message ]})
      }
    })
  }

  render() {
    return (
      <div className="app">
        <Messages messages={this.state.messages} />
        <MessageForm />
      </div>
    )
  }
}

export default App
