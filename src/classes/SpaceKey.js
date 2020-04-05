import Key from './Key.js';
import Letters from './Letters.js'

export default class SpaceKey extends Key {
    constructor() {
        super(new Letters('', '', '', ''), 'Space');
    }
}