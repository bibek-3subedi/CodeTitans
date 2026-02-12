import { scoreMatch } from './matchEngine';

// Wraps the basic scoring with a simple "AI-style" summary
export function getAiRecommendations(tenantPrefs, listings) {
  return listings
    .map((listing) => {
      const { score, reasons } = scoreMatch(tenantPrefs, listing);
      const finalScore = Math.min(100, score);

      let aiSummary;
      if (finalScore >= 80) {
        aiSummary =
          'Highly recommended based on your budget, area preferences, and lifestyle settings.';
      } else if (finalScore >= 60) {
        aiSummary =
          'Good match that fits most of your preferences, with a few possible trade-offs.';
      } else {
        aiSummary =
          'Partial match. Consider this if your top matches are unavailable or you want more options.';
      }

      return { listing, score: finalScore, reasons, aiSummary };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

