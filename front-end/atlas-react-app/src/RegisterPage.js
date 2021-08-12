import { Component } from 'react';
import Registration from "./Registration";


class RegisterPage extends Component {

    componentDidMount() {
        this.props.setOnRegisterStatus()
    }

    componentWillUnmount() {
        this.props.clearOnRegisterStatus()
    }

    render () {
        return (
        <div className='register-page'>
            <div className = 'register'> 
                <div className = 'register-title' >Register</div>
                <Registration/>
            </div>
        </div>
      )
    }
}

export default RegisterPage