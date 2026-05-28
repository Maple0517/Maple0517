import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "assets");
mkdirSync(outDir, { recursive: true });

const fallbackUser = {
  login: "Maple0517",
  name: "Maple",
  bio: "SDE @aws",
  company: "@AWS",
  location: "Seattle",
  public_repos: 9,
  followers: 2,
  following: 3,
  avatar_url: "https://avatars.githubusercontent.com/u/36678948?v=4",
};

const fallbackRepos = {
  accountant: {
    name: "accountant",
    full_name: "Maple0517/accountant",
    html_url: "https://github.com/Maple0517/accountant",
    description: "AI-native personal finance workspace with Plaid, Supabase, Notion, and receipt parsing.",
    language: "TypeScript",
    stargazers_count: 0,
  },
  Pomotree: {
    name: "Pomotree",
    full_name: "Maple0517/Pomotree",
    html_url: "https://github.com/Maple0517/Pomotree",
    description: "Local-first Pomodoro task app with focus trees, interruption capture, and a macOS shell.",
    language: "TypeScript",
    stargazers_count: 0,
  },
};

function ghJson(path) {
  try {
    return JSON.parse(execFileSync("gh", ["api", path], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function avatarDataUri() {
  const avatar = readFileSync(join(outDir, "avatar.png")).toString("base64");
  return `data:image/jpeg;base64,${avatar}`;
}

const user = { ...fallbackUser, ...(ghJson("user") ?? {}) };
const repos = {
  accountant: { ...fallbackRepos.accountant, ...(ghJson("repos/Maple0517/accountant") ?? {}) },
  Pomotree: { ...fallbackRepos.Pomotree, ...(ghJson("repos/Maple0517/Pomotree") ?? {}) },
};

const totalStars = Object.values(repos).reduce((sum, repo) => sum + Number(repo.stargazers_count ?? 0), 0);
const facts = [
  ["Public Repos", user.public_repos ?? fallbackUser.public_repos],
  ["Stars", totalStars],
  ["Followers", user.followers ?? fallbackUser.followers],
  ["Following", user.following ?? fallbackUser.following],
];

const tech = [
  ["Python", "#ffd166"],
  ["TypeScript", "#62a8ff"],
  ["React", "#67e8f9"],
  ["Next.js", "#e5e7eb"],
  ["Tailwind CSS", "#38bdf8"],
  ["Supabase", "#34d399"],
  ["AWS", "#f59e0b"],
  ["Docker", "#60a5fa"],
  ["GitHub Actions", "#8b5cf6"],
  ["Terraform", "#a78bfa"],
  ["PostgreSQL", "#93c5fd"],
  ["OpenAI", "#d1d5db"],
];

function panel(x, y, w, h, title) {
  return `
    <g filter="url(#softShadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="url(#panel)" stroke="url(#gold)" stroke-width="1.4"/>
      <rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 16}" rx="7" fill="none" stroke="#6b4e2e" stroke-opacity=".42"/>
      <path d="M${x + 28} ${y}h46M${x} ${y + 28}v46M${x + w - 74} ${y}h46M${x + w} ${y + 28}v46M${x + 28} ${y + h}h46M${x} ${y + h - 74}v46M${x + w - 74} ${y + h}h46M${x + w} ${y + h - 74}v46" stroke="#c69b5b" stroke-width="1" stroke-opacity=".72"/>
      <text x="${x + 30}" y="${y + 40}" class="serif title">${escapeXml(title)}</text>
      <line x1="${x + 28}" y1="${y + 56}" x2="${x + w - 28}" y2="${y + 56}" stroke="#6b4e2e" stroke-opacity=".58"/>
    </g>`;
}

function gem(x, y, color, label, level) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="46" height="46" rx="7" fill="#07111d" stroke="#6b4e2e"/>
      <path d="M23 5L38 16L33 38L23 43L13 38L8 16Z" fill="${color}" opacity=".78" filter="url(#glow)"/>
      <path d="M23 9L32 18L23 38L14 18Z" fill="#ffffff" opacity=".22"/>
      <text x="23" y="64" text-anchor="middle" class="tiny muted">${escapeXml(label)}</text>
      <text x="23" y="78" text-anchor="middle" class="tiny gold">Lv. ${level}</text>
    </g>`;
}

function projectCard(x, y, repo, variant) {
  const title = repo.name === "Pomotree" ? "Pomotree" : "Accountant";
  const desc = title === "Accountant"
    ? "AI-native finance workspace for clean transactions, receipts, and Notion sync."
    : "Local-first focus timer that grows task trees and protects deep work.";
  const tags = title === "Accountant"
    ? ["Next.js", "TypeScript", "Supabase", "Plaid"]
    : ["Tauri", "TypeScript", "Dexie", "React"];
  const scene = variant === "ledger"
    ? `<path d="M0 120c90-52 183-58 290-30s192 10 270-42v182H0Z" fill="#27190f" opacity=".95"/>
       <rect x="34" y="76" width="122" height="82" rx="5" fill="#b88a4d" opacity=".18" stroke="#d6b076"/>
       <path d="M55 98h78M55 120h72M55 142h58" stroke="#f8dca0" stroke-opacity=".45"/>
       <circle cx="448" cy="80" r="36" fill="#eab86b" opacity=".14"/>
       <path d="M390 151c42-32 86-35 132-11" stroke="#f8dca0" stroke-opacity=".25" stroke-width="10"/>`
    : `<path d="M0 136c78-45 132-38 198-7s138 23 203-25 108-61 159-23v149H0Z" fill="#08291f" opacity=".9"/>
       <path d="M418 44c34 28 56 68 47 107-11 49-57 78-108 66-45-10-77-48-78-94 0-54 42-97 91-96 17 0 32 6 48 17Z" fill="#164733" opacity=".72"/>
       <path d="M378 110c-18 42-30 71-44 104M365 151c-28-18-52-27-83-30M374 142c28-28 62-44 100-52" stroke="#7dd36f" stroke-opacity=".28" stroke-width="12" stroke-linecap="round"/>`;
  return `
    <g transform="translate(${x} ${y})" filter="url(#softShadow)">
      <rect width="560" height="190" rx="10" fill="#080c14" stroke="url(#gold)" stroke-width="1.2"/>
      <clipPath id="clip-${title}"><rect width="560" height="190" rx="10"/></clipPath>
      <g clip-path="url(#clip-${title})">${scene}<rect width="560" height="190" fill="url(#cardFade)"/></g>
      <rect x="26" y="28" width="46" height="46" rx="8" fill="${title === "Accountant" ? "#2563eb" : "#16a34a"}"/>
      <text x="49" y="60" text-anchor="middle" class="icon">${title === "Accountant" ? "$" : "P"}</text>
      <text x="88" y="56" class="serif project">${escapeXml(title)}</text>
      <rect x="478" y="25" width="58" height="28" rx="6" fill="#1a120b" stroke="#6b4e2e"/>
      <text x="507" y="44" text-anchor="middle" class="tiny gold">Star ${repo.stargazers_count ?? 0}</text>
      <text x="28" y="99" class="small">${escapeXml(desc)}</text>
      ${tags.map((tag, i) => `<rect x="${28 + i * 88}" y="124" width="${tag.length > 9 ? 86 : 74}" height="24" rx="5" fill="#111827" stroke="#3b2d1d"/><text x="${39 + i * 88}" y="141" class="tiny">${escapeXml(tag)}</text>`).join("")}
      <text x="28" y="172" class="tiny muted">${escapeXml(repo.html_url)}</text>
    </g>`;
}

const contributionCells = Array.from({ length: 91 }, (_, i) => {
  const col = i % 13;
  const row = Math.floor(i / 13);
  const colors = ["#1f2a1e", "#315c2f", "#4b8a3f", "#7bb85c", "#b8d777"];
  const color = colors[(i * 7 + row * 3 + col) % colors.length];
  return `<rect x="${col * 20}" y="${row * 20}" width="14" height="14" rx="2" fill="${color}" opacity=".92"/>`;
}).join("");

const svg = `<svg width="1280" height="1560" viewBox="0 0 1280 1560" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#030406"/><stop offset=".45" stop-color="#08111f"/><stop offset="1" stop-color="#160d08"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1018" stop-opacity=".98"/><stop offset=".55" stop-color="#0a0d13" stop-opacity=".96"/><stop offset="1" stop-color="#171008" stop-opacity=".96"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" x2="1"><stop stop-color="#7a5631"/><stop offset=".5" stop-color="#f2cf88"/><stop offset="1" stop-color="#7b542c"/></linearGradient>
    <linearGradient id="hp" x1="0" x2="1"><stop stop-color="#7f1d1d"/><stop offset="1" stop-color="#ef4444"/></linearGradient>
    <linearGradient id="xp" x1="0" x2="1"><stop stop-color="#1d4ed8"/><stop offset="1" stop-color="#38bdf8"/></linearGradient>
    <linearGradient id="river" x1="0" x2="1"><stop stop-color="#0f2638"/><stop offset=".55" stop-color="#24435d"/><stop offset="1" stop-color="#08111f"/></linearGradient>
    <linearGradient id="cardFade" x1="0" x2="1"><stop stop-color="#05070b" stop-opacity=".96"/><stop offset=".45" stop-color="#05070b" stop-opacity=".62"/><stop offset="1" stop-color="#05070b" stop-opacity=".86"/></linearGradient>
    <radialGradient id="moon" cx="70%" cy="12%" r="38%"><stop stop-color="#d9e7ff" stop-opacity=".5"/><stop offset=".36" stop-color="#d9e7ff" stop-opacity=".12"/><stop offset="1" stop-color="#d9e7ff" stop-opacity="0"/></radialGradient>
    <filter id="softShadow"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000" flood-opacity=".65"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="noise"><feTurbulence baseFrequency=".7" numOctaves="3" seed="12" type="fractalNoise"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .06"/></feComponentTransfer></filter>
    <clipPath id="avatarClip"><circle cx="146" cy="206" r="66"/></clipPath>
    <style>
      .serif{font-family:Georgia,'Times New Roman',serif}.title{font-size:18px;fill:#f2cf88;font-weight:700;letter-spacing:.3px}.name{font-size:58px;fill:#f6dca1;font-weight:700}.project{font-size:26px;fill:#f6dca1;font-weight:700}.body{font-family:Inter,Arial,sans-serif;font-size:17px;fill:#f2f2ee}.small{font-family:Inter,Arial,sans-serif;font-size:14px;fill:#e8e1d4}.tiny{font-family:Inter,Arial,sans-serif;font-size:12px;fill:#e8e1d4}.muted{fill:#b8ad9c}.gold{fill:#f2cf88}.icon{font-family:Georgia,serif;font-size:24px;fill:white;font-weight:700}
    </style>
  </defs>

  <rect width="1280" height="1560" fill="url(#background)"/>
  <rect width="1280" height="1560" filter="url(#noise)"/>
  <rect x="18" y="18" width="1244" height="1524" rx="16" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <rect x="34" y="34" width="1212" height="1492" rx="10" fill="none" stroke="#6b4e2e" stroke-opacity=".55"/>
  <path d="M548 18l92 45 92-45M548 1542l92-45 92 45" fill="none" stroke="url(#gold)" stroke-width="2"/>

  <g filter="url(#softShadow)">
    <rect x="50" y="54" width="1180" height="292" rx="12" fill="#070b12" stroke="url(#gold)" stroke-width="1.5"/>
    <clipPath id="heroClip"><rect x="50" y="54" width="1180" height="292" rx="12"/></clipPath>
    <g clip-path="url(#heroClip)">
      <rect x="50" y="54" width="1180" height="292" fill="#08111f"/>
      <rect x="50" y="54" width="1180" height="292" fill="url(#moon)"/>
      <path d="M50 248L128 180l58 48 106-132 98 140 110-96 102 102 122-156 142 164 111-108 74 80 104-128 75 82v170H50Z" fill="#111827"/>
      <path d="M50 286L172 208l120 88 146-126 136 132 130-92 116 94 146-116 126 116 142-86v128H50Z" fill="#0c1220"/>
      <path d="M50 310c132-50 241-45 342-5s219 30 348-22 263-62 490-8v71H50Z" fill="#061018"/>
      <path d="M662 240c103 5 203-25 333-96-93 82-167 138-251 167-74 25-150 15-246 21 53-33 103-72 164-92Z" fill="url(#river)" opacity=".9"/>
      <g transform="translate(572 120)" opacity=".9">
        <path d="M0 132V72h20V39h18V72h26V16L82 0l18 16v56h32V44h18v28h21v60Z" fill="#07090e" stroke="#25344c"/>
        <rect x="32" y="91" width="15" height="41" fill="#0d1423"/><rect x="74" y="82" width="18" height="50" fill="#0d1423"/><rect x="124" y="94" width="14" height="38" fill="#0d1423"/>
      </g>
      <g transform="translate(938 96)">
        <path d="M72 42c-24 35-28 74-20 118M72 42c24 35 28 74 20 118" stroke="#111827" stroke-width="13" stroke-linecap="round"/>
        <path d="M72 42L52 164h40Z" fill="#0c111b"/>
        <path d="M50 164h56l26 82H18Z" fill="#080b12"/>
        <path d="M72 38c26 27 65 72 77 118-40-16-80-25-124-18 7-41 22-76 47-100Z" fill="#0f172a"/>
      </g>
      <rect x="50" y="54" width="1180" height="292" fill="url(#cardFade)" opacity=".55"/>
    </g>

    <g transform="translate(76 80)">
      <path d="M0 0h334l12 12v38H0Z" fill="#06080d" stroke="#6b4e2e"/>
      <rect x="72" y="13" width="166" height="18" fill="#1f1010" stroke="#4a2a20"/><rect x="73" y="14" width="155" height="16" fill="url(#hp)"/>
      <text x="13" y="28" class="tiny gold">HP 100 / 100</text>
      <rect x="72" y="40" width="248" height="18" fill="#0c1728" stroke="#2a4058"/><rect x="73" y="41" width="208" height="16" fill="url(#xp)"/>
      <text x="13" y="55" class="tiny gold">XP 2360 / 3200</text>
      <text x="298" y="28" class="tiny gold">Lv. 25</text>
    </g>

    <g>
      <circle cx="146" cy="206" r="84" fill="#12100c" stroke="url(#gold)" stroke-width="4"/>
      <circle cx="146" cy="206" r="72" fill="#0b1220" stroke="#6b4e2e" stroke-width="2"/>
      <image href="${avatarDataUri()}" x="80" y="140" width="132" height="132" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
      <circle cx="146" cy="206" r="66" fill="none" stroke="#d8b16a" stroke-opacity=".55"/>
      <path d="M146 114l12 22h-24ZM146 298l12-22h-24ZM54 206l22-12v24ZM238 206l-22-12v24Z" fill="#c69b5b"/>
    </g>

    <text x="260" y="174" class="serif name">${escapeXml(user.name || user.login)}</text>
    <text x="262" y="213" class="body">${escapeXml(user.bio || "SDE @ AWS")} | ${escapeXml(user.location || "Seattle, WA")}</text>
    <text x="262" y="249" class="body">Builder of AI-native products with clean UX and useful systems.</text>
    <text x="262" y="289" class="small gold">Code   Design   AI   Cloud   Product</text>

    <g transform="translate(990 96)">
      <rect width="210" height="164" rx="8" fill="#130d08" stroke="url(#gold)"/>
      <text x="22" y="35" class="serif title">CURRENT QUEST</text>
      <text x="22" y="76" class="small">Build useful tools that</text>
      <text x="22" y="100" class="small">turn ideas into shipped work.</text>
      <text x="22" y="136" class="tiny gold">PROGRESS</text>
      <rect x="94" y="124" width="88" height="10" rx="4" fill="#2b2117" stroke="#6b4e2e"/>
      <rect x="95" y="125" width="66" height="8" rx="3" fill="#c69b5b"/>
      <text x="188" y="136" class="tiny gold">75%</text>
    </g>
  </g>

  ${panel(38, 372, 424, 300, "ABOUT ME")}
  <text x="70" y="446" class="small">I turn ideas into products people enjoy using.</text>
  <text x="70" y="474" class="small">Backend-minded, product-driven, and AI-curious.</text>
  <text x="70" y="502" class="small">I like systems that are useful, clean, and reliable.</text>
  <line x1="70" y1="542" x2="430" y2="542" stroke="#6b4e2e" stroke-opacity=".5"/>
  <g transform="translate(84 584)">
    <path d="M0 0l28 28M28 0L0 28" stroke="#d8b16a" stroke-width="5"/><text x="-20" y="62" class="tiny">Problem Solver</text>
    <path d="M112 0l30 10v25c0 22-15 34-30 42-15-8-30-20-30-42V10Z" fill="#8b5e34" stroke="#f2cf88"/><text x="70" y="62" class="tiny">Product Builder</text>
    <path d="M224 0l26 38-26 38-26-38Z" fill="#7c3aed" stroke="#d8b4fe" filter="url(#glow)"/><text x="184" y="62" class="tiny">AI Enthusiast</text>
    <circle cx="334" cy="30" r="27" fill="#0369a1" stroke="#bae6fd" filter="url(#glow)"/><text x="294" y="62" class="tiny">Cloud Explorer</text>
  </g>

  ${panel(478, 372, 374, 300, "INVENTORY")}
  <g transform="translate(512 432)">
    ${tech.map((item, i) => {
      const x = i < 6 ? 0 : 178;
      const y = (i % 6) * 34;
      return `<circle cx="${x + 10}" cy="${y + 7}" r="7" fill="${item[1]}" filter="url(#glow)"/><text x="${x + 28}" y="${y + 13}" class="small">${escapeXml(item[0])}</text>`;
    }).join("")}
  </g>

  ${panel(868, 372, 374, 300, "CHARACTER STATS")}
  <g transform="translate(1055 507)">
    <polygon points="0,-62 54,-31 54,31 0,62 -54,31 -54,-31" fill="#2e1065" opacity=".48" stroke="#8b5cf6"/>
    <polygon points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23" fill="#4c1d95" opacity=".35"/>
    <line x1="0" y1="-62" x2="0" y2="62" stroke="#463465" opacity=".5"/><line x1="-54" y1="-31" x2="54" y2="31" stroke="#463465" opacity=".5"/><line x1="-54" y1="31" x2="54" y2="-31" stroke="#463465" opacity=".5"/>
    <path d="M0,-56 L48,-27 L44,27 L0,49 L-48,28 L-45,-26Z" fill="#6d28d9" opacity=".34" stroke="#a78bfa" stroke-width="2"/>
    <text x="0" y="-75" text-anchor="middle" class="tiny">Backend 95</text>
    <text x="72" y="-30" class="tiny">System 90</text>
    <text x="66" y="43" class="tiny">AI / ML 85</text>
    <text x="0" y="80" text-anchor="middle" class="tiny">Cloud 85</text>
    <text x="-98" y="43" class="tiny">Frontend 75</text>
    <text x="-102" y="-30" class="tiny">Product 85</text>
  </g>
  <g transform="translate(902 596)">
    ${gem(0, 0, "#0ea5e9", "API", 5)}
    ${gem(58, 0, "#10b981", "UX", 4)}
    ${gem(116, 0, "#f59e0b", "Ship", 4)}
    ${gem(174, 0, "#8b5cf6", "AI", 5)}
    ${gem(232, 0, "#2563eb", "Cloud", 4)}
    ${gem(290, 0, "#ef4444", "Ops", 4)}
  </g>

  ${panel(38, 696, 1204, 292, "FEATURED PROJECTS")}
  ${projectCard(70, 764, repos.accountant, "ledger")}
  ${projectCard(650, 764, repos.Pomotree, "tree")}

  ${panel(38, 1010, 304, 266, "ACHIEVEMENTS")}
  <text x="70" y="1084" class="small">100+ days of steady building</text>
  <text x="70" y="1126" class="small">Open-source projects shipped</text>
  <text x="70" y="1168" class="small">Finance and productivity tools</text>
  <text x="70" y="1210" class="small">Always learning, always building</text>

  ${panel(362, 1010, 526, 266, "GITHUB STATS")}
  <g transform="translate(400 1086)">
    ${facts.map((fact, i) => `<text x="0" y="${i * 34}" class="small gold">${escapeXml(fact[0])}</text><text x="142" y="${i * 34}" class="small">${escapeXml(fact[1])}</text>`).join("")}
  </g>
  <g transform="translate(590 1080)">
    <rect x="-24" y="-22" width="290" height="186" rx="10" fill="#c7a36a" opacity=".82"/>
    <text x="0" y="-2" class="tiny" fill="#3a2615">Contribution Map</text>
    <g transform="translate(0 18)">${contributionCells}</g>
    <text x="0" y="168" class="tiny" fill="#3a2615">Less</text><text x="218" y="168" class="tiny" fill="#3a2615">More</text>
  </g>

  ${panel(908, 1010, 334, 266, "GITHUB TROPHIES")}
  <g transform="translate(966 1080)">
    ${[[0,0,"#f59e0b"],[78,0,"#38bdf8"],[156,0,"#ef4444"],[234,0,"#8b5cf6"],[39,82,"#60a5fa"],[117,82,"#94a3b8"],[195,82,"#0ea5e9"]].map(([x,y,c]) => `<path d="M${x+28} ${y}L${x+56} ${y+16}V${y+48}L${x+28} ${y+64}L${x} ${y+48}V${y+16}Z" fill="#102033" stroke="#d8b16a"/><path d="M${x+28} ${y+10}L${x+44} ${y+20}V${y+42}L${x+28} ${y+52}L${x+12} ${y+42}V${y+20}Z" fill="${c}" opacity=".65" filter="url(#glow)"/>`).join("")}
    <text x="78" y="180" class="small">View trophies -></text>
  </g>

  <g filter="url(#softShadow)">
    <rect x="38" y="1302" width="1204" height="190" rx="10" fill="#080c14" stroke="url(#gold)"/>
    <path d="M38 1376c160-70 270-60 412-8s252 42 392-20 257-55 400 8v136H38Z" fill="#0b1220"/>
    <path d="M124 1336l28 48-28 48-28-48Z" fill="#7c3aed" filter="url(#glow)"/><path d="M1136 1336l28 48-28 48-28-48Z" fill="#7c3aed" filter="url(#glow)"/>
    <text x="640" y="1360" text-anchor="middle" class="serif" font-size="29" fill="#e9d5ff">The best way to predict the future is to build it.</text>
    <text x="292" y="1433" class="small gold">${escapeXml(user.location || "Seattle")}</text>
    <text x="570" y="1433" class="small gold">${escapeXml(user.company || "@AWS")}</text>
    <text x="792" y="1433" class="small gold">Let's build something useful.</text>
  </g>
</svg>`;

writeFileSync(join(outDir, "profile-rpg.svg"), svg);
console.log("Generated assets/profile-rpg.svg");
