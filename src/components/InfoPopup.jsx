import React from 'react';
import '../App.css';

const InfoPopup = () => {
  
  return (
    <div className="info-container">
      <div className="info-icon">ℹ️</div>
      <div className="info-popup">
        <h3>How to Play Wordle</h3>
        <ol>
          <li>Guess the secret <b>5-letter word</b> in 6 tries or less.</li>
          <li>
            After each guess, the tiles will indicate how close your guess is:
            <ul>
              <li><span className="green">Green</span>: Correct letter, correct position.</li>
              <li><span className="yellow">Yellow</span>: Correct letter, wrong position.</li>
              <li><span className="gray">Gray</span>: Letter not in the word.</li>
            </ul>
          </li>
          <li>Use the feedback to refine your guesses and find the word!</li>
        </ol>
        <p>Good luck and have fun!</p>
      </div>
    </div>
  );
};

export default InfoPopup;
