// stats.js — Tracks generation statistics for the footer.

const createStats = () => {
  let totalGenerated = 0;

  return {
    // Record that n lines were generated.
    record(n) {
      totalGenerated += n;
    },

    // Return a human-readable stats string.
    summary() {
      return `${totalGenerated} babble${totalGenerated === 1 ? "" : "s"} generated this session`;
    },
  };
};

export { createStats };
