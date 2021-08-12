import { Component } from "react";

class UniqueEmailError extends Component {

    state = {
        uniqueEmail: true
    }

    async componentDidUpdate(prevProps) {
        const { email, touched } = this.props
        if(!touched) return 
        if ( email !== prevProps.email || touched !== prevProps.touched ) {

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/emailexists`,
                { 
                    method: 'POST',  
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email})
                }
            )
            const { uniqueEmail } = await response.json()
            this.setState({uniqueEmail})
        }
    }

    render() {
        return <p>{(this.state.uniqueEmail || this.props.email.length === 0) ? '' : 'This email is already taken'}</p>
    }
}

export default UniqueEmailError