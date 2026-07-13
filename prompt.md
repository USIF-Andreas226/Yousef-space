You are editing my personal portfolio website for Yousef Malak Ibrahim. This is a plain HTML/CSS/JS site (with an embedded NestJS chatbot) whose real structure and aesthetic are documented in PORTFOLIO_CODE_REFERENCE.md. Use that reference for accurate file paths, component names, and the visual system.

Real aesthetic (from the codebase, NOT "Neural Ink"):
- Dark theme: --bg-dark / --bg-card backgrounds
- Accent tokens: --primary (purple), --secondary (teal), --accent (coral)
- Canvas particle background (~80 particles, lines between nearby ones, mouse-reactive) in portfolio/script.js (initParticles)
- Custom cursor glow (initCursorGlow), scroll-triggered reveal via IntersectionObserver (initScrollAnimations, .animate-on-scroll / .visible classes)
- Component classes already in use: .project-card, .skill-category, .timeline-item, hero stats with animated counters
- A floating chatbot widget (portfolio/chatbot/chatbot-widget.js + .css)

Key files you will edit:
- portfolio/index.html  (sections: Hero, About, Experience, Projects, Skills, Contact, Footer)
- portfolio/style.css   (all theme tokens + component styles)
- portfolio/script.js   (animations/interactions)

=== TASK 1: NEW PROJECT CONTENT ===

1. NEW PROJECT — Kayfa AI Sales Agent (internship project at Kayfa)
   - Multilingual (Arabic/English, multi-dialect) LangGraph-based sales chatbot for courses and diplomas
   - RAG over a 52-course catalog
   - Lead scoring + automatic CRM ticket creation
   - WhatsApp notifications via Twilio integration
   - MongoDB for data persistence
   - Pydantic v2 models with validation constraints for the CRM layer
   - Deployed on Streamlit Cloud
   - Tech stack tags: LangGraph, Python, RAG, MongoDB, Twilio, Streamlit, Pydantic v2
   - Frame this as work done during my internship at Kayfa

2. NEW PROJECT — Kayfa Student Analytics Dashboard (also from the Kayfa internship)
   - Consolidated multi-source LMS data (7 files) into a unified analytics view
   - Conducted a 37-issue data quality audit
   - Built EDA visualizations with Plotly
   - Built a Jupyter-based data cleaning pipeline
   - Built in collaboration with a teammate (Ibrahim)
   - Tech stack tags: Python, Pandas, Plotly, Jupyter, Data Cleaning

3. NEW ACHIEVEMENT / HIGHLIGHT — placed 2nd (second rank) in an ML project at Ain Shams University. Add this to an "Achievements" / "Highlights" section (create one near the top or near About if it doesn't exist), styled as a small badge/card that matches the existing palette (purple/teal/coral accent).

=== TASK 2: SKILLS SECTION UPDATE ===
- Add LangGraph, Twilio, and MongoDB to the Skills / Tech Stack section (currently grouped as AI & agents, machine learning, backend, data/vector, automation, languages/tools) if missing.

=== REQUIREMENTS ===
- Match the existing .project-card / grid layout, hover states, and animation timing used by other projects (use .animate-on-scroll for reveal).
- Use consistent tech-tag styling with existing project cards.
- Keep copy concise and outcome-focused (what it does / what I built), not just a feature list.
- Do not break or reorder existing projects unless necessary — only insert the new entries.
- Keep the real palette and animation patterns; do not introduce the navy/amber/cyan "Neural Ink" scheme described elsewhere.
- If you also add the new content to the chatbot's local knowledge base (portfolio/chatbot/src/knowledge-base.service.ts cvText), mention it but it is optional.

Before applying changes, show me a concise summary of: which files you will touch, where each new entry will be placed in index.html, and the exact Skills additions. Then show the diff for the actual edits.
