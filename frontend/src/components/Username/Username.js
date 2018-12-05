import React from 'react'

class Username extends React.Component {
  constructor() {
    super()

    this.state = {
      username: '' 
    }

    this.submitUsername = this.submitUsername.bind(this)
  }

  submitUsername(e) {
    e.preventDefault()
    const { username } = this.state

    if (username.length <= 2) {
      const event = new CustomEvent('error', {
        detail: {
          type:'new', 
          message: 'Username must be at least 3 characters.'
        }
      })      

      window.dispatchEvent(event)
    } else {
      localStorage.setItem('username', username)
      this.setState({ username: '' })
    }
  }

  render() {
    return (
      <form 
        className="username"
        onSubmit={this.submitUsername}
      >
        <input 
          type="text"
          onChange={e => this.setState({ username: e.target.value })}
          placeholder="Enter username..."
          autoFocus
          autoComplete="false"
          value={this.state.username}
        />
        <button>
          Submit
        </button>
      </form>
    )
  }
}

export default Username;