import React, { Component } from 'react';
import GameEndScreen from './GameComponents/GameEndScreen';
import './Game.css'
import GameStart from './GameComponents/GameStart';
import TopGameBar from './GameComponents/TopGameBar';
import CapitalQuestion from './GameComponents/CapitalQuestion';
import CountryQuestion from './GameComponents/CountryQuestion';

const timeGiven = 15

class Game extends Component {  
  
  initialState = {
    letter: '',
    needStart: true,
    isPlayerTurn: true,
    lastLetter: '',
    aiCountryChoice: '',
    showCapitalCityQuestion: false,
    gameOver: false,
    score: 0,
    time: timeGiven,
    allMatches: [],
    countryLooped: false,
    correctCity: '',
    flag: '',
    allCountriesPlayed: false,
    playedCity: '',
    previousCountry: '',
  }
  
  state = this.initialState
  
  handleStart() {
    this.timerInterval = setInterval(() => {
        this.setState(prevState => {
            return {time: prevState.time - 1}
        })
    }, 1000)
  }

  handleRestart() {
    this.setState({time: timeGiven})
    this.handleStart()
  }

  handleLoss() {
    //trigger end game page
    this.setState({gameOver: true})
  }

  async getAllMatches() {
    //get possible solutions to display on end game page
    const {letter} = this.state
    const response = await fetch(`${process.env.REACT_APP_API_URL}/getmatches`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({letter})
    })
    const {allMatches} = await response.json()
    this.setState({allMatches})
  }

  async callLetter() {
    // calls a random letter that a country starts with
    const response = await fetch(`${process.env.REACT_APP_API_URL}/letter`)
    const initialLetter = await response.json()
    this.setState({letter: initialLetter.letter})
  }

  async handleStartGame() {
    // on refresh, you see a start game button
    // on click we call a random letter and hide this button

    await fetch(`${process.env.REACT_APP_API_URL}/game/new`, {
      method: "POST",
      credentials: "include",
    })

    this.callLetter()
    this.setState({needStart: false})
    this.handleStart()
  }

  async handleSubmitUserCountry(userInput) {
    // submits the completed player input to the backend to be checked
    // response marks whether or not the game continues or ends
    clearInterval(this.timerInterval)
    const {letter} = this.state
    this.setState({ previousCountry: userInput})
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userInput, letter})
    })
    const {correct, lastLetter, score, flag} = await response.json()
    // if user input correct, returns true else returns false
    // reset the input form to empty and update the lastLetter for the AI turn
    this.setState({lastLetter, score})

    if (correct) {
      // only want to trigger AI turn if player was correct (otherwise ends game)
      this.setState({letter: '✓', flag})
      this.correctTimeout = setTimeout(() => {
          this.setState({showCapitalCityQuestion: true, letter:'?'})
          this.handleRestart()
          this.correctTimeout = 0
        }, 1000)      
    }

    // if response is no... don't change isPlayerTurn state (so componentDidUpdate doesn't trigger), and end the game
    if (!correct) {

      await this.getAllMatches()
      //render endgame
      this.setState({letter: '✗'})
      // this.setState({allMatches})
      this.incorrectTimeout = setTimeout(() => {
          this.handleLoss()
          this.incorrectTimeout = 0
        }, 1000)
    }
  }

  async checkCapitalCity(userInputCity) {
    clearInterval(this.timerInterval)
    this.setState({ playedCity: userInputCity })
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game/city`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userInputCity})
    })

    const { isCorrectCity, correctCity, score } = await response.json()

    if (isCorrectCity) {
      this.setState({letter: '✓', score})
      this.correctTimeout = setTimeout(() => {
          this.setState({isPlayerTurn: false, showCapitalCityQuestion: false})
          this.handleRestart()
          this.correctTimeout = 0
        }, 1000) 

    } else {
      await this.getAllMatches()
      this.setState({letter: '✗', correctCity})
      this.incorrectTimeout = setTimeout(() => {
          this.handleLoss()
          this.incorrectTimeout = 0
        }, 1000)
      // something to do with correctCity
    }
  }

  async triggerAiTurn() {
    // handles the AI turn with the provided lastLetter from user input
    const {lastLetter} = this.state
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game/ai`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({lastLetter})
    })
    //returns country name that AI plays
    const { aiCountryChoice, allCountriesPlayed, letter, countryLooped } = await response.json()

    if (allCountriesPlayed) {
      this.setState({allCountriesPlayed})
      this.handleLoss() // if all countries have been played

    } else {

      // trigger next player turn, displaying new lastLetter
      this.setState({isPlayerTurn: true, aiCountryChoice, letter, countryLooped})
    }
  }

  async componentDidUpdate(_prevProps, prevState) {
    // handles time running out
    if (this.state.time === 0 && !this.state.gameOver) {
      if (!this.state.showCapitalCityQuestion) await this.getAllMatches()
      clearInterval(this.timerInterval)
      this.handleLoss()
    }
    // triggers toggling between player and AI turns
    // only runs when isPlayerTurn state changes (which is when they give a right answer)
    if (this.state.isPlayerTurn !== prevState.isPlayerTurn) {
      if (this.state.isPlayerTurn && !this.state.needStart) {
        // non-first player turns (don't actually need to call a function again, player turn called on submit)

      } else if (!this.state.isPlayerTurn) {
        // call AI turn
        await this.triggerAiTurn()
      }
    }
  }

  async componentWillUnmount() {
    clearInterval(this.timerInterval)
    clearTimeout(this.correctTimeout)
    clearTimeout(this.incorrectTimeout)
  }

  handleGameReset() {
    this.setState(this.initialState)
  }

  handleSkip() {
    this.setState({isPlayerTurn: false, showCapitalCityQuestion: false})
    clearInterval(this.timerInterval)
    this.handleRestart()
  }

  render() {

    const { needStart, letter, aiCountryChoice, gameOver, time, score, allMatches, countryLooped, showCapitalCityQuestion, correctCity, allCountriesPlayed, playedCity, previousCountry, flag } = this.state
    if (gameOver) return <GameEndScreen
                            isLoggedIn={this.props.isLoggedIn}
                            handleGameReset = {() => this.handleGameReset()}
                            allMatches = {allMatches}
                            time={time}
                            correctCity={correctCity}
                            allCountriesPlayed={allCountriesPlayed}
                            playedCity={playedCity}
                         />
    if (needStart) return <GameStart
                            handleStartGame={() => this.handleStartGame()}/>
    return (
      <main className = 'game-page'>
        <div className = 'game-container'>
          <TopGameBar
            showCapitalCityQuestion={showCapitalCityQuestion}
            score={score} />
          {showCapitalCityQuestion ? <CapitalQuestion
                                      letter={letter}
                                      previousCountry={previousCountry}
                                      flag={flag}
                                      checkCapitalCity={(userInputCity) => this.checkCapitalCity(userInputCity)}
                                      handleSkip={() => this.handleSkip()}
                                      /> : 
                                      <CountryQuestion
                                      aiCountryChoice={aiCountryChoice}
                                      countryLooped={countryLooped}
                                      letter={letter}
                                      handleSubmitUserCountry={(userInput) => this.handleSubmitUserCountry(userInput)}
                                      />}
        </div>
     </main>
    )
  }
}

export default Game