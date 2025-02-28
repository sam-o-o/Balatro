import { empty, push, top, pop, Stack, NonEmptyStack, is_empty } from './stack.ts'
import { scene_keys, sizes, deck, Card } from '../scenes/common'
    
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