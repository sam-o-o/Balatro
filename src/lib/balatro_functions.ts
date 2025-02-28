import Phaser from 'phaser'
import { empty, push, top, pop, Stack, NonEmptyStack, is_empty } from './stack.ts'
import { scene_keys, sizes, deck, Card } from '../scenes/common'
    
let card_slots: Array<{ x: number; y: number }> = []

const numSlots = 7  // Number of slots
const panel_width = 350
const slotSpacing = 110  // Space between slots
const left_side_offset = 30
const startX = left_side_offset * 2 + panel_width + sizes.card_width / 2 // Center slots
const slotY = sizes.height - 200  // Position near bottom



//Shuffles your deck
export function shuffle_cards(arr: Card[]): Stack<Card> {
    const takencards: Array<number> = []
    let stack: Stack<Card> = empty<Card>()

    while (takencards.length !== deck.length) {
        let card = Math.floor(Math.random() * (deck.length))
        if (!takencards.includes(card)) {
            takencards.push(card);
            stack = push(arr[card], stack)
        }
    }
    return stack;
}
//Takes a deck (Array<cards>), shuffles the order of the cards and returns them as a stack.
export function create_card_slots(scene: Phaser.Scene): void {

    // Clear existing card slots and cards
    card_slots = []
    
    for (let i = 0; i < numSlots; i++) {
        const x = startX + i * slotSpacing
        const y = slotY

        // Optional: Add a visual representation of the slots
        const slot = scene.add.rectangle(x, y, sizes.card_width, sizes.card_height, 0xffffff, 0.3)
        slot.setStrokeStyle(2, 0x000000)  // Outline
        card_slots.push({ x, y })  // Adding the position

        let stack  = shuffle_cards(deck)

        if(!is_empty(stack)) {
            const card = top(stack)
            const card_display = scene.add.image(x, y, card.image)
            card_display.setInteractive()
            card_display.on('pointerdown', function() {
                console.log(card.id)
            })
            stack = pop(stack)
            card_display.setScale(3)
        }
    }
}

export function create_hand_buttons(scene: Phaser.Scene): void {
    for (let i = 0; i < numSlots; i++) {
        const x = startX + i * slotSpacing
        const y = slotY

        if (i == 2){
            const cardImage = scene.add.image(x + 35, y + 150, "play_hand_button")
            cardImage.setScale(0.5)
        }else if (i == 4){
            const cardImage = scene.add.image(x - 35, y + 150, "discard_button")
            cardImage.setScale(0.5)
        }
    }
}

export function create_left_panel(scene: Phaser.Scene) {
    const panel = scene.add.rectangle(left_side_offset, 0, panel_width, sizes.height, 0x000000, 0.9).setOrigin(0, 0)
    panel.setStrokeStyle(2, 0x000000)  // Outline
}