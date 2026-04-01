// babble-engine.js — Generates technobabble strings from word arrays
// Pure logic — no DOM access.
import { randomElement } from "./utils.js";

// Generate a single line of technobabble from the three word lists.
const generateOne = (data) => {
  const w1 = randomElement(data.words1);
  const w2 = randomElement(data.words2);
  const w3 = randomElement(data.words3);
  return `${w1} ${w2} ${w3}`;
};

// Generate multiple lines of technobabble.
const generateMany = (data, count) => {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(generateOne(data));
  }
  return results;
};

export { generateOne, generateMany };
