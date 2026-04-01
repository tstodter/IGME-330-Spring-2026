// history.js — Manages a rolling history of generated babble lines.
// Uses localStorage so history survives page reloads.
import { clamp } from "./utils.js";

const STORAGE_KEY = "technobabble-history";
const MAX_ENTRIES = 50;

// Load history array from localStorage (or return empty).
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Save history array to localStorage.
const save = (entries) => {
  const trimmed = entries.slice(
    0,
    clamp(entries.length, 0, MAX_ENTRIES)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
};

// Create a history manager with add / clear / getAll.
const createHistory = () => {
  let entries = load();

  return {
    // Add one or more lines to the front of history.
    add(lines) {
      entries = [...lines, ...entries].slice(0, MAX_ENTRIES);
      save(entries);
    },

    // Clear all history.
    clear() {
      entries = [];
      localStorage.removeItem(STORAGE_KEY);
    },

    // Return a copy of all entries.
    getAll() {
      return [...entries];
    },
  };
};

export { createHistory };
