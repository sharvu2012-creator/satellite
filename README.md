# Satellite Watch — Local Problem Solving with Free Satellite Data

An educational platform for Siksha-Hack 2026 (Government of Punjab) demonstrating how free satellite data can solve local agricultural and environmental problems in Punjab's villages.

## What it does

1. **Explore the Problem** — interactive map of a Punjab village showing agricultural stress zones
2. **See Satellite Data** — real NDVI / NDWI indices visualized on the map
3. **Get AI Diagnosis** — Gemini explains what the satellite sees in plain language
4. **Compare Solutions** — before/after scenarios showing the impact of interventions

## Tech Stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript (ES6+)
- **Map:** Leaflet.js 1.9.x
- **Charts:** Chart.js 4.x
- **AI:** Google Gemini 1.5 Flash
- **Hosting:** Vercel (serverless)

## Quick Start

### Prerequisites

- Node.js 18+
- A Google Gemini API key (free tier: https://aistudio.google.com)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/satellite-watch.git
cd satellite-watch

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your Gemini API key

# Start development server
npm start
```

The app runs at `http://localhost:3000`.

## Project Structure

```
satellite-watch/
├── server.js                 # Express server
├── public/
│   ├── index.html            # Single-page app
│   ├── css/
│   │   └── style.css         # All styles
│   ├── js/
│   │   ├── app.js            # Main application logic
│   │   ├── map.js            # Leaflet map setup
│   │   └── charts.js         # Chart.js visualizations
│   ├── data/
│   │   └── results.json      # Sample analysis results
│   └── images/               # Static assets
├── api/
│   └── explain.js            # Gemini proxy endpoint
├── .env.example              # Environment template
└── vercel.json               # Vercel deployment config
```

## API

### POST /api/explain

Proxies requests to Google Gemini API (keeps the API key server-side only).

**Request:**
```json
{
  "prompt": "Explain this NDVI reading..."
}
```

**Response:**
```json
{
  "reply": "The NDVI value of 0.3 indicates..."
}
```

## License

MIT
