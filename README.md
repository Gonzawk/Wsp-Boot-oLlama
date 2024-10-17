# 📲 Integración Node.js con WhatsApp Business API y OllamaAI 🧠

![Node.js](https://img.shields.io/badge/Node.js-v14.17.0-green?logo=node.js&logoColor=white)
![WhatsApp API](https://img.shields.io/badge/WhatsApp-Business%20API-brightgreen?logo=whatsapp)
![Python](https://img.shields.io/badge/Python-3.9-blue?logo=python&logoColor=white)
![OllamaAI](https://img.shields.io/badge/OllamaAI-Integración-yellow?logo=ai)
![License](https://img.shields.io/github/license/tu-usuario/tu-repositorio?style=flat-square)

Este proyecto se basa en la integración de la API de **WhatsApp Business** a través de webhooks, donde los mensajes recibidos son procesados por un servicio en Python que utiliza **OllamaAI** para generar respuestas inteligentes. El sistema responde automáticamente a los usuarios de WhatsApp de forma eficiente y en tiempo real.

## ✨ **Características principales**

- 🚀 **Mensajes en tiempo real**: Recibe notificaciones y mensajes de WhatsApp mediante webhooks.
- 🧠 **Respuestas inteligentes**: OllamaAI maneja el contexto del mensaje para dar respuestas coherentes.
- 🔗 **Integración con Python**: La lógica que conecta con OllamaAI está escrita en Python.
- ⚡ **Arquitectura escalable**: Desarrollado con Node.js y Express.js para manejar múltiples solicitudes asíncronas.

---

## ⚙️ **Tecnologías utilizadas**

- **Node.js** - Servidor para manejar las solicitudes y la API de WhatsApp
- **WhatsApp Business API** - Para recibir mensajes a través de webhooks
- **Python** - Maneja la integración con OllamaAI y procesa las respuestas
- **OllamaAI** - Motor de inteligencia artificial que analiza los mensajes
- **Express.js** - Framework para la construcción de servicios RESTful
- **Axios** - Para realizar peticiones HTTP a servicios externos

---

## 🚀 **Comenzando**

Sigue los siguientes pasos para configurar el proyecto en tu máquina local:

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/Gonzawk/Wsp-Boot-oLlama.git
cd Wsp-Boot-oLlama
```
### 2️⃣ Instalar Dependencias 
Para Node.js:
```bash
npm install
```
Para Python:
```bash
pip install -r requirements.txt
```
### 3️⃣ Configuración de variables de entorno
Crea un archivo .env en la raíz del proyecto y añade las siguientes variables:
```plaintext
WHATSAPP_API_URL=<La url de la herramienta de facebook. Ej: (https://graph.facebook.com/v20.0)>
GRAPH_API_TOKEN=<Tu Token de autorizacion de la API de WhatsApp Bussines.>
OLLAMAAI_API_KEY=<Tu clave de API de OllamaAI. EN CASO DE QUE oLLAMA NO ESTE INSTALADO DE FORMA LOCAL. COMENTAR Y DESCOMENTAR EL CODIGO CORRESPONDIENTE EN EL SERVICIO.>
WEBHOOK_VERIFY_TOKEN=<Tu Token de Verificacion del Webhook. El que tu creas en la HERRAMIENTA WEBHOOK.>
```
### 4️⃣ Ejecutar el servidor
```bash
node index.js
```
---

## 🛠️ **Funcionamiento**
- **Recepcion de Mensajes:** - La API de WhatsApp Business envía los mensajes entrantes al webhook del servidor.
- **Procesamiento con Python:** - El servidor en Node.js reenvía los mensajes a un servicio en Python.
- **Respuesta de OllamaAI:** - El servicio en Python llama a OllamaAI, que analiza el mensaje y genera una respuesta.
- **Respuesta al usuario:** - La respuesta generada es enviada de vuelta al usuario a través de la API de WhatsApp.

---
