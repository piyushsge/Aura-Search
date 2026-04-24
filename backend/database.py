import json
import os
import uuid
import time

class Database:
    def __init__(self, filepath="data.json"):
        self.filepath = filepath
        self.data = self._load_data()

    def _load_data(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r") as f:
                    data = json.load(f)
                    # Migrate old history format (list of strings) to new format by clearing it
                    if data.get("history") and isinstance(data["history"][0], str):
                        data["history"] = []
                    return data
            except:
                pass
        return {"frequencies": {}, "history": [], "trending": []}

    def save_data(self):
        with open(self.filepath, "w") as f:
            json.dump(self.data, f, indent=4)

    def increment_frequency(self, query):
        query = query.lower().strip()
        if not query: return
        self.data["frequencies"][query] = self.data["frequencies"].get(query, 0) + 1
        self.save_data()

    def add_to_history(self, query):
        query = query.strip()
        if not query: return
        
        # We will keep duplicate queries to show a proper timeline
        item = {
            "id": str(uuid.uuid4()),
            "query": query,
            "timestamp": time.time(),
            "favorite": False
        }
        self.data["history"].insert(0, item)
        self.data["history"] = self.data["history"][:100] # Keep last 100 for a richer history
        self.save_data()

    def delete_history_item(self, item_id):
        self.data["history"] = [item for item in self.data["history"] if item.get("id") != item_id]
        self.save_data()

    def toggle_favorite(self, item_id):
        for item in self.data["history"]:
            if item.get("id") == item_id:
                item["favorite"] = not item.get("favorite", False)
                break
        self.save_data()

    def get_trending(self, k=5):
        # Trending can be based on highest frequencies
        sorted_freqs = sorted(self.data["frequencies"].items(), key=lambda x: x[1], reverse=True)
        return [item[0] for item in sorted_freqs[:k]]

    def get_history(self, k=100):
        return self.data["history"][:k]

    def get_all_frequencies(self):
        return self.data["frequencies"]
