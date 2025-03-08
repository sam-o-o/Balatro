export const scene_keys = {
    title: 'title',
    preload: 'preload',
    gameboard: 'gameboard',
    shop: 'shop'
} as const

export const sizes = {
    width: 1400,
    height: 900,
    left_width: 300,
    card_width: 115,
    card_height: 115 * 1.405405405
} as const

let id: number = 1
export function create_card(image: string,
                            value: number,
                            suit: Suit,
                            chip: number,
                            mult: number):Card {

    return {image: image,
        id: get_id(),
        value: value,
        suit: suit,
        chip: chip,
        mult: mult,}
}

function get_id(): number {
    return id++
}

export enum Suit {
    hearts,
    spades,
    diamonds,
    clubs
}

export function get_card_image_name(suit: Suit, value: number): string {
    return `${suit.toString()}_${value}`
}

export type Card = {
    image: string,
    id: number,
    value: number,
    suit: Suit,
    chip: number,
    mult: number,
}

export type Joker = {
    id: number
    image: string
    price: number
    description: string
}

export type CardSlot = {
    card: Card | null,
    selected: boolean,
    disabled: boolean,
    x: number,
    y: number
}

export const base_chip_req: Array<number> = [
    10, // 0
    100, // 1
    300, // 2
    800, // 3
    2000, // 4
    5000, // 5
    11000, // 6
    20000, // 7
    35000, // 8
] as const

export let deck: Array<Card> = []