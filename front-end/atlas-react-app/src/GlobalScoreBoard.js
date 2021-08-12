import { Component } from 'react'
import ScoreBoard from './ScoreBoard.js'

export default class globalScoresBoard extends Component{

    state = {
        gameData: [],
        dateFilter: 'all',
        allCountries: [],
        country: 'world'
    }

    async fetchScores() {
        const { dateFilter, country } = this.state
        const response = await fetch(`${process.env.REACT_APP_API_URL}/globalscores/${dateFilter}/${country}`)
        const { gameData } = await response.json()
        this.setState({gameData})
    }
    
    async componentDidMount(){
       this.fetchScores()
       const response  = await fetch(`${process.env.REACT_APP_API_URL}/allcountries`)
        const allCountries = await response.json()
        allCountries.sort()
        this.setState({allCountries})
    }

    async componentDidUpdate(_prevProps, prevState) {
        if (this.state.dateFilter !== prevState.dateFilter || this.state.country !== prevState.country) this.fetchScores()
    }

    render(){
        const { gameData, country, allCountries } = this.state
        return (
        <div className = 'scoreboard'>
            <h2>Global Scoreboard</h2>
            <div className="global-scoreboard-filters-box">
                <label className='scoreboard-filter'>Scores since:
                    <select name='dateFilter' value={this.state.dateFilter} onChange={(e) => this.setState({dateFilter: e.target.value})}>
                        <option value="all">All time</option>
                        <option value="day">Last day</option>
                        <option value="month">Last week</option>
                        <option value="week">Last month</option>
                        <option value="year">Last year</option>
    ]                </select>
                </label>
                <label className='scoreboard-filter'>Country:
                        <select name='country' value={country} onChange={(e) => this.setState({country: e.target.value})}>
                            <option value="world">World</option>
                                {allCountries.map((country, i) => {return <option key={i} value={country}>{country}</option>})}
                        </select>
                </label>
            </div>
            <div className='global-scoreboard'>
            {gameData.length === 0 ? <p>No global scores</p> : <ScoreBoard gameData={gameData} />}
            </div>
        </div>
        )
    }
} 

