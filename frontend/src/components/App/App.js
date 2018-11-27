import React, { Component } from 'react'
import MessageForm from '../MessageForm/MessageForm.js'
import Messages from '../Messages/Messages.js'
import Username from '../Username/Username.js'
import '../../styles/app.css'

class App extends Component {
  constructor() {
    super()
    
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    const socket = new WebSocket("ws://35.228.115.67")

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
      <React.Fragment>
        <Username />
        <div className="message-app">
          <Messages messages={this.state.messages} />
          <MessageForm />
        </div>
      </React.Fragment>
    )
  }
}

export default App
