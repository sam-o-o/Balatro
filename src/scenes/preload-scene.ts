import Phaser from 'phaser'
import { scene_keys, deck } from './common'

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: scene_keys.preload })
    }

    public preload(): void {
        this.load.image("bg", "/assets/bg.jpg") // Game backgound image
        this.load.image("title_bg", "/assets/title_bg.webp") // Title background image
        this.load.image("title_text", "/assets/title_text.png") // Title text image
        this.load.image("click_to_start", "/assets/clickToStart.png") // Title click to start image
        this.load.image("play_hand_button", "/assets/play_hand_button.png") // Play hand button image
        this.load.image("discard_button", "/assets/discard_button.png") // Discard button image

        for (let i = 2; i <= 14; i++){ 
            // All playing card images
            this.load.image(`card_hearts_${i}`, `/assets/playing_cards/Hearts_${i}.png`)
            this.load.image(`card_ spades_${i}`, `/assets/playing_cards/Spades_${i}.png`)
            this.load.image(`card_diamonds_${i}`, `/assets/playing_cards/Diamonds_${i}.png`)
            this.load.image(`card_clubs_${i}`, `/assets/playing_cards/Clubs_${i}.png`)

            //Makes a deck
            deck.push({image: `card_hearts_${i}`, id: i, value: i, suit: "hearts", chip_flat: i, chip_factor: 1, mult_flat: 0, mult_factor: 1})
            deck.push({image: `card_ spades_${i}`, id: i + 13, value: i, suit: "spades", chip_flat: i, chip_factor: 1, mult_flat: 0, mult_factor: 1})
            deck.push({image: `card_diamonds_${i}`, id: i + 26, value: i, suit: "diamonds", chip_flat: i, chip_factor: 1, mult_flat: 0, mult_factor: 1})
            deck.push({image: `card_clubs_${i}`, id: i + 39, value: i, suit: "clubs", chip_flat: i, chip_factor: 1, mult_flat: 0, mult_factor: 1})
        }
    }

    public create(): void {
        this.scene.start(scene_keys.gameboard)
        // this.scene.start(scene_keys.title)
    }
}