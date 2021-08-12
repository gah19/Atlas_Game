import React, { Component } from 'react';
import GlobalScoresBoard from './GlobalScoreBoard';
import './Homepage.css';
import PersonalScoreboard from './PersonalScoreboard';
import { Link } from "react-router-dom";

class Homepage extends Component {
    render() {
      return (
        <div className = 'homepage-container'>
          <div className = 'scoreboards'>
          <div className='global-scoreboard-homepage'><GlobalScoresBoard /></div>
          { this.props.isLoggedIn ? <PersonalScoreboard /> :
          <div className='game-description'> 
            <ul>
              <li>Can you name every country in the world?</li>
              <li>Play Atlas to test your memory and find out!</li>
              <li>Play against the computer, naming a new country for the given letters until you can't keep up any more!</li>
              <li>Daring to test your knowledge on capital cities can even earn you bonus points...</li>
            </ul>
            <Link className='play-link' to='/game'>Play game</Link>
          </div>
           }
          </div>
        </div>
      )
    }
}

export default Homepage