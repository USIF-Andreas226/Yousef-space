// Lightweight knowledge base for Vercel serverless (mirrors portfolio/chatbot/src/knowledge-base.service.ts)
const CV_TEXT = `
YOUSEF MALAK IBRAHIM ANDRAWS - AI Engineer and Machine Learning Developer, Maadi, Cairo, Egypt.
Email: yousefmalak55@gmail.com | Phone: +201275416149 | GitHub: github.com/USIF-Andreas | LinkedIn: linkedin.com/in/yousef-malak-98026b287
EDUCATION: Bachelor of Computer Science, Software Engineering, 2023-2027, Ain Shams University, GPA 3.5/4.0 (A-).
WORK: Agentic AI Intern at Datalentech (Current) - Agentic AI systems & LLMOps, agentic architectures & LLM workflows for multi-step execution, provider-agnostic LLM abstractions & model registries, structured prompts/tools/responses/agent state, tool calling & versioned tools/prompts with schemas/validation, configurable reasoning/guardrails/fallbacks/error-handling, LLM evaluation workflows (datasets/metrics/regression/self-correction), LLMOps tracing/monitoring/cost/latency/observability, context management & optimization, modular architecture/separation of concerns/validation/testing.
WORK: AI Engineering Intern at BARQ Systems (Current, 4-week) - production LLM features, LLM APIs/tokens/context windows/prompt engineering, structured prompts & LLM evaluation (test sets/scoring/regression), RAG (embeddings/vector search/retrieval/contextual generation), integrated LLM+retrieval app, testing/monitoring/documentation/hardening, end-to-end project Demo Day.
WORK: AI Engineer at Wider (Multinational, 2025-Present) - backend AI agent infra, Knowledge Graph, LLM extraction, LangChain REST APIs.
WORK: AI Engineer Intern at Kayfa (Multinational, 2026-Present) - multilingual LangGraph sales agent with RAG over 52-course catalog, lead scoring, Twilio WhatsApp, student analytics dashboard consolidating 7 LMS sources with 37-issue data-quality audit and Plotly EDA.
WORK: Head of AI at iCLUB (2024-Present) - workshops on generative AI, deployment, ethics, mentoring Python/TensorFlow.
CERTIFICATION: AI Agent Developer Course, Orange Digital Center, Feb 2026, Grade 99.3%, 30h - AI Agents, LLMs, LangChain, RAG, Vector Stores, Multi-Agent Systems.
PROJECTS: 1) Sadeed - AI Claim Management (Django, LangGraph, pgvector HNSW, Celery, Redis, Docker) - multi-agent Extractor→Investigator→Resolver→Explainer, multilingual embeddings, OpenRouter routing, fraud detection, auto-retraining. 2) Loom CLI - Multi-Agent Coding Pipeline (MIT, LangGraph, Python) - Thinker→Worker→Debugger, Anthropic/Groq/OpenRouter/NVIDIA, TPM backoff, context compaction, SQLite checkpointing. 3) Kayfa AI Sales Agent - LangGraph, RAG, MongoDB, Twilio, Streamlit, Pydantic v2 - Arabic/English multi-dialect, CRM tickets, WhatsApp. 4) Kayfa Student Analytics Dashboard - Pandas, Plotly, Jupyter - 7-file LMS consolidation, 37-issue audit. 5) AI Travel Reservation Chatbot (n8n). 6) Online Exam Management System (Java, JavaFX, Maven). 7) Land Type Classification Satellite Imagery (TensorFlow, Sentinel-2, NWPU-RESISC45) - ResNet50 81.9% vs EfficientNetB0 96.3%. 8) Forest Cover Type Prediction (XGBoost 86.6%). 9) Walmart Sales Forecasting (LightGBM MAE ~$7277). 10) Diabetes Prediction Model (Scikit-learn, SMOTE, 76%). 11) Mall Customer Segmentation (K-Means 5 clusters). 12) Image Segmentation App (C#, DSU).
SKILLS: AI/Agents: LangChain, LangGraph, Multi-Agent, RAG, Prompt Engineering, Knowledge Graphs. ML: Scikit-learn, TensorFlow, PyTorch, XGBoost, LightGBM, SMOTE. Backend: Django, FastAPI, REST, Auth, MongoDB. Data/Vector: pgvector, Qdrant, Supabase, PostgreSQL, Redis, Celery, Docker. Automation: n8n, Twilio. Languages: Python, Java, C#, C++, JavaScript, SQL. Tools: Pandas, Jupyter, Streamlit, Seaborn, JavaFX. LANGUAGES: Arabic Native, English Fluent, German Good. ACHIEVEMENTS: 1st Place NLP Project, 2nd Place ML Competition at Ain Shams University.
`;

function simpleSearch(query, topK = 3) {
  const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const paragraphs = CV_TEXT.split('\n').filter(p => p.trim().length > 20);
  // also split by sentences
  const chunks = [...paragraphs, ...CV_TEXT.split(/(?<=[.!])\s+/).filter(s => s.trim().length > 30)];
  const scored = chunks.map(c => {
    const lower = c.toLowerCase();
    let score = 0;
    queryWords.forEach(w => {
      if (lower.includes(w)) score += 2;
      const re = new RegExp(`\\b${w}\\b`, 'gi');
      const m = lower.match(re);
      if (m) score += m.length;
    });
    return { text: c.trim(), score };
  }).filter(s => s.score > 0).sort((a,b)=> b.score - a.score);
  return scored.slice(0, topK).map(s => s.text);
}

function offlineResponse(message) {
  const lower = message.toLowerCase();
  if (/\b(hi|hello|hey|greetings)\b/.test(lower)) {
    return "Hello! I'm Yousef's AI assistant (running on Vercel). How can I help you learn about his skills, experience, or projects?";
  }
  const ctx = simpleSearch(message, 2);
  if (ctx.length > 0) {
    return ctx.join(' ');
  }
  return "Yousef Malak Ibrahim is an AI Engineer & ML Developer (Ain Shams University, GPA 3.5/4.0) working at Wider and Head of AI at iCLUB. Ask me about his experience, projects (Sadeed, Loom CLI, Kayfa Sales Agent), skills (LangGraph, TensorFlow, Django, pgvector), education, achievements (1st NLP, 2nd ML), languages, or contact (yousefmalak55@gmail.com).";
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  try {
    const { message, sessionId } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    if (message.length > 4000) {
      return res.status(400).json({ error: 'message too long (max 4000)' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    const relevant = simpleSearch(message, 3);
    const context = relevant.join('\n\n');

    // If no API key, return offline RAG response directly (no external call)
    if (!apiKey || apiKey === 'sk-or-v1-your-api-key-here') {
      const resp = offlineResponse(message);
      return res.status(200).json({ response: resp, model: 'offline-vercel-rag', sources: relevant.map((_,i)=>`CV-${i}`) });
    }

    const systemPrompt = `You are Yousef Malak Ibrahim's AI assistant. Answer based on context. Be friendly, concise, professional. If question is about Yousef, use context. Respond in user's language.\nContext:\n${context}\nAbout Yousef: Agentic AI Intern at Datalentech (Current, Agentic AI & LLMOps), AI Engineering Intern at BARQ Systems (Current, 4-week RAG/LLM), AI Engineer at Wider, Head of AI at iCLUB, AI Engineer Intern at Kayfa, Ain Shams CS GPA 3.5/4.0, skills: LangChain/LangGraph/RAG/pgvector/Django/FastAPI/TensorFlow/PyTorch.`.trim();

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://yousef-portfolio.vercel.app',
        'X-Title': 'Yousef Malak Ibrahim Portfolio',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error('OpenRouter error', openRouterRes.status, errText);
      // fallback to offline
      return res.status(200).json({ response: offlineResponse(message), model: 'offline-fallback-vercel-rag', sources: relevant.map((_,i)=>`CV-${i}`), warning: 'OpenRouter failed, used offline fallback' });
    }

    const data = await openRouterRes.json();
    const assistantMessage = data.choices?.[0]?.message?.content || offlineResponse(message);

    return res.status(200).json({
      response: assistantMessage,
      model: data.model || model,
      usage: data.usage,
      sources: relevant.map((_,i)=>`CV-${i}`),
    });
  } catch (err) {
    console.error('API error', err);
    return res.status(200).json({ response: offlineResponse(String(req.body?.message || '')), model: 'offline-fallback-vercel-rag', sources: [], warning: err.message });
  }
}
