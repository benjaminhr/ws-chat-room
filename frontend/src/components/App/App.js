import React, { Component } from 'react'
import MessageForm from '../MessageForm/MessageForm.js'
import Messages from '../Messages/Messages.js'
import Username from '../Username/Username.js'
import Error from '../Error/Error.js'
import '../../styles/app.css'

class App extends Component {
  constructor() {
    super()
    
    this.state = {
      messages: [],
      error:false,
      errorMessage: ''
    }
  }

  componentDidMount() {
    const socket = new WebSocket("wss://35.228.190.182:8000")

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: "get_all" }))
    })

    socket.addEventListener('error', (event) => {
      console.error('ERROR: ' + event)
    })

    socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)
      const { messages } = this.state
      console.log(msg)

      if (msg.type === "messages") {
        this.setState({ messages: [...messages, ...msg.messages ]})
      } else {
        this.setState({ messages: [...messages, msg.message ]})
      }
    })

    window.addEventListener('error', (event) => {
      const error = event.detail

      if (error.type === "new") {
        this.setState({ 
          error: true,
          errorMessage: error.message
        })
      } else {
        this.setState({ error: false })
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.error && <Error message={this.state.errorMessage} />}
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
