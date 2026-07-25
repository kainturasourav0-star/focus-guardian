# Focus Guardian 🎯

> **AI-Powered Productivity Desktop App for Students & Professionals**
>
> Real-time distraction detection · Smart AI interventions · Deep focus analytics

[![Tech Stack](https://img.shields.io/badge/Stack-Electron%20+%20React%20+%20FastAPI-7c3aed?style=flat-square)](.)
[![Python](https://img.shields.io/badge/Python-3.11+-06b6d4?style=flat-square)](.)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=flat-square)](.)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 AI Classification | Gemini 1.5 Flash classifies every app/website as PRODUCTIVE, DISTRACTION, or NEUTRAL |
| 🚨 Smart Interventions | Elegant notifications after configurable distraction threshold (default 5 min) |
| 🎯 Focus Mode | Fullscreen focus overlay with progress ring, timer, and motivational quotes |
| 📊 Analytics | Daily charts, weekly trends, distraction pie, app usage, 24×7 heatmap |
| 💡 AI Insights | Gemini-generated daily insights (peak hours, distraction patterns, focus blocks) |
| 🤝 AI Coach | Floating contextual coach with real-time tips |
| 🏆 Goals | Study, coding, reading, and focus-hour goals with progress tracking |
| 📜 History | Full session timeline with scores and app usage breakdown |
| ⚙️ Settings | Configurable thresholds, blocked sites, allowed apps, Gemini key |
| 🔒 Privacy | 100% local — all data stored in SQLite on your machine |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** (`npm i -g pnpm`)
- **Python** 3.11+
- **Gemini API Key** — [Get one free at Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone & Install

```bash
git clone <repo>
cd focus-guardian

# Frontend dependencies
pnpm install

# Backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your GEMINI_API_KEY
```

### 3. Start Development

```bash
# Terminal 1 — Start the Python backend
cd backend
python main.py

# Terminal 2 — Start Electron + Vite
pnpm dev
```

The app will launch automatically once the backend health check passes.

---

## 🏗️ Architecture

```
Electron (Desktop Shell)
├── Main Process (main.ts)        — Backend spawn, IPC, system tray, global shortcut
├── Preload (preload.ts)          — Secure IPC bridge to renderer
└── Renderer (React + Vite)       — Premium UI

Python FastAPI (localhost:8000)
├── REST API                      — Sessions, Analytics, Goals, Settings, Insights
├── WebSocket (/ws/monitor)       — Real-time activity stream to React
├── System Monitor                — pygetwindow polling every 3 seconds
├── AI Classifier                 — Gemini 1.5 Flash with rule-based fallback
├── Analytics Engine              — Score computation, stats aggregation
└── SQLite + SQLAlchemy           — Local persistent storage
```

### Data Flow

```
Windows OS → pygetwindow → AI Classifier → ActivityLog DB
                         → WebSocket → React UI (live dashboard)
                         → Distraction threshold check → Notification
```

---

## 🔍 How It Works (System Deep Dive)

Focus Guardian is built as a hybrid desktop utility combining native OS hooks, an asynchronous local web services layer, and a hardware-accelerated React interface. Here is how each subsystem executes under the hood:

### 1. Native Activity Monitoring (`System Monitor`)
- **Active Window Polling:** The FastAPI background worker spawns a persistent polling loop that queries the operating system every **3 seconds** for the active window's reference.
- **Process Identification:**
  - On **Windows**, it uses `pygetwindow` to locate the foreground handler and extracts the title bar string.
  - On **macOS**, it relies on a Cocoa application handler to fetch active process descriptors.
- **Title Parsing:** The monitor breaks down window title structures (e.g., `Document Name - Microsoft Word` or `Tab Name · Website - Google Chrome`) to extract the application name (`Word`, `Chrome`) and the dynamic context title.

### 2. Context-Aware AI Classification (`AI Engine`)
- **Local Rule Engine (Fast Path):** To prevent network delays, the monitor first evaluates the window data against a regex list of keywords (e.g., development environments, communication apps, social platforms).
- **Gemini AI Classification (Deep Path):** If the classification is ambiguous (e.g., a browser tab with a generic title), the app dispatches the metadata to the **Gemini 1.5 Flash API**.
- **Education vs. Distraction Resolution:** The classifier uses structural prompt instructions to understand context. For example:
  - `youtube.com/watch?v=PythonTutorial` is categorized as **PRODUCTIVE** (`Study`).
  - `youtube.com/watch?v=GamingStream` is categorized as **DISTRACTION** (`Entertainment`).
- **LRU Cache Layer:** All classified results are stored in an in-memory `ClassifierCache` (up to 200 items) to prevent redundant API calls for recurring window title shifts.

### 3. Smart Intervention & Logging
- **Distraction Tracker:** When the active window is classified as a `DISTRACTION`, a monotonic stopwatch starts. If the distraction duration exceeds the configured threshold (default: 5 minutes), the backend triggers a WebSocket broadcast.
- **Desktop Alerts:** The Electron main process intercepts this event and displays a custom floating notification with interactive action buttons:
  - **Return to Work:** Dismisses the alert and brings focus back to productive windows.
  - **Snooze:** Suppresses the warning for a short duration.
  - **Ignore:** Dismisses the prompt and logs the choice.
- **Intervention DB Logging:** Every button click dispatches an event to the backend and records a structured row in the SQLite `intervention_logs` table for long-term willpower analytics.

### 4. Floating AI Coach & Live Advice
- **Activity Context Analysis:** If a focus session is active, the app counts window switches. If the user context-switches frequently (e.g., more than 6 times in a short interval) or if a focus block runs long without a break, the coach triggers.
- **Asynchronous Prompting:** An asynchronous worker thread sends the recent activity trace to the Gemini model to synthesize a supportive, non-judgmental prompt (e.g., *"You've switched apps 8 times recently, let's take a deep breath and close our messaging tabs!"*).
- **WebSocket Broadcast:** The message is pushed over the live socket and rendered inside the floating React coach bubble.

---

## 📁 Project Structure

```
focus-guardian/
├── electron/               Electron main process, preload, tray
├── src/                    React TypeScript frontend
│   ├── components/         Reusable UI components
│   ├── pages/              Page-level components (routes)
│   ├── store/              Zustand global state
│   ├── hooks/              Custom React hooks
│   ├── services/           Axios API client
│   └── types/              TypeScript type definitions
├── backend/                Python FastAPI backend
│   ├── api/                REST routes + WebSocket + middleware
│   ├── models/             SQLAlchemy ORM models
│   ├── schemas/            Pydantic request/response schemas
│   ├── services/           AI classifier, monitor, analytics
│   ├── adapters/           Platform-specific window monitors
│   └── scripts/            Demo data seeding, crash recovery
└── assets/                 Icons and images
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Desktop Shell | Electron 28 |
| Frontend | React 18 + TypeScript 5 |
| Styling | Tailwind CSS v3 + Glassmorphism |
| State | Zustand |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Python 3.11 + FastAPI |
| AI | Google Gemini 1.5 Flash |
| Database | SQLite + SQLAlchemy + Alembic |
| Monitor | pygetwindow (Windows) |
| Build | Vite + electron-builder |

---

## 🤖 AI Features

### App Classification
Every 3 seconds (on window change), Focus Guardian sends the active app + window title to Gemini 1.5 Flash:
```
Classify: app="Firefox", title="Instagram · Home"
→ DISTRACTION (confidence: 0.97)
```

If Gemini is unavailable (rate limit, no key, offline), the **rule-based fallback classifier** takes over automatically.

### AI Insights (End of Day)
```
"You focus best between 9 AM and 11 AM."
"Most distractions occur after 37 minutes of focused work."
"Your biggest distraction today was YouTube (42 min)."
"Average uninterrupted focus block: 28 minutes."
```

### AI Coach
Real-time contextual tips based on your last 10 minutes of activity:
```
"You've switched applications 8 times in the last 10 minutes."
"Take a 5-minute break — you've been coding for 52 minutes straight!"
```

---

## ⚙️ Configuration

All settings are in the **Settings** page:

| Setting | Default | Description |
|---|---|---|
| Warning Threshold | 5 min | How long on a distraction before alert |
| Focus Duration | 25 min | Pomodoro-style session length |
| Break Duration | 5 min | Break length |
| Idle Threshold | 90 sec | AFK detection — pauses session clock |
| Gemini API Key | — | Required for AI features |

---

## 📦 Build for Production

### Windows Installer (.exe)
```bash
# Build PyInstaller backend binary
cd backend
pyinstaller --onefile main.py -n backend

# Move binary
cp dist/backend.exe ../assets/

# Build Electron installer
cd ..
pnpm dist
```

Output: `release/FocusGuardian-Setup-1.0.0.exe`

---

## 🔒 Privacy

Focus Guardian is **100% local**:
- All data stored in SQLite on your machine (`backend/focus_guardian.db`)
- No analytics, no telemetry, no cloud sync
- Only network requests: Gemini API (optional) for AI features
- Window title monitoring only — no keylogging, no screenshots

---

## 🌐 Platform Support

| Platform | Status |
|---|---|
| Windows 10/11 | ✅ Full support |
| macOS | 🔧 UI works, system monitor is a stub |
| Linux | 🔧 UI works, system monitor is a stub |

---

## 🔮 Future Roadmap

- [ ] Browser extension for exact URL tracking
- [ ] Website blocking via hosts file
- [ ] Calendar integration (block distractions during meetings)
- [ ] Cross-device sync
- [ ] macOS and Linux system monitors
- [ ] Custom AI model support (OpenAI, Ollama)
- [ ] Team productivity mode

---

## 📄 License

MIT — built with ❤️ for hackathons and productivity enthusiasts.
