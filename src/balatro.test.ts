import { get_poker_hand } from './lib/balatro_functions';
import { Card, hand } from './scenes/common';

test("Royal flush", () => {
  expect(get_poker_hand(hand)).toBe("royal flush")
});
