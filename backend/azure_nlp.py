def extract_key_phrases(text):
    words = set(word.strip(".,;!?()").lower() for word in text.split())
    return [w for w in words if len(w) > 4][:10]  # return top 10 longest
