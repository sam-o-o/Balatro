export const scene_keys = {
    title: 'title',
    preload: 'preload',
    gameboard: 'gameboard',
} as const

export const sizes = {
    width: 1400,
    height: 900,
    left_width: 300,
} as const

export type Card = {
    id: string
    value: integer
    suit: string
}

export let deck: Array<Card> = [];