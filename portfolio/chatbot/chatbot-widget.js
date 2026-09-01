/* ==========================================
   Yousef Malak Ibrahim - AI Chatbot Widget
   ========================================== */

(function() {
    // Fully client-side assistant — no backend / OpenRouter required.
    const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

    // Local knowledge base (split into passages for TF-IDF matching)
    const MY_INFO = [
        { topic: 'intro', text: 'Yousef Malak Ibrahim is an AI Engineer and ML Developer based in Cairo, Egypt, currently pursuing a Bachelor of Computer Science at Ain Shams University (GPA 3.5/4.0, A-). He is passionate about building production-ready AI agent systems and large language model applications.' },
        { topic: 'experience-datalentech', text: 'As Agentic AI Intern at Datalentech (Current), Yousef works on Agentic AI systems and LLMOps workflows, designing agentic AI architectures and LLM workflows for multi-step task execution, provider-agnostic LLM abstractions and model registries, structured prompts/tools/responses/agent state, tool calling with versioned tools/prompts and validation, configurable reasoning/guardrails/fallbacks, LLM evaluation workflows with datasets/metrics/regression/self-correction, LLMOps tracing/monitoring/cost/latency/observability, and context management optimization.' },
        { topic: 'experience-barq', text: 'As AI Engineering Intern at BARQ Systems (Current, 4-week), Yousef completed a production-oriented LLM internship: LLM APIs/tokens/context windows/prompt engineering, structured prompts and LLM evaluation with test sets/scoring/regression, RAG with embeddings/vector search/retrieval/contextual generation, integrated LLM+retrieval into a working AI app with testing/monitoring/documentation/hardening, and delivered an end-to-end AI project presented on Demo Day.' },
        { topic: 'experience-wider', text: 'At Wider, a multinational company, Yousef works as an AI Engineer building backend AI agent infrastructure, knowledge graphs, and LLM extraction pipelines for production authentication and identity systems.' },
        { topic: 'experience-iclub', text: 'As Head of AI at iCLUB (Ain Shams University), Yousef leads AI initiatives, runs hands-on workshops on generative AI, deployment, and AI ethics, and mentors student developers building real-world ML projects.' },
        { topic: 'experience-kayfa', text: 'Yousef\'s most recent internship was at Kayfa, a multinational education company, where he built AI solutions for education and business — including a multilingual AI Sales Agent and a Student Analytics Dashboard.' },
        { topic: 'project-loom', text: 'Loom CLI is a terminal-native multi-agent coding pipeline built with LangGraph. It orchestrates Thinker → Worker → Debugger agents, each using its own model provider (Anthropic, Groq, OpenRouter, NVIDIA). Features include TPM-aware exponential backoff, context compaction, and SQLite checkpointing for resuming long runs. It is open-source (MIT) and solo-built.' },
        { topic: 'project-sadeed', text: 'Sadeed is a multi-agent claim management system built with LangGraph. It uses semantic deduplication with pgvector, automated fraud detection, and an auto-retraining pipeline to keep models accurate over time.' },
        { topic: 'project-salesagent', text: 'The Kayfa AI Sales Agent is a multilingual (Arabic/English) LangGraph sales chatbot. It uses RAG over a 52-course catalog, scores leads, opens CRM tickets, and sends WhatsApp notifications through Twilio. It is deployed live on Streamlit Cloud.' },
        { topic: 'project-dashboard', text: 'The Kayfa Student Analytics Dashboard consolidated 7 multi-source LMS files, ran a 37-issue data quality audit, and delivered interactive Plotly EDA visualizations backed by a Jupyter cleaning pipeline.' },
        { topic: 'projects-other', text: 'Other projects include an AI Travel Reservation Chatbot (n8n), an Online Exam Management System (Java/JavaFX), Land Type Classification from satellite imagery (TensorFlow), Forest Cover Type Prediction (XGBoost), Walmart Sales Forecasting (LightGBM), a Diabetes Prediction Model, Mall Customer Segmentation (K-Means), and an Image Segmentation App (C#).' },
        { topic: 'skills', text: 'Skills include LangGraph, LangChain, RAG, multi-agent systems, knowledge graphs, Python, TensorFlow, PyTorch, XGBoost, LightGBM, Django, FastAPI, MongoDB, Twilio, and Streamlit.' },
        { topic: 'education', text: 'Yousef is pursuing a Bachelor of Computer Science at Ain Shams University with a GPA of 3.5/4.0 (A-). He focuses on machine learning, artificial intelligence, and software engineering.' },
        { topic: 'achievements', text: 'Yousef won 1st place for an NLP project and 2nd place in an ML competition at Ain Shams University, recognizing his applied machine learning and natural language processing work.' },
        { topic: 'languages', text: 'Yousef speaks Arabic (native), English (fluent), and German (good).' },
        { topic: 'contact', text: 'You can reach Yousef at yousefmalak55@gmail.com, by phone at +20 127 541 6149, or through LinkedIn and GitHub (github.com/USIF-Andreas).' },
        { topic: 'interests', text: 'Yousef is focused on agentic AI, retrieval-augmented generation (RAG), LLM orchestration, and MLOps. He enjoys turning research ideas into scalable, real-world AI products and is open to new AI engineering and ML opportunities.' },
        { topic: 'tools', text: 'On the data side, Yousef works with pandas, NumPy, scikit-learn, and Plotly. For deployment and apps he uses FastAPI, Django, Streamlit, and MongoDB, and integrates messaging via Twilio.' },
        { topic: 'approach', text: 'Yousef\'s strengths are building end-to-end AI systems — from data cleaning and model training to agent orchestration and live deployment — with attention to data quality, evaluation, and production reliability.' },
    ];

    // --- Fast-button curated offline responses (first-person, streaming, no API) ---
    // Each key must exactly match the button's data-msg attribute
    const QUICK_RESPONSES = {
        "Tell me about yourself": "Hey there! 👋 I'm **Yousef Malak Ibrahim** — an **AI Engineer & ML Developer** based in Maadi, Cairo.\n\nI'm pursuing my **Bachelor's in Computer Science (Software Engineering) at Ain Shams University — GPA 3.5/4.0 (A-)** and currently working as an **Agentic AI Intern at Datalentech** and **AI Engineering Intern at BARQ Systems**, alongside my roles as **AI Engineer at Wider** and **Head of AI at iCLUB**.\n\nI build **production-ready Agentic AI systems** — RAG pipelines, multi-agent architectures (LangGraph), and LLMOps workflows — and I love turning research into reliable, real-world products. Ask me about my experience, projects, skills or how to contact me!",
        "Tell me about your experience at Wider": "Here's my journey so far 🚀\n\n**Datalentech — Agentic AI Intern (Current):** I work on **Agentic AI & LLMOps** — designing agentic architectures & LLM workflows for multi-step execution, provider-agnostic LLM abstractions & model registries, structured **prompts/tools/responses/agent state**, **tool calling with versioned tools/prompts** (schemas + validation), **reasoning/guardrails/fallbacks**, **evaluation pipelines** (datasets, metrics, regression, self-correction), and **LLMOps** observability (tracing, monitoring, cost, latency) + context optimization.\n\n**BARQ Systems — AI Engineering Intern (Current, 4 weeks):** Shipped **production LLM features** — worked with LLM APIs, tokens & context windows, built **RAG** (embeddings, vector search, retrieval, contextual generation), integrated into a working app, and presented the end-to-end project on **Demo Day**.\n\n**Wider (2025–Present) — AI Engineer:** Backend AI agent infra, Knowledge Graphs & semantic metadata enrichment with LLM extraction pipelines, LangChain agents via REST APIs.\n\n**Kayfa — AI Engineer Intern:** Multilingual **LangGraph Sales Agent** (52-course RAG, lead scoring, CRM + Twilio WhatsApp) + **Student Analytics Dashboard** (7 LMS sources, 37-issue data audit, Plotly EDA).\n\n**iCLUB — Head of AI (2024–Present):** Leading AI strategy, workshops on generative AI/deployment/ethics, mentoring in Python & TensorFlow.",
        "What are your top projects?": "My top builds — all end-to-end, production-oriented:\n\n**1. Sadeed — AI Claim Management** (`Django, LangGraph, pgvector, Celery, Redis, Docker`) — Multi-agent pipeline **Extractor → Investigator → Resolver → Explainer**, semantic deduplication with **pgvector HNSW + multilingual embeddings**, smart **OpenRouter routing**, fraud detection + auto-retraining loop.\n\n**2. Loom CLI — Multi-Agent Coding Pipeline** (`MIT, LangGraph`) — Terminal-native **Thinker → Worker → Debugger** agents, each with its own provider (Anthropic, Groq, OpenRouter, NVIDIA), **TPM-aware backoff, context compaction, SQLite checkpointing**.\n\n**3. Kayfa AI Sales Agent** (`LangGraph, RAG, MongoDB, Twilio, Streamlit`) — Multilingual **Arabic/English** sales bot, **RAG over 52 courses**, lead scoring, CRM tickets & **WhatsApp via Twilio** — live on Streamlit Cloud.\n\n**4. Kayfa Student Analytics Dashboard** (`Pandas, Plotly`) — Consolidated **7 LMS exports**, fixed **37 data-quality issues**, built interactive EDA.\n\nPlus: AI Travel Chatbot (n8n), Online Exam System (JavaFX), Satellite Land Classification (**EfficientNetB0 96.3%**), Forest Cover XGBoost (86.6%), and more — check the Projects section!",
        "What skills do you have?": "My stack is built for **Agentic AI & production LLMs**:\n\n**AI & Agents:** `LangChain`, `LangGraph`, Multi-Agent Systems, `RAG`, Prompt Engineering, Knowledge Graphs\n\n**LLMOps:** Tracing & monitoring, Evaluation (datasets/metrics/regression), Tool calling & versioned prompts, Guardrails/Fallbacks, Context optimization, Cost/latency control\n\n**ML:** `Scikit-learn`, `TensorFlow`, `PyTorch`, `XGBoost`, `LightGBM`, SMOTE, EfficientNet/ResNet\n\n**Backend & Data:** `Django`, `FastAPI`, REST, Auth, `MongoDB`, `PostgreSQL`, `pgvector`, `Qdrant`, `Redis`, `Celery`, `Docker`\n\n**Automation:** `n8n`, `Twilio`, API orchestration\n\n**Languages & Tools:** `Python`, `Java`, `C#`, `C++`, `JavaScript`, `SQL`, `Pandas`, `Plotly`, `Streamlit`, `Jupyter`",
        "What is your education background?": "I'm pursuing my **Bachelor of Computer Science, Software Engineering (2023–2027)** at **Ain Shams University — GPA 3.5/4.0 (A-)**.\n\nI also completed the **AI Agent Developer Course at Orange Digital Center (Feb 2026) — Grade 99.3%, 30 Hours** covering AI Agents, LLMs, Prompt Engineering, LangChain Basics, RAG & Vector Stores, Multi-Agent Systems, Deployment & Optimization, and Inter-Agent Communication.\n\nI love blending academic depth with shipping production systems at Datalentech, BARQ, and Wider.",
        "Tell me about the Sadeed project": "I built **Sadeed — AI Claim Management System** as a **multi-agent LangGraph** pipeline: **Extractor → Investigator → Resolver → Explainer** for automated claim triage.\n\nHighlights I engineered:\n- **Semantic deduplication** with **pgvector HNSW** + `paraphrase-multilingual-mpnet` (Arabic/English)\n- **Smart LLM routing via OpenRouter** — dispatching simple vs. complex claims to cost-appropriate models\n- **Fraud detection engine** (rule-based anomaly + Supabase `fraud_patterns`)\n- **Auto-retraining loop** with Celery workers feeding rejected decisions to a reflection model for prompt optimization\n- **Stack:** `Django`, `LangGraph`, `pgvector`, `Celery`, `Redis`, `Docker` (multi-service + async queues) + K-Means analytics.\n\nIt's my most complete agentic + LLMOps showcase — check it at **github.com/USIF-Andreas/Sadeed**.",
        "Tell me about Loom CLI": "I solo-built **Loom CLI — Multi-Agent Coding Pipeline** (`MIT` open-source) — a **terminal-native** coding agent powered by **LangGraph**.\n\nIt splits work across specialized agents: **Thinker → Worker → Debugger**, each with its own prompt, tools, and model provider. You can mix **Anthropic, Groq, OpenRouter, NVIDIA** mid-session.\n\nWhat I'm proud of:\n- **Provider-agnostic** — swap models mid-run\n- **TPM-aware exponential backoff**\n- **Context compaction** to stay in token budget\n- **SQLite checkpointing** to resume long runs\n\nLive at **github.com/USIF-Andreas** and demo: **lnkd.in/e_cGEztW**.",
        "What are your achievements?": "Proud of these milestones 🏆\n\n**1st Place — NLP Project** at Ain Shams University — recognized for my applied natural language processing work.\n\n**2nd Place — ML Project Competition** at Ain Shams University — ranked 2nd among all ML projects.\n\n**99.3% — AI Agent Developer Course** (Orange Digital Center, 30 Hours) — top grade in AI Agents, LLMs, LangChain, RAG & Multi-Agent Systems.\n\nI also delivered and presented an end-to-end AI project on **Demo Day at BARQ Systems**, and I lead AI strategy as **Head of AI at iCLUB**.",
        "How can I contact you?": "Let's connect! 📬\n\n**Email:** `yousefmalak55@gmail.com`\n**Phone:** `+20 127 541 6149`\n**Location:** Maadi, Cairo, Egypt\n**GitHub:** `github.com/USIF-Andreas`\n**LinkedIn:** `linkedin.com/in/yousef-malak-98026b287`\n\nTap **Email Me** on this page or use the contact form — I usually reply within a day and I'm **open to Agentic AI / LLM opportunities**!"
    };

    const STOPWORDS = new Set(['the','a','an','and','or','is','are','was','were','to','of','in','on','for','with','my','me','i','you','your','what','who','how','do','does','did','can','have','has','had','at','from','about','tell','please','this','that','be','it','as','by','he','she','they','we','our','their','but','if','so','get','know','more','top','some','any','will','would','there','here','than','into','out','up','down','all','his','her','him','its','am','not','no']);

    function tokenize(str) {
        return String(str).toLowerCase().match(/[a-z0-9]+/g) || [];
    }

    // Pre-compute IDF and per-passage term frequencies (TF) for fast, high-signal matching.
    function buildIndex(passages) {
        const N = passages.length;
        const dfs = {};
        const tfs = passages.map(p => {
            const toks = tokenize(p.text);
            const uniq = new Set(toks);
            uniq.forEach(t => { dfs[t] = (dfs[t] || 0) + 1; });
            const c = {};
            toks.forEach(t => { c[t] = (c[t] || 0) + 1; });
            return c;
        });
        const idf = {};
        Object.keys(dfs).forEach(t => { idf[t] = Math.log((N + 1) / (dfs[t] + 1)) + 1; });
        return { tfs, idf };
    }
    const INDEX = buildIndex(MY_INFO);

    function handleIntent(message) {
        const t = message.toLowerCase().trim();
        const greetings = ['hi', 'hello', 'hey', 'salam', 'ahlan', 'sup', 'yo', 'good morning', 'good evening', 'good afternoon'];
        if (greetings.some(g => t === g || new RegExp('\\b' + g.replace(/ /g, '\\s+') + '\\b').test(t))) {
            return "Hello! 👋 I'm Yousef's AI assistant. I can tell you about his experience, projects, skills, education, achievements, languages, and how to contact him. What would you like to know?";
        }
        if (/\b(thank|thanks|thankyou|شكرا|appreciate)\b/.test(t)) {
            return "You're welcome! 😊 If you'd like to know more about Yousef's projects, skills, or experience, just ask — or tap a quick button below.";
        }
        if (/(who are you|about you|about yourself|tell me about you|introduce yourself|your name)/.test(t)) {
            return MY_INFO.find(p => p.topic === 'intro').text;
        }
        if (/(what can you|how (can|do) you|help me|need help)/.test(t)) {
            return "I can answer questions about Yousef — his experience (Datalentech Agentic AI, BARQ Systems, Wider, iCLUB, Kayfa), projects (Sadeed, Kayfa AI Sales Agent, Student Analytics), skills, education, achievements, languages, and contact info. Try a quick button or ask anything!";
        }
        return null;
    }

    function tfRespond(message) {
        const intent = handleIntent(message);
        if (intent) return intent;

        const queryWords = tokenize(message).filter(w => !STOPWORDS.has(w) && w.length > 1);
        if (queryWords.length === 0) {
            return "Ask me about Yousef's experience, projects, skills, education, achievements, languages, or how to contact him — or tap a quick button below.";
        }

        // Score every passage with TF * IDF (high term-frequency weighting) so the
        // most relevant passage wins, with a bonus for covering more distinct query terms.
        const scored = INDEX.tfs.map((tf, i) => {
            const matched = new Set();
            let score = 0;
            queryWords.forEach(q => {
                if (tf[q]) { score += tf[q] * INDEX.idf[q]; matched.add(q); }
            });
            score += matched.size * 0.6;
            return { i, score, matched };
        }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

        if (scored.length === 0) {
            return "I don't have specific info on that yet, but you can explore Yousef's projects and achievements on this page. Try asking about experience, projects, skills, education, or contact.";
        }

        const best = scored[0];
        let answer = MY_INFO[best.i].text;
        // Blend a second relevant passage when it shares strong signal, for a fuller answer.
        if (scored[1] && scored[1].score >= best.score * 0.5) {
            answer += ' ' + MY_INFO[scored[1].i].text;
        }
        return answer;
    }

    // State
    let isOpen = false;
    let isTyping = false;
    // On Vercel the API is at /api/chat/send — try it first, fallback to offline TF if unavailable
    const API_URL = window.CHATBOT_API_URL || '/api/chat/send';
    const API_ENABLED = window.CHATBOT_API_ENABLED !== false; // set to false to force offline

    async function tryApiRespond(message) {
        if (!API_ENABLED) return null;
        try {
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, sessionId }),
                signal: controller.signal,
            });
            clearTimeout(t);
            if (!res.ok) return null;
            const data = await res.json();
            if (data && data.response) return data.response;
            return null;
        } catch (e) {
            return null;
        }
    }

    // Create stylesheet
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = window.CHATBOT_CSS_URL || 'chatbot/chatbot-widget.css';
    // Fallback to absolute path if relative fails (Vercel outputDirectory handling)
    styleLink.onerror = function() {
        if (styleLink.href.indexOf('/chatbot/') === -1) return;
        const alt = document.createElement('link');
        alt.rel = 'stylesheet';
        alt.href = '/chatbot/chatbot-widget.css';
        document.head.appendChild(alt);
    };
    document.head.appendChild(styleLink);

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'chatbot-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-robot"></i>';
    toggleBtn.title = 'Chat with AI Assistant';
    toggleBtn.addEventListener('click', toggleChat);
    document.body.appendChild(toggleBtn);

    // Create container
    const container = document.createElement('div');
    container.className = 'chatbot-container';
    container.innerHTML = `
        <div class="chatbot-header">
            <div class="chatbot-avatar"><img src="assets/logo.svg" alt="YMI" onerror="this.src='/assets/logo.svg'"></div>
            <div class="chatbot-header-info">
                <h4>Yousef's AI Assistant</h4>
                <p>Ask about my experience, skills & projects</p>
            </div>
            <div class="chatbot-status">
                <span class="chatbot-status-dot"></span>
                Online
            </div>
            <button class="chatbot-close" title="Close"><i class="fas fa-times"></i></button>
        </div>
        <div class="chatbot-messages" id="chatMessages">
            <div class="chatbot-welcome">
                <span class="chatbot-welcome-icon">🤖</span>
                <h4>Hello! I'm Yousef's AI Assistant</h4>
                <p>I can answer questions about my CV, experience, projects, and skills.</p>
            </div>
        </div>
        <div class="chatbot-quick-actions" id="quickActions">
            <button class="chatbot-quick-action" data-msg="Tell me about yourself">About</button>
            <button class="chatbot-quick-action" data-msg="Tell me about your experience at Wider">Experience</button>
            <button class="chatbot-quick-action" data-msg="What are your top projects?">Projects</button>
            <button class="chatbot-quick-action" data-msg="What skills do you have?">Skills</button>
            <button class="chatbot-quick-action" data-msg="What is your education background?">Education</button>
            <button class="chatbot-quick-action" data-msg="Tell me about the Sadeed project">Sadeed</button>
            <button class="chatbot-quick-action" data-msg="Tell me about Loom CLI">Loom CLI</button>
            <button class="chatbot-quick-action" data-msg="What are your achievements?">Achievements</button>
            <button class="chatbot-quick-action" data-msg="How can I contact you?">Contact</button>
        </div>
        <div class="chatbot-input">
            <input type="text" id="chatInput" placeholder="Ask me anything..." autocomplete="off">
            <button class="chatbot-send-btn" id="chatSend" title="Send">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;
    document.body.appendChild(container);

    // Elements
    const messagesEl = container.querySelector('#chatMessages');
    const inputEl = container.querySelector('#chatInput');
    const sendBtn = container.querySelector('#chatSend');
    const closeBtn = container.querySelector('.chatbot-close');
    const quickActions = container.querySelector('#quickActions');

    // Event listeners
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    quickActions.addEventListener('click', (e) => {
        const btn = e.target.closest('.chatbot-quick-action');
        if (btn) {
            quickReply(btn.dataset.msg);
        }
    });

    function toggleChat() {
        isOpen = !isOpen;
        container.classList.toggle('active', isOpen);
        toggleBtn.classList.toggle('active', isOpen);
        if (isOpen) {
            setTimeout(() => inputEl.focus(), 300);
        }
    }

    async function sendMessage() {
        const message = inputEl.value.trim();
        if (!message || isTyping) return;

        inputEl.value = '';
        addMessage(message, 'user');

        // Show typing indicator
        isTyping = true;
        showTyping();

        // 1) Exact quick-button curated response (offline, instant)
        if (QUICK_RESPONSES[message]) {
            // Small delay to feel natural, then stream curated response
            await new Promise(r => setTimeout(r, 180));
            removeTyping();
            streamMessage(QUICK_RESPONSES[message], 'bot');
            isTyping = false;
            return;
        }

        // 2) Try Vercel API first (OpenRouter), fallback to offline TF-IDF
        const apiAnswer = await tryApiRespond(message);
        removeTyping();
        if (apiAnswer) {
            streamMessage(apiAnswer, 'bot');
        } else {
            streamMessage(tfRespond(message), 'bot');
        }
        isTyping = false;
    }

    async function quickReply(message) {
        if (isTyping || !message) return;
        addMessage(message, 'user');
        isTyping = true;
        showTyping();
        // Fast buttons are ALWAYS offline curated metadata — no API, guaranteed instant streaming
        const curated = QUICK_RESPONSES[message];
        if (curated) {
            await new Promise(r => setTimeout(r, 200));
            removeTyping();
            streamMessage(curated, 'bot');
            isTyping = false;
            return;
        }
        // Fallback (should never happen) — try API then TF
        const apiAnswer = await tryApiRespond(message);
        removeTyping();
        if (apiAnswer) {
            streamMessage(apiAnswer, 'bot');
        } else {
            streamMessage(tfRespond(message), 'bot');
        }
        isTyping = false;
    }

    function addMessage(text, type, sources) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;

        const avatar = type === 'bot' ? '<img src="assets/logo.svg" alt="YMI" class="msg-logo" onerror="this.src=\'/assets/logo.svg\'">' : '<i class="fas fa-user"></i>';

        let html = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-bubble">${formatMessage(text)}</div>
        `;

        if (sources && sources.length > 0) {
            html += `<div class="message-sources">Sources: ${sources.join(', ')}</div>`;
        }

        msgDiv.innerHTML = html;
        messagesEl.appendChild(msgDiv);
        scrollToBottom();
    }

    function streamMessage(text, type, sources) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;

        const avatar = type === 'bot' ? '<img src="assets/logo.svg" alt="YMI" class="msg-logo" onerror="this.src=\'/assets/logo.svg\'">' : '<i class="fas fa-user"></i>';
        msgDiv.innerHTML = `<div class="message-avatar">${avatar}</div><div class="message-bubble"></div>`;
        messagesEl.appendChild(msgDiv);
        const bubble = msgDiv.querySelector('.message-bubble');

        const words = String(text).split(' ');
        let idx = 0;
        const timer = setInterval(() => {
            if (idx >= words.length) {
                clearInterval(timer);
                bubble.innerHTML = formatMessage(text);
                if (sources && sources.length) {
                    const s = document.createElement('div');
                    s.className = 'message-sources';
                    s.innerHTML = 'Sources: ' + sources.join(', ');
                    msgDiv.appendChild(s);
                }
                return;
            }
            bubble.textContent += (idx === 0 ? '' : ' ') + words[idx];
            idx++;
            scrollToBottom();
        }, 30);
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar"><img src="assets/logo.svg" alt="YMI" class="msg-logo" onerror="this.src='/assets/logo.svg'"></div>
            <div class="message-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesEl.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function formatMessage(text) {
        // Convert markdown-like syntax to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="background:rgba(139,92,246,0.18);padding:2px 6px;border-radius:4px;font-size:0.85em;">$1</code>')
            .replace(/\n/g, '<br>');
    }

    // Expose toggle function globally
    window.toggleChatbot = toggleChat;
})();