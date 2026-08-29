import React from 'react';

export default function ResearchInput({ topic, setTopic, onSubmit, loading }) {
  const examples = [
    'LLM agents 2025',
    'CRISPR gene editing',
    'Fusion energy progress',
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      onSubmit();
    }
  };

  return (
    <div className="input-card">
      <label htmlFor="topic-input" className="input-label">
        Research Topic
      </label>
      <input
        id="topic-input"
        type="text"
        className="input-field"
        placeholder="e.g. Quantum computing breakthroughs in 2025"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button
        id="run-pipeline-btn"
        className="btn-primary"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <span>⚡ Running Pipeline…</span>
          </>
        ) : (
          <>
            <span>⚡ Run Research Pipeline</span>
          </>
        )}
      </button>

      <div className="chips-container">
        <span className="chips-label">TRY →</span>
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            className="chip-btn"
            onClick={() => !loading && setTopic(ex)}
            disabled={loading}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
