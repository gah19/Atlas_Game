import { Component } from 'react';
import { Link } from 'react-router-dom'
import './Login.css'

class Login extends Component {
  
  state = {
    usernameOrEmail: '',
    password: '',
    message: '',
  }

  componentDidMount() {
    this.props.setOnLoginStatus()
  }

  componentWillUnmount() {
    this.props.clearOnLoginStatus()
  }
  
  async handleSubmit(event) {
    event.preventDefault()
    const { usernameOrEmail, password } = this.state
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({usernameOrEmail, password}),
        credentials: 'include'
      }
      )
      const { message } = await response.json()
      this.setState({message})
      if (message === 'Success') {
        this.props.handleLogin()
      } else { 
        this.setState({usernameOrEmail: '', password: ''})
      }
  }
    
  render() {
    const { usernameOrEmail, password, message } = this.state
    return (
      <div className='login-container'>
        <div className='login'>
          <h1 className='title'>Log in</h1>
          <form className='login-form' onSubmit={(event) => this.handleSubmit(event)} >
            <div>Username or Email: <input className='login-input' name='usernameOrEmail' type="text" value={usernameOrEmail} onChange={(event) => this.setState({usernameOrEmail: event.target.value})} /></div>
            <div>Password: <input className='login-input' name='password' type="password" value={password} onChange={(event) => this.setState({password: event.target.value})} /></div>
            <button type='submit' disabled={ usernameOrEmail.length === 0 || password.length < 8 }>Login</button>
          </form>
          <p className="register-link-message">Haven't got an account? Sign up <Link to='/register' className="register-link">here</Link>.</p>
          <div className='login-response'>{message}</div>
        </div>
      </div>

      )
    }
  }
    
    export default Login
    
    