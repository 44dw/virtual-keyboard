import Key from './Key.js';
import Letters from './Letters.js'

export default class FunctionalKey extends Key {
    constructor(keyName, keyCode) {
        super(new Letters(keyName, keyName, keyName, keyName), (keyCode ? keyCode : keyName));
    }
}