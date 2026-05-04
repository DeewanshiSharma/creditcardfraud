import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
import requests
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)

# === DEBUG: WHERE ARE WE? ===
script_dir = Path(__file__).parent
env_path = script_dir / ".env"

print("=== DEBUG INFO ===")
print(f"Script location: {script_dir}")
print(f".env path: {env_path}")
print(f".env exists? {env_path.exists()}")

if not env_path.exists():
    raise FileNotFoundError(f".env not found! Create it at: {env_path}")

load_dotenv(dotenv_path=env_path)

# === GET KEY ===
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded? {'YES' if GEMINI_API_KEY else 'NO'}")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing! Check .env file.")

print("API Key is valid. Starting Flask app...")

# === FLASK SETUP ===
app = Flask(__name__)
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    try:
        data = request.get_json()
        user_message = data['message'].lower()
        reply = ""

        if any(x in user_message for x in ["who created you", "who made you"]):
            reply = "I was created by Veera karthick."
        elif any(x in user_message for x in ["about veera karthick", "who is veera karthick"]):
            reply = "He is an AI Engineer, a problem solver, and a critical thinker."
        else:
            payload = {"contents": [{"parts": [{"text": user_message}]}]}
            headers = {"Content-Type": "application/json"}
            response = requests.post(GEMINI_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            reply = response.json()['candidates'][0]['content']['parts'][0]['text']

    except Exception as e:
        reply = "Sorry, something went wrong."

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True)
