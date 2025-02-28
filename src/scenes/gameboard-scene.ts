import Phaser from 'phaser'
import { scene_keys, sizes, deck, Card } from './common'
import { empty, push, top, pop, Stack, NonEmptyStack, is_empty } from '../lib/stack.ts'
import { shuffle_cards } from '../lib/balatro_functions.ts'

export class GameScene extends Phaser.Scene {
    private card_slots: { x: number; y: number }[] = []

    constructor() {
        super({ key: scene_keys.gameboard })
    }

    create() {
        const bg = this.add.image(0, 0, "bg").setOrigin(0, 0)
        bg.setDisplaySize(sizes.width, sizes.height)

        const shuffled_cards = shuffle_cards(deck)
        
        this.create_card_slots(shuffled_cards)
        this.create_hand_buttons()
    }

    private numSlots = 7  // Number of slots
    private slotSpacing = 110  // Space between slots
    private left_side_offset = 120
    private startX = this.left_side_offset + (sizes.width - (this.slotSpacing * (this.numSlots - 1))) / 2  // Center slots
    private slotY = sizes.height - 200  // Position near bottom
    // Create the starting hand
    create_card_slots(shuffled_deck: Stack<Card>): void {

        // Clear existing card slots and cards
        this.card_slots = []
        
        for (let i = 0; i < this.numSlots; i++) {
            const x = this.startX + i * this.slotSpacing
            const y = this.slotY

            // Optional: Add a visual representation of the slots
            const slot = this.add.rectangle(x, y, 100, 150, 0xffffff, 0.3)
            slot.setStrokeStyle(2, 0x000000)  // Outline
            slot.setScale(1.06)
            this.card_slots.push({ x, y })  // Adding the position

            // Adding cards to slots
            if(!is_empty(shuffled_deck)){
                let card = top(shuffled_deck)
                const cardImage = this.add.image(x, y, card.id).setOrigin(0.5, 0.5)
                cardImage.setScale(3)  // Card size
                shuffled_deck = pop(shuffled_deck);
            }
            
        }
    }
    

    create_hand_buttons(): void {
        for (let i = 0; i < this.numSlots; i++) {
            const x = this.startX + i * this.slotSpacing
            const y = this.slotY

            if (i == 2){
                const cardImage = this.add.image(x + 35, y + 150, "play_hand_button")
                cardImage.setScale(0.5)
            }else if (i == 4){
                const cardImage = this.add.image(x - 35, y + 150, "discard_button")
                cardImage.setScale(0.5)
            }
        }
    }
}