// src/App.jsx
import { useState } from 'react'
import { initialCandidates } from './datosCandidatos'
import './App.css' // Usaremos el css básico de vite

function App() {
  const [candidates] = useState(initialCandidates)
  const [selectedIds, setSelectedIds] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // manejo de checkboxes
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) 
        ? prev.filter(candidateId => candidateId !== id) // Lo quita si ya estaba
        : [...prev, id] // Lo agrega si no estaba
    )
  }

  const handleOpenModal = () => {
    if (selectedIds.length === 0) {
      alert("Por favor selecciona al menos un candidato.")
      return
    }
    setIsModalOpen(true)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Lista de Candidatos</h2>
      
      <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        {candidates.map(candidate => (
          <div key={candidate.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
              type="checkbox" 
              checked={selectedIds.includes(candidate.id)}
              onChange={() => handleCheckboxChange(candidate.id)}
            />
            <label>{candidate.name} - {candidate.email}</label>
          </div>
        ))}
      </div>

      <button 
        onClick={handleOpenModal}
        style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Enviar Mensaje
      </button>

      {/* Aquí irá el Modal más adelante */}
      {isModalOpen && (
        <div style={{ marginTop: '20px', padding: '20px', border: '2px dashed red' }}>
          Aquí construiremos el modal del asistente...
          <br/>
          <button onClick={() => setIsModalOpen(false)}>Cerrar temporalmente</button>
        </div>
      )}
    </div>
  )
}

export default App