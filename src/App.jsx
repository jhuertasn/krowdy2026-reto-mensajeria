// src/App.jsx
import { useState } from 'react';
import { initialCandidates } from './datosCandidatos';
import CandidateList from './components/ListaCandidatos';
import WizardModal from './components/Modal';
import './App.css';

function App() {
  const [candidates] = useState(initialCandidates);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleOpenModal = () => {
    if (selectedIds.length === 0) {
      alert("Por favor selecciona al menos un candidato.");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2 style={{ textAlign: 'center' }}>Lista de Candidatos</h2>
      
      <CandidateList 
        candidates={candidates} 
        selectedIds={selectedIds} 
        onToggleSelect={handleToggleSelect} 
      />

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleOpenModal}
          style={{ padding: '10px 24px', backgroundColor: '#333', color: 'white', border: '1px solid #666', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          Preparar Mensaje
        </button>
      </div>

      {isModalOpen && (
        <WizardModal 
          selectedCandidates={candidates.filter(c => selectedIds.includes(c.id))} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;