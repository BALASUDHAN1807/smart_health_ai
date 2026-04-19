# 🩺 SmartHealth AI — Symptom Checker

AI-powered health symptom analysis system built with **Python + Flask + Groq AI**.

---

## Features

- ✅ Select from 28 common symptoms or type custom ones
- ✅ Patient profile (age, sex, duration, severity, conditions, medications)
- ✅ Groq AI analyzes symptoms → structured JSON report
- ✅ Urgency level: ROUTINE / MONITOR / SEE_DOCTOR / EMERGENCY
- ✅ Possible conditions with likelihood (Low / Moderate / High)
- ✅ Self-care tips & warning signs
- ✅ Recommended next steps
- ✅ Clean, responsive web UI
- ✅ Ready to deploy on Render

---

## Project Structure

```
smarthealthai/
├── app.py                  # Flask app & routes
├── utils/
│   ├── __init__.py
│   └── ai_engine.py        # Groq API integration
├── templates/
│   ├── index.html          # Landing page
│   └── checker.html        # Symptom checker page
├── static/
│   ├── css/style.css       # Full stylesheet
│   └── js/checker.js       # Frontend logic
├── requirements.txt
├── render.yaml             # Render deployment config
├── .env.example
└── .gitignore
```

---

## Local Setup

### 1. Clone & enter project
```bash
git clone <your-repo-url>
cd smarthealthai
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up environment
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### 5. Run locally
```bash
python app.py
# Open http://localhost:5000
```

---

## Deploy to Render

1. Push this project to a **GitHub repository**
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Render auto-detects `render.yaml`
5. Add environment variable:
   - `GROQ_API_KEY` → your key from [console.groq.com](https://console.groq.com)
6. Click **Deploy** — done! 🚀

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Landing page |
| GET | `/checker` | Symptom checker UI |
| POST | `/api/analyze` | Analyze symptoms via Groq API |

### POST `/api/analyze`

**Request body:**
```json
{
  "symptoms": ["Headache", "Fever", "Fatigue"],
  "profile": {
    "age": "25",
    "sex": "male",
    "duration": "3 days",
    "severity": "6",
    "conditions": "None",
    "medications": "None"
  }
}
```

**Response:**
```json
{
  "summary": "...",
  "urgency": "MONITOR",
  "urgency_reason": "...",
  "conditions": [
    { "name": "Viral Flu", "likelihood": "High", "description": "...", "symptoms_matched": ["Fever", "Fatigue"] }
  ],
  "self_care": ["..."],
  "warning_signs": ["..."],
  "next_steps": "...",
  "disclaimer": "..."
}
```

---

## ⚠️ Disclaimer

This tool is for **informational purposes only** and does not constitute medical advice.
Always consult a qualified healthcare professional for diagnosis and treatment.
For medical emergencies, call **112** (India) or **911** immediately.
