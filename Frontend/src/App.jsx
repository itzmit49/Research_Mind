import React, { useState, useRef } from 'react';
import ResearchInput from './components/ResearchInput';
import Pipeline from './components/Pipeline';
import Results from './components/Results';

export default function App() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);

  const stepTimerRef = useRef(null);

  const handleSubmit = async () => {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError('Please enter a research topic first.');
      return;
    }

    setError(null);
    setResults(null);
    setLoading(true);
    setCurrentStep(1);

    // Visual step progression while waiting for the single API response
    let stepCounter = 1;
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    stepTimerRef.current = setInterval(() => {
      stepCounter += 1;
      if (stepCounter <= 4) {
        setCurrentStep(stepCounter);
      }
    }, 4500);

    try {
      const response = await fetch('https://research-mind-7cj4.onrender.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: trimmedTopic }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      setCurrentStep(5); // All 4 steps done
      setResults(data);
    } catch (err) {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      setCurrentStep(null);
      setError(err.message || 'Failed to connect to the backend server. Ensure FastAPI is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* ── Hero Header ── */}
      <header className="hero">
        <div className="hero-eyebrow">Multi-Agent AI System</div>
        <h1>
          Research<span>Mind</span>
        </h1>
        <p className="hero-sub">
          Four specialized AI agents collaborate — searching, scraping, writing,
          and critiquing — to deliver a polished research report on any topic.
        </p>
      </header>

      <div className="divider"></div>

      {/* ── Main 2-Column Section ── */}
      <main className="main-grid">
        <div>
          <ResearchInput
            topic={topic}
            setTopic={(val) => {
              setTopic(val);
              if (error) setError(null);
            }}
            onSubmit={handleSubmit}
            loading={loading}
          />
          {error && (
            <div className="error-banner">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div>
          <Pipeline
            currentStep={currentStep}
            loading={loading}
            results={results}
          />
        </div>
      </main>

      {/* ── Results Section ── */}
      <Results results={results} />

      {/* ── Footer ── */}
      <footer className="footer">
        ResearchMind · Powered by LangChain multi-agent pipeline · React + FastAPI
      </footer>
    </div>
  );
}
