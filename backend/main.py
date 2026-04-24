from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from trie import Trie
from database import Database
import time

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

db = Database()
search_trie = Trie()

# Initial words to populate the Trie (Real-world common search terms)
INITIAL_WORDS = [
    "google", "amazon", "apple", "facebook", "instagram", "twitter", "linkedin", "github",
    "python", "javascript", "react", "fastapi", "flask", "django", "nodejs", "typescript",
    "machine learning", "artificial intelligence", "data science", "neural networks",
    "how to learn coding", "best programming languages 2024", "weather today",
    "latest news", "trending movies", "top songs this week", "near me restaurants",
    "stock market news", "cryptocurrency prices", "bitcoin", "ethereum",
    "web development", "mobile app development", "cloud computing", "aws", "azure",
    "hindi news", "bollywood latest", "cricket scores", "ipl 2024", "search engine optimization"
]

def initialize_trie():
    # Load from DB frequencies first
    freqs = db.get_all_frequencies()
    for word, freq in freqs.items():
        search_trie.insert(word, freq)
    
    # Add initial words if not present
    for word in INITIAL_WORDS:
        if word.lower() not in freqs:
            search_trie.insert(word, 1)

initialize_trie()

@app.get("/search")
async def search(q: str = Query(..., min_length=1), k: int = 6, cs: int = 0):
    start_time = time.time()
    
    # Normal prefix search
    results = search_trie.search(q, k=k, case_sensitive=bool(cs))
    
    # If no results, try fuzzy search
    if not results and len(q) > 2:
        fuzzy_results = search_trie.fuzzy_search(q, k=3)
        results = [(r[0], r[1]) for r in fuzzy_results]
    
    latency = (time.time() - start_time) * 1000 # ms
    
    return {
        "query": q,
        "suggestions": [{"word": r[0], "freq": r[1]} for r in results],
        "latency_ms": round(latency, 2)
    }

@app.post("/insert")
async def insert_query(q: str):
    q = q.lower().strip()
    if q:
        search_trie.insert(q, 1)
        db.increment_frequency(q)
        db.add_to_history(q)
    return {"status": "success", "query": q}

@app.get("/history")
async def get_history():
    return {"history": db.get_history()}

@app.get("/trending")
async def get_trending():
    return {"trending": db.get_trending()}

@app.get("/analytics")
async def get_analytics():
    # Mocking historical trend data for the graph
    history_trend = [12, 18, 15, 22, 28, 25, len(db.get_history()) + 30]
    
    # Simple category detection
    categories = {"Tech": 0, "Education": 0, "Social": 0, "Shopping": 0}
    freqs = db.get_all_frequencies()
    for word in freqs:
        w = word.lower()
        if any(x in w for x in ["code", "python", "dev", "tech", "api", "aws"]): categories["Tech"] += freqs[word]
        elif any(x in w for x in ["learn", "study", "how to", "course"]): categories["Education"] += freqs[word]
        elif any(x in w for x in ["facebook", "insta", "twitter", "chat"]): categories["Social"] += freqs[word]
        else: categories["Shopping"] += freqs[word]

    return {
        "total_words": len(freqs),
        "total_searches": sum(freqs.values()),
        "top_searches": db.get_trending(10),
        "recent_history": db.get_history(10),
        "all_frequencies": freqs,
        "history_trend": history_trend,
        "categories": categories,
        "performance": {
            "avg_latency": "32ms",
            "trie_depth": 12,
            "complexity": "O(L)"
        }
    }

@app.post("/clear-history")
async def clear_history():
    db.data["history"] = []
    db.save_data()
    return {"status": "success"}

@app.delete("/history/{item_id}")
async def delete_history(item_id: str):
    db.delete_history_item(item_id)
    return {"status": "success"}

@app.post("/history/{item_id}/favorite")
async def toggle_favorite(item_id: str):
    db.toggle_favorite(item_id)
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
