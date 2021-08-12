import { Component } from "react";

class UniqueUsernameError extends Component {

    state = {
        uniqueUsername: true
    }

    async componentDidUpdate(prevProps) {
        const { username, touched } = this.props
        if(!touched) return 

        if ( (username !== prevProps.username) || touched !== prevProps.touched ) {

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/usernameexists`,
                { 
                    method: 'POST',  
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({username})
                }
            )
            const { uniqueUsername } = await response.json()
            this.setState({uniqueUsername})
        }
    }

    render() {
        return <p>{(this.state.uniqueUsername || this.props.username.length === 0) ? '' : 'This username is already taken'}</p>
    }
}

export default UniqueUsernameError