import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const MyKeyboard = ({ handleKeyboardType, changeLanguage, language }) => {
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

    return (
        <Keyboard
            layout={language === 'english' ? englishLayout : hebrewLayout}
            display={display}
            layoutName={'default'}
            onKeyPress={onKeyPress}
        />
    );
}

export default MyKeyboard;