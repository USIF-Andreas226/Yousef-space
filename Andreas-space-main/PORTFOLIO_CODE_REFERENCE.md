# Portfolio Code Reference

This document explains the portfolio project in a file-by-file and code-by-code way so it is easy to understand, maintain, and extend.

## 1. Project Overview

This repository contains a personal portfolio website for Yousef Malak Ibrahim with two main parts:

1. A polished front-end portfolio page built with plain HTML, CSS, and JavaScript.
2. An embedded AI chatbot backend built with NestJS and TypeScript that serves as a conversational assistant about the portfolio owner.

The site is designed to feel modern and interactive, with:

- animated particles and a custom cursor glow
- smooth scrolling and section-based navigation
- a floating AI chatbot widget
- a backend that can answer questions using a local knowledge base and optionally OpenRouter

---

## 2. Main File Structure

- [portfolio/index.html](portfolio/index.html) — the complete portfolio page structure
- [portfolio/style.css](portfolio/style.css) — all visual styling, animations, and theme rules
- [portfolio/script.js](portfolio/script.js) — interactive frontend behavior
- [portfolio/chatbot/chatbot-widget.js](portfolio/chatbot/chatbot-widget.js) — the floating chatbot UI logic
- [portfolio/chatbot/chatbot-widget.css](portfolio/chatbot/chatbot-widget.css) — the chatbot widget visual styling
- [portfolio/chatbot/package.json](portfolio/chatbot/package.json) — Node/NestJS project settings and scripts
- [portfolio/chatbot/src/main.ts](portfolio/chatbot/src/main.ts) — app bootstrap
- [portfolio/chatbot/src/app.module.ts](portfolio/chatbot/src/app.module.ts) — main NestJS module with static file hosting
- [portfolio/chatbot/src/chatbot/chatbot.controller.ts](portfolio/chatbot/src/chatbot/chatbot.controller.ts) — API routes for chat
- [portfolio/chatbot/src/chatbot/chatbot.service.ts](portfolio/chatbot/src/chatbot/chatbot.service.ts) — conversation logic and LLM integration
- [portfolio/chatbot/src/knowledge-base.service.ts](portfolio/chatbot/src/knowledge-base.service.ts) — local knowledge base built from CV and portfolio text
- [portfolio/chatbot/src/chatbot/dto/send-message.dto.ts](portfolio/chatbot/src/chatbot/dto/send-message.dto.ts) — request validation for chat messages
- [portfolio/chatbot/src/chatbot/types.ts](portfolio/chatbot/src/chatbot/types.ts) — TypeScript types for chat payloads
- [portfolio/chatbot/src/chatbot/chatbot.module.ts](portfolio/chatbot/src/chatbot/chatbot.module.ts) — NestJS module wiring
- [portfolio/CV_Yousef_Malak_ibrahim.pdf](portfolio/CV_Yousef_Malak_ibrahim.pdf) — downloadable CV asset
- [nixpacks.toml](nixpacks.toml) and [railway.json](railway.json) — deployment configuration

---

## 3. Detailed File-by-File Explanation

### [portfolio/index.html](portfolio/index.html)

This file is the full HTML structure of the portfolio website.

#### What it contains
- A full-page single-site layout with sections for:
  - Hero
  - About
  - Experience and Education
  - Projects
  - Skills
  - Contact
  - Footer
- Links to external style and font resources
- A reference to the chatbot widget stylesheet
- A script tag for the main JavaScript file and the chatbot widget JavaScript file

#### Key sections in the page
- Hero section:
  - introduces Yousef as an AI Engineer and ML Developer
  - includes CTA buttons for viewing projects and downloading the CV
  - shows profile image and floating badges
- About section:
  - includes personal background, education, location, email, phone, and language proficiency
- Experience section:
  - shows timeline entries for Wider, iCLUB, Ain Shams University, and Orange Digital Center
- Projects section:
  - lists multiple featured projects such as Sadeed, travel chatbot, exam system, land classification, forecasting, diabetes model, image segmentation, and customer segmentation
- Skills section:
  - groups skills into AI & agents, machine learning, backend, data/vector, automation, and languages/tools
- Contact section:
  - includes contact details and a form with a submit button
- Footer:
  - closes the site with branding and social links

#### Important implementation detail
The page uses a lot of class names such as animate-on-scroll, skill-category, project-card, and timeline-item, which are styled and animated in the CSS and JavaScript files.

---

### [portfolio/style.css](portfolio/style.css)

This is the visual engine of the portfolio.

#### What it defines
- CSS variables for the color palette and spacing system
- global reset styles
- layout classes like container and section spacing
- all section-level styling for hero, about, projects, skills, contact, and footer
- animations for fade-in, pulse, movement, and scroll-based visibility

#### Important design tokens
The file uses variables such as:
- --primary for the main purple accent
- --secondary for the teal accent
- --accent for the coral highlight
- --bg-dark and --bg-card for the dark theme background

These variables keep the design consistent and easy to change.

#### Notable UI behaviors implemented here
- fixed navigation bar with blur and shadow on scroll
- animated hero title and subtitle
- glowing cursor effect placeholder and particle canvas support
- responsive behavior for mobile screens
- card hover states and gradient buttons
- chatbot widget styling

#### Why it matters
This file makes the portfolio feel premium and modern. It controls almost every visual behavior of the site.

---

### [portfolio/script.js](portfolio/script.js)

This file handles all the interactive frontend behavior.

#### Main initialization
The DOMContentLoaded event runs a set of setup functions:
- initParticles()
- initCursorGlow()
- initNavbar()
- initScrollAnimations()
- initCounters()
- initContactForm()
- initSmoothScroll()
- initParallax()

#### Function breakdown

##### initParticles()
- creates a canvas-based particle background
- spawns around 80 particles
- draws lines between nearby particles
- makes particles react to mouse movement
- uses requestAnimationFrame for smooth animation

This gives the site a futuristic live background.

##### initCursorGlow()
- creates a moving glowing orb that follows the mouse pointer
- uses requestAnimationFrame for fluid movement

##### initNavbar()
- adds a scrolled class to the navigation bar when the page scrolls down
- handles the mobile hamburger menu open/close behavior
- highlights the current section while scrolling

##### initScrollAnimations()
- uses IntersectionObserver to reveal cards and content as they come into view
- adds the visible class to animated elements

##### initCounters()
- animates the numbers in the hero stats section from 0 to their target values

##### initContactForm()
- intercepts the contact form submission
- shows a temporary sending state
- simulates success feedback and resets the form after a short delay

##### initSmoothScroll()
- makes anchor links scroll smoothly instead of jumping instantly

##### initParallax()
- adds a subtle parallax effect to the hero background gradient

#### Extra effect
The hero subtitle uses a typing effect that gradually reveals the text with a delay.

---

### [portfolio/chatbot/chatbot-widget.js](portfolio/chatbot/chatbot-widget.js)

This file powers the floating AI assistant widget on the portfolio page.

#### What it does
- creates a floating button in the bottom-right corner
- creates the chatbot popup container
- handles opening and closing the chat window
- sends messages to the backend API
- displays chat history and a typing indicator
- shows quick-action buttons for common questions

#### Important logic

##### API base selection
The script chooses the correct backend URL depending on the environment:
- localhost uses http://localhost:3001/api/chat
- production uses /api/chat
- GitHub Codespaces uses a hostname-based URL adjustment

##### Session management
A random session ID is generated for each page load to keep conversations separated.

##### sendMessage()
- reads the current input text
- adds the user message to the chat UI
- shows the typing indicator
- sends a POST request to /send
- displays the backend reply
- handles errors gracefully

##### addMessage()
- renders both user and bot messages into the chat UI
- optionally shows source references returned by the backend

##### formatMessage()
- converts simple markdown-style text into HTML for display

#### Why this file is important
It connects the static portfolio front-end to the backend chatbot service and makes the AI assistant feel native to the website.

---

### [portfolio/chatbot/chatbot-widget.css](portfolio/chatbot/chatbot-widget.css)

This file styles the floating chatbot widget.

#### What it controls
- the button placement and animation
- the popup container size and appearance
- the message bubble layout
- the send button and input field style
- the typing indicator animation
- quick-action chip styles

#### Visual style choices
The widget uses the same dark theme as the main site and adds subtle gradients, rounded corners, and animated states to make it feel contemporary.

---

### [portfolio/chatbot/package.json](portfolio/chatbot/package.json)

This file defines the NestJS chatbot application.

#### Main scripts
- build — runs nest build
- start — runs nest start
- start:dev — runs the app in watch mode
- start:prod — runs the compiled production build

#### Main dependencies
- @nestjs/common, @nestjs/core, @nestjs/platform-express — NestJS framework
- @nestjs/axios — HTTP client support for calling OpenRouter
- @nestjs/config — environment variable handling
- @nestjs/serve-static — serves the portfolio front-end files
- class-validator and class-transformer — request validation
- dotenv — environment loading

#### Why it matters
This file is the package manifest that controls the chatbot backend runtime and build process.

---

### [portfolio/chatbot/src/main.ts](portfolio/chatbot/src/main.ts)

This is the entry point of the NestJS application.

#### What happens here
- creates the Nest app
- enables global validation for incoming DTOs
- enables CORS for cross-origin requests
- starts the server on process.env.PORT or port 3000

#### Important detail
The app is configured to listen on a dynamic port, which is useful for deployment platforms such as Railway.

---

### [portfolio/chatbot/src/app.module.ts](portfolio/chatbot/src/app.module.ts)

This is the root module for the backend.

#### What it imports
- ConfigModule.forRoot() to read environment variables globally
- ServeStaticModule.forRoot() to serve the static portfolio files from the parent directory
- ChatbotModule to register the chat feature

#### Important detail
The static serving is configured to exclude /api/(.*), so API routes will not be mistaken for files and frontend assets will still load correctly.

---

### [portfolio/chatbot/src/chatbot/chatbot.module.ts](portfolio/chatbot/src/chatbot/chatbot.module.ts)

This file wires the chatbot feature into NestJS.

#### What it registers
- HttpModule for outbound API calls
- ChatbotController for the endpoints
- ChatbotService and KnowledgeBaseService as providers

---

### [portfolio/chatbot/src/chatbot/chatbot.controller.ts](portfolio/chatbot/src/chatbot/chatbot.controller.ts)

This is the API layer for the chatbot.

#### Endpoints
- POST /api/chat/send
  - accepts a message and optional sessionId
  - sends the request to the service
- GET /api/chat/history
  - returns the chat history for a session
- DELETE /api/chat/history
  - clears conversation history for the session
- GET /api/chat/info
  - returns metadata about the assistant and its capabilities

#### Why it is important
It exposes the chatbot as a clear API surface for the front-end widget.

---

### [portfolio/chatbot/src/chatbot/chatbot.service.ts](portfolio/chatbot/src/chatbot/chatbot.service.ts)

This is the business logic layer for the chatbot.

#### Main responsibilities
- searches the local knowledge base for relevant context
- prepares a system prompt about Yousef
- stores conversation history per session
- optionally calls the OpenRouter API
- falls back to an offline response if no valid API key is available or the API call fails

#### Core behavior
- It first uses the local knowledge base to gather relevant snippets.
- Then it builds a system prompt that tells the model to answer as Yousef’s assistant.
- If OpenRouter is available, it sends the prompt and conversation context to the chosen model.
- If not, it returns a safe offline fallback response.

#### Important variables
- MAX_HISTORY = 20 limits the length of stored conversation history
- the default model is openai/gpt-4o-mini unless overridden in the environment
- the service uses the OPENROUTER_API_KEY environment variable

#### Why this file matters
It is the heart of the chatbot experience and combines retrieval, prompting, conversation memory, and model calls into a single service.

---

### [portfolio/chatbot/src/knowledge-base.service.ts](portfolio/chatbot/src/knowledge-base.service.ts)

This file builds the chatbot’s local knowledge base.

#### What it does
- stores a large block of text describing Yousef’s CV, experience, projects, skills, and education
- splits the text into chunks
- creates paragraph-based chunks as well
- provides a search method that scores chunks by keyword relevance

#### How it works
- The knowledge base is created from the cvText string.
- createChunks() splits the content into manageable chunks.
- search(query, topK) looks through the chunks and returns the best matches based on word overlap and technical-term boosts.

#### Why it matters
This is what makes the chatbot capable of answering questions even when the OpenRouter API is not available.

---

### [portfolio/chatbot/src/chatbot/dto/send-message.dto.ts](portfolio/chatbot/src/chatbot/dto/send-message.dto.ts)

This file defines the incoming body shape for chat requests.

#### Validation rules
- message must be a string
- message must not be empty
- message length is capped at 4000 characters
- sessionId is optional and may be omitted

#### Why it matters
It protects the API from malformed inputs and ensures cleaner request handling.

---

### [portfolio/chatbot/src/chatbot/types.ts](portfolio/chatbot/src/chatbot/types.ts)

This file contains TypeScript interfaces used throughout the chatbot service and controller.

#### Key interfaces
- KnowledgeChunk — holds text and source metadata
- ChatMessage — a single message in the conversation
- ChatResponse — the expected shape of the LLM response
- SendMessagePayload — the payload sent by the client

---

### [nixpacks.toml](nixpacks.toml)

This file helps deployment platforms install and build the app correctly.

#### Purpose
It configures the build environment and dependencies for deployment.

---

### [railway.json](railway.json)

This file configures the Railway deployment behavior.

#### Purpose
It tells Railway how to run the project, including the working directory and startup path.

---

## 4. How the Portfolio and Chatbot Work Together

The relationship is simple:

1. The portfolio website is rendered by [portfolio/index.html](portfolio/index.html), [portfolio/style.css](portfolio/style.css), and [portfolio/script.js](portfolio/script.js).
2. The AI assistant widget is injected by [portfolio/chatbot/chatbot-widget.js](portfolio/chatbot/chatbot-widget.js).
3. The widget sends requests to the NestJS API at /api/chat/send.
4. The backend service searches the knowledge base, builds a prompt, and replies with either:
   - an OpenRouter-powered AI answer, or
   - an offline local answer if the API key is unavailable

This creates a seamless experience where the portfolio is both a static presentation and an interactive AI-facing product.

---

## 5. Suggested Next Improvements

If you want to expand this project further, the most useful next steps would be:

- add real contact form backend integration instead of simulated success
- add persistent chat history in a database
- support richer markdown formatting in chatbot replies
- add a proper environment template such as .env.example
- move the knowledge base to a more scalable vector store later

---

## 6. Summary

In short, this project combines:

- a modern personal portfolio website
- interactive animations and UI effects
- an AI-powered chatbot assistant
- a NestJS backend with local RAG-style knowledge retrieval
- deployment configuration for hosting on Railway

This makes the repository much more than a simple landing page; it is a complete portfolio experience with AI functionality built into it.
