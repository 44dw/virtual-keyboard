import LetterKey from "./classes/LetterKey.js";
import CustomKey from "./classes/CustomKey.js";
import NumberKey from "./classes/NumberKey.js";
import FunctionalKey from "./classes/FunctionalKey.js";
import SpaceKey from "./classes/SpaceKey.js";

const BODY = document.querySelector('body');

const LANGUAGE_KEY = 'language';
const LANGUAGE_RUS = 'rus';
const LANGUAGE_ENG = 'eng';
const REGISTER_KEY = 'register';

let KEYBOARD_CONTAINER, KEYS, LETTER_KEYS, TEXTAREA;

window.onload = () => {
    loadPageContent();
    setConstants();
    addElementListeners();
}

const setConstants = () => {
    KEYBOARD_CONTAINER = document.querySelector('.keyboard-container');
    KEYS = document.querySelectorAll('.keyboard-container__key');
    LETTER_KEYS = document.querySelectorAll('.key_letter');
    TEXTAREA = document.querySelector('.textarea');
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

// here all keydown event will be handle (both mouse and keyboard)
const addKeyPressListener = () => {
    document.addEventListener('keydown', (e) => {
        const { key, code } = e;
        setActiveKeys(code);
        if (key == 'Tab') {
            setIdent(e);
        } else if (key.includes('Shift')) {
            toggleAllElementsRegister(true);
        } else if (key.includes('CapsLock')) {
            changeRegisterInSessionStorage();
        }
        // do nothing if event from keyboard and textarea is active
        if (textareaIsActive(code)) {
            return;
        }
        // all letters and numbers and line break
        if ((key.length == 1 || key == 'Enter' || key == 'Space')) {
            setTextToTextarea(key);
        }

        switch(key) {
            case('Backspace'): {
                delTextBeforeCursor();
            }
            case('Delete'): {
                delTextAfterCursor();
            }
            case('ArrowRight'):
            case('ArrowLeft'):
            case('ArrowUp'):
            case('ArrowDown'): {
                TEXTAREA.focus();
            }
        }
    })
    document.addEventListener('keyup', (e) => {
        if (e.key.includes('Shift')) {
            toggleAllElementsRegister(false)
        }
        removeActiveKeys(e.code)
    })
}

const textareaIsActive = (code) => {
    return (code.length > 0 && document.activeElement === TEXTAREA);
}

const addLanguageChangeListener = () => {
    // alt + shift has been pressed
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey) {
            changeLanguageInSessionStorage();
            sendChangeLanguageEvent();
        }
    })
}

const setIdent = (e) => {
    e.preventDefault();
    const { selectionStart, value } = TEXTAREA;
    // const prevStart = selectionStart;
    const ident = '   ';
    TEXTAREA.value = value.slice(0, selectionStart) + ident + value.slice(selectionStart, value.length);
    TEXTAREA.focus();
    TEXTAREA.selectionStart = TEXTAREA.selectionEnd = selectionStart + ident.length;
}

const delTextBeforeCursor = () => {
    const { value } = TEXTAREA;
    TEXTAREA.value = value.slice(0, value.length - 1);
}

const delTextAfterCursor = () => {
    const { selectionStart, value } = TEXTAREA;
    TEXTAREA.value = value.slice(0, selectionStart) + value.slice(selectionStart + 1, value.length);
    TEXTAREA.selectionStart = TEXTAREA.selectionEnd = selectionStart - 1;
}

const setTextToTextarea = (key) => {
    const { value } = TEXTAREA;
    let symbol;
    if (key == 'Enter') {
        symbol = '\n';
    } else if (key == 'Space') {
        symbol = ' ';
    } else {
        symbol = key;
    }
    TEXTAREA.value = value + symbol;
}

const onKeyMousedown = (target) => {
    if (!target.classList.contains('keyboard-container__key')) {
        return;
    }

    target.classList.add('key_active');
    dispatchKeydownEvent(target.innerText, target.keyObject);
}

const dispatchKeydownEvent = (text, keyObject) => {

    if (keyObject instanceof FunctionalKey || keyObject instanceof SpaceKey) {
        dispatchEventForFunctionalKey('keydown', keyObject.keyCode);
    } else {
        // letter or custom key
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': text}));
    }
}

const dispatchEventForFunctionalKey = (event, keyCode) => {
    document.dispatchEvent(new KeyboardEvent(event, {'key': keyCode}));
}

const onKeyMouseup = (target) => {
    if (!target.classList.contains('keyboard-container__key')) {
        return;
    }

    target.classList.remove('key_active');
    dispatchKeyupEvent(target.innerText, target.keyObject);
}

const dispatchKeyupEvent = (text, keyObject) => {
    if (keyObject instanceof FunctionalKey || keyObject instanceof SpaceKey) {
        dispatchEventForFunctionalKey('keyup', keyObject.keyCode);
    } else {
        // letter or custom key
        document.dispatchEvent(new KeyboardEvent('keyup', {'key': text}));
    }
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

const changeLanguageInSessionStorage = () => {
    sessionStorage.getItem(LANGUAGE_KEY) == LANGUAGE_ENG 
        ? sessionStorage.setItem(LANGUAGE_KEY, LANGUAGE_RUS) 
        : sessionStorage.setItem(LANGUAGE_KEY, LANGUAGE_ENG); 
}

const changeRegisterInSessionStorage = () => {
    if (sessionStorage.getItem(REGISTER_KEY) === 'true') {
        sessionStorage.setItem(REGISTER_KEY, 'false');
        toggleAllElementsRegister(false);
    } else {
        sessionStorage.setItem(REGISTER_KEY, 'true');
        toggleAllElementsRegister(true);
    }
}

const sendChangeLanguageEvent = () => {
    let event = new Event('changeLanguage');

    // dispatch event on all keys
    KEYS.forEach((el) => el.dispatchEvent(event));
}

const loadPageContent = () => {
    renderTextarea();
    renderKeyboard();
    renderNote();
}

const renderTextarea = () => {
    let textarea = document.createElement('textarea');
    textarea.classList.add('textarea');
    BODY.appendChild(textarea);
}

const renderKeyboard = () => {
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

const renderNote = () => {
    const note = document.createElement('p');
    note.textContent = 'переключение языков: Alt + Shift'
    note.classList.add('note');
    BODY.appendChild(note);
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
    if (keyObj instanceof LetterKey || keyObj instanceof CustomKey) {
        keyElement.classList.add('key_letter');
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
        if (e.key.includes('Shift')) {
            toggleRegister(keyElement, true);
        }
    })
    window.addEventListener('keyup', (e) => {
        if (e.key.includes('Shift')) {
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

const toggleAllElementsRegister = (shiftKeyIsPressed) => {
    LETTER_KEYS.forEach(keyElement => toggleRegister(keyElement, shiftKeyIsPressed));
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
            new NumberKey('\\', '/', null, 'Backslash'),
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