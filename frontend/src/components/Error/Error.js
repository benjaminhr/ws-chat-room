import React from 'react'

class Error extends React.Component {
  constructor() {
    super()

    this.closeModal = this.closeModal.bind(this)
  }

  closeModal() {
    const event = new CustomEvent('error', { 
      detail: {
        type: 'close'
      }
    })

    window.dispatchEvent(event)
  }

  render() {
    return (
      <div className="error-modal">
        <div className="error">
          <h1>{this.props.message}</h1>
          <button onClick={this.closeModal}>
            X
          </button>
        </div>
      </div>
    )
  }
}

export default Error;