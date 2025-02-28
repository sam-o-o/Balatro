import Phaser from 'phaser'
import { scene_keys, sizes, deck, Card } from './common'
import { create_card_slots, create_hand_buttons, create_left_panel, shuffle_cards } from '../lib/balatro_functions.ts'

export class GameScene extends Phaser.Scene {
    private card_slots: { x: number; y: number }[] = []
    private shuffled_deck = empty<number>() as NonEmptyStack<number>;
    private takencards: Array<number> = []


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
        create_hand_buttons(this)
        create_left_panel(this)
    }
}