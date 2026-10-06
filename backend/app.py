import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all /api routes
CORS(app, resources={r"/api/*": {"origins": "*"}})

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
AI_PROVIDER = os.getenv("AI_PROVIDER", "auto").lower()  # "auto", "gemini", "openai", "mock"


def get_active_provider() -> str:
    """Determines the active AI provider based on configuration and available API keys."""
    if AI_PROVIDER == "mock":
        return "mock"
    if AI_PROVIDER == "gemini" and GEMINI_API_KEY:
        return "gemini"
    if AI_PROVIDER == "openai" and OPENAI_API_KEY:
        return "openai"
    if AI_PROVIDER == "auto":
        if GEMINI_API_KEY:
            return "gemini"
        if OPENAI_API_KEY:
            return "openai"
    return "mock"


def clean_json_text(text: str) -> str:
    """Strips markdown code blocks (```json ... ```) from LLM output if present."""
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()


def build_system_prompt() -> str:
    return """You are IdeaForge, an expert AI Idea Improvement Assistant for hackathons and software projects.
Your goal is to evaluate rough ideas from developers and students, identify their exact maturity, and route them to one of three dynamic workspaces:
1. "research" - The idea addresses an unverified problem, has unknown market demand, or lacks clarity on target users and existing competitors.
2. "improve" - The idea has a solid premise, but lacks clear scope, differentiation, monetization, or carries unmitigated technical/product risks.
3. "build" - The idea is already well-defined, realistic, and ready for technical architecture, tech stack selection, and a hackathon build plan.

You MUST respond with valid JSON strictly conforming to this schema (no extra markdown outside the JSON):
{
  "intent": "improve" | "research" | "build",
  "summary": "1-2 sentence crisp, professional summary of the idea",
  "next_action": "research" | "improve" | "build",
  "reason": "Clear 2-sentence rationale for why this workspace and next action were selected",
  "confidence": 0.85,
  "is_research_useful": true | false,
  "is_improvement_needed": true | false,
  "is_ready_to_build": true | false,
  "research": {
    "target_audience": "Specific user personas or customer segment",
    "market_need": "Why this problem is painful right now",
    "existing_alternatives": ["Existing tool or competitor 1", "Existing tool 2", "Manual workaround"],
    "critical_unknowns": ["Crucial question to answer 1", "Crucial question 2", "Crucial question 3"],
    "validation_checklist": ["Concrete validation action 1", "Concrete validation action 2", "Concrete validation action 3"]
  },
  "improve": {
    "refined_pitch": "Crisp one-liner value proposition",
    "value_proposition": "Clear statement of what unique value is unlocked",
    "identified_risks": ["Key technical/product risk 1", "Adoption or distribution risk 2"],
    "must_have_features": ["Core MVP feature 1", "Core MVP feature 2", "Core MVP feature 3"],
    "cut_features": ["Feature to CUT to avoid scope creep 1", "Feature to CUT 2"],
    "key_differentiator": "The unfair advantage or unique wedge that makes this stand out"
  },
  "build": {
    "tech_stack": {
      "frontend": ["React", "Vite", "Tailwind CSS"],
      "backend": ["Python", "Flask"],
      "ai_services": ["Gemini API", "OpenCV"],
      "storage": ["PostgreSQL", "Local Cache"],
      "rationale": "Why this stack is ideal for a 24-48 hour hackathon build"
    },
    "mermaid_diagram": "flowchart TD\\n  User[User / Client] --> UI[React Frontend]\\n  UI --> API[Flask API Server]\\n  API --> AI[AI / LLM Engine]\\n  AI --> API\\n  API --> UI",
    "sprint_timeline": [
      {"phase": "Hours 0-4: Foundation", "goal": "Setup repository, API scaffolding, initial UI layout", "tasks": ["Scaffold Vite + React", "Setup Flask endpoints", "Define data schemas"]},
      {"phase": "Hours 4-14: Core Loop", "goal": "End-to-end prompt engineering, backend route, dynamic workspace", "tasks": ["Integrate LLM API", "Build input state", "Render dynamic workspace"]},
      {"phase": "Hours 14-20: Polish & Testing", "goal": "Mermaid diagrams, edge cases, responsive UI", "tasks": ["Add Mermaid renderer", "Handle API timeouts", "Design QA"]},
      {"phase": "Hours 20-24: Pitch & Demo", "goal": "Record 2-min demo video, finalize README, test script", "tasks": ["Record demo video", "Write README.md", "Prepare presentation"]}
    ],
    "implementation_checklist": [
      "Verify end-to-end API communication",
      "Ensure graceful fallback when AI keys are missing",
      "Deploy or test locally on port 3000 & 5000"
    ]
  }
}
"""


def generate_mock_analysis(idea: str, feedback: str = "") -> dict:
    """High-fidelity heuristic generator that parses the user's idea and produces a structured result."""
    text_lower = idea.lower()
    
    # Classify intent based on semantic markers in the prompt
    is_agri = any(w in text_lower for w in ["farm", "crop", "plant", "disease", "agriculture", "soil"])
    is_intern = any(w in text_lower for w in ["intern", "internship", "job", "career", "hiring", "recruit", "resume"])
    is_notes = not is_intern and any(w in text_lower for w in ["note", "notes", "lecture", "study", "upload", "credit", "campus", "academic"])
    is_dev = any(w in text_lower for w in ["pr", "code", "github", "developer", "lint", "git", "review", "bug", "hackathon"])
    is_health = any(w in text_lower for w in ["health", "patient", "doctor", "medical", "clinic", "diagnosis"])
    is_build_ready = any(w in text_lower for w in ["plan", "build", "stack", "architecture", "hackathon project", "24 hours", "prototype"])
    
    # Determine dominant intent & workspace
    if is_build_ready or is_dev:
        intent = "build"
        next_action = "build"
        confidence = 0.89
        is_research_useful = False
        is_improvement_needed = False
        is_ready_to_build = True
        reason = "The problem statement and implementation scope are clearly delineated. Immediate priority is technical architecture and the hackathon build sprint."
    elif is_intern:
        intent = "build"
        next_action = "build"
        confidence = 0.88
        is_research_useful = False
        is_improvement_needed = True
        is_ready_to_build = True
        reason = "Matching students to internships has high utility and clear MVP boundaries. Priority is automated matching scoring and technical MVP execution."
    elif is_notes or "monetize" in text_lower or "improve" in text_lower:
        intent = "improve"
        next_action = "improve"
        confidence = 0.84
        is_research_useful = True
        is_improvement_needed = True
        is_ready_to_build = False
        reason = "The core premise is understandable, but value proposition and moderation mechanics require scope sharpening before technical implementation."
    else:
        # Default or agriculture/exploratory idea -> research or improve
        intent = "research" if is_agri or len(idea.split()) < 15 else "improve"
        next_action = "research" if intent == "research" else "improve"
        confidence = 0.86
        is_research_useful = True
        is_improvement_needed = True
        is_ready_to_build = False
        reason = "The domain problem has significant utility, but local constraints (e.g., offline usage, distribution, target user context) need direct validation before coding."

    # Contextual summary
    slug = idea.strip()
    if len(slug) > 85:
        slug = slug[:82] + "..."
    summary = f"Initiative: {slug}"

    if is_agri:
        summary = "AI-powered mobile crop disease diagnosis assistant for farmers using computer vision and localized treatment guidance."
        target_audience = "Smallholder farmers, rural agricultural extension workers, and regional agronomy cooperatives."
        market_need = "Early plant pathology detection prevents 30-40% crop yield loss, yet rural agronomist visits are infrequent and expensive."
        existing_alts = ["Plantix & Google Lens", "Local agro-chemical dealers (often push expensive products)", "Manual agricultural extension manuals"]
        critical_unknowns = [
            "Will farmers have reliable 4G connectivity in the fields, or is on-device offline inference required?",
            "What camera resolution and lighting variance will the model encounter across different plant canopies?",
            "How will recommendations account for locally available and affordable organic/chemical remedies?"
        ]
        checklist = [
            "Interview 5 local farmers or gardening enthusiasts about how they currently diagnose yellowing leaves.",
            "Collect a test dataset of 20 high-resolution disease leaf photos under harsh midday sunlight.",
            "Verify whether a quantized MobileNet/TFLite model fits within typical Android device RAM constraints."
        ]
        pitch = "Real-time crop disease diagnosis right in the palm of a farmer's hand, working offline and speaking local languages."
        val_prop = "Instant, trustworthy disease detection that preserves harvest yield without waiting days for an expert visit."
        risks = ["False positive disease predictions leading to costly incorrect treatments.", "Farmer hesitation to trust app recommendations without community validation."]
        must_haves = [
            "One-tap leaf camera capture with instant disease classification score",
            "Actionable remedy card outlining symptoms, organic cures, and chemical treatments",
            "Offline mode caching recent diagnoses and offline disease dictionary"
        ]
        cut_features = ["Satellite imagery NDVI integration (too slow for 24h MVP)", "Peer-to-peer farmer social network forum", "Automated drone delivery integration"]
        differentiator = "Lightweight on-device offline vision pipeline optimized for low-end Android smartphones."
        frontend_stack = ["React", "Vite", "Tailwind CSS", "HTML5 Camera API / PWA"]
        backend_stack = ["Python", "Flask", "Pillow / OpenCV", "PyTorch / ONNX Runtime"]
        ai_services = ["Gemini 3.8 Flash Vision API", "Quantized MobileNetV3"]
        storage_stack = ["IndexedDB (Client Offline)", "SQLite / PostgreSQL"]
        stack_rationale = "PWA + Flask enables zero-friction mobile testing without app store delays, while Gemini Vision delivers zero-shot leaf pathology analysis."
        mermaid = """flowchart TD
  Farmer[Farmer Smartphone Camera] -->|Capture Leaf Photo| PWA[React PWA Interface]
  PWA -->|Offline Check: Yes| LocalModel[TFLite / ONNX Offline Engine]
  PWA -->|Offline Check: No / Online| API[Flask Backend API]
  API -->|Vision Inference| Gemini[Gemini Vision Model]
  Gemini -->|Pathology & Treatment JSON| API
  API -->|Diagnosis Card| PWA
  LocalModel -->|Fast Offline Diagnosis| PWA
  PWA -->|Display Cure & Remedy| Farmer"""
    elif is_intern:
        summary = "AI platform that matches college students with verified internships and tailors applications automatically."
        target_audience = "College and university students seeking software, design, or business internships."
        market_need = "Students struggle to find reliable, high-match internships and waste hours submitting generic applications that get rejected by automated applicant tracking systems (ATS)."
        existing_alts = ["LinkedIn & Handshake (overcrowded, impersonal)", "Mass cold emailing alumni", "Static spreadsheet trackers"]
        critical_unknowns = [
            "How do we source verified, live internship postings before they expire?",
            "What criteria best predict whether an applicant actually matches a role?",
            "Can personalized resume tailoring reliably pass corporate ATS scanners?"
        ]
        checklist = [
            "Interview 15 college students about their biggest pain points during internship recruitment.",
            "Verify employer appetite for receiving pre-screened student talent profiles.",
            "Test Gemini embedding similarity against 20 real internship job descriptions."
        ]
        pitch = "Verified AI internship discovery and personalized application engine for college students."
        val_prop = "Turn hours of frustrating job searching into 3 tailored, high-fit internship applications every week."
        risks = ["Getting enough high-quality, verified internship postings at launch.", "Ensuring tailored resumes sound authentic rather than robotic."]
        must_haves = [
            "Student profile & course projects importer",
            "AI match fit score & gap analysis for each role",
            "Automated personalized resume & cover letter tailoring",
            "Application tracking board with interview status updates"
        ]
        cut_features = ["Direct salary escrow or payment processing", "Automated cold-messaging bots that spam recruiters on LinkedIn", "Multi-stage automated video interview practice"]
        differentiator = "AI verifies student coursework and project relevance before matching, guaranteeing authentic fit."
        frontend_stack = ["React", "Vite", "Tailwind CSS"]
        backend_stack = ["Python", "Flask", "Pydantic"]
        ai_services = ["Gemini 3.8 Flash (Skill Extraction & Match Scoring)"]
        storage_stack = ["PostgreSQL", "pgvector (Vector Search)"]
        stack_rationale = "React + Flask allows rapid prototyping of the matching interface while Gemini embeddings handle high-speed job fit scoring."
        mermaid = """flowchart TD
  Student[College Student] -->|Upload Resume / Projects| Frontend[React + Vite Interface]
  Frontend -->|Submit Profile| Backend[Flask API Server]
  Backend -->|Extract Skills & Background| AI[Gemini Match Engine]
  AI -->|Compute Match Score & Tailor Pitch| Backend
  Backend -->|Store in Vector Store| DB[(PostgreSQL + pgvector)]
  Backend -->|Ranked Matches & Tailored Application| Frontend
  Frontend -->|Track Submission| Dashboard[Application Tracker]"""
    elif is_notes:
        summary = "Peer-to-peer academic notes exchange platform with quality verification and student micro-incentives."
        target_audience = "University undergraduates studying stem courses with high exam volume."
        market_need = "Students waste hours organizing fragmented lecture slides, while high-performing note-takers lack clean incentives to share."
        existing_alts = ["Studocu & CourseHero (paywalled & spammy)", "University Google Drive folders (messy & disorganized)", "WhatsApp group chats"]
        critical_unknowns = [
            "What motivates top-tier students to upload their best notes rather than hoarding them?",
            "How do we prevent copyright strikes from university professors whose lecture slides are uploaded?",
            "Will students pay subscription fees, or is a campus credit exchange flywheel better?"
        ]
        checklist = [
            "Survey 20 college students on what format of study notes they actually pay or trade for.",
            "Review university academic integrity and copyright policies for course material sharing.",
            "Test a pilot WhatsApp group with 15 students to measure upload-to-download ratios."
        ]
        pitch = "The verified peer-to-peer study vault where quality note-takers get recognized and rewarded."
        val_prop = "Curated, high-yield exam summaries that cut test preparation time by 60%."
        risks = ["Low initial liquidity of notes leading to high bounce rate.", "Uploads of low-effort AI-generated summaries that dilute note quality."]
        must_haves = [
            "Course and professor tagged PDF upload with preview generator",
            "AI OCR auto-tagging and lecture topic summary extraction",
            "Peer upvoting and peer verification badge system"
        ]
        cut_features = ["Direct PayPal fiat withdrawal payouts (high legal/tax overhead for MVP)", "Live collaborative whiteboard", "Audio lecture transcription"]
        differentiator = "Automated AI quality rubric that filters out low-effort uploads before they reach classmates."
        frontend_stack = ["React", "Vite", "Tailwind CSS", "PDF.js"]
        backend_stack = ["Python", "Flask", "Pydantic", "PyPDF2"]
        ai_services = ["Gemini 3.8 Flash (Summarization & Quality Scoring)"]
        storage_stack = ["Supabase PostgreSQL", "S3-compatible Object Storage"]
        stack_rationale = "React + Flask allows instant PDF preview rendering, rapid OCR processing, and seamless document ingestion."
        mermaid = """flowchart TD
  Student[Student User] -->|Upload Notes PDF| Frontend[React + Vite App]
  Frontend -->|Upload Document| Backend[Flask API]
  Backend -->|Text Extraction| Parser[PyPDF Parser]
  Backend -->|Quality Check| AI[Gemini Quality Scorer]
  AI -->|Quality Score & Tags| Backend
  Backend -->|Index & Store| DB[(PostgreSQL + S3)]
  Backend -->|Approved & Ranked| Frontend
  Frontend -->|Search & View Notes| Classmates[Classroom Peers]"""
    else:
        # General / Tech / Hackathon idea
        target_audience = "Hackathon squads, solo builders, indie founders, and product developers."
        market_need = "Early-stage builders waste precious hackathon hours arguing over tech stacks and scope rather than shipping the core loop."
        existing_alts = ["Generic ChatGPT prompts (unstructured and conversational)", "Notion templates (static and slow)", "Manual whiteboarding sessions"]
        critical_unknowns = [
            "Can the team build and demonstrate the core interactive loop within the hackathon time limit?",
            "Does the project have an immediate 'Aha!' moment for judges within the first 15 seconds of the pitch?",
            "Are the required external APIs reliable, free-tier accessible, and fast?"
        ]
        checklist = [
            "Define the single 15-second killer demo flow that will wow hackathon judges.",
            "Verify all external API keys, tokens, and rate limits prior to the coding sprint.",
            "Test the deployment pipeline early so there are no 11th-hour hosting surprises."
        ]
        pitch = f"Transform napkin concepts into structured, buildable solutions in under 30 seconds."
        val_prop = "Instant clarity on whether an idea is ready to build, what features to cut, and how to architect the system."
        risks = ["Building secondary dashboard features before proving the primary user loop.", "Over-complicating backend infrastructure instead of utilizing lightweight serverless/REST."]
        must_haves = [
            "Single focused idea input with instant intent categorization",
            "Dynamic workspace routing between Research, Improve, and Build",
            "Interactive system architecture diagram and hackathon sprint roadmap"
        ]
        cut_features = ["User authentication & sign-up flows", "Stripe subscription billing", "Complex multi-tenant permissions"]
        differentiator = "Chat-first dynamic workspace routing: CHAT → UNDERSTAND → WORKSPACE → ACTION."
        frontend_stack = ["React", "Vite", "Tailwind CSS", "Mermaid.js"]
        backend_stack = ["Python", "Flask", "CORS"]
        ai_services = ["Gemini 3.8 Flash API"]
        storage_stack = ["In-Memory / LocalState"]
        stack_rationale = "Zero-database, lightweight frontend and Flask API that runs locally in seconds and deploys anywhere."
        mermaid = """flowchart TD
  User([User / Developer]) -->|Enter Idea| Client[React Frontend]
  Client -->|POST /api/analyze| API[Flask API Backend]
  API -->|Structured Prompt| LLM[Gemini 3.8 Flash]
  LLM -->|Structured JSON| API
  API -->|Workspace Payload| Client
  Client -->|Dynamic Route| Workspace{Workspace Router}
  Workspace -->|Research Path| Res[Research Workspace]
  Workspace -->|Improve Path| Imp[Improve Workspace]
  Workspace -->|Build Path| Bld[Build Workspace & Mermaid Diagram]"""

    if feedback:
        reason += f" (Refined based on feedback: '{feedback}')"

    return {
        "intent": intent,
        "summary": summary,
        "next_action": next_action,
        "reason": reason,
        "confidence": confidence,
        "is_research_useful": is_research_useful,
        "is_improvement_needed": is_improvement_needed,
        "is_ready_to_build": is_ready_to_build,
        "research": {
            "target_audience": target_audience,
            "market_need": market_need,
            "existing_alternatives": existing_alts,
            "critical_unknowns": critical_unknowns,
            "validation_checklist": checklist
        },
        "improve": {
            "refined_pitch": pitch,
            "value_proposition": val_prop,
            "identified_risks": risks,
            "must_have_features": must_haves,
            "cut_features": cut_features,
            "key_differentiator": differentiator
        },
        "build": {
            "tech_stack": {
                "frontend": frontend_stack,
                "backend": backend_stack,
                "ai_services": ai_services,
                "storage": storage_stack,
                "rationale": stack_rationale
            },
            "mermaid_diagram": mermaid,
            "sprint_timeline": [
                {
                    "phase": "Hours 0-4: Foundation",
                    "goal": "Repository setup, API contract, and skeleton UI",
                    "tasks": [
                        "Initialize React + Vite + Tailwind frontend",
                        "Scaffold Flask API with CORS and /api/analyze route",
                        "Define mock data schema and wire up communication"
                    ]
                },
                {
                    "phase": "Hours 4-14: Core Loop",
                    "goal": "AI prompt engineering & dynamic workspace rendering",
                    "tasks": [
                        "Connect LLM API with structured JSON output",
                        "Build intelligent loading state with multi-step feedback",
                        "Implement Research, Improve, and Build workspace views"
                    ]
                },
                {
                    "phase": "Hours 14-20: Polish & Testing",
                    "goal": "Mermaid.js architecture diagram, error handling, visual polish",
                    "tasks": [
                        "Embed interactive Mermaid diagram with copy code support",
                        "Add suggestion triggers and input validation",
                        "Verify fast responsiveness and clean typography"
                    ]
                },
                {
                    "phase": "Hours 20-24: Pitch & Demo",
                    "goal": "Record demo, write README, prepare hackathon submission",
                    "tasks": [
                        "Record clean 2-minute walkthrough video",
                        "Document exact setup commands in README.md",
                        "Test clean restart on clean environment"
                    ]
                }
            ],
            "implementation_checklist": [
                "Verify Flask server starts on port 5000 with CORS enabled",
                "Verify Vite dev server proxies /api to Flask",
                "Ensure robust JSON error handling and safe fallbacks"
            ]
        }
    }


def analyze_with_gemini(idea: str, feedback: str = "") -> dict:
    """Invokes Google Gemini API with structured JSON output."""
    import requests
    
    system_prompt = build_system_prompt()
    user_prompt = f"Idea to analyze:\n{idea}\n"
    if feedback:
        user_prompt += f"\nAdditional User Feedback/Constraints:\n{feedback}\n"
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": system_prompt + "\n\n" + user_prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "responseMimeType": "application/json"
        }
    }
    
    resp = requests.post(url, headers=headers, json=payload, timeout=25)
    if resp.status_code != 200:
        raise RuntimeError(f"Gemini API returned HTTP {resp.status_code}: {resp.text}")
        
    data = resp.json()
    candidates = data.get("candidates", [])
    if not candidates:
        raise RuntimeError("Gemini returned empty candidates")
        
    parts = candidates[0].get("content", {}).get("parts", [])
    if not parts:
        raise RuntimeError("Gemini returned empty parts")
        
    raw_text = clean_json_text(parts[0].get("text", "{}"))
    return json.loads(raw_text)


def analyze_with_openai(idea: str, feedback: str = "") -> dict:
    """Invokes OpenAI API with JSON output mode."""
    import requests
    
    system_prompt = build_system_prompt()
    user_prompt = f"Idea to analyze:\n{idea}\n"
    if feedback:
        user_prompt += f"\nAdditional User Feedback/Constraints:\n{feedback}\n"
        
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.4
    }
    
    resp = requests.post(url, headers=headers, json=payload, timeout=25)
    if resp.status_code != 200:
        raise RuntimeError(f"OpenAI API returned HTTP {resp.status_code}: {resp.text}")
        
    data = resp.json()
    choices = data.get("choices", [])
    if not choices:
        raise RuntimeError("OpenAI returned empty choices")
        
    raw_content = clean_json_text(choices[0].get("message", {}).get("content", "{}"))
    return json.loads(raw_content)


@app.route("/api/health", methods=["GET"])
def health_check():
    """System health check and provider inspection."""
    active_provider = get_active_provider()
    return jsonify({
        "status": "healthy",
        "service": "IdeaForge API",
        "version": "1.0.0",
        "active_provider": active_provider,
        "providers_available": {
            "gemini": bool(GEMINI_API_KEY),
            "openai": bool(OPENAI_API_KEY),
            "mock": True
        }
    })


@app.route("/api/analyze", methods=["POST"])
@app.route("/api/analyze-idea", methods=["POST"])  # Alias for backward compatibility
def analyze_idea():
    """Primary endpoint for IdeaForge.
    
    Request Body:
      {
        "idea": "I want to build an AI system that helps farmers detect crop diseases.",
        "feedback": "Optional refinement feedback string"
      }
    """
    body = request.get_json(silent=True) or {}
    idea = str(body.get("idea", "")).strip()
    feedback = str(body.get("feedback", "")).strip()
    files_list = body.get("files", [])

    # If idea is empty but files were sent in the payload
    if not idea and files_list:
        file_names = [f.get("name", "Document") for f in files_list if isinstance(f, dict)]
        idea = f"Project specification based on attached files: {', '.join(file_names)}"

    # Input validation
    if not idea:
        return jsonify({
            "error": "Please provide an idea to analyze or attach project files.",
            "field": "idea"
        }), 400

    if len(idea) < 4:
        return jsonify({
            "error": "The idea description is too short. Please provide at least a few words or attach project documents.",
            "field": "idea"
        }), 400

    provider = get_active_provider()
    
    try:
        if provider == "gemini":
            print(f"[IdeaForge] Analyzing idea with Google Gemini...")
            result = analyze_with_gemini(idea, feedback)
            mode = "live_gemini"
        elif provider == "openai":
            print(f"[IdeaForge] Analyzing idea with OpenAI...")
            result = analyze_with_openai(idea, feedback)
            mode = "live_openai"
        else:
            print(f"[IdeaForge] Analyzing idea with Intelligent Heuristic Engine (no API key configured)...")
            result = generate_mock_analysis(idea, feedback)
            mode = "simulated"

        # Ensure top-level required fields exist
        result.setdefault("intent", "improve")
        result.setdefault("summary", idea[:100])
        result.setdefault("next_action", "improve")
        result.setdefault("reason", "Analysis generated successfully.")
        result.setdefault("confidence", 0.85)
        result.setdefault("is_research_useful", True)
        result.setdefault("is_improvement_needed", True)
        result.setdefault("is_ready_to_build", False)

        return jsonify({
            "data": result,
            "mode": mode,
            "provider": provider,
            "status": "success"
        }), 200

    except Exception as e:
        print(f"[IdeaForge] Live AI call failed ({str(e)}). Falling back gracefully to simulated engine.")
        fallback_result = generate_mock_analysis(idea, feedback)
        return jsonify({
            "data": fallback_result,
            "mode": "fallback_on_error",
            "provider": "mock",
            "warning": f"AI service error: {str(e)}. Displaying high-fidelity simulated analysis."
        }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"=================================================")
    print(f" IdeaForge Backend running on http://127.0.0.1:{port}")
    print(f" Active AI Provider: {get_active_provider()}")
    print(f"=================================================")
    app.run(host="0.0.0.0", port=port, debug=True)
