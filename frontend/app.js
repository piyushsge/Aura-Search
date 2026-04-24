const API_BASE = "http://localhost:8000";
const searchInput = document.getElementById("search-input");
const suggestionsBox = document.getElementById("suggestions-box");
const voiceBtn = document.getElementById("voice-btn");
const themeToggle = document.getElementById("theme-toggle");
const languageToggle = document.getElementById("language-toggle");
const latencyInfo = document.getElementById("latency-info");
const trendingList = document.getElementById("trending-list");
const historyList = document.getElementById("history-list");
const searchContainer3D = document.getElementById("search-container-3d");
const sphere1 = document.getElementById("sphere-1");
const sphere2 = document.getElementById("sphere-2");
const customCursor = document.getElementById("custom-cursor");
const cursorFollower = document.getElementById("custom-cursor-follower");
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const searchPage = document.getElementById("search-page");

let currentLanguage = "EN";
let selectedIndex = -1;

let globalSettings = {
    "dark-mode": true,
    "neon-glow": true,
    "autocomplete": true,
    "personalize": true,
    "notifications": true,
    "save-history": true,
    "performance": false,
    "ai-features": false,
    "case-sensitive": false,
    "max-suggestions": 10,
    "language": "EN",
    "region": "global",
    "accent": "#06b6d4"
};

// Performance Optimized Mouse Movement
let rafId = null;
let mouseX = 0, mouseY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!rafId) {
        rafId = requestAnimationFrame(updateUIOnMouseMove);
    }
});

function updateUIOnMouseMove() {
    // Custom Cursor
    customCursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0)`;
    
    // Follower with lag
    cursorFollower.style.transform = `translate3d(${mouseX - 20}px, ${mouseY - 20}px, 0)`;

    const nx = mouseX / window.innerWidth;
    const ny = mouseY / window.innerHeight;

    // Background spheres
    sphere1.style.transform = `translate3d(${nx * 50}px, ${ny * 50}px, 0)`;
    sphere2.style.transform = `translate3d(${-nx * 80}px, ${-ny * 80}px, 0)`;

    // 3D Search Bar tilt (Only if visible)
    if (searchContainer3D && searchPage.classList.contains('active')) {
        const rect = searchContainer3D.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (mouseY - centerY) / 25;
        const rotateY = (centerX - mouseX) / 25;
        searchContainer3D.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    rafId = null;
}

// Reset tilt when mouse leaves
searchContainer3D.addEventListener("mouseleave", () => {
    searchContainer3D.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
});

// Sidebar Navigation
navItems.forEach(item => {
    item.addEventListener("click", () => {
        const pageId = item.dataset.page;
        switchPage(pageId);
        
        // Update active class
        navItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});

function switchPage(pageId) {
    pages.forEach(page => {
        if (page.id === `${pageId}-page`) {
            page.classList.add("active");
            loadPageData(pageId);
        } else {
            page.classList.remove("active");
        }
    });
}

async function loadPageData(pageId) {
    if (pageId === "analytics") await refreshAnalytics();
    if (pageId === "history") await refreshHistory();
    if (pageId === "trending") await refreshTrending();
    if (pageId === "search") await refreshDashboard();
    if (pageId === "settings") syncSettingsUI();
}

// Translations
const translations = {
    "EN": {
        "hero-title": "Next-Gen <span style='color: var(--accent-cyan); text-shadow: 0 0 20px var(--glow-cyan);'>Contextual</span> Search.",
        "hero-subtitle": "Experience the power of sub-50ms autocomplete driven by advanced Trie structures and AI-based logic.",
        "search-placeholder": "Search for ideas, code, or trends...",
        "filter-placeholder": "Filter history...",
        "nav-analytics": "Analytics",
        "nav-history": "History",
        "nav-trending": "Trending",
        "nav-settings": "Settings",
        "trending-title": "Trending Now",
        "history-title": "Recent Queries",
        "analytics-title": "Engine Metrics",
        "trend-hero": "Trend <span style='color: var(--accent-cyan);'>Intelligence</span>",
        "trend-sub": "Real-time semantic analysis of network queries and growth velocity.",
        "history-hero": "Neural <span style='color: var(--accent-cyan);'>History</span>",
        "history-sub": "Manage your past semantic footprints and favorite nodes.",
        "settings-hero": "Platform <span style='color: var(--accent-cyan);'>Settings</span>",
        "settings-sub": "Manage your preferences, profile, and system configuration."
    },
    "HI": {
        "hero-title": "अगली पीढ़ी की <span style='color: var(--accent-cyan); text-shadow: 0 0 20px var(--glow-cyan);'>प्रासंगिक</span> खोज।",
        "hero-subtitle": "उन्नत Trie संरचनाओं और AI-आधारित तर्क द्वारा संचालित उप-50ms ऑटो-पूर्ण की शक्ति का अनुभव करें।",
        "search-placeholder": "विचारों, कोड या रुझानों को खोजें...",
        "filter-placeholder": "इतिहास फ़िल्टर करें...",
        "nav-analytics": "विश्लेषिकी",
        "nav-history": "इतिहास",
        "nav-trending": "रुझान",
        "nav-settings": "सेटिंग्स",
        "trending-title": "अभी ट्रेंडिंग",
        "history-title": "हाल की खोजें",
        "analytics-title": "इंजन मेट्रिक्स",
        "trend-hero": "ट्रेंड <span style='color: var(--accent-cyan);'>इंटेलिजेंस</span>",
        "trend-sub": "नेटवर्क प्रश्नों और विकास वेग का वास्तविक समय सिमेंटिक विश्लेषण।",
        "history-hero": "न्यूरल <span style='color: var(--accent-cyan);'>इतिहास</span>",
        "history-sub": "अपने पिछले सिमेंटिक फुटप्रिंट और पसंदीदा नोड्स प्रबंधित करें।",
        "settings-hero": "प्लेटफॉर्म <span style='color: var(--accent-cyan);'>सेटिंग्स</span>",
        "settings-sub": "अपनी प्राथमिकताओं, प्रोफाइल और सिस्टम कॉन्फ़िगरेशन को प्रबंधित करें।"
    }
};

// Theme Toggle (Day/Night)
themeToggle.addEventListener("click", () => {
    globalSettings["dark-mode"] = !globalSettings["dark-mode"];
    const settingsSwitch = document.getElementById("settings-dark-mode");
    if (settingsSwitch) {
        if (globalSettings["dark-mode"]) settingsSwitch.classList.add("active");
        else settingsSwitch.classList.remove("active");
    }
    
    // Update Icon
    const icon = themeToggle.querySelector("i");
    if (globalSettings["dark-mode"]) {
        icon.className = "fas fa-moon";
    } else {
        icon.className = "fas fa-sun";
    }
    
    applySettings();
});

// Language Toggle
languageToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "EN" ? "HI" : "EN";
    languageToggle.innerText = currentLanguage === "EN" ? "EN | हिंदी" : "हिंदी | EN";
    updateLanguage();
});

function updateLanguage() {
    const t = translations[currentLanguage];
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) {
            if (el.tagName === "INPUT" && el.type === "text") {
                el.placeholder = t[key];
            } else {
                el.innerHTML = t[key];
            }
        }
    });
    
    // Explicit mappings for placeholders if needed
    if (searchInput) searchInput.placeholder = t["search-placeholder"];
}

// Search Logic with Debouncing
let searchTimeout = null;
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (query.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    if (!globalSettings["autocomplete"]) return;

    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        try {
            const start = performance.now();
            const k = globalSettings["max-suggestions"] || 10;
            const cs = globalSettings["case-sensitive"] ? 1 : 0;
            const response = await fetch(`${API_BASE}/search?q=${query}&k=${k}&cs=${cs}`);
            const data = await response.json();
            const end = performance.now();

            latencyInfo.innerText = `SYSTEM READY // API LATENCY: ${data.latency_ms}ms | UI: ${Math.round(end - start)}ms`;
            
            renderSuggestions(data.suggestions, query);
        } catch (err) {
            console.error("Search error:", err);
        }
    }, 150); // 150ms debounce
});

function renderSuggestions(suggestions, query) {
    if (suggestions.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    suggestionsBox.innerHTML = suggestions.map((s, index) => {
        const regex = new RegExp(`(${query})`, "gi");
        const highlighted = s.word.replace(regex, `<span class="match">$1</span>`);
        return `
            <div class="suggestion-item" data-index="${index}" data-word="${s.word}">
                <span>${highlighted}</span>
                <span style="font-size: 0.7rem; opacity: 0.4;">MATCH RANK #${index + 1}</span>
            </div>
        `;
    }).join("");

    suggestionsBox.style.display = "block";
    selectedIndex = -1;
}

// Selection & Navigation
suggestionsBox.addEventListener("click", (e) => {
    const item = e.target.closest(".suggestion-item");
    if (item) {
        selectQuery(item.dataset.word);
    }
});

searchInput.addEventListener("keydown", (e) => {
    const items = suggestionsBox.querySelectorAll(".suggestion-item");
    if (e.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
    } else if (e.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
    } else if (e.key === "Enter") {
        if (selectedIndex >= 0) {
            selectQuery(items[selectedIndex].dataset.word);
        } else {
            selectQuery(searchInput.value);
        }
    }
});

function updateSelection(items) {
    items.forEach((item, idx) => {
        if (idx === selectedIndex) {
            item.style.background = "rgba(168, 85, 247, 0.2)";
            item.style.transform = "translateX(10px)";
            searchInput.value = item.dataset.word;
        } else {
            item.style.background = "transparent";
            item.style.transform = "translateX(0)";
        }
    });
}

async function selectQuery(word) {
    if (!word) return;
    searchInput.value = word;
    suggestionsBox.style.display = "none";
    
    // Save to DB (Respect Privacy Setting)
    if (globalSettings["save-history"]) {
        await fetch(`${API_BASE}/insert?q=${word}`, { method: "POST" });
    }
    refreshDashboard();
}

// Voice Search
voiceBtn.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice recognition not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLanguage === "EN" ? "en-US" : "hi-IN";
    recognition.interimResults = false;
    
    voiceBtn.classList.add("active");
    console.log("Voice recognition started...");
    
    recognition.start();
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Transcript received:", transcript);
        searchInput.value = transcript;
        searchInput.dispatchEvent(new Event("input"));
        voiceBtn.classList.remove("active");
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        voiceBtn.classList.remove("active");
    };

    recognition.onend = () => {
        voiceBtn.classList.remove("active");
    };
});

// Dashboard Data (Global)
async function refreshDashboard() {
    try {
        const [trendRes, histRes] = await Promise.all([
            fetch(`${API_BASE}/trending`),
            fetch(`${API_BASE}/history`)
        ]);

        const trends = await trendRes.json();
        const history = await histRes.json();

        trendingList.innerHTML = trends.trending.slice(0, 5).map(t => `
            <div style="padding: 1rem; margin-bottom: 0.5rem; background: rgba(255,255,255,0.03); border-radius: 12px; display: flex; justify-content: space-between; cursor: pointer;" onclick="selectQuery('${t}')">
                <span>${t}</span>
                <i class="fas fa-chevron-right" style="font-size: 0.7rem; opacity: 0.3;"></i>
            </div>
        `).join("");

        historyList.innerHTML = history.history.slice(0, 5).map(h => `
            <div style="padding: 1rem; margin-bottom: 0.5rem; background: rgba(255,255,255,0.03); border-radius: 12px; display: flex; justify-content: space-between; cursor: pointer;" onclick="selectQuery('${h.query}')">
                <span>${h.query}</span>
                <i class="fas fa-clock" style="font-size: 0.7rem; opacity: 0.3;"></i>
            </div>
        `).join("");

    } catch (err) {
        console.error("Dashboard error:", err);
    }
}

async function refreshAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    const data = await res.json();
    
    // Summary Stats
    document.getElementById("stat-total").innerText = data.total_searches;
    document.getElementById("stat-top").innerText = data.top_searches[0] || "None";
    document.getElementById("stat-latency").innerText = data.performance.avg_latency;

    // Trend Graph
    renderTrendGraph(data.history_trend);

    // Categories
    const catContainer = document.getElementById("category-stats");
    const maxCat = Math.max(...Object.values(data.categories), 1);
    catContainer.innerHTML = Object.entries(data.categories).map(([name, count]) => `
        <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8rem;">
                <span>${name}</span>
                <span style="opacity: 0.6;">${count} hits</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                <div style="width: ${(count/maxCat)*100}%; height: 100%; background: ${name === 'Tech' ? 'var(--accent-cyan)' : 'var(--accent-purple)'};"></div>
            </div>
        </div>
    `).join("");

    // Trending Tags
    const tagsCloud = document.getElementById("trending-tags-cloud");
    tagsCloud.innerHTML = data.top_searches.map(tag => `
        <span style="padding: 0.4rem 0.8rem; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 20px; font-size: 0.7rem; color: var(--accent-cyan); cursor: pointer;" onclick="selectQuery('${tag}')">
            #${tag.replace(/\s+/g, '_')}
        </span>
    `).join("");

    // AI Predictions
    const aiList = document.getElementById("ai-prediction-list");
    const predictions = data.top_searches.slice(0, 3).map(t => `${t} tutorial`);
    aiList.innerHTML = predictions.map(p => `
        <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.3s;" onclick="selectQuery('${p}')">
            <i class="fas fa-magic" style="color: var(--accent-purple); font-size: 0.7rem; margin-right: 0.5rem;"></i> ${p}
        </li>
    `).join("");
}

function renderTrendGraph(values) {
    const svg = document.getElementById("trend-svg");
    const path = document.getElementById("trend-path");
    const pathBg = document.getElementById("trend-path-bg");
    
    if (!values || values.length < 2) return;

    const width = 800;
    const height = 200;
    const padding = 20;
    const maxValue = Math.max(...values, 10);
    
    const points = values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - (v / maxValue) * (height - padding * 2) - padding;
        return { x, y };
    });

    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        // Curve calculation
        const cp1x = points[i-1].x + (points[i].x - points[i-1].x) / 2;
        d += ` C ${cp1x},${points[i-1].y} ${cp1x},${points[i].y} ${points[i].x},${points[i].y}`;
    }

    path.setAttribute("d", d);
    pathBg.setAttribute("d", `${d} L ${width},${height} L 0,${height} Z`);
    
    // Animate path
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.animation = "none";
    setTimeout(() => {
        path.style.transition = "stroke-dashoffset 2s ease-out";
        path.style.strokeDashoffset = "0";
    }, 100);
}

let globalHistoryData = [];

async function refreshHistory() {
    const res = await fetch(`${API_BASE}/history`);
    const data = await res.json();
    globalHistoryData = data.history;
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById("full-history-list");
    const searchFilter = document.getElementById("history-filter-input").value.toLowerCase();
    const dateFilter = document.getElementById("history-date-filter").value;
    const sortFilter = document.getElementById("history-sort").value;

    let filtered = globalHistoryData.filter(h => h.query.toLowerCase().includes(searchFilter));

    const now = Date.now() / 1000;
    if (dateFilter === "today") {
        filtered = filtered.filter(h => now - h.timestamp < 86400);
    } else if (dateFilter === "week") {
        filtered = filtered.filter(h => now - h.timestamp < 604800);
    } else if (dateFilter === "month") {
        filtered = filtered.filter(h => now - h.timestamp < 2592000);
    }

    if (sortFilter === "frequent") {
        // Group by query to count, then sort
        const counts = {};
        filtered.forEach(h => counts[h.query] = (counts[h.query] || 0) + 1);
        filtered.sort((a, b) => counts[b.query] - counts[a.query]);
    } else {
        // Recent (already sorted by timestamp desc mostly, but explicitly sort to be sure)
        filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    if (filtered.length === 0) {
        list.innerHTML = `<div style="text-align: center; padding: 3rem; opacity: 0.5;">No history matches your filters.</div>`;
    } else {
        list.innerHTML = filtered.map(h => {
            const date = new Date(h.timestamp * 1000);
            const timeString = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const dateString = date.toLocaleDateString();
            
            return `
            <div class="history-card">
                <div>
                    <div class="keyword">${h.query}</div>
                    <div class="timestamp">${dateString} &bull; ${timeString}</div>
                </div>
                <div class="history-actions">
                    <button class="action-btn search" onclick="selectQuery('${h.query}')" title="Search Again">
                        <i class="fas fa-search"></i>
                    </button>
                    <button class="action-btn star ${h.favorite ? 'active' : ''}" onclick="toggleFavorite('${h.id}')" title="Favorite">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteHistoryItem('${h.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `}).join("");
    }

    updateHistorySidebar();
}

async function toggleFavorite(id) {
    await fetch(`${API_BASE}/history/${id}/favorite`, { method: "POST" });
    refreshHistory();
}

async function deleteHistoryItem(id) {
    await fetch(`${API_BASE}/history/${id}`, { method: "DELETE" });
    refreshHistory();
}

function updateHistorySidebar() {
    // Favorites
    const favorites = globalHistoryData.filter(h => h.favorite);
    const favList = document.getElementById("favorites-list");
    if (favorites.length === 0) {
        favList.innerHTML = `<div style="opacity: 0.4; font-size: 0.8rem;">No favorites yet.</div>`;
    } else {
        // Unique favorites
        const uniqueFavs = [...new Set(favorites.map(f => f.query))];
        favList.innerHTML = uniqueFavs.map(q => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(255,255,255,0.02); border-radius: 8px; cursor: pointer;" onclick="selectQuery('${q}')">
                <span>${q}</span>
                <i class="fas fa-arrow-right" style="font-size: 0.7rem; opacity: 0.5;"></i>
            </div>
        `).join("");
    }

    // Insights
    document.getElementById("history-insight-count").innerText = globalHistoryData.length;
    
    if (globalHistoryData.length > 0) {
        const counts = {};
        globalHistoryData.forEach(h => counts[h.query] = (counts[h.query] || 0) + 1);
        const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        document.getElementById("history-insight-top").innerText = top;

        // Smart Suggestions
        const suggestionsDiv = document.getElementById("history-smart-suggestions");
        const suggestions = [
            `${top} tutorial`,
            `latest ${top} news`,
            `best ${top} practices`
        ];
        
        suggestionsDiv.innerHTML = suggestions.map(s => `
            <div style="padding: 0.6rem; background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 8px; cursor: pointer; transition: 0.3s; font-size: 0.85rem;" onclick="selectQuery('${s}')" onmouseover="this.style.background='rgba(168, 85, 247, 0.2)'" onmouseout="this.style.background='rgba(168, 85, 247, 0.1)'">
                <i class="fas fa-magic" style="color: var(--accent-purple); margin-right: 0.5rem;"></i> ${s}
            </div>
        `).join("");
    }
}

// Event Listeners for Filters
document.getElementById("history-filter-input")?.addEventListener("input", renderHistory);
document.getElementById("history-date-filter")?.addEventListener("change", renderHistory);
document.getElementById("history-sort")?.addEventListener("change", renderHistory);



async function refreshTrending() {
    const res = await fetch(`${API_BASE}/analytics`);
    const data = await res.json();
    
    const sorted = Object.entries(data.all_frequencies).sort((a,b) => b[1] - a[1]);
    const topWords = sorted.slice(0, 10);
    const bottomWords = sorted.slice(-10).reverse();

    // 1. Overview Stats
    document.getElementById("trend-stat-total").innerText = sorted.length;
    if (topWords.length > 0) {
        document.getElementById("trend-stat-fastest").innerText = topWords[0][0];
        const maxFreq = topWords[0][1];
        document.getElementById("trend-stat-velocity").innerText = `+${Math.min(maxFreq * 15, 300)}%`;
        document.getElementById("trend-stat-ai").innerText = `${topWords[0][0]} optimization`;
    }

    // 2. Rising vs Falling (Momentum)
    const surgingDiv = document.getElementById("momentum-surging");
    surgingDiv.innerHTML = topWords.slice(0, 5).map(([w, f]) => `
        <div class="momentum-item" onclick="selectQuery('${w}')">
            <span>${w}</span>
            <div class="trend-badge-up"><i class="fas fa-arrow-up"></i> ${f * 12}%</div>
        </div>
    `).join("");

    const decliningDiv = document.getElementById("momentum-declining");
    decliningDiv.innerHTML = bottomWords.slice(0, 5).map(([w, f]) => `
        <div class="momentum-item" onclick="selectQuery('${w}')">
            <span>${w}</span>
            <div class="trend-badge-down"><i class="fas fa-arrow-down"></i> ${f * 3}%</div>
        </div>
    `).join("");

    // 3. Category Topology
    const catContainer = document.getElementById("category-topology");
    const maxCat = Math.max(...Object.values(data.categories), 1);
    catContainer.innerHTML = Object.entries(data.categories).map(([name, count]) => `
        <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8rem;">
                <span>${name}</span>
                <span style="opacity: 0.6;">${count} queries</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                <div style="width: ${(count/maxCat)*100}%; height: 100%; background: ${name === 'Tech' ? 'var(--accent-cyan)' : 'var(--accent-purple)'};"></div>
            </div>
        </div>
    `).join("");

    // 4. Elite Keywords
    const eliteList = document.getElementById("elite-keywords-list");
    eliteList.innerHTML = topWords.slice(0, 5).map(([w, f], idx) => `
        <div class="elite-item" onclick="selectQuery('${w}')">
            <div class="elite-rank">0${idx + 1}</div>
            <div style="flex: 1;">
                <div style="font-size: 1.1rem; font-weight: 600;">${w}</div>
                <div style="font-size: 0.8rem; opacity: 0.5; margin-top: 0.2rem;">Volume: ${f * 1000}</div>
            </div>
            <div class="trend-badge-up"><i class="fas fa-arrow-up"></i></div>
        </div>
    `).join("");

    // 5. AI Predictions
    const predictions = document.getElementById("trend-predictions");
    predictions.innerHTML = topWords.slice(0, 3).map(([w, f]) => `
        <div style="padding: 0.8rem; background: rgba(6, 182, 212, 0.05); border-left: 2px solid var(--accent-cyan); border-radius: 4px; cursor: pointer;" onclick="selectQuery('${w} ecosystem')">
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.2rem;">${w} ecosystem</div>
            <div style="font-size: 0.8rem; opacity: 0.6;">High probability of breakout in next 48h based on semantic proximity to '${w}'.</div>
        </div>
    `).join("");

    // 6. Draw Trend Graph
    drawVelocityMatrix(topWords.slice(0, 3));
}

function drawVelocityMatrix(topWords) {
    const svg = document.getElementById("velocity-svg");
    if (!svg || topWords.length === 0) return;
    
    const width = 800;
    const height = 300;
    const padding = 20;
    
    svg.innerHTML = '';
    const colors = ['var(--accent-cyan)', 'var(--accent-purple)', '#10b981'];
    
    topWords.forEach(([word, freq], index) => {
        let points = [];
        let currY = height - padding - (Math.random() * 50);
        for(let i=0; i<10; i++) {
            points.push(currY);
            currY -= Math.random() * (freq * 5); 
            if (currY < padding) currY = padding + (Math.random() * 20);
        }
        points.reverse(); 
        
        const pathData = points.map((p, i) => {
            const x = (i / 9) * width;
            return {x, y: p};
        });
        
        let d = `M ${pathData[0].x},${pathData[0].y}`;
        for (let i = 1; i < pathData.length; i++) {
            const cp1x = pathData[i-1].x + (pathData[i].x - pathData[i-1].x) / 2;
            d += ` C ${cp1x},${pathData[i-1].y} ${cp1x},${pathData[i].y} ${pathData[i].x},${pathData[i].y}`;
        }
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", colors[index]);
        path.setAttribute("stroke-width", "3");
        path.style.filter = `drop-shadow(0 0 8px ${colors[index]})`;
        
        const length = 2500;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.animation = "none";
        
        svg.appendChild(path);
        
        setTimeout(() => {
            path.style.transition = "stroke-dashoffset 2s ease-out";
            path.style.strokeDashoffset = "0";
        }, 100);
    });
}

// Clear History
document.getElementById("clear-history-btn").addEventListener("click", async () => {
    await fetch(`${API_BASE}/clear-history`, { method: "POST" });
    refreshHistory();
    refreshDashboard();
});

// Settings Logic
function toggleSetting(key, el) {
    el.classList.toggle("active");
    globalSettings[key] = el.classList.contains("active");
    applySettings();
}

function updateSelectSetting(key, el) {
    globalSettings[key] = el.value;
    if (key === 'language') {
        currentLanguage = el.value;
        updateLanguage();
        languageToggle.innerText = currentLanguage === "EN" ? "EN | हिंदी" : "हिंदी | EN";
    }
    applySettings();
}

function setAccent(color, el) {
    document.querySelectorAll(".color-circle").forEach(c => c.classList.remove("active"));
    el.classList.add("active");
    globalSettings.accent = color;
    applySettings();
}

function saveProfile() {
    const name = document.getElementById("settings-display-name").value;
    const email = document.getElementById("settings-email").value;
    const avatar = document.getElementById("profile-avatar-display");
    
    // Update Settings Page Avatar
    if (name) {
        avatar.innerText = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    
    // Update Sidebar Profile
    const sidebarName = document.querySelector(".user-profile div div:first-child");
    if (sidebarName) sidebarName.innerText = name;
    
    alert(`Profile updated successfully!`);
}

function applySettings() {
    // Dark/Light Mode
    if (globalSettings["dark-mode"]) {
        document.body.classList.remove("light");
    } else {
        document.body.classList.add("light");
    }

    // Accent Color
    document.documentElement.style.setProperty('--accent-cyan', globalSettings.accent);
    document.documentElement.style.setProperty('--glow-cyan', `${globalSettings.accent}66`);

    // Neon Glow / Glassmorphism
    if (!globalSettings["neon-glow"]) {
        document.body.classList.add("no-glow");
    } else {
        document.body.classList.remove("no-glow");
    }

    // Performance Mode
    if (globalSettings["performance"]) {
        document.body.classList.add("performance-mode");
    } else {
        document.body.classList.remove("performance-mode");
    }
}

function syncSettingsUI() {
    for (const [key, value] of Object.entries(globalSettings)) {
        const el = document.getElementById(`settings-${key}`);
        if (el) {
            if (el.tagName === "SELECT") {
                el.value = value;
            } else if (el.classList.contains("switch-3d")) {
                if (value) el.classList.add("active");
                else el.classList.remove("active");
            }
        }
    }
    
    // Sync accent circles
    document.querySelectorAll(".color-circle").forEach(c => {
        if (c.dataset.color === globalSettings.accent) c.classList.add("active");
        else c.classList.remove("active");
    });
}

// Init
window.onload = () => {
    refreshDashboard();
    applySettings();
    syncSettingsUI();
};
