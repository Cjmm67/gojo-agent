# Gojo-sensei — AI Anime Companion for Max

An AI chat companion where Max (age 11) can talk to Satoru Gojo from Jujutsu Kaisen. Built with Next.js + Claude 3.5 Haiku, hardened with 7 layers of child-safety guardrails.

## Quick Start

```bash
# 1. Install
cd gojo-agent
npm install

# 2. Configure
cp .env.example .env.local
# Edit .env.local:
#   ANTHROPIC_API_KEY=sk-ant-your-real-key-here
#   MAX_PIN=____          (4-digit PIN for Max to enter)
#   PARENT_PASSWORD=____  (password for the parent dashboard)

# 3. Run
npm run dev
```

- **Max's chat:** [http://localhost:3000](http://localhost:3000) — enter the 4-digit PIN
- **Parent dashboard:** [http://localhost:3000/parent](http://localhost:3000/parent) — enter the parent password

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Max's Browser                          │
│                                                          │
│  ┌──────────┐         ┌──────────────────────┐          │
│  │ PIN Gate  │────OK──→│     Chat Window      │          │
│  │ (4-digit) │         │  Gojo-themed UI      │          │
│  └──────────┘         │  Break reminders      │          │
│                        └──────────┬───────────┘          │
└───────────────────────────────────┼──────────────────────┘
                                    │ POST /api/chat
                                    ▼
┌──────────────────────────────────────────────────────────┐
│                    Next.js Server                         │
│                                                          │
│  ┌────────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │Auth Check   │→│ INPUT    │→│  Claude 3.5 Haiku   │   │
│  │(cookie)     │  │ FILTERS  │  │  (with system      │   │
│  └────────────┘  │• PII     │  │   prompt)           │   │
│                   │• Profan. │  └─────────┬──────────┘   │
│                   │• Inject. │            ▼              │
│                   │• Distress│  ┌────────────────────┐   │
│                   └──────────┘  │  OUTPUT FILTERS    │   │
│                                  │• Content safety   │   │
│                   ┌──────────┐  │• URL stripping     │   │
│                   │ LOGGER   │←│• Length check       │   │
│                   │ chat-logs│  └────────────────────┘   │
│                   └────┬─────┘                           │
│                        ▼                                 │
│              ┌────────────────┐                          │
│              │ PARENT DASH    │  ← /parent               │
│              │ (password)     │                          │
│              └────────────────┘                          │
└──────────────────────────────────────────────────────────┘
```

## Safety Layers

### Layer 1: Authentication
- 4-digit PIN gate — Max needs the code to access chat
- PIN stored server-side as env variable
- Auth cookie expires after 4 hours

### Layer 2: System Prompt Guardrails
- Gojo persona locked to anime/manga topics only
- 10 hard rules that cannot be overridden
- 3-tier welfare response protocol with Singapore helplines
- Anti-parasocial bonding rules (no "I love you", "best friend" etc.)
- Transparency: Max is told parents can see chats

### Layer 3: Input Filters (pre-Claude)
- **PII detection:** Phone, email, school name, address, postal code, name disclosure
- **Profanity filter:** Word-boundary matching to avoid false positives
- **Prompt injection blocker:** Catches jailbreak attempts, "ignore instructions", DAN mode etc.
- **Distress detection:** 3-tier keyword matching for welfare escalation

### Layer 4: Output Filters (post-Claude)
- **Content classifier:** Sexual, violence, substances, gambling, weapons
- **Parasocial blocker:** Catches "I love you", "I'll always be here", secret-keeping
- **URL stripping:** Removes any links Claude generates
- **Length limiter:** Caps responses at 1000 chars, cuts at sentence boundary
- **Anime whitelist:** JJK terms (Domain Expansion, Cursed Energy etc.) won't false-positive

### Layer 5: Session Controls
- 30-minute break reminder modal
- 2-second rate limiting between messages
- 500-character input limit
- 4-hour auth expiry

### Layer 6: Welfare Protocol
| Tier | Trigger | Action |
|------|---------|--------|
| 1 — Mild | "sad", "bad day", "lonely" | Claude handles in-character, gentle redirect |
| 2 — Concerning | Bullying, being hurt, "everyone hates me" | Blocks Claude, shows Tinkle Friend helpline, logs for parent |
| 3 — Serious | Self-harm, abuse, "want to die" | Blocks Claude, urgent helpline message, immediate parent alert |

**Singapore resources provided:**
- Tinkle Friend: 1800-274-4788 (for primary school kids)
- Samaritans of Singapore: 1767 (24/7 crisis)
- Child Protective Service: 1800-777-0000

### Layer 7: Parental Oversight
- All conversations logged to `chat-logs/` as daily JSONL files
- Parent dashboard at `/parent` (password protected)
- Dashboard shows: message counts, welfare alerts, filter blocks per day
- Drill into any day to see full conversation transcript
- Welfare alerts highlighted in red with full context

## Security Headers
- `X-Frame-Options: DENY` — prevents iframe embedding
- `Content-Security-Policy` — restricts resource loading
- `Permissions-Policy` — blocks camera, microphone, geolocation
- `httpOnly` auth cookies — prevents XSS token theft

## File Structure

```
gojo-agent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/route.ts           # PIN verification
│   │   │   ├── chat/route.ts           # Main chat endpoint
│   │   │   └── parent/logs/route.ts    # Parent log viewer API
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx          # Main chat interface
│   │   │   ├── ChatBubble.tsx          # Message bubbles
│   │   │   ├── BreakReminder.tsx       # 30-min break modal
│   │   │   └── PinGate.tsx             # PIN entry screen
│   │   ├── parent/
│   │   │   ├── page.tsx                # Parent dashboard UI
│   │   │   └── layout.tsx              # Parent layout
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Home (PIN → Chat)
│   │   └── globals.css                 # Anime-themed styles
│   └── lib/
│       ├── system-prompt.ts            # Gojo persona + safety rules
│       ├── input-filter.ts             # Pre-API content filters
│       ├── output-filter.ts            # Post-API content filters
│       ├── welfare.ts                  # Distress detection + escalation
│       └── logger.ts                   # Conversation file logger
├── public/
│   └── gojo-avatar.svg                # Gojo avatar (SVG)
├── chat-logs/                          # Auto-created, gitignored
├── .env.example                        # Template for environment vars
├── .gitignore
├── next.config.js                      # Security headers
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Production Deployment Notes

When deploying (Vercel, Railway, etc.):
1. Set all env variables in the hosting platform's dashboard
2. Move chat logging from file system to a database (file system is ephemeral on most platforms)
3. Add real email/SMS alerts for Tier 3 welfare events
4. Consider adding a daily summary email to parents
5. Add proper session management (JWT or similar) instead of simple cookie
6. Set up monitoring for API costs and unusual usage patterns

## Cost Estimate

Claude 3.5 Haiku at typical Max usage (~20 messages/day):
- **~$0.02/day** → ~$0.60/month
- Even heavy use (100 messages/day) would be ~$3/month

## Legal Notes

- Compliant with Singapore PDPA Children's Data Guidelines (minimal data, parental oversight)
- Break reminders align with emerging SAFEBOTs Act requirements
- No user profiling, no data collection beyond chat logs for parental review
- Gojo character used in fan/educational context — for commercial use, consult IP counsel re: Shueisha/MAPPA licensing
