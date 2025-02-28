import { empty, push, top, pop, Stack, NonEmptyStack, is_empty } from './stack.ts'
import { scene_keys, sizes, deck, Card } from '../scenes/common'
    
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
    switch(arr.length) {
        case 1: {

            break
        }

        case 2: {

            break
        }

        case 3: {

            break
        }

        case 4: {

            break
        }

        case 5: {
            
            break
        }
    }
}