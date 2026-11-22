// The wall photo is 1400x1050 here, whatever its file size. Each link is the four corners of
// one tile on the photo, clockwise from top left, measured in those pixels.
// Add a link by adding an entry. `href` is an https URL, or a folder here with its own index.html.
// `hidden: true` keeps a tile off the page; open the page with ?all (or ?show=<title>) to preview it.
export const WALL = { width: 1400, height: 1050 };

// The glass of the mirror, in the same pixels. The page title is written on it.
export const MIRROR = [[1015, 90], [1215, 90], [1160, 420], [978, 392]];

export const TILES = [
  {
    emoji: "🥔",
    title: "Poteto Mode",
    blurb: "A game that teaches the playbooks in pstack, Lauren Tan's AI coding skills.",
    description:
      "The Playbook Quest, a learner's game about the /poteto-mode playbooks in pstack, the AI coding skills Lauren Tan (poteto) built at Cursor. Pick a level and watch the potato walk through the steps, or turn on CS mode for a harder version.",
    href: "https://georgeroberts1.github.io/poteto-playbook-quest/",
    corners: [[356, 335], [434, 319], [439, 366], [363, 383]],
  },
  {
    emoji: "🪥",
    title: "Brushing Stars",
    blurb: "A mobile-first tooth brushing tracker for young children.",
    description:
      "A mobile-first tooth brushing tracker for young children. Parents open it on their phone at the bathroom sink — the kid watches their favourite brushing video, then taps to earn a gold star for morning and evening brushes throughout the week.",
    href: "https://brushing-stars.vercel.app/",
    corners: [[1025, 498], [1087, 512], [1082, 537], [1022, 527]],
  },
  {
    emoji: "🚶",
    title: "Trail Tracker",
    blurb: "A walk tracker for UK trails.",
    href: "https://walk-tracker-omega.vercel.app/?completed=7%2C8%2C9%2C10%2C11%2C12%2C13%2C14",
    corners: [[498, 218], [554, 210], [555, 248], [500, 257]],
  },
  {
    emoji: "🍽️",
    title: "Restaurant Metrix",
    hidden: true,
    blurb: "A restaurant rating aggregator.",
    href: "https://restaurant-metrix-xiwa.vercel.app/",
    corners: [[380, 478], [445, 457], [448, 493], [384, 516]],
  },
  {
    emoji: "🎶",
    title: "Choirmash",
    hidden: true,
    blurb: "An app for choir singers to sing together remotely.",
    href: "https://choirmash-v2.vercel.app/",
    corners: [[612, 287], [640, 284], [640, 316], [614, 319]],
  },
  {
    emoji: "⚽",
    title: "Match Ranker",
    blurb: "Ranks Premier League football matches.",
    href: "https://match-ranker.vercel.app/",
    corners: [[719, 391], [750, 393], [749, 423], [719, 421]],
  },
  {
    emoji: "🔭",
    title: "Tonight's Sky",
    blurb: "A night-sky guide to the Moon, planets and stars above your town tonight.",
    href: "https://georgeroberts1.github.io/tonights-sky/",
    corners: [[800, 160], [829, 162], [828, 197], [799, 196]],
  },
  {
    emoji: "🕵️",
    title: "Conspiracy or Real?",
    blurb: "A quiz game: did it really happen, or did we make it up?",
    href: "https://georgeroberts1.github.io/conspiracy-or-real/",
    corners: [[641, 117], [674, 117], [675, 153], [642, 153]],
  },
  {
    emoji: "🔤",
    title: "Anagram Ring",
    blurb: "Type some letters and shuffle them around a ring to solve the anagram yourself.",
    href: "https://claude.ai/artifact/AXQdHrDkDhM8zd2cUrJkYN",
    corners: [[515, 435], [566, 417], [566, 449], [517, 467]],
  },
];
