// src/data.js

export const initialCandidates = [
    { id: 1, name: 'Roland Deschain', email: 'roland125@gmail.com', phone: '999888777' },
    { id: 2, name: 'Jake Chambers', email: 'jakechambers@gmail.com', phone: '999111222' },
    { id: 3, name: 'Kento Nanami', email: 'kentonanami@gmail.com', phone: '999333444' },
];

export const TEMPLATES = {
    invitacion: {
        sms: 'Hola [Nombre], te invitamos a participar en el proceso de [nombre del proceso/actividad] que se llevará a cabo el [fecha] a las [hora]. Por favor, confirma tu asistencia respondiendo a este mensaje. ¡Te esperamos!',
        email: {
            subject: 'Invitación al proceso de [nombre del proceso]',
            body: 'Estimado/a [Nombre],\nEsperamos que te encuentres bien. A través de este medio, queremos invitarte a participar en el proceso de [nombre del proceso], que se llevará a cabo el [fecha] a las [hora]. El lugar del encuentro será [dirección/sala virtual].\nTu participación es muy importante para nosotros. Agradeceríamos que confirmes tu asistencia respondiendo a este correo.\nQuedamos atentos a cualquier consulta que puedas tener.\nCordialmente,\n[Nombre del remitente]\n[Puesto]\n[Empresa/Organización]'
        },
        whatsapp: 'Hola [Nombre], te invitamos a participar en el proceso de [nombre del proceso/actividad] que se llevará a cabo el [fecha] a las [hora]. Por favor, confirma tu asistencia respondiendo a este mensaje. ¡Te esperamos!'
    },
    recordatorio: {
        sms: 'Hola [Nombre], te recordamos que el proceso de [nombre del proceso/actividad] al que confirmaste tu asistencia se realizará el [fecha] a las [hora]. ¡Te esperamos puntual!',
        email: {
            subject: 'Recordatorio del proceso de [nombre del proceso]',
            body: 'Estimado/a [Nombre],\nQueremos recordarte que el proceso de [nombre del proceso], al que amablemente confirmaste tu asistencia, se realizará el [fecha] a las [hora].\nEl evento tendrá lugar en [dirección/sala virtual]. Si tienes alguna duda o necesitas asistencia previa, no dudes en contactarnos.\nTe esperamos puntual.\nSaludos cordiales,\n[Nombre del remitente]\n[Puesto]\n[Empresa/Organización]'
        },
        whatsapp: 'Hola [Nombre], te recordamos que el proceso de [nombre del proceso/actividad] al que confirmaste tu asistencia se realizará el [fecha] a las [hora]. ¡Te esperamos puntual!'
    },
    personalizado: {
        sms: '',
        email: { subject: '', body: '' },
        whatsapp: ''
    }
};