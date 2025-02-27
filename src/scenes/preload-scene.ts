import Phaser from 'phaser'
import { scene_keys, deck, Card } from './common'

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

        for (let i = 1; i <= 13; i++){ 
            // All playing card images
            this.load.image(`card_hearts_${i}`, `/assets/playing_cards/Hearts_${i}.png`)
            this.load.image(`card_ spades_${i}`, `/assets/playing_cards/Spades_${i}.png`)
            this.load.image(`card_diamonds_${i}`, `/assets/playing_cards/Diamonds_${i}.png`)
            this.load.image(`card_clubs_${i}`, `/assets/playing_cards/Clubs_${i}.png`)

            //Makes a deck
            deck.push({id: `card_hearts_${i}`, value: i, suit: "hearts"})
            deck.push({id: `card_ spades_${i}`, value: i, suit: "spades"})
            deck.push({id: `card_diamonds_${i}`, value: i, suit: "diamonds"})
            deck.push({id: `card_clubs_${i}`, value: i, suit: "clubs"})
        }
    }

    public create(): void {
        this.scene.start(scene_keys.title)
    }
}