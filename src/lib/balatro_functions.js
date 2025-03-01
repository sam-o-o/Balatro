"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle_cards = shuffle_cards;
exports.get_poker_hand = get_poker_hand;
exports.create_card_slots = create_card_slots;
exports.create_hand_buttons = create_hand_buttons;
exports.create_left_panel = create_left_panel;
var stack_1 = require("./stack");
var common_1 = require("../scenes/common");
var card_slots = [];
var numSlots = 7; // Number of slots
var panel_width = 350;
var slotSpacing = 110; // Space between slots
var left_side_offset = 30;
var startX = left_side_offset * 2 + panel_width + common_1.sizes.card_width / 2; // Center slots
var slotY = common_1.sizes.height - 200; // Position near bottom
/**
 * Takes a deck and shuffles it
 * @example
 * @param {Array} arr - Array of cards
 * @returns {Stack} a stack of cards
 */
function shuffle_cards(arr) {
    var takencards = [];
    var stack = (0, stack_1.empty)();
    while (takencards.length !== common_1.deck.length) {
        var card = Math.floor(Math.random() * (common_1.deck.length));
        if (!takencards.includes(card)) {
            takencards.push(card);
            stack = (0, stack_1.push)(arr[card], stack);
        }
    }
    return stack;
}
/**
 *
 * @param arr
 */
/**
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
*/
function get_poker_hand(cards) {
    if (cards.length === 1)
        return "high card";
    var values = cards.map(function (card) { return card.value; }).sort(function (a, b) { return a - b; });
    var suits = cards.map(function (card) { return card.suit; });
    var valueCounts = values.reduce(function (acc, v) { return ((acc[v] = (acc[v] || 0) + 1), acc); }, {});
    var counts = Object.values(valueCounts).sort(function (a, b) { return b - a; });
    var isFlush = cards.length === 5 && new Set(suits).size === 1;
    var isStraight = cards.length === 5 && (values.every(function (v, i) { return i === 0 || v === values[i - 1] + 1; }));
    // Determine the hand type based on the above conditions
    if (isStraight && isFlush)
        return values[0] === 10 ? "royal flush" : "straight flush";
    if (counts[0] === 4)
        return "four of a kind";
    if (counts[0] === 3 && counts[1] === 2)
        return "full house";
    if (isFlush)
        return "flush";
    if (isStraight)
        return "straight";
    if (counts[0] === 3)
        return "three of a kind";
    if (counts[0] === 2 && counts[1] === 2)
        return "two pair";
    if (counts[0] === 2)
        return "pair";
    return "high card"; // If no other hand type is matched
}
var hand = [
    { id: "1", value: 10, suit: "hearts" },
    { id: "2", value: 11, suit: "hearts" },
    { id: "3", value: 12, suit: "hearts" },
    { id: "4", value: 13, suit: "hearts" },
    { id: "5", value: 14, suit: "hearts" }
];
console.log(get_poker_hand(hand)); // "Royal Flush"
function create_card_slots(scene) {
    // Clear existing card slots and cards
    card_slots = [];
    for (var i = 0; i < numSlots; i++) {
        var x = startX + i * slotSpacing;
        var y = slotY;
        // Optional: Add a visual representation of the slots
        var slot = scene.add.rectangle(x, y, common_1.sizes.card_width, common_1.sizes.card_height, 0xffffff, 0.3);
        slot.setStrokeStyle(2, 0x000000); // Outline
        card_slots.push({ x: x, y: y }); // Adding the position
    }
}
function create_hand_buttons(scene) {
    for (var i = 0; i < numSlots; i++) {
        var x = startX + i * slotSpacing;
        var y = slotY;
        if (i == 2) {
            var cardImage = scene.add.image(x + 35, y + 150, "play_hand_button");
            cardImage.setScale(0.5);
        }
        else if (i == 4) {
            var cardImage = scene.add.image(x - 35, y + 150, "discard_button");
            cardImage.setScale(0.5);
        }
    }
}
function create_left_panel(scene) {
    var panel = scene.add.rectangle(left_side_offset, 0, panel_width, common_1.sizes.height, 0x000000, 0.9).setOrigin(0, 0);
    panel.setStrokeStyle(2, 0x000000); // Outline
}
