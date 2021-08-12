import { Component } from 'react';
import Confetti from 'react-dom-confetti';
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
const numbers = [0,1,2,3,4,5,6,7,8,9]
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

class CapitalQuestion extends Component {

    state = {userInputCity: ''}

    render() {
        const { letter, previousCountry, flag, checkCapitalCity, handleSkip } = this.props
        const { userInputCity } = this.state
        return (
            <div>
                <div className="letter-question-container">
                    <div className="question-container">
                        <div>For bonus points, name the capital city of {formatUserGameInput(previousCountry)}</div>
                    </div>
                    <Confetti active={letter === '✓'} config={confettiConfig} />
                    <div style={letter === '✓' ? { backgroundColor: 'hsl(133, 100%, 40%)', color: 'white' }
                        : letter === '✗' ? { backgroundColor: 'rgb(231, 50, 73)', color: 'white' }
                            : { backgroundImage: `url(${flag})`, color: 'white' }}
                        className="letter"
                    >
                        {letter}
                    </div>
                </div>
                <section>
                    <form className="game-input-container"
                        onSubmit={(e) => {
                            e.preventDefault()
                            this.setState({userInputCity: ''})
                            checkCapitalCity(userInputCity)
                        }}>
                        <input className="game-input-bar"
                            type="text"
                            placeholder={`Name the capital city of ${formatUserGameInput(previousCountry)}`}
                            name="userInputCity"
                            value={userInputCity}
                            onChange={(e) => this.setState({userInputCity: e.target.value})}
                            autoComplete='off'
                            autoFocus={true}
                        />
                        <button className="game-submit"
                            type="submit"
                            disabled={numbers.some(number => userInputCity.includes(number)) || userInputCity === "" || !userInputCity.toLowerCase().split('').some(character => alphabet.includes(character)) || userInputCity.length > 60}
                        >
                            Submit
                        </button>
                        <button className="game-skip"
                            onClick={() => {
                                this.setState({userInputCity: ''})
                                handleSkip()}}
                        >
                            Skip
                        </button>
                    </form>
                </section>
            </div>
        )
    }
}

function formatUserGameInput(userInput) {
    if (!userInput) return
    // hard codes capitalisation for all inputs, accounting for those with 'of', 'the' and 'and' (all edge cases)
    userInput = userInput.toLowerCase()
    userInput = userInput.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    userInput = userInput.split('').filter(elem => alphabet.includes(elem) || elem === '-' || elem === ' ').join('')
    userInput = userInput.trim()
    const nonCapitalizedWords = ['and', 'of', 'the', 'au', 'la']
    userInput = userInput.split(' ').map(word => nonCapitalizedWords.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join(' ')
    userInput = userInput.split('-').map(word => nonCapitalizedWords.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join('-')
    return userInput
}

export default CapitalQuestion