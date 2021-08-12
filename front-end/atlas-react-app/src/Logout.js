import { Component } from 'react'

class Logout extends Component {
  
  async handleClick() {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/sessions`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )
    const { loggedOut } = await response.json()
    if (loggedOut) this.props.handleLogout()
  }

  render() {
    return (
      <button onClick={() => this.handleClick()}>Logout</button>
    )
  }   
}

export default Logout