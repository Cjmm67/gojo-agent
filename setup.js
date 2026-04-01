#!/usr/bin/env node
// =============================================================
// Gojo-sensei Agent — Full Project Generator
// Run: node setup.js
// Creates the entire project in a ./gojo-agent folder
// =============================================================

const fs = require("fs");
const path = require("path");

const PROJECT = "gojo-agent";

function writeFile(filePath, content) {
  const fullPath = path.join(PROJECT, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), "utf-8");
  console.log(`  + ${filePath}`);
}

console.log("\n========================================");
console.log("  Gojo-sensei Agent - Project Generator");
console.log("========================================\n");

if (fs.existsSync(PROJECT)) {
  console.log(`ERROR: '${PROJECT}' folder already exists. Delete it first or run from a different location.`);
  process.exit(1);
}

console.log("Creating project...\n");

// ===== package.json =====
writeFile("package.json", JSON.stringify({
  name: "gojo-agent",
  version: "1.0.0",
  private: true,
  scripts: { dev: "next dev", build: "next build", start: "next start" },
  dependencies: {
    "@anthropic-ai/sdk": "^0.39.0",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  devDependencies: {
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0"
  }
}, null, 2) + "\n");

// ===== tsconfig.json =====
writeFile("tsconfig.json", JSON.stringify({
  compilerOptions: {
    target: "ES2017", lib: ["dom","dom.iterable","esnext"], allowJs: true, skipLibCheck: true,
    strict: true, noEmit: true, esModuleInterop: true, module: "esnext",
    moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true,
    jsx: "preserve", incremental: true, plugins: [{ name: "next" }],
    paths: { "@/*": ["./src/*"] }
  },
  include: ["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],
  exclude: ["node_modules"]
}, null, 2) + "\n");

// ===== .gitignore =====
writeFile(".gitignore", `node_modules/
.next/
.env
.env.local
chat-logs/
`);

// ===== .env.example =====
writeFile(".env.example", `# Gojo-sensei Environment Variables
# Copy this to .env.local and fill in your values
ANTHROPIC_API_KEY=sk-ant-your-key-here
MAX_PIN=1234
PARENT_PASSWORD=parent123
SESSION_LIMIT_MINUTES=30
`);

// ===== tailwind.config.js =====
writeFile("tailwind.config.js", `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gojo: { blue: "#4A90D9", dark: "#1a1a2e", purple: "#6C3CE1", light: "#e8f0fe" },
      },
    },
  },
  plugins: [],
};
`);

// ===== postcss.config.js =====
writeFile("postcss.config.js", `module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
`);

// ===== next.config.js =====
writeFile("next.config.js", `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';" },
      ],
    }];
  },
};
module.exports = nextConfig;
`);

// ===== public/gojo-avatar.svg =====
writeFile("public/gojo-avatar.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="95" fill="#1a1a2e" stroke="#4A90D9" stroke-width="3"/>
  <ellipse cx="100" cy="65" rx="55" ry="45" fill="#e8e8f0"/>
  <path d="M50 70 Q55 30 75 50 Q80 25 95 45 Q100 20 110 40 Q120 22 130 48 Q140 28 145 55 Q155 35 150 70" fill="#e8e8f0"/>
  <ellipse cx="100" cy="95" rx="42" ry="38" fill="#fce4d6"/>
  <rect x="55" y="80" width="90" height="18" rx="9" fill="#2a2a3e"/>
  <rect x="55" y="80" width="90" height="18" rx="9" fill="none" stroke="#4A90D9" stroke-width="1.5"/>
  <path d="M80 108 Q100 122 120 108" fill="none" stroke="#c96b5a" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M65 128 Q100 145 135 128" fill="#1a1a4e" stroke="#4A90D9" stroke-width="1"/>
  <path d="M75 130 L100 142 L125 130" fill="none" stroke="#4A90D9" stroke-width="1.5"/>
  <circle cx="85" cy="89" r="4" fill="#4A90D9" opacity="0.6"/>
  <circle cx="115" cy="89" r="4" fill="#6C3CE1" opacity="0.6"/>
  <circle cx="85" cy="89" r="8" fill="none" stroke="#4A90D9" opacity="0.3" stroke-width="1"/>
  <circle cx="115" cy="89" r="8" fill="none" stroke="#6C3CE1" opacity="0.3" stroke-width="1"/>
</svg>
`);

console.log("\n  Now copying source files...\n");

// ===== REMAINING FILES: Read from existing project and embed =====
// Since we're running setup.js, we read the already-built source files

const sourceFiles = [
  "src/lib/system-prompt.ts",
  "src/lib/input-filter.ts",
  "src/lib/output-filter.ts",
  "src/lib/logger.ts",
  "src/lib/welfare.ts",
  "src/app/api/chat/route.ts",
  "src/app/api/auth/route.ts",
  "src/app/api/parent/logs/route.ts",
  "src/app/components/ChatWindow.tsx",
  "src/app/components/ChatBubble.tsx",
  "src/app/components/BreakReminder.tsx",
  "src/app/components/PinGate.tsx",
  "src/app/parent/page.tsx",
  "src/app/parent/layout.tsx",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/globals.css",
];

// Check if source files exist alongside setup.js (in existing project)
const scriptDir = __dirname;
let copiedFromSource = false;

for (const file of sourceFiles) {
  const srcPath = path.join(scriptDir, file);
  if (fs.existsSync(srcPath)) {
    const content = fs.readFileSync(srcPath, "utf-8");
    writeFile(file, content);
    copiedFromSource = true;
  }
}

if (!copiedFromSource) {
  console.log("\n  WARNING: Source files not found next to setup.js.");
  console.log("  Make sure setup.js is in the root of the gojo-agent project.\n");
}

console.log(`
========================================
  Project created in ./${PROJECT}/
========================================

  Next steps:

  1. cd ${PROJECT}
  2. npm install
  3. copy .env.example .env.local
  4. Edit .env.local with your real values:
     - ANTHROPIC_API_KEY=sk-ant-your-new-key
     - MAX_PIN=____  (4-digit PIN for Max)
     - PARENT_PASSWORD=____  (your parent dashboard password)
  5. npm run dev
  6. Open http://localhost:3000 (Max's chat)
  7. Open http://localhost:3000/parent (your dashboard)

========================================
`);
