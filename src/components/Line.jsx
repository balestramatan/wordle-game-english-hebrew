import React from 'react';

const WORD_LENGTH = 5;

const Line = React.memo(({ guess, isFinal, solution }) => {
  const tiles = [];
  
  if (isFinal) {
    const solutionLetters = solution.split('');
    const usedIndices = new Set(); // Tracks used letters in the solution

    // Mark 'correct' first
    for (let i = 0; i < WORD_LENGTH; i++) {
      const char = guess[i];
      if (char === solution[i]) {
        usedIndices.add(i); // Mark the letter as used
      }
    }

    // Create tiles
    for (let i = 0; i < WORD_LENGTH; i++) {
      const char = guess[i];
      let className = 'tile';

      if (char === solution[i]) {
        className += ' correct'; // Correct position
      } else if (solutionLetters.includes(char)) {
        // Find an unused matching letter
        const indexInSolution = solutionLetters.findIndex(
          (letter, idx) => letter === char && !usedIndices.has(idx)
        );
        if (indexInSolution !== -1) {
          className += ' close'; // Wrong position, correct letter
          usedIndices.add(indexInSolution); // Mark it as used
        } else {
          className += ' incorrect'; // No more matches left
        }
      } else {
        className += ' incorrect'; // Letter not in the solution
      }

      tiles.push(
        <div key={`char_${i}`} className={className}>
          {char}
        </div>
      );
    }
  } else {
    // When not final, just render default tiles
    for (let i = 0; i < WORD_LENGTH; i++) {
      const char = guess[i] || '';
      tiles.push(
        <div key={`char_${i}`} className="tile">
          {char}
        </div>
      );
    }
  }

  return <div className="line">{tiles}</div>;
});

export default Line;
