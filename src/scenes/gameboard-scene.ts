import Phaser from 'phaser'
import { scene_keys, sizes } from './common'
import { create_card_slots, create_deck_slot, create_hand_buttons, create_left_panel, create_played_hand_slots} from '../lib/balatro_functions'

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: scene_keys.gameboard })
    }

    create() {
        const bg = this.add.image(0, 0, "bg").setOrigin(0, 0)
        bg.setDisplaySize(sizes.width, sizes.height)

        this.create_board()
    } 

    create_board() {
        create_card_slots(this)
        create_deck_slot(this)
        create_played_hand_slots(this)
        create_hand_buttons(this)
        create_left_panel(this)
    }
}