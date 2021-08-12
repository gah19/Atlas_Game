import ReactCountdownClock from "react-countdown-clock"

export default function TopGameBar({ showCapitalCityQuestion, score }) {
    return <section className="top-game-bar">
            <div className = 'timer'>
              {!showCapitalCityQuestion && <div className = 'game-clock-container'>
                <ReactCountdownClock
                seconds={15}
                color="#019120"
                alpha={0.9}
                size={100}
                />
              </div>}
              {showCapitalCityQuestion && <div className = 'game-clock-container'>
                <ReactCountdownClock
                  seconds={15}
                  color="#019120"
                  alpha={0.9}
                  size={100}
                />
              </div>}
            </div>
            <div className="player-score">
              <span>{score}</span>
            </div>
          </section>
}