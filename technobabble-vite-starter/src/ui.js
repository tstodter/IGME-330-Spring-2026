// ui.js — All DOM interaction lives here.
// Imports from babble-engine and history.
import { generateOne, generateMany } from "./babble-engine.js";
import { createHistory } from "./history.js"; // NEW: localStorage-backed history of past babble

// Render an array of babble lines into the #output element.
const renderOutput = (lines) => {
  const el = document.querySelector("#output");

  el.innerHTML = lines
    .map((line) => `<span class="babble-line">${line}</span>`)
    .join("<br>");
};

// Render the history list.
const renderHistory = (history) => {
  const section = document.querySelector("#history-section");
  const list = document.querySelector("#history-list");
  const entries = history.getAll();

  if (entries.length === 0) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  
  list.innerHTML = entries
    .map((entry) => `<li>${entry}</li>`)
    .join("");
};

// Update the stats display in the footer.
const renderStats = (stats) => {
  document.querySelector("#stats").textContent = stats.summary();
};

// Wire up all UI event handlers.
const initUI = (data, stats) => {
  const history = createHistory(); // NEW: init localStorage-backed history

  // Generate 1
  document.querySelector("#btn-gen-1").addEventListener("click", () => {
    const line = generateOne(data);
    renderOutput([line]);
    history.add([line]); // NEW: save to history
    stats.record(1); // NEW: track count
    renderHistory(history); // NEW: update history list in DOM
    renderStats(stats); // NEW: update footer stats
  });

  // Generate 5
  document.querySelector("#btn-gen-5").addEventListener("click", () => {
    const lines = generateMany(data, 5);
    renderOutput(lines);
    history.add(lines); // NEW: save to history
    stats.record(5); // NEW: track count
    renderHistory(history); // NEW: update history list in DOM
    renderStats(stats); // NEW: update footer stats
  });

  // NEW: Clear history button
  document.querySelector("#btn-clear-history").addEventListener("click", () => {
    history.clear();
    renderHistory(history);
  });

  // Show initial babble on load
  const initial = generateOne(data);
  renderOutput([initial]);
  history.add([initial]); // NEW: save to history
  stats.record(1); // NEW: track count
  renderHistory(history); // NEW: update history list in DOM
  renderStats(stats); // NEW: update footer stats
};

export { initUI };
