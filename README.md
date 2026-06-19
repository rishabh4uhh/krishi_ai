# Krishi-AI

Krishi-AI is a full-stack agricultural assistant that helps users identify crop issues, receive weather-informed guidance, and interact with an AI-powered farming chatbot.

## Project Overview

This project combines a frontend web interface with a backend API server. The frontend handles the user experience, while the backend securely manages AI requests to Gemini.

## Features

- Crop image analysis for disease and issue detection
- Weather-based advisory for selected regions
- Multilingual support for English, Hindi, and Punjabi
- Voice-based output and chat interaction
- Backend API endpoints for diagnosis, chatbot responses, and advisories

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js
- dotenv
- CORS

### AI Service

- Google Gemini API

## Project Structure

- `index.html` — frontend layout
- `style.css` — frontend styling
- `app.js` — frontend logic and UI interaction
- `server.js` — backend API server
- `package.json` — project scripts and dependencies
- `.env.example` — environment variable template

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file using `.env.example` and add your Gemini API key.

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Run the project

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

## API Endpoints

- `GET /api/health` — checks backend status
- `POST /api/diagnose` — analyzes uploaded crop images
- `POST /api/chat` — handles chatbot responses
- `POST /api/advisory` — generates weather advisory text

## Notes

- The browser no longer directly calls the Gemini API; all AI requests are routed through the backend.
- This setup is suitable for learning, demonstration, and further extension into a real production application.

## License

This project is intended for educational and demonstration purposes.
