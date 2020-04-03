import Key from "./Key.js";

const CAPITAL_LETTERS_GAP = 32;

export default class LetterKey extends Key {
    constructor(engKeyCode, rusKeyCode) {
        let engLetter = String.fromCharCode(engKeyCode);
        let engCapitalLetter = String.fromCharCode(engKeyCode - CAPITAL_LETTERS_GAP);
        let rusLetter = String.fromCharCode(rusKeyCode);
        let rusCapitalLetter = String.fromCharCode(rusKeyCode - CAPITAL_LETTERS_GAP);
        super(engLetter, rusLetter, engCapitalLetter, rusCapitalLetter);
    }
    
}