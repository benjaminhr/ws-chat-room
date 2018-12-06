import React from 'react'

class MessageForm extends React.Component {
  constructor() {
    super()

    this.state = {
      value: '',
      socket: null
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    const socket = new WebSocket('wss://chatroom-ws.ml') 
    this.setState({ socket })
  }


  onSubmit(e) {
    e.preventDefault()

    if (!localStorage.getItem('username')) {
      const event = new CustomEvent('error', {
        detail: {
          type:'new', 
          message: 'You must create a username before you can send messages.'
        }
      })

      window.dispatchEvent(event)
    }

    if (this.state.value.length >= 1) {
      this.sendMessage()
    } 
  }

  sendMessage() {
    if (this.state.socket.readyState === 1) {
      const username = localStorage.getItem('username')
      
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
      window.location.reload()
    }
  }

  render() {
    return (
      <form 
        className="message-form" 
        onSubmit={this.onSubmit}
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