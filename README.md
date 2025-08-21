# Creeator – AI‑powered Content Creation Platform

## Overview

Creeator is a full‑stack web application inspired by Brainvine.ai.  It provides a unified dashboard for generating text, images, voice, and SEO‑optimized content, and supports agent‑based workflow building.  The project is split into two major parts:

* **client/** – a React front‑end using Vite, Tailwind CSS, and Radix UI.  It contains pages for authentication and a dashboard with multiple panels (**Text**, **Image**, **Voice**, **SEO**, **Feeds**, and **Workflow Builder**).  React Flow powers a drag‑and‑drop interface for assembling agent workflows, and the Feeds panel lets you generate multiple product descriptions at once.
* **server/** – a Node.js back‑end built on Express with JWT‑based authentication.  It exposes RESTful routes for text generation, image manipulation, voice synthesis, SEO analysis, **bulk product description generation (feeds)**, and workflow execution.  A lightweight SQLite database stores users and saved workflows.  The server is structured with separate route and controller modules.

## Getting Started

### Prerequisites

* Node.js ≥ 18.x
* A Replit or local environment with internet access
* API keys for OpenAI and Anthropic (add to the `.env` file)

### Running in Replit

1. Fork this repository into your Replit account.
2. In the root of the workspace, create a `.env` file using the provided `.env.example` as a template.  Add your own values for `JWT_SECRET`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and any other secrets.
3. Open a Replit shell and install dependencies for both the server and client:

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

4. Run the development servers concurrently.  In Replit you can configure two separate run commands or run them in a single shell with `concurrently` (already listed in the server package.json):

   ```bash
   # From project root
   npm run dev
   ```

   This will start the Express back‑end on **http://localhost:3001** and the Vite front‑end on **http://localhost:5173**.  The Vite dev server proxies API requests beginning with `/api` to the Express server.

### Testing Endpoints

Use a tool such as Postman or your browser to hit the following endpoints after starting the server.  All authenticated routes require a Bearer token obtained from `/api/auth/login`.

* `POST /api/auth/signup` – Register a new user with `email` and `password`.
* `POST /api/auth/login` – Log in and receive a JWT token.
* `POST /api/text/generate` – Generate text with GPT‑4o.  Body: `{ prompt: "your text", tone: "style" }`.
* `POST /api/image/generate` – Generate an image from text with options for style.  Body: `{ prompt: "image description" }`.
* `POST /api/image/edit` – Endpoint for background removal/upscaling (placeholder implementation).
* `POST /api/voice/synthesize` – Convert text to speech in a selected Dutch voice.
* `POST /api/feeds/generate` – Generate persuasive product descriptions for multiple items (the “Verzio Feeds” feature).
* `POST /api/seo/analyze` – Analyze and optimize SEO meta data and readability.
* `POST /api/workflows/run` – Execute a saved workflow chain.
* `POST /api/workflows/save` – Save a workflow definition to the database.

### Deployment

For deployment on Replit or any other platform:

1. Set environment variables for `NODE_ENV=production`, `JWT_SECRET`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and database connection strings (for SQLite this is not required).
2. Build the client for production:

   ```bash
   cd client
   npm run build
   ```

   The build artifacts will be generated in `client/dist`.

3. Configure the server to serve static files from the `client/dist` directory when `NODE_ENV` is production.

4. Start the server with `npm start` which will run `node index.js`.  The front‑end files will be served and API endpoints will be available under `/api`.

---

This scaffold provides a starting point.  You can expand on the workflow builder, integrate neuromarketing templates, and connect to external AI services using the provided hooks.