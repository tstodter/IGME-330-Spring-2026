// main.js — App entry point
// Initializes the app once data is loaded.
import { loadBabbleData } from "./data-loader.js";
import { initUI } from "./ui.js";
import { createStats } from "./stats.js"; // NEW: tracks how many babbles generated per session

const init = async () => {
  try {
    const babbleData = await loadBabbleData();
    const stats = createStats(); // NEW: create a stats tracker, passed into the UI
    
    initUI(babbleData, stats);
  } catch (err) {
    document.querySelector("#output").textContent =
      `Error loading babble data: ${err.message}`;
  }
};

window.addEventListener("DOMContentLoaded", init);
