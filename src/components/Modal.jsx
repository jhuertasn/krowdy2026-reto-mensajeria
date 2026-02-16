// src/components/WizardModal.jsx
import React, { useState } from 'react';
import { TEMPLATES } from '../datosCandidatos';

export default function WizardModal({ selectedCandidates, onClose }) {
  const [plantilla, setPlantilla] = useState('invitacion');
  const [canales, setCanales] = useState({ sms: false, email: false, whatsapp: false });
  
  const [mensajes, setMensajes] = useState({
    sms: TEMPLATES.invitacion.sms,
    emailSubject: TEMPLATES.invitacion.email.subject,
    emailBody: TEMPLATES.invitacion.email.body,
    whatsapp: TEMPLATES.invitacion.whatsapp
  });

  // Calculamos dinámicamente qué pantallas vamos a mostrar
  const pantallasActivas = ['PLANTILLA', 'CANALES'];
  if (canales.sms) pantallasActivas.push('SMS');
  if (canales.email) pantallasActivas.push('EMAIL');
  if (canales.whatsapp) pantallasActivas.push('WHATSAPP');

  const [pasoActual, setPasoActual] = useState(0);
  const pantallaActual = pantallasActivas[pasoActual];

  // --- MANEJADORES ---

  const manejarCambioPlantilla = (nuevaPlantilla) => {
    setPlantilla(nuevaPlantilla);
    setMensajes({
      sms: TEMPLATES[nuevaPlantilla].sms,
      emailSubject: TEMPLATES[nuevaPlantilla].email.subject,
      emailBody: TEMPLATES[nuevaPlantilla].email.body,
      whatsapp: TEMPLATES[nuevaPlantilla].whatsapp
    });
  };

  const manejarCambioCanal = (canal) => {
    setCanales(prev => ({ ...prev, [canal]: !prev[canal] }));
  };

  const siguientePaso = () => {
    const sinCanales = !canales.sms && !canales.email && !canales.whatsapp;
    // Si estamos en la pantalla de canales y no eligió ninguno, no avanza
    if (pantallaActual === 'CANALES' && sinCanales) {
      return; 
    }
    setPasoActual(prev => prev + 1);
  };

  const enviarCampaña = () => {
    const payload = selectedCandidates.map(candidato => {
      const personalizarTexto = (texto) => 
        texto ? texto.replace(/\[Nombre\]/gi, candidato.name) : '';

      return {
        candidato: candidato.name,
        contacto: { email: candidato.email, telefono: candidato.phone },
        mensajes: {
          sms: canales.sms ? personalizarTexto(mensajes.sms) : null,
          email: canales.email ? {
            asunto: personalizarTexto(mensajes.emailSubject),
            cuerpo: personalizarTexto(mensajes.emailBody)
          } : null,
          whatsapp: canales.whatsapp ? personalizarTexto(mensajes.whatsapp) : null
        }
      };
    });

    const datosFinales = {
      tipoPlantilla: plantilla,
      fechaEnvio: new Date().toISOString(),
      envios: payload
    };

    console.log("🚀 CAMPAÑA ENVIADA EXITOSAMENTE:", datosFinales);
    localStorage.setItem('ultimaCampana', JSON.stringify(datosFinales));
    
    alert("¡Mensajes enviados! Revisa la consola para ver los nombres reemplazados.");
    onClose();
  };

  // --- RENDERIZADO DE LOS PASOS ---

  const renderizarPasoPlantilla = () => (
    <div>
      <h3 className="step-title">Selección de Plantilla</h3>
      <div className="options-group">
        {['invitacion', 'recordatorio', 'personalizado'].map(tpl => (
          <label key={tpl} className="radio-label" style={{ textTransform: 'capitalize' }}>
            <input 
              type="radio" 
              name="plantilla" 
              checked={plantilla === tpl} 
              onChange={() => manejarCambioPlantilla(tpl)}
            />
            {tpl}
          </label>
        ))}
      </div>
    </div>
  );

  const renderizarPasoCanales = () => (
    <div>
      <h3 className="step-title">Selección de Canales</h3>
      <div className="options-group">
        {['sms', 'email', 'whatsapp'].map(canal => (
          <label key={canal} className="checkbox-label" style={{ textTransform: 'capitalize' }}>
            <input 
              type="checkbox" 
              checked={canales[canal]} 
              onChange={() => manejarCambioCanal(canal)} 
            />
            {canal === 'email' ? 'Correo electrónico' : canal}
          </label>
        ))}
      </div>
    </div>
  );

  const renderizarPasoMensaje = () => (
    <div>
      <h3 className="step-title">{pantallaActual}</h3>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
        Nota: La etiqueta [Nombre] se reemplazará automáticamente al enviar.
      </p>
      
      {pantallaActual === 'EMAIL' && (
        <input 
          type="text" 
          className="input-text"
          value={mensajes.emailSubject} 
          onChange={(e) => setMensajes({...mensajes, emailSubject: e.target.value})}
          placeholder="Asunto del correo"
        />
      )}
      
      <textarea 
        className="input-area"
        value={pantallaActual === 'EMAIL' ? mensajes.emailBody : mensajes[pantallaActual.toLowerCase()]} 
        onChange={(e) => {
          const llave = pantallaActual === 'EMAIL' ? 'emailBody' : pantallaActual.toLowerCase();
          setMensajes({...mensajes, [llave]: e.target.value});
        }}
      />
    </div>
  );

  // Variables de control para botones
  const sinCanalesSeleccionados = pantallaActual === 'CANALES' && !canales.sms && !canales.email && !canales.whatsapp;
  const esUltimoPaso = pasoActual === pantallasActivas.length - 1;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* AQUÍ ESTABA EL ERROR: Ahora los nombres coinciden con 'pantallasActivas' */}
        {pantallaActual === 'PLANTILLA' && renderizarPasoPlantilla()}
        {pantallaActual === 'CANALES' && renderizarPasoCanales()}
        {['SMS', 'EMAIL', 'WHATSAPP'].includes(pantallaActual) && renderizarPasoMensaje()}

        {/* Botones de acción */}
        <div className="modal-actions">
          <button 
            className="btn-back"
            onClick={pasoActual === 0 ? onClose : () => setPasoActual(prev => prev - 1)}
          >
            {pasoActual === 0 ? 'Cancelar' : 'Atrás'}
          </button>
          
          {!esUltimoPaso ? (
            <button 
              className="btn-next"
              onClick={siguientePaso} 
              disabled={sinCanalesSeleccionados}
            >
              Siguiente
            </button>
          ) : (
            <button className="btn-send" onClick={enviarCampaña}>
              Enviar {selectedCandidates.length === 1 ? 'Mensaje' : 'Mensajes'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}