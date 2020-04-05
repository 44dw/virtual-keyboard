import LetterKey from "./classes/LetterKey.js";
import CustomKey from "./classes/CustomKey.js";
import NumberKey from "./classes/NumberKey.js";
import FunctionalKey from "./classes/FunctionalKey.js";
import SpaceKey from "./classes/SpaceKey.js";

const BODY = document.querySelector('body');

const NUMBER_KEY = 'NumberKey';
const LETTER_KEY = 'LetterKey';
const FUNCTIONAL_KEY = 'FunctionalKey';
const CUSTOM_KEY = 'CustomKey';

const LANGUAGE_KEY = 'language';
const LANGUAGE_RUS = 'rus';
const LANGUAGE_ENG = 'eng';

let KEYBOARD_CONTAINER, KEYS;

window.onload = () => {
    loadPageContent();
    setConstants();
    addElementListeners();
}

const setConstants = () => {
    KEYBOARD_CONTAINER = document.querySelector('.keyboard-container');
    KEYS = document.querySelectorAll('.keyboard-container__key');
}

const addElementListeners = () => {
    addLanguageChangeListener();
    addKeyPressListener();
    addKeyClickListener();
}

const addKeyClickListener = () => {
    KEYBOARD_CONTAINER.addEventListener('mousedown', (e) => onKeyMousedown(e.target))
    KEYBOARD_CONTAINER.addEventListener('mouseup', (e) => onKeyMouseup(e.target))
}

const addKeyPressListener = () => {
    document.addEventListener('keydown', (e) => setActiveKeys(e.code))
    document.addEventListener('keyup', (e) => removeActiveKeys(e.code))
}

const addLanguageChangeListener = () => {
    // alt + shift has been pressed
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey) {
            changeLanguage();
            sendChangeLanguageEvent();
        }
    })
}

const onKeyMousedown = (target) => {
    if (!target.classList.contains('keyboard-container__key')) {
        return;
    }

    target.classList.add('key_active');
}

const onKeyMouseup = (target) => {
    if (!target.classList.contains('keyboard-container__key')) {
        return;
    }

    target.classList.remove('key_active');
}

const setActiveKeys = (code) => {
    KEYS.forEach(key => {
        const { keyObject } = key;
        if (keyObject.keyCode === code) {
            key.classList.add('key_active')
        }
    })
}

const removeActiveKeys = (code) => {
    KEYS.forEach(key => {
        const { keyObject } = key;
        if (keyObject.keyCode === code) {
            key.classList.remove('key_active')
        }
    })
}

const changeLanguage = () => {
    sessionStorage.getItem(LANGUAGE_KEY) == LANGUAGE_ENG 
        ? sessionStorage.setItem(LANGUAGE_KEY, LANGUAGE_RUS) 
        : sessionStorage.setItem(LANGUAGE_KEY, LANGUAGE_ENG); 
}

const sendChangeLanguageEvent = () => {
    let event = new Event('changeLanguage');

    // dispatch event on all keys
    KEYS.forEach((el) => el.dispatchEvent(event));
}

const loadPageContent = () => {
    const keyboardArr = generateKeyboardArr();
    attachKeyboardToDom(keyboardArr);
}

const attachKeyboardToDom = (keyboardArr) => {
    setLanguageToSessionStorage();

    let keyboardContainer = appendKeyboardContainer();

    keyboardArr.forEach(row => {
        let rowContainer = appendRowContainer(keyboardContainer);
        row.forEach(keyObj => {
            appendKeyToRow(rowContainer, keyObj);
        })
    })
}

const setLanguageToSessionStorage = () => {
    if (!sessionStorage.getItem(LANGUAGE_KEY)) {
        sessionStorage.setItem(LANGUAGE_KEY, LANGUAGE_ENG);
    } 
}

const appendKeyboardContainer = () => {
    let keyboardContainer = document.createElement('div');
    keyboardContainer.classList.add('keyboard-container');
    BODY.appendChild(keyboardContainer);
    return keyboardContainer;
}

const appendRowContainer = (keyboardContainer) => {
    let rowContainer = document.createElement('div');
    rowContainer.classList.add('keyboard-container__row');
    keyboardContainer.appendChild(rowContainer);
    return rowContainer;
}

const appendKeyToRow = (rowContainer, keyObj) => {
    let keyElement = document.createElement('div');
    setupKeyElement(keyElement, keyObj);
    keyElement.classList.add('keyboard-container__key');
    if (keyObj instanceof FunctionalKey) {
        keyElement.classList.add('key_functional');
    }
    if (keyObj instanceof SpaceKey) {
        keyElement.classList.add('key_space');
    }
    const language = sessionStorage.getItem(LANGUAGE_KEY);
    keyElement.innerText = (language == LANGUAGE_ENG ? keyObj.engLetter : keyObj.rusLetter);
    rowContainer.appendChild(keyElement);
}

const setupKeyElement = (keyElement, keyObj) => {
    keyElement.keyObject = keyObj;
    keyElement.addEventListener('changeLanguage', () => {
        toggleElementLanguage(keyElement);
    })
    window.addEventListener('keydown', (e) => {
        if (e.shiftKey) {
            toggleRegister(keyElement, true);
        }
    })
    window.addEventListener('keyup', (e) => {
        if (e.key == "Shift") {
            toggleRegister(keyElement, false);
        }
    })
}
const toggleRegister = (keyElement, shiftKeyIsPressed) => {
    const language = sessionStorage.getItem(LANGUAGE_KEY);
    const { keyObject } = keyElement;
    const letterForEng = shiftKeyIsPressed ? keyObject.engCapitalLetter : keyObject.engLetter;
    const letterForRus = shiftKeyIsPressed ? keyObject.rusCapitalLetter : keyObject.rusLetter;
    keyElement.innerText = (language == LANGUAGE_ENG ? letterForEng : letterForRus);
}

const toggleElementLanguage = (keyElement) => {
    const language = sessionStorage.getItem(LANGUAGE_KEY);
    const { keyObject } = keyElement;
    keyElement.innerText = (language == LANGUAGE_ENG ? keyObject.engLetter : keyObject.rusLetter);
}

const generateKeyboardArr = () => {
    return [
        [
            new CustomKey('`', 'ё', '~', 'Ё', 'Backquote'), 
            new NumberKey('1', '!', null, 'Digit1'),
            new NumberKey('2', '@', '"', 'Digit2'),
            new NumberKey('3', '#', '№', 'Digit3'),
            new NumberKey('4', '$', ';', 'Digit4'),
            new NumberKey('5', '%', null, 'Digit5'),
            new NumberKey('6', '^', ':', 'Digit6'),
            new NumberKey('7', '&', '?', 'Digit7'),
            new NumberKey('8', '*', null, 'Digit8'),
            new NumberKey('9', '(', null, 'Digit9'),
            new NumberKey('0', ')', null, 'Digit0'),
            new NumberKey('-', '_', null, 'Minus'),
            new NumberKey('=', '+', null, 'Equal'),
            new FunctionalKey('backspace', 'Backspace')
        ],
        [
            new FunctionalKey('Tab'),
            new LetterKey(113, 1081, 'KeyQ'),
            new LetterKey(119, 1094, 'KeyW'),
            new LetterKey(101, 1091, 'KeyE'),
            new LetterKey(114, 1082, 'KeyR'),
            new LetterKey(116, 1077, 'KeyT'),
            new LetterKey(121, 1085, 'KeyY'),
            new LetterKey(117, 1075, 'KeyU'),
            new LetterKey(105, 1096, 'KeyI'),
            new LetterKey(111, 1097, 'KeyO'),
            new LetterKey(112, 1079, 'KeyP'),
            new CustomKey('[', 'х', '{', 'Х', 'BracketLeft'), 
            new CustomKey(']', 'ъ', '}', 'Ъ', 'BracketRight'), 
            new NumberKey('\\', '/', 'Backslash'),
            new FunctionalKey('DEL', 'Delete')
        ],
        [
            new FunctionalKey('Caps Lock', 'CapsLock'),
            new LetterKey(97, 1092, 'KeyA'),
            new LetterKey(115, 1099, 'KeyS'),
            new LetterKey(100, 1074, 'KeyD'),
            new LetterKey(102, 1072, 'KeyF'),
            new LetterKey(103, 1087, 'KeyG'),
            new LetterKey(104, 1088, 'KeyH'),
            new LetterKey(106, 1086, 'KeyJ'),
            new LetterKey(107, 1083, 'KeyK'),
            new LetterKey(108, 1076, 'KeyL'),
            new CustomKey(';', 'ж', ':', 'Ж', 'Semicolon'), 
            new CustomKey('\'', 'э', '"', 'Э', 'Quote'),
            new FunctionalKey('ENTER', 'Enter'), 
        ],
        [
            new FunctionalKey('Shift', 'ShiftLeft'), 
            new CustomKey('/', '.', '?', ',', 'Slash'),
            new LetterKey(122, 1103, 'KeyZ'),
            new LetterKey(120, 1095, 'KeyX'),
            new LetterKey(99, 1089, 'KeyC'),
            new LetterKey(118, 1084, 'KeyV'),
            new LetterKey(98, 1080, 'KeyB'),
            new LetterKey(110, 1090, 'KeyN'),
            new LetterKey(109, 1100, 'KeyM'),
            new CustomKey(',', 'б', '<', 'Б', 'Comma'), 
            new CustomKey('.', 'ю', '>', 'Ю', 'Period'), 
            new CustomKey('/', '.', '?', ',', 'Slash'),
            new FunctionalKey('↑', 'ArrowUp'),
            new FunctionalKey('Shift', 'ShiftRight')
        ],
        [
            new FunctionalKey('Ctrl', 'ControlLeft'),
            new FunctionalKey('Win', 'MetaLeft'),
            new FunctionalKey('Alt', 'AltLeft'),
            new SpaceKey(),
            new FunctionalKey('Alt', 'AltRight'),
            new FunctionalKey('Ctrl', 'ControlRight'),
            new FunctionalKey('←', 'ArrowLeft'),
            new FunctionalKey('↓', 'ArrowDown'),
            new FunctionalKey('→', 'ArrowRight'),
        ]
    ];
}