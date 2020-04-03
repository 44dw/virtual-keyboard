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

window.onload = () => {
    loadPageContent();
    addElentClickListeners();
}

const addElentClickListeners = () => {
    addLanguageChangeListener();
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

const changeLanguage = () => {
    sessionStorage.getItem(LANGUAGE_KEY) == LANGUAGE_ENG 
        ? sessionStorage.setItem(LANGUAGE_KEY, LANGUAGE_RUS) 
        : sessionStorage.setItem(LANGUAGE_KEY, LANGUAGE_ENG); 
}

const sendChangeLanguageEvent = () => {
    let event = new Event('changeLanguage');

    // dispatch event on all keys
    document.querySelectorAll('.keyboard-container__key').forEach((el) => el.dispatchEvent(event));
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
        keyElement.classList.add('key-space');
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
            new CustomKey('`', 'ё', '~', 'Ё'), 
            new NumberKey('1', '!'),
            new NumberKey('2', '@', '"'),
            new NumberKey('3', '#', '№'),
            new NumberKey('4', '$', ';'),
            new NumberKey('5', '%'),
            new NumberKey('6', '^', ':'),
            new NumberKey('7', '&', '?'),
            new NumberKey('8', '*'),
            new NumberKey('9', '('),
            new NumberKey('0', ')'),
            new NumberKey('-', '_'),
            new NumberKey('=', '+'),
            new FunctionalKey('backspace')
        ],
        [
            new FunctionalKey('Tab'),
            new LetterKey(113, 1081),
            new LetterKey(119, 1094),
            new LetterKey(101, 1091),
            new LetterKey(114, 1082),
            new LetterKey(116, 1077),
            new LetterKey(121, 1085),
            new LetterKey(117, 1075),
            new LetterKey(105, 1096),
            new LetterKey(111, 1097),
            new LetterKey(112, 1079),
            new CustomKey('[', 'х', '{', 'Х'), 
            new CustomKey(']', 'ъ', '}', 'Ъ'), 
            new NumberKey('\\', '/'),
            new FunctionalKey('DEL')
        ],
        [
            new FunctionalKey('Caps Lock'),
            new LetterKey(97, 1092),
            new LetterKey(115, 1099),
            new LetterKey(100, 1074),
            new LetterKey(102, 1072),
            new LetterKey(103, 1087),
            new LetterKey(104, 1088),
            new LetterKey(106, 1086),
            new LetterKey(107, 1083),
            new LetterKey(108, 1076),
            new CustomKey(';', 'ж', ':', 'Ж'), 
            new CustomKey('\'', 'э', '"', 'Э'),
            new FunctionalKey('ENTER'), 
        ],
        [
            new FunctionalKey('Shift'), 
            new CustomKey('/', '.', '?', ','),
            new LetterKey(122, 1103),
            new LetterKey(120, 1095),
            new LetterKey(99, 1089),
            new LetterKey(118, 1084),
            new LetterKey(98, 1080),
            new LetterKey(110, 1090),
            new LetterKey(109, 1100),
            new CustomKey(',', 'б', '<', 'Б'), 
            new CustomKey('.', 'ю', '>', 'Ю'), 
            new CustomKey('/', '.', '?', ','),
            new FunctionalKey('↑'),
            new FunctionalKey('Shift')
        ],
        [
            new FunctionalKey('Ctrl'),
            new FunctionalKey('Win'),
            new FunctionalKey('Alt'),
            new SpaceKey(),
            new FunctionalKey('Alt'),
            new FunctionalKey('Ctrl'),
            new FunctionalKey('←'),
            new FunctionalKey('↓'),
            new FunctionalKey('→'),
        ]
    ];
}