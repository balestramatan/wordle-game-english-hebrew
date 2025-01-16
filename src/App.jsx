import { useEffect, useState, useMemo } from 'react';
import LocalStorage from './utils/localStorage';
import Line from './components/Line';
import MyKeyboard from './components/Keyboard';
import { hebrewWords } from './utils/hebrewWords'
import InfoPopup from './components/InfoPopup';

import './App.css';
import TimeLeft from './components/TimeLeft';

const API_URL = 'https://random-word-api.herokuapp.com/word?length=5';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const ONE_MINUTE_IN_MS = 60 * 1000; // 1 minute in milliseconds

function App() {
  const [language, setLanguage] = useState('english'); // Default language
  const [englishSolution, setEnglishSolution] = useState('');
  const [hebrewSolution, setHebrewSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  

  const fetchSolutions = async () => {
    const englishWord = await getSolutionWord('english');
    const hebrewWord = await getSolutionWord('hebrew');
    const now = Date.now();

    LocalStorage.save('english_Solution', englishWord);
    LocalStorage.save('hebrew_Solution', hebrewWord);
    LocalStorage.save('lastUpdated', now);

    setEnglishSolution(englishWord);
    setHebrewSolution(hebrewWord);
  };

  const getSolutionWord = async (lang) => {
    if (lang === 'english') {
      const response = await fetch(API_URL);
      const englishWord = await response.json();
      return englishWord[0];
    } else if (lang === 'hebrew') {
      return hebrewWords[Math.floor(Math.random() * hebrewWords.length)];
    }
  };

  const finishGame = () => {
    alert('You Won!');
    setIsGameOver(true);
  }

  const checkIfCurrentGuess = () => {
    if (currentGuess.length !== 5) return;

    const newGuesses = [...guesses];
    newGuesses[guesses.findIndex((val) => val === null)] = currentGuess;
    setGuesses(newGuesses);
    setCurrentGuess('');

    const isCorrect = englishSolution === currentGuess || hebrewSolution === currentGuess;
    if (isCorrect) {
      finishGame();
      return;
    }

    // Check if all guesses are used
    const allGuessesUsed = newGuesses.filter((guess) => guess !== null).length === 6;
    if (allGuessesUsed) {
      setIsGameOver(true);
      alert(`Game Over! The solution was ${language === 'english' ? englishSolution : hebrewSolution}`);
    }
  };

  const handleMyKeyboardType = (button) => {
    if (isGameOver) return;

    if (button === '{bksp}') {
      setCurrentGuess(currentGuess.slice(0, -1));
      return;
    }

    if (button === '{enter}') {
      checkIfCurrentGuess();
      return;
    }

    if (currentGuess.length >= 5) return;

    const isLetter = button.match(/^[a-zא-ת]{1}/); // Accept both English and Hebrew letters
    isLetter && setCurrentGuess(currentGuess + button);
  };

  const changeLanguage = () => {
    if (isGameOver) return;

    if (language === 'english'){
      setLanguage('hebrew')
    } else setLanguage('english')

    resetGame();
  };

  const resetGame = () => {
    setGuesses(Array(6).fill(null));
    setCurrentGuess('');
    fetchSolutions();
    setIsGameOver(false);
  }

  // Fetching new words
  useEffect(() => {
    const savedEnglishSolution = LocalStorage.load('english_Solution');
    const savedHebrewSolution = LocalStorage.load('hebrew_Solution');
    const lastUpdated = LocalStorage.load('lastUpdated');

    const now = Date.now();

    if (
      savedEnglishSolution &&
      savedHebrewSolution &&
      lastUpdated &&
      now - lastUpdated < ONE_MINUTE_IN_MS
    ) {
      // Use saved solutions if they're still valid
      setEnglishSolution(savedEnglishSolution);
      setHebrewSolution(savedHebrewSolution);
    } else {
      // Fetch new solutions if the time has passed
      fetchSolutions();
    }

  }, [language]);

  // Handling typing
  useEffect(() => {
    if (isGameOver) return;

    const handleType = (event) => {
      if (isGameOver) return;

      if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (event.key === 'Enter') {
        checkIfCurrentGuess();
        return;
      }

      if (currentGuess.length >= 5) return;

      let isLetter;
      if (language === 'english'){
        isLetter = event.key.match(/^[a-z]{1}/) !== null;
      } else {
        isLetter = event.key.match(/^[א-ת]{1}/) !== null;
      }

      isLetter && setCurrentGuess(currentGuess + event.key);
    };

    window.addEventListener('keydown', handleType);

    return () => window.removeEventListener('keydown', handleType);
  }, [currentGuess, isGameOver, englishSolution, hebrewSolution, language]);

  const solution = useMemo(() => (language === 'english' ? englishSolution : hebrewSolution), [language]);

  return (
    <div className="board">
      <InfoPopup />

      <TimeLeft fetchSolutions={fetchSolutions} />
      
      <p>{`${language === 'english' ? 'Guess The Word' : 'נחש את המילה'}`}</p>

      <div className={`lines ${language === 'hebrew' ? 'hebrew-tiles-container' : ''}`}>
        {guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex((val) => val === null);
          return (
            <Line
              key={i}
              guess={isCurrentGuess ? currentGuess : guess ?? ''}
              isFinal={!isCurrentGuess && guess != null}
              solution={solution}
            />
          );
        })}
      </div>

      <MyKeyboard 
        handleKeyboardType={handleMyKeyboardType} 
        changeLanguage={changeLanguage} 
        language={language} 
        guesses={guesses} 
        solution={language === 'english' ? englishSolution : hebrewSolution} 
      />

      {isGameOver && (
        <div>
          <p>{`Number Of Guesses: ${guesses.filter((guess) => guess !== null).length}`}</p>
          <button onClick={() => resetGame()}>Click To Start A New Game</button>
        </div>
      )}
    </div>
  );
}

export default App;
