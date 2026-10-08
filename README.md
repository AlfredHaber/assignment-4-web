# Weather Dashboard — Assignment 4

A simple weather dashboard made with HTML, CSS, and JavaScript.

## How to run

1. Download or unzip this folder.
2. Open the folder in VS Code.
3. Run `index.html` using the **Live Server** extension (or run `python -m http.server 5500` in this folder, then visit `http://localhost:5500`).
4. Type a city and press **Search**. An internet connection is required.

The app also loads Paris weather automatically when it opens.

## Weather API / API key setup

This project uses **Open-Meteo**, a public weather API:
- City lookup: https://open-meteo.com/en/docs/geocoding-api
- Current weather: https://open-meteo.com/en/docs

**No API key or signup is required for Open-Meteo's non-commercial API.** Therefore there is no API key to obtain, paste, or expose in this project. The app works without a `.env` file. If using a different provider that requires a key, obtain it from that provider and keep it in a local untracked configuration or secure server-side environment; never commit a real key to GitHub. Note that client-side `.env` values are not secret once shipped to browsers.

## Features

- Search current weather by city name using live API requests
- Temperature, weather description/icon, feels-like, humidity, wind speed
- Loading indicator while fetching
- Friendly errors for invalid cities, HTTP errors, rate limits, and network problems
- Responsive design for desktop and mobile
- JavaScript Fetch API with `async/await` and `try/catch`

## Files

- `index.html` — page structure
- `style.css` — responsive styling
- `script.js` — API requests and dynamic data display
- `screenshot.png` — weather dashboard screenshot (representative API response captured for presentation/testing)
- `.gitignore` — prevents accidentally committing environment files
