// src/components/WizardModal.jsx
import React, { useState } from 'react';
import { TEMPLATES } from '../datosCandidatos';

export default function WizardModal({ selectedCandidates, onClose }) {
  // 1. Estados inicializados limpios (canales en false por defecto)
  const [template, setTemplate] = useState('invitacion');
  const [channels, setChannels] = useState({ sms: false, email: false, whatsapp: false });
  const [messages, setMessages] = useState({
    sms: TEMPLATES.invitacion.sms,
    emailSubject: TEMPLATES.invitacion.email.subject,
    emailBody: TEMPLATES.invitacion.email.body,
    whatsapp: TEMPLATES.invitacion.whatsapp
  });

  // 2. Lógica de pantallas fijas (El QA del profesor)
  const activeScreens = ['TEMPLATE', 'CHANNELS'];
  if (channels.sms) activeScreens.push('SMS');
  if (channels.email) activeScreens.push('EMAIL');
  if (channels.whatsapp) activeScreens.push('WHATSAPP');

  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const currentScreen = activeScreens[currentScreenIndex];

  // 3. Manejadores
  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
    setMessages({
      sms: TEMPLATES[newTemplate].sms,
      emailSubject: TEMPLATES[newTemplate].email.subject,
      emailBody: TEMPLATES[newTemplate].email.body,
      whatsapp: TEMPLATES[newTemplate].whatsapp
    });
  };

  const handleChannelToggle = (channel) => {
    setChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  const handleNext = () => {
    if (currentScreen === 'CHANNELS' && !channels.sms && !channels.email && !channels.whatsapp) {
      alert("Debes seleccionar al menos un canal para continuar.");
      return;
    }
    setCurrentScreenIndex(prev => prev + 1);
  };

  // --- LA LÓGICA SENIOR: PERSONALIZAR MENSAJES ---
  const handleSend = () => {
    // Recorremos cada candidato y creamos su mensaje personalizado
    const payload = selectedCandidates.map(candidate => {
      
      // Función ayudante para reemplazar [Nombre] de forma segura
      const personalize = (text) => text ? text.replace(/\[Nombre\]/gi, candidate.name) : '';

      return {
        candidato: candidate.name,
        contacto: { email: candidate.email, telefono: candidate.phone },
        mensajes: {
          sms: channels.sms ? personalize(messages.sms) : null,
          email: channels.email ? {
            asunto: personalize(messages.emailSubject),
            cuerpo: personalize(messages.emailBody)
          } : null,
          whatsapp: channels.whatsapp ? personalize(messages.whatsapp) : null
        }
      };
    });

    const finalData = {
      tipoPlantilla: template,
      fechaEnvio: new Date().toISOString(),
      envios: payload
    };

    console.log("🚀 CAMPAÑA ENVIADA EXITOSAMENTE:", finalData);
    localStorage.setItem('lastCampaign', JSON.stringify(finalData));
    
    alert("¡Mensajes enviados! Revisa la consola para ver los nombres reemplazados.");
    onClose();
  };

  // 4. Sub-renders para mantener el código limpio
  const renderTemplateStep = () => (
    <div>
      <h3 style={{ marginTop: 0 }}>Selección de Plantilla</h3>
      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
        {['invitacion', 'recordatorio', 'personalizado'].map(tpl => (
          <label key={tpl} style={{ textTransform: 'capitalize', cursor: 'pointer' }}>
            <input 
              type="radio" name="template" 
              checked={template === tpl} onChange={() => handleTemplateChange(tpl)}
              style={{ marginRight: '8px' }}
            />
            {tpl}
          </label>
        ))}
      </div>
    </div>
  );

  const renderChannelsStep = () => (
    <div>
      <h3 style={{ marginTop: 0 }}>Selección de Canales</h3>
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {['sms', 'email', 'whatsapp'].map(ch => (
          <label key={ch} style={{ textTransform: 'capitalize', cursor: 'pointer' }}>
            <input 
              type="checkbox" checked={channels[ch]} onChange={() => handleChannelToggle(ch)} 
              style={{ marginRight: '10px' }} 
            />
            {ch === 'email' ? 'Correo electrónico' : ch}
          </label>
        ))}
      </div>
    </div>
  );

  const renderMessageStep = () => (
    <div>
      <h3 style={{ marginTop: 0 }}>{currentScreen}</h3>
      <p style={{ fontSize: '12px', color: '#666' }}>Nota: La etiqueta [Nombre] se reemplazará automáticamente al enviar.</p>
      
      {currentScreen === 'EMAIL' && (
        <input 
          type="text" value={messages.emailSubject} 
          onChange={(e) => setMessages({...messages, emailSubject: e.target.value})}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Asunto del correo"
        />
      )}
      
      <textarea 
        value={currentScreen === 'EMAIL' ? messages.emailBody : messages[currentScreen.toLowerCase()]} 
        onChange={(e) => {
          const key = currentScreen === 'EMAIL' ? 'emailBody' : currentScreen.toLowerCase();
          setMessages({...messages, [key]: e.target.value});
        }}
        style={{ width: '100%', height: '150px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
    </div>
  );

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', color: '#000', padding: '24px',
        borderRadius: '8px', width: '450px', maxWidth: '90%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}>
        
        {/* Renderizado condicional limpio */}
        {currentScreen === 'TEMPLATE' && renderTemplateStep()}
        {currentScreen === 'CHANNELS' && renderChannelsStep()}
        {['SMS', 'EMAIL', 'WHATSAPP'].includes(currentScreen) && renderMessageStep()}

{/* Botones */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
          <button 
            onClick={currentScreenIndex === 0 ? onClose : () => setCurrentScreenIndex(prev => prev - 1)}
            style={{ padding: '8px 16px', backgroundColor: '#e0e0e0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', color: '#333' }}
          >
            {currentScreenIndex === 0 ? 'Cancelar' : 'Atrás'}
          </button>
          
          {/* Lógica Senior: Si hay más pantallas, O si estamos en la pantalla de canales y no hay ninguno seleccionado */}
          {currentScreenIndex < activeScreens.length - 1 || (currentScreen === 'CHANNELS' && !channels.sms && !channels.email && !channels.whatsapp) ? (
            <button 
              onClick={handleNext} 
              disabled={currentScreen === 'CHANNELS' && !channels.sms && !channels.email && !channels.whatsapp}
              style={{ 
                padding: '8px 16px', 
                // Se pone gris si está en canales y no seleccionó nada
                backgroundColor: (currentScreen === 'CHANNELS' && !channels.sms && !channels.email && !channels.whatsapp) ? '#666' : '#222', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: (currentScreen === 'CHANNELS' && !channels.sms && !channels.email && !channels.whatsapp) ? 'not-allowed' : 'pointer' 
              }}
            >
              Siguiente
            </button>
          ) : (
            <button 
              onClick={handleSend} 
              style={{ padding: '8px 16px', backgroundColor: '#2b9348', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {/* Dinámico: Singular o Plural */}
              Enviar {selectedCandidates.length === 1 ? 'Mensaje' : 'Mensajes'}
            </button>
          )}
        </div>


      </div>
    </div>
  );
}