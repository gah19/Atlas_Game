export default function GameStart({ handleStartGame }) {
    return (
        <div className='game-page'>
            <div className="start-instructions">
                <h3>Welcome to Atlas game!</h3>
                <p>
                    On clicking start game, the AI will provide you with a random letter. <br />
                    For ten points, you will need to <span className="instruction-correct">enter the name of a country beginning with that letter</span>. <br />
                    If you are correct, you can then <span className="instruction-correct">enter the name of that country's capital city</span> for a bonus five points, <span className="instruction-correct">or skip</span> if you aren't sure.<br />
                    The AI will then pick a country that starts with the last letter of your chosen country.<br />
                    You then guess again, for the last letter of the AI's pick.
                </p>
                <p>
                    Any <span className="instruction-error">incorrect answers</span>, or <span className="instruction-error">picking a country that has already been played by you or the AI</span>, will <span className="instruction-error">lead to game over!</span><br />
                    If there are no remaining countries starting with a letter, we move on to the next letter in the alphabet instead, repeating until all 201 countries have been played.<br />
                </p>
                <p>
                    <span className="instruction-error">Don't let the timer run out</span> or it's game over!
                </p>
                <h3>
                    Have fun!
                </h3>
            </div>
            <div className="start-button-container">
                <button onClick={() => handleStartGame()}>Start Game</button>
            </div>
        </div>
    )
}