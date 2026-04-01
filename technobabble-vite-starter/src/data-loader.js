// data-loader.js — Fetches babble word lists from JSON

const DATA_PATH = "data/babble-data.json";

const loadBabbleData = async () => {
  const response = await fetch(DATA_PATH);
  if (!response.ok) {
    throw new Error(`Failed to load ${DATA_PATH}: ${response.status}`);
  }
  const json = await response.json();

  // Validate that we got the three arrays we expect
  if (!json.words1 || !json.words2 || !json.words3) {
    throw new Error("babble-data.json is missing required word arrays");
  }

  return {
    words1: json.words1,
    words2: json.words2,
    words3: json.words3,
  };
};

export { loadBabbleData };
