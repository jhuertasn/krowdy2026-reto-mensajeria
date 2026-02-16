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
    // Aplicamos la clase "container" que centra todo el layout de nuestro app.css
    <div className="container">
      <h2 className="title">Lista de Candidatos</h2>
      
      <CandidateList 
        candidates={candidates} 
        selectedIds={selectedIds} 
        onToggleSelect={handleToggleSelect} 
      />

      <div style={{ textAlign: 'center' }}>
        {/* Aplicamos la clase "btn-primary" para el diseño del botón de nuestro app.css */}
        <button 
          className="btn-primary"
          onClick={handleOpenModal}
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