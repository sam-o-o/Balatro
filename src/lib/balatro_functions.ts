import Phaser from 'phaser'
import { empty, push, top, pop, Stack, NonEmptyStack, is_empty } from './stack'
import { scene_keys, sizes, deck, Card, Suit } from '../scenes/common'
    
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

/**
 * 
 * @param arr 
 */

export function calculate_hand(arr: Array<Card> ): Array<number> {
    const poker_hand: string = get_poker_hand(arr); 
    let chip_five_cards: number = arr.reduce((sum, card) => {return sum + card.chip_flat}, 0)
    let mult_five_cards: number = arr.reduce((sum, card) => {return sum + card.mult_flat}, 0)

    const values: Array<number> = arr.map(card => card.value).sort((a, b) => a - b);
    const valueCounts: Record<number, number> = values.reduce((acc, v) => ((acc[v] = (acc[v] || 0) + 1), acc), {} as Record<number, number>);

    if (poker_hand === "royal flush" || "straight flush") {
        return [100 + chip_five_cards, 8 + mult_five_cards]
    } else if (poker_hand === "four of a kind") {
        let value = Number(Object.keys(valueCounts)[values.indexOf(4)])
        let chip_tot: number = 0, mult_tot: number = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value === value) {
                chip_tot += arr[i].chip_flat 
                mult_tot += arr[i].mult_flat
            }
        }
        return [chip_tot + 60, mult_tot + 7]
    } else if (poker_hand === "full house") {
        return [40 + chip_five_cards, 4 + mult_five_cards]
    } else if (poker_hand === "flush") {
        return [35 + chip_five_cards, 4 + mult_five_cards]
    } else if (poker_hand === "straight") {
        return [30 + chip_five_cards, 4 + mult_five_cards]
    } else if (poker_hand === "three of a kind") {
        let value = Number(Object.keys(valueCounts)[values.indexOf(3)])
        let chip_tot: number = 0, mult_tot: number = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value === value) {
                chip_tot += arr[i].chip_flat 
                mult_tot += arr[i].mult_flat
            }
        }
        return [chip_tot + 30, mult_tot + 3]
    } else if (poker_hand === "two pair") {
        return []
    } else if (poker_hand === "pair") {
        let value = Number(Object.keys(valueCounts)[values.indexOf(2)])
        let chip_tot: number = 0, mult_tot: number = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value === value) {
                chip_tot += arr[i].chip_flat 
                mult_tot += arr[i].mult_flat
            }
        }
        return [chip_tot + 10, mult_tot + 2]
    } else {
        return [arr[0].chip_flat + 5, arr[0].mult_flat + 1]
    }
}

export function get_poker_hand(cards: Array<Card>): string {
    if (cards.length === 1) return "high card";
  
    const values: Array<number> = cards.map(card => card.value).sort((a, b) => a - b);
    const suits: Array<Suit> = cards.map(card => card.suit);

    const valueCounts: Record<number, number> = values.reduce((acc, v) => ((acc[v] = (acc[v] || 0) + 1), acc), {} as Record<number, number>);
    const counts: Array<number> = Object.values(valueCounts).sort((a, b) => b - a);
    
    const isFlush: boolean = cards.length === 5 && new Set(suits).size === 1;
    const isStraight: boolean = cards.length === 5 && (values.every((v, i) => i === 0 || v === values[i - 1] + 1));
  
    // Determine the hand type based on the above conditions
    if (isStraight && isFlush) return values[0] === 10 ? "royal flush" : "straight flush";
    if (counts[0] === 4) return "four of a kind";
    if (counts[0] === 3 && counts[1] === 2) return "full house";
    if (isFlush) return "flush";
    if (isStraight) return "straight";
    if (counts[0] === 3) return "three of a kind";
    if (counts[0] === 2 && counts[1] === 2) return "two pair";
    if (counts[0] === 2) return "pair";
  
    return "high card"; // If no other hand type is matched
  }

//Takes a deck (Array<cards>), shuffles the order of the cards and returns them as a stack.
export function create_card_slots(scene: Phaser.Scene): void {

    // Clear existing card slots and cards
    card_slots = []
    let stack  = shuffle_cards(deck)

    for (let i = 0; i < numSlots; i++) {
        const x = startX + i * slotSpacing
        const y = slotY

        // Optional: Add a visual representation of the slots
        const slot = scene.add.rectangle(x, y, sizes.card_width, sizes.card_height, 0xffffff, 0.3)
        slot.setStrokeStyle(2, 0x000000)  // Outline
        card_slots.push({ x, y })  // Adding the position

        

        if(!is_empty(stack)) {
            const card: Card = top(stack)
            const card_display = scene.add.image(x, y, card.image)
            card_display.setInteractive()
            card_display.on('pointerdown', function() {
                card_display.setPosition(card_display.x, card_display.y - 50)
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

    const level_box_height = 45
    const level_box = scene.add.graphics()

    level_box.fillStyle(blind_specific_color, 0.5)
    level_box.lineStyle(1.3, 0x000000)

    level_box.fillRoundedRect(0, 0, 32, level_box_height, 4)
    level_box.strokeRoundedRect(0, 0, 32, level_box_height, 4)

    level_box.generateTexture("pixel-rounded-box", 32, level_box_height)
    level_box.destroy()

    scene.add.image(left_side_offset + 10, 156, "pixel-rounded-box")
        .setScale((panel_width - 20) / 32, 60 / 16)
        .setOrigin(0, 0)

}