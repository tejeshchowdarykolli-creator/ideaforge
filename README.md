# 🔨 IdeaForge — AI Idea Improvement Assistant

> **Turn rough ideas into buildable solutions.**

IdeaForge is a chat-first AI workspace designed for students and hackathon participants. Instead of overwhelming builders with complex dashboards or generic chatbot conversations, IdeaForge follows a clear, focused paradigm:

```
CHAT ──► UNDERSTAND ──► WORKSPACE ──► ACTION
```

1. **Chat:** Enter any raw idea (e.g., *"I want to build an AI system that helps farmers detect crop diseases."*).
2. **Understand:** The AI parses the concept, checks for missing constraints, scores maturity, and identifies the appropriate intent.
3. **Workspace:** Dynamically routes into one of three dedicated workspaces:
   - **RESEARCH:** When user demand, market gaps, or core assumptions are unverified.
   - **IMPROVE:** When the premise is strong but requires scope sharpening, risk mitigation, and cutting feature creep.
   - **BUILD:** When the idea is ready for system architecture (Mermaid.js diagram), tech stack selection, and a 24-hour sprint checklist.
4. **Action:** Take immediate next steps or export a complete GitHub-ready markdown project spec.

---

## 🎨 Product & Design Principles

- **No generic ChatGPT clone:** Replaces conversational back-and-forth with structured, purpose-driven workspaces.
- **No complicated dashboards:** Extremely focused, clean entry screen with dark typography, light neutral background, and restrained accents.
- **Productivity-tool aesthetic:** Built with Linear / Raycast / Notion minimalism in mind — clean borders, Inter typography, and zero distracting gimmicks (no neon colors, no fake stats, no glassmorphism).

---

## 🛠 Tech Stack

- **Frontend:**
  - React 18
  - Vite
  - Tailwind CSS
  - Mermaid.js (dynamic system architecture rendering)
  - Lucide React (minimalist iconography)
- **Backend:**
  - Python 3
  - Flask + Flask-CORS
  - python-dotenv
  - requests
- **AI Provider (Configurable):**
  - **Google Gemini** (`gemini-2.5-flash` / `gemini-3.8-flash` via `GEMINI_API_KEY`)
  - **OpenAI** (`gpt-4o-mini` via `OPENAI_API_KEY`)
  - **Intelligent Heuristic Engine (Mock):** Automatically runs out-of-the-box if no API key is provided, allowing instant evaluation without external dependencies.
- **Database:**
  - Intentionally zero-database for the MVP prototype. All workspace state is live and responsive.

---

## 📂 Project Structure

```
ai-idea-improvement-assistant/
├── backend/
│   ├── app.py                 # Flask server with /api/analyze route & AI provider abstraction
│   ├── requirements.txt       # Python dependencies (Flask, Flask-CORS, requests, etc.)
│   └── .env.example           # Environment template (GEMINI_API_KEY, OPENAI_API_KEY)
├── frontend/
│   ├── index.html             # Minimalist light HTML entry
│   ├── package.json           # React, Vite, Tailwind, Mermaid dependencies
│   ├── vite.config.js         # Vite dev server with proxy /api -> http://127.0.0.1:5000
│   ├── tailwind.config.js     # Restrained design system tokens & font stack
│   ├── postcss.config.js      # PostCSS configuration
│   └── src/
│       ├── main.jsx           # React application mount
│       ├── App.jsx            # Main app orchestrator & state machine
│       ├── index.css          # Clean neutral styling & custom scrollbars
│       └── components/
│           ├── ChatHome.jsx          # Minimal opening screen ("What are you building?")
│           ├── IdeaInput.jsx         # Clean auto-growing textarea & "Analyze idea →" action
│           ├── SuggestionButtons.jsx # Preset suggestion prompts (Improve, Research, Plan)
│           ├── AnalyzingState.jsx    # 3-step progress loader ("Understanding your idea...")
│           ├── WorkspaceRouter.jsx   # Dynamic workspace tab router & summary header
│           ├── ResearchWorkspace.jsx # Market need, competitors, unknowns & validation tasks
│           ├── ImproveWorkspace.jsx  # Value proposition, risks, Must-Haves vs What to Cut
│           ├── BuildWorkspace.jsx    # Tech stack, 24h sprint timeline & export spec
│           └── MermaidDiagram.jsx    # Live interactive Mermaid.js diagram viewer
├── .gitignore                 # Standard node_modules, Python cache, and .env ignores
└── README.md                  # Complete documentation & local run commands
```

---

## 🚀 Running Locally

### Prerequisites

- **Node.js** (v18+) & **npm**
- **Python** (3.10+) & **pip**

---

### Step 1: Start the Backend (Flask)

Open a terminal and navigate to `backend`:

```bash
cd backend
```

Create and activate a virtual environment:

**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install backend dependencies:
```bash
pip install -r requirements.txt
```

*(Optional)* Configure your AI Provider:
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your `GEMINI_API_KEY` or `OPENAI_API_KEY`. If left empty, IdeaForge automatically runs its built-in intelligent heuristic engine so you can test all features immediately.

Start the Flask API server:
```bash
python app.py
```
> The backend runs on `http://127.0.0.1:5000`.

---

### Step 2: Start the Frontend (React + Vite)

Open a second terminal and navigate to `frontend`:

```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
> The frontend opens at `http://localhost:3000`. Vite automatically proxies `/api` requests to `http://127.0.0.1:5000`.

---

## 📡 API Specification

### `POST /api/analyze`

Analyzes an idea description and returns structured classification and workspace data.

#### Request Body
```json
{
  "idea": "I want to build an AI system that helps farmers detect crop diseases.",
  "feedback": "Optional constraint or refinement string"
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "mode": "live_gemini | live_openai | simulated",
  "provider": "gemini | openai | mock",
  "data": {
    "intent": "research",
    "summary": "AI crop disease diagnosis system for smallholder farmers using computer vision.",
    "next_action": "research",
    "reason": "The domain problem has significant utility, but local constraints (e.g., offline usage, distribution) need direct validation before coding.",
    "confidence": 0.86,
    "is_research_useful": true,
    "is_improvement_needed": true,
    "is_ready_to_build": false,
    "research": {
      "target_audience": "Smallholder farmers, rural agricultural cooperatives.",
      "market_need": "Early pathology detection prevents 30-40% harvest loss.",
      "existing_alternatives": ["Plantix", "Agro-chemical sales reps", "Paper manuals"],
      "critical_unknowns": ["Is 4G reliable or is offline on-device inference needed?"],
      "validation_checklist": ["Interview 5 farmers", "Collect 20 leaf photos"]
    },
    "improve": {
      "refined_pitch": "Real-time crop disease diagnosis in a farmer's hand, working offline.",
      "value_proposition": "Preserves crop yield without waiting days for agronomists.",
      "identified_risks": ["False positives leading to improper pesticide use"],
      "must_have_features": ["Camera leaf capture", "Localized remedy card"],
      "cut_features": ["Satellite imagery NDVI", "Drone delivery integration"],
      "key_differentiator": "Lightweight on-device offline vision pipeline"
    },
    "build": {
      "tech_stack": {
        "frontend": ["React", "Vite", "Tailwind CSS", "PWA"],
        "backend": ["Python", "Flask", "OpenCV"],
        "ai_services": ["Gemini 3.8 Flash Vision API", "TFLite"],
        "storage": ["IndexedDB (Client Offline)", "SQLite"],
        "rationale": "PWA enables zero-friction mobile testing on Android."
      },
      "mermaid_diagram": "flowchart TD\n  Farmer[Farmer Phone] --> PWA[React PWA]\n  PWA --> API[Flask API]\n  API --> Gemini[Gemini Vision]\n  Gemini --> API\n  API --> PWA",
      "sprint_timeline": [
        {"phase": "Hours 0-4: Foundation", "goal": "Setup repository & API", "tasks": ["..."]},
        {"phase": "Hours 4-14: Core Loop", "goal": "AI vision integration", "tasks": ["..."]},
        {"phase": "Hours 14-20: Polish & Testing", "goal": "Offline caching", "tasks": ["..."]},
        {"phase": "Hours 20-24: Pitch & Demo", "goal": "Record demo video", "tasks": ["..."]}
      ],
      "implementation_checklist": ["Verify end-to-end API communication"]
    }
  }
}
```

---

## 🔮 What to Build Next

1. **Persistence & Saved Workspaces:** Add lightweight SQLite/PostgreSQL storage or browser LocalStorage so participants can maintain multiple project ideas.
2. **Interactive Whiteboard / Canvas:** Allow dragging features from "What to Cut" into "Must-Have" interactively.
3. **One-Click GitHub Starter Generator:** Automatically generate a starter GitHub repository with boilerplate code matching the recommended tech stack.
4. **Hackathon Pitch Deck Exporter:** Export structured slides (Problem, Solution, Tech Stack, Demo flow) to PDF or presentation format.
