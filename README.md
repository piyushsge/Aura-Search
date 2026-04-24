# 🌌 Aura Search | AI-Powered Semantic Engine

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/piyushsge/Aura-Search)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://piyushsge.github.io/Aura-Search/)

A high-performance, contextual search platform built with a custom **Trie** data structure and a sleek, 3D-enhanced glassmorphism UI.

## 🚀 Key Features

-   **Sub-50ms Autocomplete:** Powered by an optimized Python-based Trie architecture.
-   **Fuzzy Search:** Intelligent suggestion engine that handles typos and semantic proximity.
-   **Neural Analytics:** Real-time dashboard for monitoring search velocity and category usage.
-   **Premium Aesthetics:** Immersive dark mode with 3D parallax effects and glassmorphism.
-   **Bilingual Support:** Full English and Hindi translation support.
-   **Accessibility First:** Optimized for screen readers and modern web standards.

## 🛠️ Tech Stack

-   **Frontend:** Vanilla JS, HTML5, CSS3 (with 3D transforms & RAO optimization).
-   **Backend:** FastAPI (Python 3.9+).
-   **Data Engine:** Custom Trie (Prefix Tree) with caching.
-   **Icons & Fonts:** FontAwesome 6, Google Fonts (Outfit).

## 🏃 Getting Started

### Prerequisites

-   Python 3.9+
-   `pip install fastapi uvicorn`

### Running the Backend

```bash
cd backend
python main.py
```
The API will be available at `http://localhost:8000`.

### Running the Frontend

Simply open `frontend/index.html` in any modern web browser.

## 📊 Performance Metrics

-   **Search Latency:** < 1ms
-   **Trie Complexity:** O(L)
-   **UI Responsiveness:** Optimized via `requestAnimationFrame` and throttled event listeners.

## 📄 License

MIT License - feel free to use and modify for your own projects!
