"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hand = exports.deck = exports.sizes = exports.scene_keys = void 0;
exports.scene_keys = {
    title: 'title',
    preload: 'preload',
    gameboard: 'gameboard',
};
exports.sizes = {
    width: 1400,
    height: 900,
    left_width: 300,
    card_height: 159,
    card_width: 106
};
exports.deck = [];
exports.hand = [
    { id: "1", value: 10, suit: "hearts" },
    { id: "2", value: 11, suit: "hearts" },
    { id: "3", value: 12, suit: "hearts" },
    { id: "4", value: 13, suit: "hearts" },
    { id: "5", value: 14, suit: "hearts" }
];
