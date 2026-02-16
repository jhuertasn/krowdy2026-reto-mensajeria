// src/App.jsx
import { useState, useEffect } from 'react'
import { initialCandidates, TEMPLATES } from './datosCandidatos'
import './App.css'

function App() {
  const [candidates] = useState(initialCandidates)
  const [selectedIds, setSelectedIds] = useState([])
  
  // --- ESTADOS DEL MODAL Y EL FORMULARIO ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // 1. Plantilla seleccionada (por defecto 'invitacion')
  const [template, setTemplate] = useState('invitacion')
  
  // 2. Canales seleccionados (por defecto los dos primeros)
  const [channels, setChannels] = useState({ sms: true, email: true, whatsapp: false })
  
  // 3. Los textos editables (se pre-llenan con la plantilla pero se pueden cambiar)
  const [messages, setMessages] = useState({
    sms: TEMPLATES.invitacion.sms,
    emailSubject: TEMPLATES.invitacion.email.subject,
    emailBody: TEMPLATES.invitacion.email.body,
    whatsapp: TEMPLATES.invitacion.whatsapp
  })

  // --- LÓGICA DE NAVEGACIÓN (El QA que pide el profesor) ---
  // Calculamos qué pantallas deben mostrarse según los canales seleccionados.
  // El orden fijo se respeta aquí: siempre SMS primero, luego EMAIL, luego WHATSAPP.
  const activeScreens = ['TEMPLATE', 'CHANNELS']
  if (channels.sms) activeScreens.push('SMS')
  if (channels.email) activeScreens.push('EMAIL')
  if (channels.whatsapp) activeScreens.push('WHATSAPP')

  // Índice de la pantalla actual en la que estamos
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)
  const currentScreen = activeScreens[currentScreenIndex]

  // --- FUNCIONES MANEJADORAS ---

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    )
  }

  const handleOpenModal = () => {
    if (selectedIds.length === 0) {
      alert("Por favor selecciona al menos un candidato.")
      return
    }
    // Al abrir el modal, siempre empezamos en el paso 0
    setCurrentScreenIndex(0)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate)
    // Autocompletamos los textos con la nueva plantilla elegida
    setMessages({
      sms: TEMPLATES[newTemplate].sms,
      emailSubject: TEMPLATES[newTemplate].email.subject,
      emailBody: TEMPLATES[newTemplate].email.body,
      whatsapp: TEMPLATES[newTemplate].whatsapp
    })
  }

  const handleChannelToggle = (channel) => {
    setChannels(prev => ({ ...prev, [channel]: !prev[channel] }))
  }

  const handleNext = () => {
    if (currentScreen === 'CHANNELS' && !channels.sms && !channels.email && !channels.whatsapp) {
      alert("Debes seleccionar al menos un canal para continuar.")
      return
    }
    setCurrentScreenIndex(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentScreenIndex(prev => prev - 1)
  }

  const handleSend = () => {
    // Recopilamos la data de los candidatos seleccionados
    const selectedCandidatesData = candidates.filter(c => selectedIds.includes(c.id))
    
    const payload = {
      candidates: selectedCandidatesData,
      templateUsed: template,
      channelsUsed: channels,
      finalMessages: messages,
      timestamp: new Date().toISOString()
    }

    // Cumpliendo el requisito: consolog y localstorage
    console.log("🚀 ENVIANDO CAMPAÑA:", payload)
    localStorage.setItem('lastCampaign', JSON.stringify(payload))
    
    alert("¡Mensajes enviados! Revisa la consola y el LocalStorage.")
    setIsModalOpen(false)
  }

  // --- RENDERIZADO CONDICIONAL DE LAS PANTALLAS DEL MODAL ---
  const renderModalContent = () => {
    switch (currentScreen) {
      case 'TEMPLATE':
        return (
          <div>
            <h3 style={{ marginTop: 0 }}>Selección de Plantilla</h3>
            <div style={{ display: 'flex', flexDirection: 'content', gap: '10px', marginTop: '20px' }}>
              {['invitacion', 'recordatorio', 'personalizado'].map(tpl => (
                <label key={tpl} style={{ display: 'block', marginBottom: '10px', textTransform: 'capitalize' }}>
                  <input 
                    type="radio" 
                    name="template" 
                    checked={template === tpl}
                    onChange={() => handleTemplateChange(tpl)}
                    style={{ marginRight: '10px' }}
                  />
                  {tpl}
                </label>
              ))}
            </div>
          </div>
        )

      case 'CHANNELS':
        return (
          <div>
            <h3 style={{ marginTop: 0 }}>Selección de Canales</h3>
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <input type="checkbox" checked={channels.sms} onChange={() => handleChannelToggle('sms')} style={{ marginRight: '10px' }} />
                SMS
              </label>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <input type="checkbox" checked={channels.email} onChange={() => handleChannelToggle('email')} style={{ marginRight: '10px' }} />
                Correo electrónico
              </label>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <input type="checkbox" checked={channels.whatsapp} onChange={() => handleChannelToggle('whatsapp')} style={{ marginRight: '10px' }} />
                Whatsapp
              </label>
            </div>
          </div>
        )

      case 'SMS':
        return (
          <div>
            <h3 style={{ marginTop: 0 }}>SMS</h3>
            <label style={{ display: 'block', marginBottom: '5px' }}>Mensaje</label>
            <textarea 
              value={messages.sms} 
              onChange={(e) => setMessages({...messages, sms: e.target.value})}
              style={{ width: '100%', height: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="Escribe el mensaje de SMS..."
            />
          </div>
        )

      case 'EMAIL':
        return (
          <div>
            <h3 style={{ marginTop: 0 }}>Correo electrónico</h3>
            <label style={{ display: 'block', marginBottom: '5px' }}>Asunto</label>
            <input 
              type="text" 
              value={messages.emailSubject} 
              onChange={(e) => setMessages({...messages, emailSubject: e.target.value})}
              style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="Escribe el asunto..."
            />
            <label style={{ display: 'block', marginBottom: '5px' }}>Mensaje</label>
            <textarea 
              value={messages.emailBody} 
              onChange={(e) => setMessages({...messages, emailBody: e.target.value})}
              style={{ width: '100%', height: '150px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="Escribe el correo..."
            />
          </div>
        )

      case 'WHATSAPP':
        return (
          <div>
            <h3 style={{ marginTop: 0 }}>Whatsapp</h3>
            <label style={{ display: 'block', marginBottom: '5px' }}>Mensaje</label>
            <textarea 
              value={messages.whatsapp} 
              onChange={(e) => setMessages({...messages, whatsapp: e.target.value})}
              style={{ width: '100%', height: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="Escribe el mensaje de Whatsapp..."
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2 style={{ textAlign: 'center' }}>Lista de Candidatos</h2>
      
      <div style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '1rem', border: '1px solid #555', padding: '1.5rem', borderRadius: '8px' }}>
        {candidates.map(candidate => (
          <div key={candidate.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <input 
              type="checkbox" 
              checked={selectedIds.includes(candidate.id)}
              onChange={() => handleCheckboxChange(candidate.id)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label style={{ cursor: 'pointer' }} onClick={() => handleCheckboxChange(candidate.id)}>
              {candidate.name} - <span style={{ color: '#aaa' }}>{candidate.email}</span>
            </label>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleOpenModal}
          style={{ padding: '10px 24px', backgroundColor: '#333', color: 'white', border: '1px solid #666', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          Enviar Mensaje
        </button>
      </div>

      {/* --- MODAL WIZARD --- */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', color: '#000', padding: '24px',
            borderRadius: '8px', width: '400px', maxWidth: '90%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            
            {/* Contenido dinámico del paso actual */}
            {renderModalContent()}

            {/* Controles de navegación (Atrás, Siguiente, Enviar) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button 
                onClick={currentScreenIndex === 0 ? handleCloseModal : handleBack}
                style={{ padding: '8px 16px', backgroundColor: '#e0e0e0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', color: '#333' }}
              >
                {currentScreenIndex === 0 ? 'Cancelar' : 'Atrás'}
              </button>
              
              {currentScreenIndex < activeScreens.length - 1 ? (
                <button 
                  onClick={handleNext}
                  style={{ padding: '8px 16px', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Siguiente
                </button>
              ) : (
                <button 
                  onClick={handleSend}
                  style={{ padding: '8px 16px', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Enviar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App