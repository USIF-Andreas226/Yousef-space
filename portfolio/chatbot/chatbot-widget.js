/* ==========================================
   Yousef Malak Ibrahim - AI Chatbot Widget
   ========================================== */

(function() {
    // Fully client-side assistant — no backend / OpenRouter required.
    const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

    // Local knowledge base (split into passages for TF matching)
    const MY_INFO = [
        { text: 'Yousef Malak Ibrahim is an AI Engineer and ML Developer pursuing a Bachelor of Computer Science at Ain Shams University (GPA 3.5/4.0, A-).' },
        { text: 'At Wider (multinational company) Yousef builds backend AI agent infrastructure, knowledge graphs, and LLM extraction pipelines for production authentication flows.' },
        { text: 'As Head of AI at iCLUB (Ain Shams University) Yousef leads AI initiatives, runs workshops on generative AI, deployment, and ethics, and mentors developers.' },
        { text: 'Sadeed is a multi-agent LangGraph claim management system using semantic deduplication with pgvector, fraud detection, and an auto-retraining pipeline.' },
        { text: 'The Kayfa AI Sales Agent is a multilingual (Arabic/English) LangGraph sales chatbot with RAG over a 52-course catalog, lead scoring, CRM tickets, and WhatsApp notifications via Twilio, deployed on Streamlit Cloud.' },
        { text: 'The Kayfa Student Analytics Dashboard consolidated 7 multi-source LMS files, ran a 37-issue data quality audit, and built Plotly EDA visualizations with a Jupyter cleaning pipeline.' },
        { text: 'Yousef\'s most recent internship was at Kayfa, where he built AI solutions in education and business — including the multilingual Kayfa AI Sales Agent (RAG over a 52-course catalog with lead scoring and WhatsApp via Twilio) and the Kayfa Student Analytics Dashboard for LMS data quality and EDA.' },
        { text: 'Yousef won 1st place for an NLP project and 2nd place in an ML project competition at Ain Shams University.' },
        { text: 'Skills include LangGraph, LangChain, RAG, multi-agent systems, knowledge graphs, Python, TensorFlow, PyTorch, XGBoost, LightGBM, Django, FastAPI, MongoDB, Twilio, and Streamlit.' },
        { text: 'Yousef speaks Arabic (native), English (fluent), and German (good).' },
        { text: 'You can reach Yousef at yousefmalak55@gmail.com, by phone at +20 127 541 6149, or via LinkedIn and GitHub (USIF-Andreas).' },
        { text: 'Other projects include an AI Travel Reservation Chatbot (n8n), an Online Exam Management System (Java/JavaFX), Land Type Classification from satellite imagery (TensorFlow), Forest Cover Type Prediction (XGBoost), Walmart Sales Forecasting (LightGBM), a Diabetes Prediction Model, Mall Customer Segmentation (K-Means), and an Image Segmentation App (C#).' },
    ];

    const STOPWORDS = new Set(['the','a','an','and','or','is','are','was','were','to','of','in','on','for','with','my','me','i','you','your','what','who','how','do','does','did','can','have','has','had','at','from','about','tell','please','this','that','be','it','as','by','he','she','they','we','our','their','but','if','so','get','know','more','top','some','any','will','would','there','here','than','into','out','up','down','all','his','her','him','its','am','not','no']);

    function tokenize(str) {
        return String(str).toLowerCase().match(/[a-z0-9]+/g) || [];
    }

    function tfRespond(message) {
        const queryWords = tokenize(message).filter(w => !STOPWORDS.has(w) && w.length > 1);
        if (queryWords.length === 0) {
            return "Ask me about Yousef's experience, projects, skills, education, achievements, languages, or contact — or tap a quick button below.";
        }
        let best = null;
        let bestScore = 0;
        let bestMatched = [];
        for (const passage of MY_INFO) {
            const counts = {};
            tokenize(passage.text).forEach(w => { counts[w] = (counts[w] || 0) + 1; });
            const matched = new Set();
            let score = 0;
            queryWords.forEach(q => {
                if (counts[q]) { score += counts[q]; matched.add(q); }
            });
            score += matched.size * 2;
            if (score > bestScore) {
                bestScore = score;
                best = passage;
                bestMatched = [...matched];
            }
        }
        if (!best || bestScore === 0) {
            return "I don't have specific info on that yet, but you can explore Yousef's projects and achievements on this page. Try asking about experience, projects, skills, or education.";
        }
        return best.text;
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
            <div class="chatbot-avatar"><i class="fas fa-brain"></i></div>
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
            <button class="chatbot-quick-action" data-msg="Tell me about your experience at Wider">Experience</button>
            <button class="chatbot-quick-action" data-msg="What are your top projects?">Projects</button>
            <button class="chatbot-quick-action" data-msg="What skills do you have?">Skills</button>
            <button class="chatbot-quick-action" data-msg="What is your education background?">Education</button>
            <button class="chatbot-quick-action" data-msg="What languages do you speak?">Languages</button>
            <button class="chatbot-quick-action" data-msg="Tell me about the Sadeed project">Sadeed</button>
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
        // Fast, saved-response path with no network wait
        setTimeout(() => {
            removeTyping();
            streamMessage(offlineRespond(message), 'bot');
            isTyping = false;
        }, 250);
    }

    function offlineRespond(message) {
        const text = message.toLowerCase();
        const faq = [
            { keys: ['experience', 'wider', 'work'], reply: 'Yousef is an AI Engineer at Wider, building backend AI agent infrastructure, knowledge graphs, and LLM extraction pipelines. He is also Head of AI at iCLUB (Ain Shams University).' },
            { keys: ['project', 'sadeed', 'kayfa', 'sales agent'], reply: 'Notable projects include Sadeed (multi-agent claim management with LangGraph), the Kayfa AI Sales Agent (multilingual RAG chatbot on Streamlit), and the Kayfa Student Analytics Dashboard (Plotly EDA).' },
            { keys: ['skill', 'tech', 'stack', 'langgraph', 'twilio', 'mongodb'], reply: 'Skills include LangGraph, LangChain, RAG, MongoDB, Twilio, Python, TensorFlow, PyTorch, Django, FastAPI, and more.' },
            { keys: ['education', 'university', 'ain shams', 'degree'], reply: 'Yousef is pursuing a Bachelor\'s in Computer Science at Ain Shams University (GPA 3.4/4.0).' },
            { keys: ['language', 'arabic', 'english', 'german'], reply: 'He speaks Arabic (native), English (fluent), and German (good).' },
            { keys: ['achievement', 'award', 'rank', 'nlp', 'competition'], reply: 'He placed 1st in an NLP project and 2nd in an ML project competition at Ain Shams University.' },
            { keys: ['contact', 'email', 'hire', 'reach'], reply: 'You can reach Yousef at yousefmalak55@gmail.com or via LinkedIn / GitHub.' },
        ];
        for (const item of faq) {
            if (item.keys.some(k => text.includes(k))) return item.reply;
        }
        return 'Thanks for your message! The AI backend isn\'t connected right now, but you can explore Yousef\'s projects and achievements on this page. Ask me about experience, projects, skills, education, or contact.';
    }

    function addMessage(text, type, sources) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;

        const avatar = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

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

        const avatar = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
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
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
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