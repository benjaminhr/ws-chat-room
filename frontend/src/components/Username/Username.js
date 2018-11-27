import React from 'react'

class Username extends React.Component {
  constructor() {
    super()

    this.state = {
      username: '' 
    }

    this.submitUsername = this.submitUsername.bind(this)
  }

  submitUsername() {
    localStorage.setItem('username', this.state.username)
    this.setState({ username: '' })
  }

  render() {
    return (
      <div className="username">
        <input 
          type="text"
          onChange={e => this.setState({ username: e.target.value })}
          placeholder="Enter username..."
          autoFocus
          autoComplete="false"
          value={this.state.username}
        />
        <button onClick={this.submitUsername}>
          Submit
        </button>
      </div>
    )
  }
}

export default Username;