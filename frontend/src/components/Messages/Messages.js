import React from 'react'

class Messages extends React.Component {
  render() {
    return (
      <ul className="messages">
        {this.props.messages.map(message => {
          return (
            <li key={message._id}>
              <span className="sender">{message.sender}:</span> {message.text}
            </li>
          )
        })}
      </ul>
    )
  }
}

export default Messages