# Krishi-AI

Krishi-AI is a web-based agricultural assistant designed to help users identify crop-related issues, receive weather-informed recommendations, and ask farming questions in multiple languages.

## Project Overview

The application combines several features that support smart agriculture:

- crop image analysis using AI
- regional weather advisory
- multilingual chat support
- voice-based interaction for reading responses aloud

## Purpose

The goal of this project is to provide a simple and practical digital tool for farmers, students, and agricultural learners. It helps users understand crop conditions more quickly and supports better decision-making based on visual inspection and local weather information.

## Key Features

### Crop Health Scanner

Users can upload an image of a crop or leaf for AI-based analysis. The app provides information about the likely issue, severity level, and suggested remedies.

### Weather Advisory

The app includes weather details for selected regions such as Bhopal, Indore, and Jabalpur. These insights help users understand how local conditions may affect farming activities.

### Agricultural Chat Assistant

The built-in assistant can respond to questions related to soil preparation, crop cycles, disease prevention, fertilizer use, and other farming practices.

### Voice Support

The application supports text-to-speech output and voice input, making it easier for users to interact with the system.

## Technology Stack

- HTML
- CSS
- JavaScript
- Gemini API
- Browser local storage for saving the API key

## Project Structure

- `index.html` — main structure of the web application
- `style.css` — styling and layout design
- `app.js` — application logic, API calls, translations, and interactivity

## How to Run

### Option 1: Open the app directly

Open `index.html` in a browser to run the project.

### Option 2: Use a local server

Run the following command:

```bash
python -m http.server
```

Then open:

```text
http://localhost:8000
```

## API Configuration

To use the AI features, you need a valid Google Gemini API key.

1. Open the application.
2. Click the Settings button.
3. Enter your API key.
4. Save the settings.

> The API key is stored locally in the browser.

## Notes

- This project is intended for educational and demonstration purposes.
- The quality of AI responses depends on the uploaded image, internet connection, and API availability.
- Microphone access is required if voice input is used.

## License

This project is provided for learning and demonstration purposes.
# krishi_ai
