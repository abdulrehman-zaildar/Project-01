# ⚡ SmartBijli — AI Electricity Bill Analyzer

> An AI-powered web app that helps Pakistani households analyze their electricity usage, estimate monthly bills, and get personalized money-saving tips using Google Gemini AI.

![Built for AI Hackathon 2026](https://img.shields.io/badge/AI%20Hackathon-2026-blue)
![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Problem Statement

Pakistani households face rising electricity costs. Many families don't know which appliances consume the most power or how to reduce their bills. **SmartBijli** solves this by providing:

- Real-time bill estimation
- Appliance-by-appliance cost breakdown
- AI-powered personalized saving tips
- Efficiency scoring

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Usage Calculator** | Add appliances with wattage, quantity, and daily hours |
| 💰 **Bill Estimator** | Real-time monthly/yearly bill calculation |
| ⚡ **Efficiency Score** | Gamified score showing household efficiency |
| 🤖 **AI Analysis** | Gemini AI provides personalized saving tips |
| 📱 **Responsive** | Works on mobile, tablet, and desktop |
| 🌙 **Dark Theme** | Modern dark UI with smooth animations |
| 💾 **Local Storage** | Saves your data between sessions |

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **JavaScript** (Vanilla) — No frameworks needed
- **Google Gemini AI API** — Intelligent analysis
- **Vercel** — Deployment

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- A free [Gemini API key](https://aistudio.google.com/apikey)

### Run Locally
1. Clone or download this project
2. Open `index.html` in your browser
3. Enter your Gemini API key
4. Start adding appliances!

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project folder
3. Follow the prompts — your app will be live!

## 📸 How It Works

1. **Enter your electricity rate** (PKR/kWh)
2. **Add your home appliances** — select from presets or add custom
3. **View your bill estimate** — daily, monthly, and yearly
4. **Check your efficiency score** — see how efficient your home is
5. **Get AI analysis** — Gemini AI gives you personalized tips to save money

## 🤖 AI Integration

SmartBijli uses the **Google Gemini 2.0 Flash** model to:
- Analyze which appliances consume the most electricity
- Provide top 5 personalized saving tips with estimated savings in PKR
- Suggest quick wins for immediate bill reduction
- Recommend energy-efficient upgrades
- Estimate potential monthly savings
- Calculate environmental impact (CO₂ reduction)

## 📁 Project Structure

```
smart-bijli/
├── index.html       # Main HTML page
├── style.css        # All styles (dark theme, responsive)
├── app.js           # Application logic + AI integration
├── vercel.json      # Vercel deployment config
└── README.md        # This file
```

## 📄 License

MIT License — Free to use, modify, and distribute.

## 👤 Author

Built with ⚡ for AI Hackathon 2026
