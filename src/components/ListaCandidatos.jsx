import React from 'react';

export default function CandidateList({ candidates, selectedIds, onToggleSelect }) {
  return (
    <div className="candidate-list">
      {candidates.map(candidato => (
        <div key={candidato.id} className="candidate-item">
          <input
            type="checkbox"
            checked={selectedIds.includes(candidato.id)}
            onChange={() => onToggleSelect(candidato.id)}
            style={{ cursor: 'pointer' }}
          />
          <label style={{ cursor: 'pointer', flexGrow: 1 }} onClick={() => onToggleSelect(candidato.id)}>
            {candidato.name} - <span style={{ color: '#aaa' }}>{candidato.email}</span>
          </label>
        </div>
      ))}
    </div>
  );
}