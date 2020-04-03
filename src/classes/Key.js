export default class Key {
    constructor(engLetter, rusLetter, engCapitalLetter, rusCapitalLetter) {
        this.init(engLetter, rusLetter, engCapitalLetter, rusCapitalLetter);
    }

    init(engLetter, rusLetter, engCapitalLetter, rusCapitalLetter) {
        this.engLetter = engLetter;
        this.rusLetter = rusLetter;
        this.engCapitalLetter = engCapitalLetter;
        this.rusCapitalLetter = rusCapitalLetter;
    }
}