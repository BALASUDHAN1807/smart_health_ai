import os
import json
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))
MODEL  = "llama-3.1-8b-instant"

ANALYSIS_SYSTEM = """
You are SmartHealth AI, a medical symptom analysis engine.
Analyze the given patient symptoms and profile, then respond ONLY with a valid JSON object.
No markdown, no code fences, no extra text — raw JSON only.

JSON schema:
{
  "summary": "One sentence overview of the reported symptoms",
  "urgency": "ROUTINE | MONITOR | SEE_DOCTOR | EMERGENCY",
  "urgency_reason": "One sentence explaining this urgency level",
  "conditions": [
    {
      "name": "Condition Name",
      "likelihood": "Low | Moderate | High",
      "description": "Why this condition fits the symptoms (1-2 sentences)",
      "symptoms_matched": ["symptom1", "symptom2"]
    }
  ],
  "self_care": ["tip 1", "tip 2", "tip 3"],
  "warning_signs": ["sign 1", "sign 2", "sign 3"],
  "next_steps": "Clear recommended action in 2-3 sentences.",
  "disclaimer": "This is for informational purposes only and does not constitute medical advice."
}

Rules:
- Provide 2 to 4 conditions maximum
- Provide 3 to 5 self-care tips
- Provide 3 to 4 warning signs to watch for
- If urgency is EMERGENCY, urgency_reason must advise calling 112 or 911 immediately
- Never name specific prescription medications
- Be empathetic, calm, and clear
- Return ONLY the JSON object, nothing else
"""


def analyze_symptoms(symptoms: list, profile: dict) -> dict:
    """Send symptoms + profile to Groq (LLaMA 3) and return structured JSON result."""
    
    # Check for missing or placeholder API key
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key or api_key == "your_groq_api_key_here":
        return {
            "error": "Missing API Key: Please get a free Groq API key from https://console.groq.com/keys, add it to your .env file, and restart the server."
        }

    sym_list = "\n".join(f"- {s}" for s in symptoms)

    user_msg = f"""
Patient Profile:
  Age: {profile.get('age', 'Not specified')}
  Biological sex: {profile.get('sex', 'Not specified')}
  Duration: {profile.get('duration', 'Not specified')}
  Severity (1-10): {profile.get('severity', 'Not specified')}
  Known conditions: {profile.get('conditions', 'None')}
  Current medications: {profile.get('medications', 'None')}

Reported Symptoms:
{sym_list}

Analyze these symptoms and return ONLY the JSON assessment.
""".strip()

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": ANALYSIS_SYSTEM},
                {"role": "user",   "content": user_msg},
            ],
            temperature=0.3,
            max_tokens=1500,
        )

        raw = response.choices[0].message.content.strip()

        # Strip accidental markdown fences if model adds them
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        return json.loads(raw)

    except json.JSONDecodeError as e:
        return {"error": f"Failed to parse AI response: {e}"}
    except Exception as e:
        return {"error": str(e)}
