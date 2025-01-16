import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import '../App.css';

const MyKeyboard = React.memo(({ handleKeyboardType, changeLanguage, language, guesses, solution }) => {
    const onKeyPress = (button) => {
        if (button === '{cl}') {
            changeLanguage()
            return;
        }
        handleKeyboardType(button);
    }

    const hebrewLayout = {
        default: [
          "\u05e7 \u05e8 \u05d0 \u05d8 \u05d5 \u05df \u05dd \u05e4",
          "\u05e9 \u05d3 \u05d2 \u05db \u05e2 \u05d9 \u05d7 \u05dc \u05da \u05e3 {bksp}",
          "\u05d6 \u05e1 \u05d1 \u05d4 \u05e0 \u05de \u05e6 \u05ea \u05e5 {enter}",
          "{cl}"
        ],
    }

    const englishLayout = {
        default: [
            'q w e r t y u i o p',
            'a s d f g h j k l {bksp}',
            'z x c v b n m {enter}',
            '{cl}'
        ],
    }

    const display = {
        "{enter}": "return",
        "{bksp}": "⌫",
        "{abc}": "ABC",
        "{cl}": language === 'english' ? 'Change Language' : "החלף שפה"
    }

    const guessedLettersSet = new Set();
    const correctLettersSet = new Set();
    const closeLettersSet = new Set();

    guesses
        .filter((guess) => guess !== null) // Remove null guesses
        .forEach((guess) => {
            const solutionCopy = solution.split(''); // Copy of the solution for comparison
            guess.split('').forEach((letter, index) => {
                guessedLettersSet.add(letter);
                if (letter === solution[index]) {
                    // Letter is in the correct position
                    correctLettersSet.add(letter);
                    solutionCopy[index] = null; // Mark as used in solution copy
                }
            });

            // Find letters that exist in the solution but are in the wrong position
            guess.split('').forEach((letter, index) => {
                if (solutionCopy.includes(letter) && letter !== solution[index]) {
                    closeLettersSet.add(letter);
                    // Remove the first occurrence of this letter from the solution copy
                    solutionCopy[solutionCopy.indexOf(letter)] = null;
                }
            });
        });

    // Convert the Set to a space-separated string for buttonTheme
    const guessedLetters = Array.from(guessedLettersSet).join(' ');
    const correctLetters = Array.from(correctLettersSet).join(' ');
    const closeLetters = Array.from(closeLettersSet).join(' ');

    const buttonThemes = [
        {
          class: "enter-highlight",
          buttons: '{enter}'
        },
        {
          class: "ln-highlight",
          buttons: '{cl}'
        },
    ]

    const dynamicButtonThemes = [
        {
            class: "hg-correct",
            buttons: correctLetters
        },
        {
            class: "hg-close",
            buttons: closeLetters
        },
        {
            class: "hg-guesses",
            buttons: guessedLetters
        },
    ];

    const filteredThemes = [
        ...buttonThemes,
        ...dynamicButtonThemes.filter(theme => theme.buttons && theme.buttons.trim() !== '')
    ];

    return (
        <div className="keyboard-container">
            <Keyboard
                layout={language === 'english' ? englishLayout : hebrewLayout}
                display={display}
                layoutName={'default'}
                theme={"hg-theme-default myTheme"}
                onKeyPress={onKeyPress}
                buttonTheme={filteredThemes}
            />
        </div>
    );
});

export default MyKeyboard;