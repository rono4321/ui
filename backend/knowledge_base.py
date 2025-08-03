import json
import os
from azure_nlp import extract_key_phrases

KB_PATH = "storage/knowledge.json"

def load_kb():
    if not os.path.exists(KB_PATH):
        return {}
    with open(KB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_kb(data):
    with open(KB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def search_query(query, tags, file_content):
    kb = load_kb()
    full_query = f"{query}\n{' '.join(tags)}\n{file_content}".lower()

    for _, entry in kb.items():
        if entry.get("query", "").lower() in full_query:
            return entry["answer"]
    return None

def store_answer(query_id, answer_text):
    kb = load_kb()
    key_phrases = extract_key_phrases(answer_text)

    kb[query_id] = {
        "query": "",  # You can optionally store the actual query here
        "answer": answer_text,
        "structured": {
            "key_phrases": key_phrases
        }
    }
    save_kb(kb)
