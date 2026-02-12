// Simple rule-based matching between tenant preferences and property listings.

// listing shape (from storage):
// {
//   id, landlordId, title, color, width, price, location, description
// }

// prefs shape: see src/lib/models.js

export function scoreMatch(prefs, listing) {
  let score = 0;
  const reasons = [];

  // Budget
  if (prefs.budgetMin || prefs.budgetMax) {
    if (prefs.budgetMin && listing.price < prefs.budgetMin) {
      return { score: 0, reasons: ['Below your budget range'] };
    }
    if (prefs.budgetMax && listing.price > prefs.budgetMax) {
      return { score: 0, reasons: ['Above your budget range'] };
    }
    score += 25;
    reasons.push('Within your budget range');
  }

  // Preferred areas: very rough for now (substring match on location)
  if (prefs.preferredAreas && prefs.preferredAreas.length > 0) {
    const loc = (listing.location || '').toLowerCase();
    const match = prefs.preferredAreas.some((area) =>
      loc.includes(area.toLowerCase())
    );
    if (match) {
      score += 25;
      reasons.push('In your preferred area');
    } else {
      reasons.push('Outside your explicitly preferred areas');
    }
  }

  // Rooms vs width (approximation: width ~ room capacity)
  if (prefs.rooms) {
    if (listing.width >= prefs.rooms * 8) {
      score += 10;
      reasons.push('Likely enough space for requested rooms');
    }
  }

  // Lifestyle – use description text heuristics
  if (prefs.lifestyle !== 'any' && listing.description) {
    const desc = listing.description.toLowerCase();
    if (prefs.lifestyle === 'quiet') {
      if (desc.includes('quiet') || desc.includes('calm') || desc.includes('family')) {
        score += 10;
        reasons.push('Described as quiet / family friendly');
      }
    }
    if (prefs.lifestyle === 'social') {
      if (desc.includes('shared') || desc.includes('friends') || desc.includes('social')) {
        score += 10;
        reasons.push('Described as social / shared-friendly');
      }
    }
  }

  // Parking (very light check using description/location for now)
  if (prefs.parking !== 'any') {
    const text = `${listing.description || ''} ${listing.title || ''}`.toLowerCase();
    const has2w = text.includes('bike') || text.includes('2-wheeler');
    const has4w = text.includes('car') || text.includes('4-wheeler');
    if (prefs.parking === '2w' && has2w) {
      score += 5;
      reasons.push('Mentions 2-wheeler parking');
    } else if (prefs.parking === '4w' && has4w) {
      score += 5;
      reasons.push('Mentions 4-wheeler parking');
    } else if (prefs.parking === 'both' && has2w && has4w) {
      score += 8;
      reasons.push('Mentions both 2-wheeler and 4-wheeler parking');
    }
  }

  // WiFi requirement – assume good if description mentions it
  if (prefs.wifiRequired) {
    const text = `${listing.description || ''} ${listing.title || ''}`.toLowerCase();
    if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet')) {
      score += 10;
      reasons.push('Mentions WiFi / internet');
    } else {
      reasons.push('No WiFi mentioned');
    }
  }

  // Generic base score if nothing else matched but listing exists
  if (score === 0) {
    score = 10;
    reasons.push('Basic match (no strong conflicts found)');
  }

  if (score > 100) score = 100;
  return { score, reasons };
}

export function sortListingsByMatch(prefs, listings) {
  return listings
    .map((l) => {
      const { score, reasons } = scoreMatch(prefs, l);
      return { listing: l, score, reasons };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

