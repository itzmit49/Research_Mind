import React from 'react';

export default function Pipeline({ currentStep, loading, results }) {
  const steps = [
    {
      num: '01',
      title: 'Search Agent',
      desc: 'Gathers recent web information',
      stepIndex: 1,
    },
    {
      num: '02',
      title: 'Reader Agent',
      desc: 'Scrapes & extracts deep content',
      stepIndex: 2,
    },
    {
      num: '03',
      title: 'Writer Chain',
      desc: 'Drafts the full research report',
      stepIndex: 3,
    },
    {
      num: '04',
      title: 'Critic Chain',
      desc: 'Reviews & scores the report',
      stepIndex: 4,
    },
  ];

  const getStepState = (stepIndex) => {
    if (results) {
      return 'done';
    }
    if (!loading || currentStep === null) {
      return 'waiting';
    }
    if (stepIndex < currentStep) {
      return 'done';
    }
    if (stepIndex === currentStep) {
      return 'running';
    }
    return 'waiting';
  };

  const getStatusDisplay = (state) => {
    switch (state) {
      case 'running':
        return { text: '● RUNNING', className: 'status-running' };
      case 'done':
        return { text: '✓ DONE', className: 'status-done' };
      case 'waiting':
      default:
        return { text: 'WAITING', className: 'status-waiting' };
    }
  };

  return (
    <div>
      <div className="section-heading">
        <span>Pipeline</span>
      </div>
      <div className="pipeline-list">
        {steps.map((step) => {
          const state = getStepState(step.stepIndex);
          const status = getStatusDisplay(state);
          const cardClass = `step-card ${state === 'running' ? 'active' : ''} ${state === 'done' ? 'done' : ''}`;

          return (
            <div key={step.num} className={cardClass}>
              <div className="step-header">
                <span className="step-num">{step.num}</span>
                <span className="step-title">{step.title}</span>
                <span className={`step-status ${status.className}`}>
                  {status.text}
                </span>
              </div>
              <div className="step-desc">{step.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
