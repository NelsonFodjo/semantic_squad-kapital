// HUES — decides which colour a thing gets.

export type Hue = "lagoon" | "coral" | "mango" | "palm" | "orchid" | "sky";

/** Every hue, in display order. */
export const hues: Hue[] = ["lagoon", "coral", "mango", "palm", "orchid", "sky"];

/**
 * Sector to colour. Loosely thematic where it can be — ocean work is
 * lagoon blue, agriculture is palm green — because a colour that
 * matches the subject is easier to remember than an arbitrary one.
 */
const sectorHues: Record<string, Hue> = {
  "ICT & Software": "sky",
  "BPO & Shared Services": "orchid",
  "Financial Services": "orchid",
  Fintech: "orchid",
  "Tourism & Hospitality": "coral",
  "Textile & Manufacturing": "mango",
  "Agriculture & Agritech": "palm",
  "Ocean Economy": "lagoon",
  "Renewable Energy": "palm",
  "Logistics & Freeport": "sky",
  Healthcare: "coral",
  Education: "mango",
  "Creative & Media": "coral",
  "Public Sector & NGO": "lagoon",
};

/**
 * Turn any string into a hue, always the same one for the same input.
 *
 * This is the fallback for sectors, tags and skills we have no explicit
 * mapping for. It sums the character codes and takes the remainder, so
 * "Python" is the same colour on every page it appears on — but the set
 * as a whole still looks varied.
 */
function hashHue(input: string): Hue {
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    total += input.charCodeAt(i);
  }
  return hues[total % hues.length];
}

/** The colour for an opportunity's or challenge's sector. */
export function hueForSector(sector: string): Hue {
  return sectorHues[sector] ?? hashHue(sector);
}

/** The colour for a skill or showcase tag. */
export function hueForTag(tag: string): Hue {
  return hashHue(tag);
}

/**
 * Challenges get colour from their kind rather than their sector,
 * because on that page the split between a paid challenge and an
 * open-source project is the distinction that matters most.
 */
export function hueForChallengeKind(kind: string): Hue {
  return kind === "open_source" ? "mango" : "lagoon";
}

/** Application and proposal statuses. */
export function hueForStatus(status: string): Hue {
  switch (status) {
    case "offer":
    case "accepted":
      return "palm";
    case "shortlisted":
    case "interview":
      return "lagoon";
    case "rejected":
    case "withdrawn":
      return "coral";
    default:
      return "sky";
  }
}
