import Key from './Key.js';
import Letters from './Letters.js'

export default class NumberKey extends Key {
    constructor(letter, engCapitalLetter, rusCapitalLetter, keyCode) {
        super(new Letters(letter, letter, engCapitalLetter, rusCapitalLetter ? rusCapitalLetter : engCapitalLetter), keyCode);
    }
}