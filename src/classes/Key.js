export default class Key {
    constructor(engLetter, rusLetter, engCapitalLetter, rusCapitalLetter) {
        this.init(engLetter, rusLetter, engCapitalLetter, rusCapitalLetter);
    }

    init(letters, keyCode) {
        const { engLetter, rusLetter, engCapitalLetter, rusCapitalLetter } = letters;
        
        this.engLetter = engLetter;
        this.rusLetter = rusLetter;
        this.engCapitalLetter = engCapitalLetter;
        this.rusCapitalLetter = rusCapitalLetter;

        this.keyCode = keyCode;
    }
}