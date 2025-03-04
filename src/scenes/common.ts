export const scene_keys = {
    title: 'title',
    preload: 'preload',
    gameboard: 'gameboard',
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
                            value: integer,
                            suit: Suit,
                            chip_flat: number,
                            chip_factor: number,
                            mult_flat: number,
                            mult_factor: number):Card {

    return {image: image,
        id: get_id(),
        value: value,
        suit: suit,
        chip_flat: chip_flat,
        chip_factor: chip_factor,
        mult_flat: mult_flat,
        mult_factor: mult_factor}
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
    id: integer,
    value: integer,
    suit: Suit,
    chip_flat: number,
    chip_factor: number,
    mult_flat: number,
    mult_factor: number,
    
}

export type CardSlot = {
    card: Card | null,
    selected: boolean,
    disabled: boolean,
    x: integer,
    y: integer
}

export let deck: Array<Card> = [];