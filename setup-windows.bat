@echo off
REM =============================================================
REM Gojo-sensei Agent — Windows Setup Script
REM Run this in Command Prompt from the folder where you want the project
REM =============================================================

echo.
echo ========================================
echo   Gojo-sensei Agent - Project Setup
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Create project folder
if exist gojo-agent (
    echo WARNING: gojo-agent folder already exists!
    echo Delete it first or choose a different location.
    pause
    exit /b 1
)

echo [1/5] Creating project structure...
mkdir gojo-agent
cd gojo-agent
mkdir src\app\api\chat
mkdir src\app\api\auth
mkdir src\app\api\parent\logs
mkdir src\app\components
mkdir src\app\parent
mkdir src\lib
mkdir public

echo [2/5] Creating configuration files...

REM package.json
(
echo {
echo   "name": "gojo-agent",
echo   "version": "1.0.0",
echo   "private": true,
echo   "scripts": {
echo     "dev": "next dev",
echo     "build": "next build",
echo     "start": "next start"
echo   },
echo   "dependencies": {
echo     "@anthropic-ai/sdk": "^0.39.0",
echo     "next": "^14.2.0",
echo     "react": "^18.3.0",
echo     "react-dom": "^18.3.0"
echo   },
echo   "devDependencies": {
echo     "@types/node": "^22.0.0",
echo     "@types/react": "^18.3.0",
echo     "@types/react-dom": "^18.3.0",
echo     "autoprefixer": "^10.4.0",
echo     "postcss": "^8.4.0",
echo     "tailwindcss": "^3.4.0",
echo     "typescript": "^5.6.0"
echo   }
echo }
) > package.json

REM tsconfig.json
(
echo {
echo   "compilerOptions": {
echo     "target": "ES2017",
echo     "lib": ["dom", "dom.iterable", "esnext"],
echo     "allowJs": true,
echo     "skipLibCheck": true,
echo     "strict": true,
echo     "noEmit": true,
echo     "esModuleInterop": true,
echo     "module": "esnext",
echo     "moduleResolution": "bundler",
echo     "resolveJsonModule": true,
echo     "isolatedModules": true,
echo     "jsx": "preserve",
echo     "incremental": true,
echo     "plugins": [{ "name": "next" }],
echo     "paths": { "@/*": ["./src/*"] }
echo   },
echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
echo   "exclude": ["node_modules"]
echo }
) > tsconfig.json

REM .gitignore
(
echo node_modules/
echo .next/
echo .env
echo .env.local
echo chat-logs/
) > .gitignore

REM .env.example
(
echo ANTHROPIC_API_KEY=sk-ant-your-key-here
echo MAX_PIN=1234
echo PARENT_PASSWORD=parent123
echo SESSION_LIMIT_MINUTES=30
) > .env.example

REM tailwind.config.js
(
echo /** @type {import('tailwindcss').Config} */
echo module.exports = {
echo   content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
echo   theme: {
echo     extend: {
echo       colors: {
echo         gojo: {
echo           blue: "#4A90D9",
echo           dark: "#1a1a2e",
echo           purple: "#6C3CE1",
echo           light: "#e8f0fe",
echo         },
echo       },
echo     },
echo   },
echo   plugins: [],
echo };
) > tailwind.config.js

REM postcss.config.js
(
echo module.exports = {
echo   plugins: {
echo     tailwindcss: {},
echo     autoprefixer: {},
echo   },
echo };
) > postcss.config.js

REM next.config.js
(
echo /** @type {import('next').NextConfig} */
echo const nextConfig = {
echo   async headers^(^) {
echo     return [
echo       {
echo         source: "/^(.*^)",
echo         headers: [
echo           { key: "X-Frame-Options", value: "DENY" },
echo           { key: "X-Content-Type-Options", value: "nosniff" },
echo           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
echo           { key: "Permissions-Policy", value: "camera=^(^), microphone=^(^), geolocation=^(^)" },
echo         ],
echo       },
echo     ];
echo   },
echo };
echo module.exports = nextConfig;
) > next.config.js

echo [3/5] Configuration files created
echo [4/5] Source files need to be downloaded separately
echo [5/5] Setup script complete
echo.
echo ========================================
echo   Next steps:
echo   1. Download source files (see instructions)
echo   2. npm install
echo   3. cp .env.example .env.local
echo   4. Edit .env.local with your real values
echo   5. npm run dev
echo ========================================
pause
