import React from 'react'

class MessageForm extends React.Component {
  constructor() {
    super()

    this.state = {
      value: '',
      socket: null
    }

    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidMount() {
    const socket = new WebSocket('ws://35.228.115.67') 
    this.setState({ socket })
  }

  sendMessage(e) {
    e.preventDefault()
    
    if (this.state.socket.readyState === 1) {
      const username = localStorage.get('username')
      
      const msg = JSON.stringify({
        type: "new",
        message: {
          text: this.state.value, 
          timestamp: Number(new Date()),
          sender: username
        }
      })

      this.state.socket.send(msg)
      this.setState({ value: '' })
    } else {
      console.log('Unable to connect to websocket')
    }
  }

  render() {
    return (
      <form 
        className="message-form" 
        onSubmit={this.sendMessage}
        autoComplete="off"
      >
        <input 
          type="text" 
          className="message-input" 
          placeholder="Type your message..." 
          autoFocus
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
        />
        <button className="send-button">
          ▻
        </button>
      </form>
    )
  }
}

export default MessageForm