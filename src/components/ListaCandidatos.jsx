import React from 'react';

export default function CandidateList({ candidates, selectedIds, onToggleSelect }) {
    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '1rem', border: '1px solid #555', padding: '1.5rem', borderRadius: '8px' }}>
            {candidates.map(candidate => (
                <div key={candidate.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(candidate.id)}
                        onChange={() => onToggleSelect(candidate.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <label style={{ cursor: 'pointer' }} onClick={() => onToggleSelect(candidate.id)}>
                        {candidate.name} - <span style={{ color: '#aaa' }}>{candidate.email}</span>
                    </label>
                </div>
            ))}
        </div>
    );
}