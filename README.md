# 🩺 SmartHealth AI — Symptom Checker

AI-powered health symptom analysis system built with **Python 

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
