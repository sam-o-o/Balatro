export const scene_keys = {
    title: 'title',
    preload: 'preload',
    gameboard: 'gameboard',
} as const

export const sizes = {
    width: 1400,
    height: 900,
    left_width: 300,
    card_height: 159,
    card_width: 106
} as const

export type Card = {
    image: string,
    id: number,
    value: integer,
    suit: string,
    chip_flat: number,
    chip_factor: number,
    mult_flat: number,
    mult_factor: number

}

export let deck: Array<Card> = [];

export let hand: Array<Card> = [
    { id: "1", value: 10, suit: "hearts" },
    { id: "2", value: 11, suit: "hearts" },
    { id: "3", value: 12, suit: "hearts" },
    { id: "4", value: 13, suit: "hearts" },
    { id: "5", value: 14, suit: "hearts" }
  ];