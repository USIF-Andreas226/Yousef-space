/* ==========================================
   Yousef Malak Ibrahim - AI Chatbot Widget
   ========================================== */

(function() {
    // Fully client-side assistant — no backend / OpenRouter required.
    const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

    // Local knowledge base (split into passages for TF-IDF matching)
    const MY_INFO = [
        { topic: 'intro', text: 'Yousef Malak Ibrahim is an AI Engineer and ML Developer based in Cairo, Egypt, currently pursuing a Bachelor of Computer Science at Ain Shams University (GPA 3.5/4.0, A-). He is passionate about building production-ready AI agent systems and large language model applications.' },
        { topic: 'experience-wider', text: 'At Wider, a multinational company, Yousef works as an AI Engineer building backend AI agent infrastructure, knowledge graphs, and LLM extraction pipelines for production authentication and identity systems.' },
        { topic: 'experience-iclub', text: 'As Head of AI at iCLUB (Ain Shams University), Yousef leads AI initiatives, runs hands-on workshops on generative AI, deployment, and AI ethics, and mentors student developers building real-world ML projects.' },
        { topic: 'experience-kayfa', text: 'Yousef\'s most recent internship was at Kayfa, a multinational education company, where he built AI solutions for education and business — including a multilingual AI Sales Agent and a Student Analytics Dashboard.' },
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
            return "I can answer questions about Yousef — his experience (Wider, iCLUB, Kayfa), projects (Sadeed, Kayfa AI Sales Agent, Student Analytics), skills, education, achievements, languages, and contact info. Try a quick button or ask anything!";
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

    // Create stylesheet
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = window.CHATBOT_CSS_URL || '/chatbot/chatbot-widget.css';
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
            <div class="chatbot-avatar"><img src="/assets/logo.svg" alt="YMI"></div>
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

        // Fully client-side: TF-match against local info
        setTimeout(() => {
            removeTyping();
            streamMessage(tfRespond(message), 'bot');
            isTyping = false;
        }, 200);
    }

    function quickReply(message) {
        if (isTyping || !message) return;
        addMessage(message, 'user');
        isTyping = true;
        showTyping();
        // Same fast client-side TF engine as free-text input — no network wait.
        setTimeout(() => {
            removeTyping();
            streamMessage(tfRespond(message), 'bot');
            isTyping = false;
        }, 250);
    }

    function addMessage(text, type, sources) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;

        const avatar = type === 'bot' ? '<img src="/assets/logo.svg" alt="YMI" class="msg-logo">' : '<i class="fas fa-user"></i>';

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

        const avatar = type === 'bot' ? '<img src="/assets/logo.svg" alt="YMI" class="msg-logo">' : '<i class="fas fa-user"></i>';
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
            <div class="message-avatar"><img src="/assets/logo.svg" alt="YMI" class="msg-logo"></div>
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