# 📩 Sistema de Mensajería para Candidatos (Reto Krowdy)

Este proyecto es una aplicación web desarrollada con **React** y **Vite** que permite a los reclutadores seleccionar candidatos y enviarles mensajes personalizados a través de múltiples canales (SMS, Correo Electrónico y WhatsApp) mediante un flujo de pasos (*Wizard*).

## 🚀 Características Principales

* **Selección Múltiple:** Lista de candidatos interactiva con *checkboxes*.
* **Flujo Paso a Paso (Wizard):** Interfaz modal intuitiva que guía al usuario a través del proceso de envío.
* **Plantillas Predefinidas:** Incluye 3 plantillas (Invitación, Recordatorio y Personalizado) que autocompletan los mensajes, permitiendo la edición manual posterior.
* **Canales Dinámicos con Orden Fijo:** El usuario puede elegir qué canales usar. El sistema respetará siempre el orden de configuración exigido: **1º SMS, 2º Correo Electrónico, 3º WhatsApp**.
* **Reemplazo Dinámico de Variables:** El sistema detecta la etiqueta `[Nombre]` en los campos de texto y la reemplaza automáticamente por el nombre real de cada candidato al momento de enviar.

## 🧪 Aseguramiento de Calidad (QA) y UX

Se implementaron las siguientes lógicas para garantizar la mejor experiencia de usuario (UX), cumpliendo con los requerimientos del reto:

1. **Preservación de Estado (Atrás/Adelante):** Si el usuario edita un texto en un paso avanzado y decide regresar (clic en "Atrás"), **la información no se pierde**. El estado de los mensajes se conserva de forma global durante todo el ciclo de vida del modal.
2. **Validaciones de Seguridad:** * El botón "Preparar Mensaje" no se activa si no hay candidatos seleccionados.
   * El botón "Siguiente" se deshabilita si el usuario está en la vista de selección de canales y desmarca todas las opciones.
3. **Persistencia de Datos Final:** Al finalizar el flujo, se recopila toda la data (candidato, plantilla, canales, textos dinámicos formateados y timestamp) y se exporta a la **Consola (`console.log`)** y se guarda en el **LocalStorage**.

## 🛠️ Tecnologías Utilizadas

* **React 18** (Manejo de estados con `useState` y renderizado condicional).
* **Vite** (Empaquetador y entorno de desarrollo rápido).
* **CSS3** (Diseño *Dark Mode* personalizado, sin librerías externas para demostrar dominio de estilos).

## 📂 Estructura del Proyecto

El proyecto sigue el principio de Responsabilidad Única (SOLID) dividiendo la lógica en componentes:

```text
src/
 ├── components/
 │    ├── CandidateList.jsx  # Renderiza la lista y maneja la selección
 │    └── WizardModal.jsx    # Lógica central del stepper, validaciones y recolección de data
 ├── datosCandidatos.js      # Mock de base de datos (Candidatos y Plantillas)
 ├── App.jsx                 # Componente contenedor principal
 └── App.css                 # Estilos globales y del modal

 ```
## ⚙️ Instalación y Uso

Sigue estos pasos para correr el proyecto en tu entorno local:

1.- Clonar el repositorio:
```bash
git clone https://github.com/jhuertasn/krowdy2026-reto-mensajeria.git

```
2.- Ingresar al directorio del proyecto:
```bash
cd krowdy2026-reto-mensajeria
```
3.- Instalar las dependencias:
```bash
npm install
```
4.- Iniciar el servidor de desarrollo:
```bash
npm run dev
```
5.- Abrir el navegador y acceder a `http://localhost:5173`
