# ResearchMind – Multi-Agent AI Research System

ResearchMind is a multi-agent AI research system that automatically investigates any topic, gathers web information, scrapes deep webpage content, writes a structured research report, and evaluates it with a dedicated critic agent.

---

## Architecture

The project is structured into a lightweight, decoupled architecture:
- **Frontend**: React + Vite (Fast, responsive, dark-themed UI)
- **Backend**: FastAPI (REST API exposing the LangChain pipeline)
- **AI Logic**: LangChain agents and tools (`agents.py`, `tools.py`)

```
React (Vite + JavaScript + CSS)
          |
          | POST /api/research { "topic": "..." }
          v
FastAPI Backend (main.py)
          |
          v
LangChain Multi-Agent Pipeline
          |
          ├── 1. Search Agent  (build_search_agent)  ──> Tavily Search
          ├── 2. Reader Agent  (build_reader_agent)  ──> Web Scraper (BeautifulSoup)
          ├── 3. Writer Chain  (writer_chain)        ──> Markdown Report Generation
          └── 4. Critic Chain  (critic_chain)        ──> Quality Review & Score
          |
          v
JSON Response { search, reader, writer, critic }
          |
          v
React UI Displays Formatted Results & Download Markdown
```

---

## Project Structure

```
ResearchMind/
│
├── Backend/
│   ├── main.py          # FastAPI application & /api/research endpoint
│   ├── agents.py        # LangChain agent definitions & prompt templates
│   ├── tools.py         # Tavily search & BeautifulSoup scraper tools
│   └── requirements.txt # Python dependencies (FastAPI, LangChain, Tavily, etc.)
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResearchInput.jsx  # Topic input, chips, submit button
│   │   │   ├── Pipeline.jsx       # 4 pipeline step status cards
│   │   │   └── Results.jsx        # Markdown report, critic card, raw outputs
│   │   ├── App.jsx                # Main React component & state management
│   │   ├── index.css              # Dark theme styling with orange/green accents
│   │   └── main.jsx               # React DOM entry point
│   ├── index.html                 # HTML template with Google Fonts
│   ├── package.json               # NPM dependencies & scripts
│   └── vite.config.js             # Vite configuration
│
└── README.md
```

---

## Pipeline Steps

1. **01 Search Agent** (`build_search_agent()`):
   Searches the web via Tavily API to find relevant articles, titles, snippets, and URLs for the topic.
2. **02 Reader Agent** (`build_reader_agent()`):
   Analyzes the search results, picks the most relevant URL, and scrapes clean textual content (stripping scripts, styles, navigation, footers).
3. **03 Writer Chain** (`writer_chain`):
   Combines the raw search results and scraped content into a comprehensive Markdown research report containing Introduction, Key Findings, Conclusion, and Sources.
4. **04 Critic Chain** (`critic_chain`):
   Critiques the generated report strictly and provides a Score (X/10), Strengths, Areas to Improve, and a One-line verdict.

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- API keys for OpenRouter and Tavily in `.env`

Create a `.env` file in the root directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
TAVILY_API_KEY=your_tavily_api_key
```

---

### Running the Backend (FastAPI)

1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies (if needed):
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend API will run at `http://127.0.0.1:8000`.
   Interactive API docs are available at `http://127.0.0.1:8000/docs`.

---

### Running the Frontend (React + Vite)

1. Open a second terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## API Specification

### `POST /api/research`

**Request Body:**
```json
{
  "topic": "Quantum computing breakthroughs in 2025"
}
```

**Response Body:**
```json
{
  "search": "Title: ...\nURL: ...\nSnippet: ...",
  "reader": "Clean extracted text from top URL...",
  "writer": "# Research Report\n\n## Introduction...",
  "critic": "Score: 9/10\n\nStrengths:\n- ...\n\nAreas to Improve:\n- ...\n\nOne line verdict:\n..."
}
```
