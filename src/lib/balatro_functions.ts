import Phaser from 'phaser'
import { empty, push, top, pop, Stack, NonEmptyStack, is_empty } from './stack.ts'
import { scene_keys, sizes, deck, Card } from '../scenes/common'
    
let card_slots: Array<{ x: number; y: number }> = []

const numSlots: number = 7 // Number of slots
const panel_width: number = 350
const slotSpacing: number = 110  // Space between slots
const left_side_offset: number = 40
const startX: number = left_side_offset * 2 + panel_width + sizes.card_width / 2 // Center slots
const slotY: number = sizes.height - 200  // Position near bottom
let blind_specific_color: number = 0x1445cc

//Shuffles your deck
export function shuffle_cards(arr: Array<Card>): Stack<Card> {
    // Create a copy of the array to preserve the original
    let shuffledArray = [...arr]; 
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }

    // Convert the shuffled array to a stack and return it
    let stack: Stack<Card> = empty<Card>();
    shuffledArray.forEach(card => {
        stack = push(card, stack);
    });

    return stack;
}

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
            const hand = [] 
            hand.push(top(stack))
            const card = scene.add.image(x, y, top(stack).id)
            stack = pop(stack)
            card.setScale(3)
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
    // Draw background
    const panel = scene.add.rectangle(left_side_offset, 0, panel_width, sizes.height, 0x25272e, 0.9).setOrigin(0, 0)
    panel.setStrokeStyle(3, blind_specific_color)  // Outline

    // Draw textbox for blind text
    const blind_textbox = scene.add.graphics()

    // Draw at a small resolution (low-res size)
    blind_textbox.fillStyle(blind_specific_color, 1)
    blind_textbox.lineStyle(1.3, 0x000000)

    // Draw the inner rectangle with rounded corners
    blind_textbox.fillRoundedRect(0, 0, 32, 16, 4) // Inner rounded rect
    blind_textbox.strokeRoundedRect(0, 0, 32, 16, 4) // Border

    // Convert to texture and destroy original graphics
    blind_textbox.generateTexture("pixel-rounded-text-box", 32, 16)
    blind_textbox.destroy()

    // Add the pixelated texture to the scene, scaled up for pixel effect
    scene.add.image(left_side_offset + 10, 100, "pixel-rounded-text-box")
        .setScale((panel_width - 20) / 32, 60 / 16) // Scale to match desired size
        .setOrigin(0, 0) // Set origin to top-left corner

    // Draw level display box
    const level_box = scene.add.graphics()

    level_box.fillStyle(blind_specific_color, 0.5)
    level_box.lineStyle(1.3, 0x000000)

    level_box.fillRoundedRect(0, 0, 32, 32, 4)
    level_box.strokeRoundedRect(0, 0, 32, 32, 4)

    level_box.generateTexture("pixel-rounded-box", 32, 32)
    level_box.destroy()

    scene.add.image(left_side_offset + 10, 156, "pixel-rounded-box")
        .setScale((panel_width - 20) / 32, 60 / 16)
        .setOrigin(0, 0)

}