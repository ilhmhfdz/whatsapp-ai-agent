# 🤖 WhatsApp AI Agent with Dynamic Control Panel & RAG

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=Streamlit&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

An End-to-End WhatsApp Virtual Assistant powered by **OpenAI (GPT-4o-mini)**. This project features a decoupled architecture where the AI's persona, system prompts, and knowledge base can be updated in real-time via a **Streamlit Dashboard** without ever restarting the backend server.

Built to handle customer service automation, portfolio showcases, and dynamic data retrieval using **RAG (Retrieval-Augmented Generation) Level 1**.

## ✨ Key Features

* **Zero-Downtime Persona Switching:** Update the AI's core instructions (System Prompt) via a web UI. Changes take effect instantly on the next WhatsApp message.
* **Knowledge Base Injection (RAG Level 1):** Upload PDF documents (like product catalogs, FAQs, or CVs) through the dashboard. The AI will extract the text and use it as the definitive source of truth to answer user queries, preventing AI hallucinations.
* **Short-Term Memory Management:** Maintains conversational context by storing the last 10 messages per user in a fast, in-memory cache (`Map`).
* **Headless Browser Automation:** Utilizes `whatsapp-web.js` and Puppeteer to seamlessly bridge the WhatsApp interface with the Node.js backend.

## 🏗️ System Architecture

The project is split into two main microservices linked by a NoSQL database:

1. **Frontend (Dashboard):** A Python/Streamlit web app for control and document uploads (`PyPDF2`).
2. **Backend (Engine):** A Node.js server handling WhatsApp socket connections, prompt construction, and OpenAI API calls.
3. **Database:** MongoDB Atlas acts as the central state manager, storing the dynamic prompts and extracted PDF text.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python (v3.9+)
* WhatsApp account (for scanning the QR code)
* API Keys: [OpenAI API Key](https://platform.openai.com/) & [MongoDB Atlas URI](https://www.mongodb.com/cloud/atlas)

### 1. Backend Setup (Node.js)
```bash
cd backend
npm install
