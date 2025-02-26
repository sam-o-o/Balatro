import Phaser from 'phaser'
import { scene_keys, sizes } from './common'

type Card = {
    image: Phaser.GameObjects.Image
    id: string
    value: string
    suit: string
}

export class GameScene extends Phaser.Scene {
    private cards: Card[] = []
    private cardSlots: { x: number; y: number }[] = []

    constructor() {
        super({ key: scene_keys.gameboard })
    }

    create() {
        const bg = this.add.image(0, 0, "bg").setOrigin(0, 0)
        bg.setDisplaySize(sizes.width, sizes.height)

        this.create_card_slots()
    }

    // Create the starting hand
    create_card_slots() {
        const numSlots = 7  // Number of slots
        const slotSpacing = 110  // Space between slots
        const startX = (sizes.width - (slotSpacing * (numSlots - 1))) / 2  // Center slots
        const slotY = sizes.height - 80  // Position near bottom

        // Clear existing card slots and cards
        this.cardSlots = []
        this.cards = []

        for (let i = 0; i < numSlots; i++) {
            const x = startX + i * slotSpacing
            const y = slotY

            // Optional: Add a visual representation of the slots
            const slot = this.add.rectangle(x, y, 100, 150, 0xffffff, 0.3)
            slot.setStrokeStyle(2, 0x000000)  // Outline
            this.cardSlots.push({ x, y })  // Adding the position

            // Adding cards to slots
            const cardImage = this.add.image(x, y, "card_hearts_10").setOrigin(0.5, 0.5)
            cardImage.setScale(3)  // Card size

            // Create a Card object and push it to the `cards` array
            const card: Card = {
                image: cardImage,
                id: `card_${i}`,  // Can be changed for unique identifiers
                value: "8",  // Example value, can be dynamically set
                suit: "Clubs",  // Example suit, can be dynamically set
            }

            this.cards.push(card)
        }
    }
}