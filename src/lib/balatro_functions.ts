import Phaser from 'phaser'
import { empty, push, top, pop, Stack, NonEmptyStack, is_empty } from './stack'
import { scene_keys, sizes, deck, Card } from '../scenes/common'
    
let card_slots: Array<{ x: number; y: number }> = []

const numSlots = 7  // Number of slots
const panel_width = 350
const slotSpacing = 110  // Space between slots
const left_side_offset = 30
const startX = left_side_offset * 2 + panel_width + sizes.card_width / 2 // Center slots
const slotY = sizes.height - 200  // Position near bottom

/**
 * Takes a deck and shuffles it
 * @example
 * @param {Array} arr - Array of cards
 * @returns {Stack} a stack of cards
 */
export function shuffle_cards(arr: Array<Card>): Stack<Card> {
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

/**
 * 
 * @param arr 
 */

export function calculate_hand(arr: Array<Card> ): Array<number> {
    const poker_hand: string = get_poker_hand(arr); 
    let chip_five_cards: number = arr.reduce((sum, card) => {return sum + card.chip}, 0)
    let mult_five_cards: number = arr.reduce((sum, card) => {return sum + card.mult}, 0)

    const values: Array<number> = arr.map(card => card.value).sort((a, b) => a - b);
    const valueCounts: Record<number, number> = values.reduce((acc, v) => ((acc[v] = (acc[v] || 0) + 1), acc), {} as Record<number, number>);

    if (poker_hand === "royal flush" || "straight flush") {
        return [100 + chip_five_cards, 8 + mult_five_cards]
    } else if (poker_hand === "four of a kind") {
        let value = Number(Object.keys(valueCounts)[values.indexOf(4)])
        let chip_tot: number = 0, mult_tot: number = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value === value) {
                chip_tot += arr[i].chip 
                mult_tot += arr[i].mult
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
                chip_tot += arr[i].chip 
                mult_tot += arr[i].mult
            }
        }
        return [chip_tot + 30, mult_tot + 3]
    } else if (poker_hand === "two pair") {

    } else if (poker_hand === "pair") {
        let value = Number(Object.keys(valueCounts)[values.indexOf(2)])
        let chip_tot: number = 0, mult_tot: number = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value === value) {
                chip_tot += arr[i].chip 
                mult_tot += arr[i].mult
            }
        }
        return [chip_tot + 10, mult_tot + 2]
    } else {
        return [arr[0].chip + 5, arr[0].mult + 1]
    }
}

export function get_poker_hand(cards: Array<Card>): string {
    if (cards.length === 1) return "high card";
  
    const values: Array<number> = cards.map(card => card.value).sort((a, b) => a - b);
    const suits: Array<string> = cards.map(card => card.suit);

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

  const hand: Array<Card> = [
    { id: "1", value: 10, suit: "hearts" },
    { id: "2", value: 11, suit: "hearts" },
    { id: "3", value: 12, suit: "hearts" },
    { id: "4", value: 13, suit: "hearts" },
    { id: "5", value: 14, suit: "hearts" }
  ];
  
  console.log(get_poker_hand(hand)); // "Royal Flush"
  
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