const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const SVG_COVERS = [
  {
    name: "claims-form.svg",
    title: "Offline-First Claims Form",
    subtitle: "IndexedDB + Service Workers",
    gradient: ["#38d9e8", "#4ade80"],
  },
  {
    name: "solar-sensor.svg",
    title: "Solar Lagoon Sensor Rev 3",
    subtitle: "Embedded C & Ultra Low Power IoT",
    gradient: ["#ff7a90", "#ffb347"],
  },
  {
    name: "warehouse-cost.svg",
    title: "Warehouse Cost Teardown",
    subtitle: "SQL & Query Partitioning",
    gradient: ["#b58cff", "#6aa8ff"],
  },
  {
    name: "lab-booking.svg",
    title: "Faculty Lab Booking System",
    subtitle: "Full Stack PostgreSQL App",
    gradient: ["#4ade80", "#38d9e8"],
  },
  {
    name: "geocoder.svg",
    title: "Creole Geocoder Matcher",
    subtitle: "NLP & Fuzzy Address Parsing",
    gradient: ["#ffb347", "#ff7a90"],
  },
  {
    name: "fisheries.svg",
    title: "Fisheries Landings Visual",
    subtitle: "Data Analytics & Statistics",
    gradient: ["#6aa8ff", "#b58cff"],
  },
];

function generateCoverSvg(title, subtitle, [c1, c2]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#05070c" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.25" />
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#bg)" />
  <circle cx="600" cy="400" r="500" fill="url(#glow)" filter="blur(60px)" />
  <path d="M 0 200 L 1200 200 M 0 400 L 1200 400 M 0 600 L 1200 600 M 300 0 L 300 800 M 600 0 L 600 800 M 900 0 L 900 800" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
  <rect x="100" y="150" width="1000" height="500" rx="32" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
  
  <text x="160" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="800" fill="#ffffff">${title}</text>
  <text x="160" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="600" fill="url(#textGrad)">${subtitle}</text>
  
  <rect x="160" y="460" width="260" height="48" rx="24" fill="${c1}" fill-opacity="0.15" stroke="${c1}" stroke-opacity="0.4" />
  <text x="290" y="491" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="${c1}" text-anchor="middle">STAGE.MU CASE STUDY</text>
</svg>`;
}

for (const item of SVG_COVERS) {
  const svgPath = path.join(IMAGES_DIR, item.name);
  const svgContent = generateCoverSvg(item.title, item.subtitle, item.gradient);
  fs.writeFileSync(svgPath, svgContent);
  console.log(`[GENERATED] ${item.name}`);
}

console.log("ALL SVGS GENERATED LOCALLY IN /public/images/");
