import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Ensure current directory is in sys.path so agents and tools can be imported cleanly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents import build_reader_agent, build_search_agent, writer_chain, critic_chain

app = FastAPI(title="ResearchMind API", description="FastAPI Backend for ResearchMind Multi-Agent Pipeline")

# Enable CORS so the React frontend (running locally on Vite) can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    topic: str


@app.get("/")
def root():
    return {"message": "ResearchMind API is running. Use POST /api/research to run the pipeline."}


@app.post("/api/research")
def run_research(req: ResearchRequest):
    topic_val = req.topic.strip()
    if not topic_val:
        raise HTTPException(status_code=400, detail="Research topic cannot be empty.")

    try:
        # Step 1: Search Agent (Finds recent and reliable info)
        search_agent = build_search_agent()
        search_response = search_agent.invoke({
            "messages": [("user", f"Find recent, reliable and detailed information about: {topic_val}")]
        })
        search_result = search_response["messages"][-1].content

        # Step 2: Reader Agent (Picks top URL and scrapes deeper content)
        reader_agent = build_reader_agent()
        reader_response = reader_agent.invoke({
            "messages": [("user",
                f"Based on the following search results about '{topic_val}', "
                f"pick the most relevant URL and scrape it for deeper content.\n\n"
                f"Search Results:\n{search_result[:800]}"
            )]
        })
        reader_result = reader_response["messages"][-1].content

        # Step 3: Writer Chain (Combines search + scraped content into a research report)
        research_combined = (
            f"SEARCH RESULTS:\n{search_result}\n\n"
            f"DETAILED SCRAPED CONTENT:\n{reader_result}"
        )
        writer_result = writer_chain.invoke({
            "topic": topic_val,
            "research": research_combined
        })

        # Step 4: Critic Chain (Reviews and evaluates the generated report)
        critic_result = critic_chain.invoke({
            "report": writer_result
        })

        return {
            "search": search_result,
            "reader": reader_result,
            "writer": writer_result,
            "critic": critic_result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline execution failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
