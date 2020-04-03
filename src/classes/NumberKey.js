import Key from "./Key.js";

export default class NumberKey extends Key {
    constructor(letter, engCapitalLetter, rusCapitalLetter) {
        super(letter, letter, engCapitalLetter, rusCapitalLetter ? rusCapitalLetter : engCapitalLetter);
    }
}