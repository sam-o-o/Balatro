import Phaser from 'phaser'
import { scene_keys, deck, create_card, get_card_image_name, Suit, joker_deck } from './common'

export class PreloadScene extends Phaser.Scene {

    select_card_sfx: any
    deselect_card_sfx: any
    constructor() {

        super({ key: scene_keys.preload })
        this.select_card_sfx
        this.deselect_card_sfx
    }

    public preload(): void {
        // Preload graphics
        this.load.image("bg", "/assets/bg.jpg") // Game backgound image
        this.load.image("title_bg", "/assets/title_bg.webp") // Title background image
        this.load.image("title_text", "/assets/title_text.png") // Title text image
        this.load.image("click_to_start", "/assets/clickToStart.png") // Title click to start image
        this.load.image("play_hand_button", "/assets/play_hand_button.png") // Play hand button image
        this.load.image("discard_button", "/assets/discard_button.png") // Discard button image
        this.load.image("left_panel", "/assets/X.png")// An image of left panel
        this.load.image("info_button", "/assets/info.png") //A button of info image
        this.load.image("info_card", "/assets/howtoplay.png") //A info card explaining how game works image
        this.load.image("cross", "/assets/cross.png") // Click out x image
        this.load.image("gameover", "/assets/gameover.png") // Game over image
        this.load.image("card_bg", "/assets/playing_cards/Back_1.png") // Card backgound image
        this.load.image("shop", "/assets/shop.png") // Shop image
        this.load.image("next_round_button", "/assets/next_round_button.png") // Next round button image

        //preload audio
        this.load.audio("draw_cards", "/audio/discard_sfx.mp3")
        this.load.audio("select_card", "/audio/select_card_click.mp3")
        this.load.audio("deselect_card", "/audio/deselect_card_click.mp3")

        for (let i = 1; i <= 5; i++) {
            this.load.image(`joker_${i}`, `/assets/playing_cards/Joker_${i}.png`)
            this.load.image(`description_${i}`, `/assets/${i}.png`)

            if(i === 1)
                joker_deck.push( {id: i, image: `joker_${i}`, price: 3, description: `description_${i}`} )
            else
                joker_deck.push( {id: i, image: `joker_${i}`, price: 5, description: `description_${i}`} )
        }

        for (let value = 2; value <= 14; value++){ 
            // All playing card images
            this.load.image(get_card_image_name(Suit.hearts, value), `/assets/playing_cards/Hearts_${value}.png`)
            this.load.image(get_card_image_name(Suit.spades, value), `/assets/playing_cards/Spades_${value}.png`)
            this.load.image(get_card_image_name(Suit.diamonds, value), `/assets/playing_cards/Diamonds_${value}.png`)
            this.load.image(get_card_image_name(Suit.clubs, value), `/assets/playing_cards/Clubs_${value}.png`)

            if(value <= 10) {
                for(let suit = 0; suit < 4; suit++){
                    deck.push(create_card(get_card_image_name(suit, value), value, suit, value, 1, 0, 1))
                }
            }
            else if(value < 14) {
                for(let suit = 0; suit < 4; suit++){
                    deck.push(create_card(get_card_image_name(suit, value), value, suit, 10, 1, 0, 1))
                }
            }
            else {
                for(let suit = 0; suit < 4; suit++){
                    deck.push(create_card(get_card_image_name(suit, value), value, suit, 11, 1, 0, 1))
                }
            } 
        }
    }

    public create(): void {
        this.scene.start(scene_keys.gameboard)
        //this.scene.start(scene_keys.title)
    }
}