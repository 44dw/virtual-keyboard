import Key from './Key.js';
import Letters from './Letters.js'

export default class CustomKey extends Key {
    constructor(engLetter, rusLetter, engCapitalLetter, rusCapitalLetter, keyCode) {
        super(new Letters(engLetter, rusLetter, engCapitalLetter, rusCapitalLetter), keyCode);
    }
}