from flask import Flask,render_template,request,jsonify
import google.generativeai as genai
import PIL.Image

app = Flask(__name__)

# API KEY
genai.configure(api_key="enter your API key here")

model = genai.GenerativeModel("gemini-2.5-flash")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/features")
def features():
    return render_template("features.html")

@app.route("/chat", methods=["POST"])
def chat():

    data = request.json

    message = data["message"]

    prompt = f"""
You are CivicEye AI assistant.

Help users with civic problems like potholes,
garbage, road damage and public safety issues.

User question:
{message}
"""

    response = model.generate_content(prompt)

    return jsonify({"reply":response.text})

@app.route("/analyze",methods=["POST"])
def analyze():

    file = request.files["image"]
    lat = request.form.get("lat")
    lon = request.form.get("lon")

    image = PIL.Image.open(file)

    prompt = f"""
You are an AI Public Safety Analyzer.

User Location:
Latitude: {lat}
Longitude: {lon}

Analyze the uploaded image and detect public safety problems.

Respond ONLY in this format:

⚠ Problem Detected
(Name of issue)

🚨 Risk Level
Low / Medium / High with explanation

📍 Responsible Authority
Government department responsible

📌 Location
City or state guess from coordinates

✅ Suggested Action
Steps citizen should take

📊 Safety Score
Give score from 0 to 100

📝 Complaint Letter
Write a short formal complaint that a citizen can submit
to the responsible authority regarding the detected issue.
"""

    response = model.generate_content([prompt,image])

    return jsonify({"result":response.text})

if __name__=="__main__":
    app.run(debug=True)