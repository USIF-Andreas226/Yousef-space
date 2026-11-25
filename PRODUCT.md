# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are AI/ML hiring managers and technical recruiters evaluating engineering readiness for AI Engineer, Agentic AI, LLMOps, and ML Developer roles. They arrive from a CV, LinkedIn, GitHub, or direct application link to quickly verify hands-on production experience, shipped agentic/ML systems, technical depth, and contact availability.

## Product Purpose

A personal AI engineering portfolio that proves production readiness and converts recruiter or hiring-manager visits into direct outreach, CV downloads, or deeper technical inspection (GitHub repositories, live demos, and interactive CV Q&A via the embedded chatbot).

## Positioning

Production-ready Agentic AI & LLMOps engineer: builds, evaluates, and deploys multi-agent workflows, RAG systems, and backend AI infrastructure—not just isolated notebooks or demos.

## Operating Context

Visitors evaluate the portfolio asynchronously across desktop and mobile browsers by scanning the hero positioning, experience timeline, featured projects, and skills matrix, inspecting live Streamlit demos and GitHub repositories, downloading the PDF CV (`portfolio/CV_Yousef_Malak_ibrahim.pdf`), asking follow-up questions in the floating AI CV chatbot widget, or reaching out via email/LinkedIn/contact form.

## Capabilities and Constraints

- **Static portfolio frontend (`portfolio/`):** Plain HTML5, CSS3, and Vanilla JavaScript (`portfolio/index.html`, `portfolio/style.css`, `portfolio/script.js`) with scroll animations, interactive contact form handling, and downloadable PDF CV.
- **Embedded AI CV chatbot:** Floating widget (`portfolio/chatbot/chatbot-widget.js`, `portfolio/chatbot/chatbot-widget.css`) querying OpenRouter with CV RAG and an offline keyword fallback.
- **Dual backend / deployment setup present in repo:** Vercel static + serverless endpoints (`vercel.json`, `api/chat/send.js`, `api/chat/history.js`, `api/chat/info.js`) alongside a NestJS backend (`portfolio/chatbot/`, `railway.json`, `nixpacks.toml`).
- **Known repository drift (undecided cleanup):**
  - Canonical deployment target (Vercel serverless vs. Railway NestJS vs. maintaining both) is undecided.
  - `README.md` still carries the legacy title `Andreas-space` and Railway-only description.
  - `portfolio/chatbot/src/knowledge-base.service.ts` lists GPA `3.4` and omits newer projects (`Loom CLI`, `Kayfa` projects) that are already present in `portfolio/index.html` and `api/chat/send.js` (`GPA 3.5/4.0`).

## Brand Commitments

- **Identity:** Yousef Malak Ibrahim (`YMI`) — AI Engineer & ML Developer, Maadi, Cairo, Egypt; CS (Software Engineering) undergraduate at Ain Shams University (2023–2027).
- **Verified contact & profile links:** `yousefmalak55@gmail.com`, `+20 127 541 6149`, LinkedIn (`yousef-malak-98026b287`), GitHub (`USIF-Andreas`).
- **Existing brand assets:** `portfolio/profile.png`, `portfolio/assets/avatar.svg`, `portfolio/assets/logo.svg`, inline pixel-avatar SVG in `portfolio/index.html`, and `portfolio/CV_Yousef_Malak_ibrahim.pdf`.

## Evidence on Hand

- **Work & leadership experience:** Agentic AI Intern at Datalentech; AI Engineering Intern at BARQ Systems; AI Engineer at Wider (multinational); AI Engineer Intern at Kayfa (multinational); Head of AI at iCLUB (Ain Shams University).
- **Education & certification:** B.Sc. Computer Science (Software Engineering), Ain Shams University (2023–2027, GPA 3.5/4.0 in portfolio HTML / 3.4/4.0 in NestJS KB); Orange Digital Center AI Agent Developer Course (Feb 2026, 99.3%, 30h).
- **Recognitions:** 1st Place NLP Project and 2nd Place ML Project Competition at Ain Shams University.
- **Shipped projects & demos:** `Sadeed` (multi-agent LangGraph + pgvector claim management), `Loom CLI` (provider-agnostic multi-agent coding pipeline), `Kayfa AI Sales Agent` (live Streamlit demo + GitHub), `Kayfa Student Analytics Dashboard` (live Streamlit demo + GitHub), plus ML/DL/engineering projects (`Land Type Classification`, `Forest Cover Type Prediction`, `Walmart Sales Forecasting`, `Diabetes Prediction Model`, `Mall Customer Segmentation`, `AI Travel Reservation Chatbot`, `Online Exam Management System`, `Image Segmentation App`).
- **Absences (do not fabricate):** No client testimonials, press logos, employer endorsements, or unverified production latency/revenue benchmarks exist in the repository.

## Product Principles

1. **Lead with production proof:** Every role and featured project should foreground architecture, reliability practices (evaluation, guardrails, observability, deployment), and verifiable artifacts (repos, live demos) over generic buzzwords.
2. **Optimize for fast recruiter scanning:** Hiring managers should understand Yousef's focus, seniority, and strongest systems within seconds, with clear paths to CV download, project links, and contact.
3. **Keep facts synchronized across surfaces:** Experience, GPA, projects, and skills across `portfolio/index.html`, the PDF CV, and both chatbot knowledge bases (`api/chat/send.js` and `portfolio/chatbot/src/knowledge-base.service.ts`) must stay consistent and strictly factual.
4. **Preserve lightweight, reliable delivery:** Keep the portfolio fast, dependency-light, and functional even when external AI APIs are offline or rate-limited.
