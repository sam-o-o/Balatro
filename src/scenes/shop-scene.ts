import Phaser from 'phaser'
import { scene_keys, sizes} from './common'
import { create_left_panel, create_deck_slot, create_shop } from '../lib/balatro_functions'

export class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: scene_keys.shop })
    }

    create() {
        this.add.rectangle(0, 0, sizes.width, sizes.height, 0x266b46).setOrigin(0, 0)

        create_left_panel(this)
        create_deck_slot(this)
        create_shop(this)
    }       
}