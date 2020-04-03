import Key from "./Key.js";

export default class FunctionalKey extends Key {
    constructor(keyName) {
        super(keyName, keyName, keyName, keyName);
    }
}