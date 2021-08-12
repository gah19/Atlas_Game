import { Component } from 'react'
import ScoreBoard from './ScoreBoard.js'

export default class PersonalScoreBoard extends Component{

    state = {
        gameData: [],
        dateFilter: 'all'
    }
    
    async componentDidMount(){
        this.fetchScores()
    }

    async fetchScores() {
        const { dateFilter } = this.state
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/personaltopscores/${dateFilter}`,
            {
                credentials: 'include'
            })
        const { gameData } = await response.json()
        this.setState({gameData})
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.score !== prevProps.score || this.state.dateFilter !== prevState.dateFilter) this.fetchScores()
    }


    render(){
        const { gameData } = this.state

        return (
        <div className = 'scoreboard' >
            <h2>Personal Scoreboard</h2>
            <label className = 'scoreboard-filter'>Scores since:
                <select name='dateFilter' value={this.state.dateFilter} onChange={(e) => this.setState({dateFilter: e.target.value})}>
                    <option value="all">All time</option>
                    <option value="day">Last day</option>
                    <option value="month">Last week</option>
                    <option value="week">Last month</option>
                    <option value="year">Last year</option>
]                </select>
            </label>
            <div>
            {gameData.length === 0 ? <p>No personal scores</p> : <ScoreBoard gameData={gameData} personal={true} />}
            </div>
        </div>
        )
    }
} 
