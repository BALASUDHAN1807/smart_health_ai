from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "smarthealthai-secret-2024")
CORS(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/checker")
def checker():
    return render_template("checker.html")


@app.route("/api/analyze", methods=["POST"])
def analyze():
    from utils.ai_engine import analyze_symptoms
    data     = request.get_json()
    symptoms = data.get("symptoms", [])
    profile  = data.get("profile", {})

    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    result = analyze_symptoms(symptoms, profile)
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
