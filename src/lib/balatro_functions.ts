import Phaser from 'phaser'
import { empty, push, top, pop, Stack, is_empty, stack_count } from './stack'
import { sizes, deck, Card, Suit, CardSlot, scene_keys, base_chip_req, Joker } from '../scenes/common'
    
export let joker_deck: Array<Joker | null> = []

let card_slots: Array<CardSlot> = []
let played_card_slots: Array<CardSlot> = []
let shop_card_slots: Array<CardSlot> = []
let result_of_hand: Array<number> = []
let current_jokers: Array<Joker> = []

let deck_stack: Stack<Card>
let joker_deck_stack: Stack<Joker>

//For visuals
const num_slots: number = 7 // Number of slots
const panel_width: number = 330
const slotSpacing: number = 120  // Space between slots
const left_side_offset: number = 25
const startX: number = left_side_offset * 2 + panel_width + sizes.card_width / 2 // Center slots
const slotY: number = sizes.height - 200  // Position near bottom
let blind_specific_color: number = 0x1445cc

//Starting values
let discard_counter: number = 4, play_counter: number = 4
let poker_hand: string, score: number = 0
let required_score: number = base_chip_req[1], round: number = 1, ante: number = 1
let money: number = 0, extra_blind: number = 1
let is_boss_7: boolean = false, type_boss: string, blind: string = "Small Blind"
let own_joker_1: boolean = false

//Text for left panel
let hand_counter: Phaser.GameObjects.Text, discard: Phaser.GameObjects.Text
let chips: Phaser.GameObjects.Text, mult: Phaser.GameObjects.Text
let type_of_hand: Phaser.GameObjects.Text, score_text: Phaser.GameObjects.Text
let round_text: Phaser.GameObjects.Text, money_text: Phaser.GameObjects.Text
let ante_text: Phaser.GameObjects.Text
let required_score_text: Phaser.GameObjects.Text
let deck_total_text: Phaser.GameObjects.Text
let blind_text: Phaser.GameObjects.Text

const poker_hands = {
    royal_flush: "Royal Flush",
    straight_flush: "Straight Flush",
    four_of_a_kind: "Four of a Kind",
    full_house: "Full House",
    flush: "Flush",
    straight: "Straight",
    three_of_a_kind: "Three of a Kind",
    two_pair: "Two Pair",
    pair: "Pair",
    high_card: "High Card"
} as const

//Create functions, creates the visuals

/**
 * Creates visual slots for jokers
 * and adds jokers to the slots
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
export function create_joker_slots(scene: Phaser.Scene): void {
    for (let i = 0; i < 5; i++) {
        const x = startX + 30 + i * slotSpacing
        const y = 150
        let card_slot: CardSlot = {
            card: null,
            selected: false,
            disabled: false,
            x: x,
            y: y
        }

        const slot = scene.add.rectangle(card_slot.x, card_slot.y, sizes.card_width, sizes.card_height, 0xffffff, 0.3)
        slot.setStrokeStyle(2, 0x000000)  // Outline
        shop_card_slots.push(card_slot)  // Adding the position

        let joker = scene.add.image(card_slot.x, card_slot.y, current_jokers[i]?.image)
        joker.setDisplaySize(sizes.card_width, sizes.card_height)
        joker.setInteractive()
    
        joker.on("pointerover", () => {
            joker.setAlpha(0.95)
            let desc = scene.add.image(1200, 150, current_jokers[i].description)
            desc.setScale(1.1)
        })
    
        joker.on("pointerout", () => {
            joker.setAlpha(1)
            destroy_images_by_key(current_jokers[i], true, scene)
        })
    }
}

/**
 * Creates the shop visual scene, and next round
 * button
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
export function create_shop(scene: Phaser.Scene): void {
    let next_round_button = scene.add.image(927, 705, "next_round_button")
    next_round_button.setScale(1.2)
    next_round_button.setInteractive()
    next_round_button.on("pointerdown", () => {
        scene.scene.start(scene_keys.gameboard)
    })

    let shop_image = scene.add.image(580, sizes.height, "shop").setOrigin(0, 1)
    shop_image.setScale(1.2)

    joker_deck_stack = shuffle_cards(joker_deck as Array<Joker>, round) as Stack<Joker>

    let desc_x: number = 825
    let desc_y: number = 288

    for (let i = 0; i < 2; i++) {
        const x = 735 + i * (slotSpacing + 70)
        const y = 510
        let card_slot: CardSlot = {
            card: null,
            selected: false,
            disabled: false,
            x: x,
            y: y
        }

        const slot = scene.add.rectangle(card_slot.x, card_slot.y, sizes.card_width, sizes.card_height, 0xffffff, 0.3)
        slot.setStrokeStyle(2, 0x000000)  // Outline
        shop_card_slots.push(card_slot)  // Adding the position

        if(is_empty(joker_deck_stack))
            return
        let joker = top(joker_deck_stack)

        let joker_image = scene.add.image(card_slot.x, card_slot.y, joker.image)
        joker_image.setDisplaySize(sizes.card_width, sizes.card_height)
        joker_image.setInteractive()

        let price_text = scene.add.text(card_slot.x - 50, card_slot.y + 45, "$" + joker.price.toString(), {
            fontSize: "30px",
            color: "#000000",
            fontStyle: "bold"
        })

        joker_image.on("pointerover", () => {
            joker_image.setAlpha(0.8)
            scene.add.image(desc_x, desc_y, joker.description)
        })

        joker_image.on("pointerout", () => {
            joker_image.setAlpha(1)
            destroy_images_by_key(joker, true, scene)
        })

        joker_image.on("pointerdown", () => {
            if(money >= joker.price) {
                buy_joker(scene, joker)
                price_text.destroy()
            }
        })

        joker_deck_stack = pop(joker_deck_stack)
    }

    const x = 720
    const y = 760
    let card_slot: CardSlot = {
        card: null,
        selected: false,
        disabled: false,
        x: x,
        y: y
    }

    const slot = scene.add.rectangle(card_slot.x, card_slot.y, sizes.card_width, sizes.card_height, 0xffffff, 0.3)
    slot.setStrokeStyle(2, 0x000000)  // Outline
    shop_card_slots.push(card_slot)  // Adding the position
}

/**
 * Creates the deck at the bottom right corner
 * @param {Phaser.Scene} scene - The scene the function is used in  
 */
export function create_deck_slot(scene: Phaser.Scene): void {
    const deck_image = scene.add.image(sizes.width - 100, card_slots[0].y + 30, "card_bg")
    deck_image.setDisplaySize(sizes.card_width, sizes.card_height)

    deck_total_text = scene.add.text(sizes.width - 100, 
                                           card_slots[0].y + 130,
                                           stack_count(deck_stack).toString() + "/" + deck.length.toString(), {
        fontSize: "25px"
    }).setOrigin(0.5, 0.5)
}

/**
 * Makes seven card slots and puts cards in them
 * @param {Phaser.Scene} scene - The scene the function is used in 
 */
export function create_played_hand_slots(scene: Phaser.Scene): void {
    for (let i = 0; i < 5; i++) {
        const x = startX + i * 130 + 100
        const y = sizes.height / 2
        let played_slot: CardSlot = {
            card: null,
            selected: false,
            disabled: false,
            x: x,
            y: y
        }

        const slot = scene.add.rectangle(played_slot.x, played_slot.y, sizes.card_width, sizes.card_height, 0xffffff, 0.3)
        slot.setStrokeStyle(2, 0x000000)  // Outline
        played_card_slots.push(played_slot)  // Adding the position
    }
}

/**
 * Creates the seven card slots, visually and the type CardSlot
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
export function create_card_slots(scene: Phaser.Scene): void {

    deck_stack  = shuffle_cards(deck, round) as Stack<Card>

    for (let i = 0; i < num_slots; i++) {
        const x = startX + i * slotSpacing
        const y = slotY
        let card_slot: CardSlot = {
            card: null,
            selected: false,
            disabled: false,
            x: x,
            y: y
        }

        // Optional: Add a visual representation of the slots
        const slot = scene.add.rectangle(card_slot.x, card_slot.y, sizes.card_width, sizes.card_height, 0xffffff, 0.3)
        slot.setStrokeStyle(2, 0x000000)  // Outline
        card_slots.push(card_slot)  // Adding the position
    }

    scene.time.delayedCall(300, () => {
        draw_cards(scene)
    })
}

/**
 * Creates the two buttons "Play hand" and "Discard"
 * @param {Phaser.Scene} scene - The scene the function is used in  
 */
export function create_hand_buttons(scene: Phaser.Scene): void {
    let hand_button_image: Phaser.GameObjects.Image
    let discard_button_image: Phaser.GameObjects.Image

    const x = startX + 3 * slotSpacing
    const y = slotY + 140
    const space_between_buttons: number = 80

    // Play hand button
    hand_button_image = scene.add.image(x - space_between_buttons, y , "play_hand_button")
    hand_button_image.setScale(0.5)
    hand_button_image.setInteractive()
    hand_button_image.on("pointerdown", function() {
        if (get_num_selected_slots() > 0) {
            if(is_boss_7 && get_num_selected_slots() !== 5)
                return

            if (play_counter > 0) {
                play_counter--
                play_cards(scene)
                scene.time.delayedCall(2000, () => {
                    draw_cards(scene)
                    clear_played_hand(scene)
                    check_if_beaten_round(scene)
                })
            }
        }
    })
    hand_button_image.on("pointerover", () => {
        hand_button_image.setAlpha(0.8)
    })

    hand_button_image.on("pointerout", () => {
        hand_button_image.setAlpha(1)
    })

    // Discard button
    discard_button_image = scene.add.image(x + space_between_buttons, y, "discard_button")
    discard_button_image.setScale(0.5)
    discard_button_image.setInteractive()
    discard_button_image.on("pointerdown", function() {
        if (get_num_selected_slots() > 0) {
            if(discard_counter > 0) {
                discard_counter--
                update_left_panel()
                discard_cards(scene)
                scene.time.delayedCall(100, () => {
                    draw_cards(scene)
                })

            }
        }
    })

    discard_button_image.on("pointerover", () => {
        discard_button_image.setAlpha(0.8)
    })

    discard_button_image.on("pointerout", () => {
        discard_button_image.setAlpha(1)
    })
}

/**
 * Creates the left panel and the text in it
 * @param {Phaser.Scene} scene - The scene the function is used in  
 */
export function create_left_panel(scene: Phaser.Scene): void {
    const panel = scene.add.rectangle(left_side_offset, 0, panel_width, sizes.height, 0x25272e, 0.9).setOrigin(0, 0)

    const left_panel = scene.add.image(left_side_offset, 0, "left_panel").setOrigin(0, 0)
    left_panel.setDisplaySize(panel_width, sizes.height)
    // Draw background
    panel.setStrokeStyle(10, blind_specific_color)  // Outline

    const button = scene.add.image(52, 593.5, "info_button").setOrigin(0, 0)
    button.setScale(0.97)
    button.setInteractive()
    button.on("pointerdown", () => {
        const info = scene.add.image(700, 450, "info_card")
        const cross = scene.add.image(1130, 20, "cross").setOrigin(0, 0)
        cross.setScale(0.5)
        cross.setInteractive()
        cross.on("pointerdown", () => {
            info.destroy()
            cross.destroy()
        })
    })
    hand_counter = scene.add.text(100, 510, play_counter.toString(), {
        fontSize: "50px"
    })

    discard = scene.add.text(250, 510, discard_counter.toString(), {
        fontSize: "50px"
    })

    chips = scene.add.text(115, 407, "0", {
        fontSize: "50px"
    }).setOrigin(0.5, 1)

    mult = scene.add.text(220, 362, "0", {
        fontSize: "50px"
    })

    type_of_hand = scene.add.text(left_side_offset + panel_width / 2, 320, "", {
        fontSize: "30px"
        
    }).setOrigin(0.5, 0.5)

    score_text = scene.add.text(190, 240, score.toString(), {
        fontSize: "30px"
    })

    round_text = scene.add.text(265, 820, round.toString(), {
        fontSize: "50px"
    }).setOrigin(0.5, 0.5)

    ante_text = scene.add.text(115, 820, ante.toString() + "/8", {
        fontSize: "40px"
    }).setOrigin(0.5, 0.5)

    money_text = scene.add.text(265, 660, "$" + money.toString(), {
        fontSize: "50px"    
    }).setOrigin(0.5, 0.5)

    required_score_text = scene.add.text(180, 155, required_score.toString(), {
        fontSize: "40px"    
    })

    scene.add.text(190, 110, type_boss, {
        fontSize: "23px"
    }).setOrigin(0.5, 0.5) 
    
    blind_text = scene.add.text(180, 50, blind, {
        fontSize: "30px"
    }).setOrigin(0.5, 0.5) 

    scene.add.text(60, 155, "Required \n score:", {
        fontSize: "20px"
    })
}

//Updates the visuals

/**
 * Updated the ammount of cards not played
 * visable in the bottom right corner
 */
function update_deck_count(): void {
    deck_total_text.setText(stack_count(deck_stack).toString() + "/" + deck.length.toString())
}

/**
 * Updates information in the left panel
 */
export function update_left_panel() {
    hand_counter.setText(play_counter.toString())
    discard.setText(discard_counter.toString())
    score_text.setText(score.toString())
    round_text.setText(round.toString())
    money_text.setText("$" + money.toString())
    required_score_text.setText(required_score.toString())
    ante_text.setText(ante.toString() + "/8")

    blind_text.setText(blind)

    if (result_of_hand.length === 2) {
        if(result_of_hand[0] > 99)
            chips.setFontSize("40px")
        else
            chips.setFontSize("50px")
        chips.setText(result_of_hand[0].toString())
        mult.setText(result_of_hand[1].toString())
        type_of_hand.setText(poker_hand)
    }
}

//Modifies the visuals

/** 
* Takes the name associated with a preloaded audio file + scene, and plays the sound file
* @param {string} audio_name
* @precondition Sound file MUST be preloaded before calling function
* @param {Phaser.Scene} scene - The scene the function is used in 
*/
export function play_sound(audio_name: string, scene: Phaser.Scene) {
    const sound = scene.sound.add(audio_name)
             sound.play()
}

/**
 * Buys a joker from the store
 * @param {Phaser.Scene} scene - The scene the function is used in
 * @param {Joker} joker - The joker being bought
 */
function buy_joker(scene: Phaser.Scene, joker: Joker): void {
    current_jokers.push(joker)
    destroy_images_by_key(joker, false, scene)
    destroy_images_by_key(joker, true, scene)
    money -= joker.price
    update_left_panel()

    switch(joker.id){
        case 1: {
            own_joker_1 = true
            break
        }
        case 2: {
            deck.forEach(card => {
                if(card.suit === Suit.diamonds) 
                    card.mult += 4
            })
            break
        }
        case 3: {
            deck.forEach(card => {
                if(card.suit === Suit.hearts) 
                    card.mult += 4
            })
            break
        }
        case 4: {
            deck.forEach(card => {
                if(card.suit === Suit.spades) 
                    card.mult += 4
            })
            break
        }
        case 5: {
            deck.forEach(card => {
                if(card.suit === Suit.clubs) 
                    card.mult += 4
            })
            break
        }
    }
    joker_deck = arr_remove(joker_deck, joker)
}

/**
 * For every empty card slots draws equal ammount
 * of cards and puts the in your hand
 * @param {Phaser.Scene} scene - The scene the function is used in   
 */
function draw_cards(scene: Phaser.Scene): void {
    for(let i = 0; i < num_slots; i++) {
        if(card_slots[i].card == null) {
            if(is_empty(deck_stack))
                return
            const card_slot: CardSlot = card_slots[i]
            const card: Card = top(deck_stack)
            deck_stack = pop(deck_stack)
            
            card_slot.card = card
        }
    }       
    card_slots = sort_card_slot_card(card_slots)
    clear_hand(scene)
    for (let i = 0; i < num_slots; i++) {
        const card_slot: CardSlot = card_slots[i]

        const card_display = scene.add.image(card_slot.x, card_slot.y, card_slot.card!.image)
        card_display.setDisplaySize(sizes.card_width, sizes.card_height)
        card_display.setInteractive()

        card_display.on('pointerdown', () => {
            let numSelectedSlots : number = get_num_selected_slots()

            if(!card_slot.selected) {
                if(numSelectedSlots < 5){
                    card_display.setPosition(card_slot.x, card_slot.y - 30)
                    card_slot.selected = true
                    play_sound("select_card", scene)
                }
            }
            else {
                card_display.setPosition(card_slot.x, card_slot.y)
                card_slot.selected = false
                play_sound("deselect_card", scene)
            }
        })

        card_display.on("pointerover", () => {
            card_display.setAlpha(0.8)
        })

        card_display.on('pointerout', () => {
            card_display.setAlpha(1);
        });
    }
            
    update_deck_count()
    play_sound("draw_cards", scene)
}

/**
 * Clears the hand of all cards
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
function clear_hand(scene: Phaser.Scene): void {
    for(let i = 0; i < num_slots; i++) {
        destroy_images_by_key(card_slots[i].card, false, scene)
    }
}

/**
 * Plays the cards selected and calculates it's score
 * and updates left panel with correct information
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
function play_cards(scene: Phaser.Scene): void {
    let arr: Array<Card> = []
    for(let i = 0; i < num_slots; i++) {
        if(card_slots[i].selected) {
            arr.push(card_slots[i].card as Card)
            remove_card(scene, card_slots[i])
        }
    }
    result_of_hand = calculate_hand(arr)
    if(own_joker_1) {
        result_of_hand = [result_of_hand[0], result_of_hand[1] + 4]
    }

    update_left_panel()
    score += result_of_hand[0] * result_of_hand[1]
    add_cards_to_played_hand(scene, arr)
}

/**
 * Moves the played card into the played hand slots
 * @param {Phaser.Scene} scene - The scene the function is used in
 * @param {Array} cards - An array of the cards that should be moved 
 */
function add_cards_to_played_hand(scene: Phaser.Scene, cards: Array<Card>): void {
    for(let i = 0; i < cards.length; i++) {

        played_card_slots[i].card = cards[i]

        const card_display = scene.add.image(
            played_card_slots[i].x,
            played_card_slots[i].y,
            cards[i].image
        )
        card_display.setDisplaySize(sizes.card_width, sizes.card_height)
    }
}

/**
 * Clears the played hand slots of cards
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
function clear_played_hand(scene: Phaser.Scene): void {
    for(let i = 0; i < played_card_slots.length; i++) {
        if(played_card_slots[i].card !== null){
            remove_card(scene, played_card_slots[i])
        }
    }
}

/**
 * If the required score is met or if the player has run out of hands
 * gives the appropriate result. Such as moving on to next round, 
 * winning or losing.
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
function check_if_beaten_round(scene: Phaser.Scene): void {
    result_of_hand = [0, 0];
    poker_hand = "";
    update_left_panel()
    if (score >= required_score) {
        if(round === 24) {
            scene.add.image(700, 450, "won_game")
            return
        }
        reset_board(scene)
        scene.scene.start(scene_keys.shop)
    } else if (play_counter === 0) {
        scene.add.image(700, 450, "gameover")
    }
}

/**
 * Resets important values back to origin
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
function reset_board(scene: Phaser.Scene): void {
    discard_counter = 4
    play_counter = 4
    money += money_earned(round)
    score = 0
    round++
    is_boss_7 = false
    type_boss = ""
    extra_blind = 1
    if (round % 3 === 0) {
        blind = "Boss blind"
    } else if (round % 2 === 0) {
        blind = "Big blind"
    } else {
        blind = "Small blind"
    }

    if(round % 3 === 1)
        ante++
    required_score = base_chip_req[ante] * (1 + ((round - 1) % 3) * 0.5) * extra_blind
    deck_stack = shuffle_cards(deck, round) as Stack<Card>
    card_slots.forEach(card_slot => {
        remove_card(scene, card_slot)
    })

    scene.time.delayedCall(1000, () => {
        update_left_panel()
        draw_cards(scene)
    })
}

/**
 * Discards all selected cards in the hand.
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
function discard_cards(scene: Phaser.Scene): void {
    for(let i = 0; i < num_slots; i++) {
        if(card_slots[i].selected) {
            remove_card(scene, card_slots[i])
        }
    }
}

/**
 * Removes a card from type CardSlot
 * @param {Phaser.Scene} scene - The scene the function is used in
 * @param {CardSlot} card_slot - The slot the card should be removed from 
 */
function remove_card(scene: Phaser.Scene, card_slot: CardSlot): void {
    destroy_images_by_key(card_slot.card, false, scene)
    card_slot.card = null
    card_slot.selected = false
    card_slot.disabled = false
}

/**
 * Removes either a card image or description image
 * @param {Card | Joker} card - The card whose image needs to be removed
 * @param {Boolean} is_desc - If true removes card description instead of card
 * @param {Phaser.Scene} scene - The scene the function is used in
 */
function destroy_images_by_key(card: Card | Joker | null, is_desc: boolean, scene: Phaser.Scene) {
    let key: string
    if(card !== null) 
        key = card.image

    if(is_joker(card)){
        if(is_desc) 
            key = card.description
        else
            key = card.image
    }

    scene.children.list.forEach((child: Phaser.GameObjects.GameObject) => {
        if (child instanceof Phaser.GameObjects.Image && child.texture.key === key) {
            child.destroy()
        }
    })
}

//Algorithmic functions

/**
 * Takes a deck and shuffles it to a stack
 * @param {Array} arr - An array of cards that represents the full deck 
 * @precondition arr is not empty
 * @returns {Stack} - Returns a stack in which the deck is shuffled
 */
export function shuffle_cards<T>(arr: Array<T>, rnd: number): Stack<T> {
    // Create a copy of the array to preserve the original

    if(arr.length === 0)
        return empty()

    let shuffled_array: Array<T> = [...arr]; 
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled_array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
        [shuffled_array[i], shuffled_array[j]] = [shuffled_array[j], shuffled_array[i]]; // Swap elements
    }

    boss_round_debuff(rnd, shuffled_array as Array<Card>)

    // Convert the shuffled array to a stack and return it
    let stack: Stack<T> = empty<T>()
    shuffled_array.forEach(card => {
        stack = push(card, stack)
    })

    return stack
}

/**
 * Gives the deck or other variables the right debuff
 * for the boss and changes type_boss to give appropriate
 * description
 * @param {number} rnd - The current round
 * @param {Array} arr - The deck to be modified
 */
function boss_round_debuff(rnd: number, arr: Array<Card>): void {
    arr.forEach(card => {
        if(is_joker(card))
            return
        switch(rnd) {
            case 3: {
                card = debuff_cards(Suit.diamonds, card)
                type_boss = "All Diamonds are \ndebuffed"
                break
            }
            case 6: {
                discard_counter = 0
                type_boss = "Start with 0 \ndiscards"
                break
            }
            case 9: {
                card = debuff_cards(Suit.spades, card)
                type_boss = "All Spades are \ndebuffed"
                break
            }
            case 12: {
                extra_blind = 2
                type_boss = "Extra large blind"
                break
            }
            case 15: {
                card = debuff_cards("Face cards", card)
                type_boss = "All Face cards are \ndebuffed"
                break
            } 
            case 18: {
                card = debuff_cards(Suit.hearts, card)
                type_boss = "All Hearts are \ndebuffed"
                break
            }
            case 21: {
                is_boss_7 = true
                type_boss = "Must play 5 cards"
                break
            }
            case 24: {
                card = debuff_cards(Suit.clubs, card)
                type_boss = "All Clubs are \ndebuffed"
                break
            }
        }
    })
    
    function debuff_cards(attribute: Suit | String, card: Card): Card{

        if(attribute === "Face cards") {
            if (card.value >= 11 && card.value <= 13) {
                card.chip = 0
                card.mult = 0
            }
        } else if (card.suit === attribute as Suit) {
            card.chip = 0
            card.mult = 0
        }
        return card
    }
}

/**
 * Calculates a hands value based on the poker hands
 * base value and the cards value
 * @example
 * //returns [30, 4]
 * calculate_hand([{image: "diamonds_12", id: 1, value: 12, suit: diamonds, chip: 10, mult:0}, 
 *                 {image: "spades_12", id: 2, value: 12, suit: spades, chip: 10, mult:0 }])
 * @param {Array} arr - An array of cards that represents the played hand
 * @precondition - arr is not empty
 * @returns {Array} - An array of the chip total and mult total
 */
export function calculate_hand(arr: Array<Card>): Array<number> {
    let chip_five_cards: number = arr.reduce((sum, card) => {return sum + card.chip}, 0)
    let mult_five_cards: number = arr.reduce((sum, card) => {return sum + card.mult}, 0)

    const values: Array<number> = arr.map(arr => arr.value).sort((a, b) => a - b);
    const suits: Array<Suit> = arr.map(arr => arr.suit);

    const valueCounts: Record<number, number> = values.reduce((acc, v) => ((acc[v] = (acc[v] || 0) + 1), acc), {} as Record<number, number>);
    const counts: Array<number> = Object.values(valueCounts).sort((a, b) => b - a);

    poker_hand = get_poker_hand(arr); 

    switch (poker_hand) {
        case poker_hands.royal_flush: 
        case poker_hands.straight_flush: {
            return [100 + chip_five_cards, 8 + mult_five_cards]
        }
        
        case poker_hands.four_of_a_kind: {
            let value = Object.keys(valueCounts).map(Number).filter(v => valueCounts[v] === 4)[0]
            let chip_mult: Array<number> = get_chip_mult_tot(value, arr);
            return [60 + chip_mult[0], 7 + chip_mult[1]]
        }

        case poker_hands.full_house:
            return [40 + chip_five_cards, 4 + mult_five_cards]

        case poker_hands.flush:
            return [35 + chip_five_cards, 4 + mult_five_cards]

        case poker_hands.straight:
            return [30 + chip_five_cards, 4 + mult_five_cards]
            
        case poker_hands.three_of_a_kind: {
            let value = Object.keys(valueCounts).map(Number).filter(v => valueCounts[v] === 3)[0]
            let chip_mult = get_chip_mult_tot(value, arr);
            return [30 + chip_mult[0], 3 + chip_mult[1]]
        }

        case poker_hands.two_pair: {
            let pair_values = Object.keys(valueCounts).map(Number).filter(v => valueCounts[v] === 2)
            let chip_mult_1 = get_chip_mult_tot(pair_values[0], arr);
            let chip_mult_2 = get_chip_mult_tot(pair_values[1], arr);

            return [20 + chip_mult_1[0] + chip_mult_2[0], 2 + chip_mult_1[1] + chip_mult_2[1]];
        }
            
        case poker_hands.pair: {
            let value = Object.keys(valueCounts).map(Number).filter(v => valueCounts[v] === 2)[0]
            let chip_mult = get_chip_mult_tot(value, arr);
            return [10 + chip_mult[0], 2 + chip_mult[1]]
        }
            
        default:
            return [arr[0].chip + 5, arr[0].mult + 1]
    }

    // Calculates the chip total and mult total for certain cards
    function get_chip_mult_tot(value: number, arr: Array<Card>): Array<number> {
        let chip_tot: number = 0, mult_tot: number = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].value === value) {
                chip_tot += arr[i].chip 
                mult_tot += arr[i].mult
            }
        }
        return [chip_tot, mult_tot]
    }

    //Returns the correct poker hand
    function get_poker_hand(cards: Array<Card>): string {
        if (cards.length === 1) {
            return poker_hands.high_card
        } 
        
        const is_flush: boolean = cards.length === 5 && new Set(suits).size === 1;
        const is_straight: boolean = cards.length === 5 && (values.every((v, i) => i === 0 || v === values[i - 1] + 1));
        
        if (is_straight && is_flush) {
            return values[0] === 10 ? poker_hands.royal_flush : poker_hands.straight_flush
        } else if (counts[0] === 4) {
            return poker_hands.four_of_a_kind
        } else if (counts[0] === 3 && counts[1] === 2) {
            return poker_hands.full_house
        } else if (is_flush) {
            return poker_hands.flush
        } else if (is_straight) {
            return poker_hands.straight
        } else if (counts[0] === 3) {
            return poker_hands.three_of_a_kind
        } else if (counts[0] === 2 && counts[1] === 2) {
            return poker_hands.two_pair
        } else if (counts[0] === 2) {
            return poker_hands.pair
        } 

        return poker_hands.high_card
    }
}

/**
 * Using selection sort sorts a hand by rank
 * from high to low
 * @param {Array} arr - The unsorted card hand
 * @returns {Array} - Returns a sorted card hand
 */
function sort_card_slot_card(arr: Array<CardSlot>): Array<CardSlot> {
    let sorted_arr = [...arr];

    for (let i = 0; i < sorted_arr.length - 1; i++) {
        let max_index = i;

        //Finds the biggest value
        for (let j = i + 1; j < sorted_arr.length; j++) {
            if (sorted_arr[j].card !== null && sorted_arr[max_index].card !== null) {
                if (sorted_arr[j].card!.value > sorted_arr[max_index].card!.value) {
                    max_index = j;
                }
            }
        }

        // Swap the elements
        if (max_index !== i) {
            const temp_val = sorted_arr[i].card
            sorted_arr[i].card = sorted_arr[max_index].card
            sorted_arr[max_index].card = temp_val
        }
    }

    return sorted_arr;
}

/**
 * Depending on what round returns how money earned
 * @param {number} rnd - The round
 * @preconditon rnd is a non-negative number
 * @returns {number} - The ammount of money
 */
function money_earned(rnd: number): number {
    switch(rnd % 3) {
        case 1: //Small blind
            return 2
        case 2: //Big blind
            return 3
        case 0: //Boss blind
            return 4
    }
    return 0
}

/**
 * Checks if a card is a joker card
 * @param {Joker} obj - 
 * @returns {Boolean} - True if it is a joker
 */
function is_joker(obj: unknown): obj is Joker {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }

    const candidate = obj as Joker; // Type assertion to safely check properties

    return (
        typeof candidate.id === "number" &&
        typeof candidate.image === "string" &&
        typeof candidate.price === "number" &&
        typeof candidate.description === "string"
    );
}

/**
 * Removes an element in a array
 * @param {Array} arr - The array to be modified 
 * @param {T} item - The element that should be removed
 * @returns {Array} Returns a array without the removed element
 */
function arr_remove<T>(arr: Array<T>, item: T): Array<T> {
    return arr_remove_at(arr, arr.indexOf(item))
}

/**
 * Removes an element at a certain index in an array
 * @param {Array} arr - The array to be modified 
 * @param {number} index - Index of the element 
 * @returns {Array} Returns a array without the removed element
 */
function arr_remove_at<T>(arr: Array<T>, index: number): Array<T> {
    let temp_arr: Array<T> = [] 
    for(let i = 0; i < arr.length; i++) {
        if(i !== index)
            temp_arr.push(arr[i])
    }
    return temp_arr
}

/**
 * Returns the ammount of selected cards in card_slots
 * @returns {number} Returns the ammount of selected card
 */
function get_num_selected_slots(): number {
    return card_slots.filter(slot => slot.selected).length
}