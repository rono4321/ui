#!/bin/python3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 🔥 Allow all origins. For production, set specific origins!

# Your existing routes go here
@app.route("/search", methods=["POST"])
def search():
    # Stub logic
    data = request.get_json()
    query = data.get("query", "")
    tags = data.get("tags", [])
    file_content = data.get("file_content", "")

    # Simulate match
    if "error" in query.lower():
        return jsonify({"found": True, "answer": "Try restarting the system."})
    else:
        return jsonify({"found": False, "query_id": "abc123"})

@app.route("/submit_answer", methods=["POST"])
def submit_answer():
    query_id = request.form.get("query_id")
    answer = request.form.get("answer")

    # Stub logic for storage
    print(f"Answer submitted for query {query_id}: {answer}")
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(port=5000)
