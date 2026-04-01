// utils.js — Pure utility functions (no DOM, no side effects)

// Return a random element from the given array.
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Capitalize the first letter of a string.
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Clamp a number between min and max.
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export { randomElement, capitalize, clamp };
