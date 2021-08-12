import Confetti from 'react-dom-confetti';
import { Component } from 'react';

const confettiConfig = {
    angle: 90,
    spread: 200,
    startVelocity: 40,
    elementCount: 100,
    dragFriction: 0.2,
    duration: 2500,
    stagger: 1,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
const numbers = [0,1,2,3,4,5,6,7,8,9]

class CountryQuestion extends Component {

    state={userInput: ''}

    render() {
        const { userInput } = this.state
        const { aiCountryChoice, countryLooped, letter, handleSubmitUserCountry } = this.props
        return (
            <div>
                <div className="letter-question-container">
                    <div className="question-container">
                        {countryLooped && <div className="ai-response">No more countries beginning with that last letter!</div>}
                        {aiCountryChoice && <div className="ai-response">The AI picked {aiCountryChoice}</div>}
                        <div className="main-question">Name a country beginning with:</div>
                    </div>
                    <Confetti active={letter === '✓'} config={confettiConfig} />
                    <div style={letter === '✓' ? { backgroundColor: 'hsl(133, 100%, 40%)', color: 'white' }
                        : letter === '✗' ? { backgroundColor: 'rgb(231, 50, 73)', color: 'white' }
                            : {}}
                        className="letter"
                    >
                        {letter}
                    </div>
                </div>
                <section>
                    <form className="game-input-container"
                        onSubmit={(e) => {
                            e.preventDefault()
                            this.setState({userInput: ''})
                            handleSubmitUserCountry(userInput)}
                        }>
                        <input className="game-input-bar"
                            type="text"
                            placeholder="Enter country beginning with this letter"
                            name="userInput"
                            value={userInput}
                            onChange={(e) => this.setState({userInput: e.target.value})}
                            autoComplete='off' // prevents browser remembering past inputs (cheating!)
                            autoFocus={true}
                        />
                        <button className="game-submit"
                            type="submit"
                            disabled={numbers.some(number => userInput.includes(number)) || userInput === "" || !userInput.toLowerCase().split('').some(character => alphabet.includes(character)) || userInput.length > 60}
                        >
                            Submit
                        </button>
                    </form>
                </section>
            </div>
        )
    }
}

export default CountryQuestion