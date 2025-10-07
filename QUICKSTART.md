# Quick Start Guide

Get the Climate Change Data Visualization Platform up and running in 5 minutes!

## Prerequisites

- **Node.js 18+** and npm installed
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for loading climate data APIs)

## Installation

### Step 1: Clone or Download

```bash
# If using Git
git clone <repository-url>
cd climate-visualization-platform

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all the free and open-source packages:
- Next.js, React, TypeScript
- Leaflet (maps)
- Chart.js (charts)
- TensorFlow.js (AI/ML)
- And more...

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## First Time Using the Platform?

### 1. Explore the Dashboard
When you first load the platform, you'll see:
- **Global climate indicators** at the top (Temperature, CO₂, Air Quality, Arctic Ice)
- **Interactive map** showing your current region
- **Charts** displaying global CO₂ levels, temperature anomalies, and arctic ice extent
- **Educational content** explaining each climate metric

### 2. Interact with the Map
- Click anywhere on the map to select a location
- The dashboard will update with local climate data for that area
- Regional temperature and air quality data will load automatically

### 3. Use Regional Filters
- Select a continent or country from the dropdown filters
- The map will focus on that region
- Data will be filtered to show regional trends

### 4. Upload Your Own Data
- Scroll to the "Upload Your Climate Data" section
- Click "Upload CSV or JSON"
- Select a file with climate data
- The platform will parse and visualize your data

**Example CSV format:**
```csv
date,temperature,co2
2024-01-01,15.2,420
2024-01-02,14.8,421
```

### 5. Export Reports
- Click the "📥 Export Data" button in the top right
- Choose your format:
  - **CSV**: Raw data for analysis in Excel/Google Sheets
  - **JSON**: Structured data for developers
  - **PDF**: Visual report with charts and graphs

### 6. Share Infographics
- Click "📤 Share Infographic"
- On mobile, use native share options
- On desktop, the image will download automatically
- Share on social media to raise climate awareness!

## Understanding the Data

### Key Indicators Explained

**🌡️ Temperature**
- Shows current local temperature
- Global temperature anomaly vs pre-industrial levels
- Trend: increasing globally (+1.1°C since 1880)

**💨 Air Quality Index (AQI)**
- 0-50: Good (green)
- 51-100: Moderate (yellow)
- 101-150: Unhealthy for sensitive groups (orange)
- 151-200: Unhealthy (red)
- 201-300: Very unhealthy (purple)
- 301+: Hazardous (maroon)

**🏭 CO₂ Levels**
- Measured in parts per million (ppm)
- Pre-industrial: ~280 ppm
- Current: 420+ ppm
- Safe level: <350 ppm

**🧊 Arctic Ice Extent**
- Measured in million square kilometers
- Shows sea ice coverage in Arctic
- Declining ~13% per decade

## Pro Tips

### Performance
- The platform caches data to reduce API calls
- If data seems stale, refresh the page
- Map loads dynamically for better performance

### Best Practices
- Use Chrome or Firefox for best compatibility
- Enable location services for local data
- Use the latest browser version

### Troubleshooting

**Map not loading?**
- Check your internet connection
- Disable browser extensions that block scripts
- Try a different browser

**No air quality data showing?**
- Some remote areas lack monitoring stations
- Try a major city or urban area
- OpenAQ has 130+ countries but not full global coverage

**Charts not displaying?**
- Wait a few seconds for data to load
- Check browser console for errors
- Ensure JavaScript is enabled

**Export not working?**
- Check popup blocker settings
- Try a different browser
- Ensure downloads are allowed

## Next Steps

### Learn More
- Read [DATA_SOURCES.md](./DATA_SOURCES.md) to understand where data comes from
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) to add features
- Review [README.md](./README.md) for full documentation

### Deploy Your Own
```bash
# Build for production
npm run build

# Run production server
npm start
```

### Deploy to Vercel (Free)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy! (it's free for personal projects)

### Customize
All components are in `/components` directory:
- Modify colors in Tailwind CSS classes
- Add new charts in `/components/charts`
- Integrate new APIs in `/lib/api`

## Common Use Cases

### For Students
- Explore global climate trends
- Create presentations with exported charts
- Upload local weather data for science projects

### For Researchers
- Download data in CSV for analysis
- Compare multiple regions
- Track long-term climate trends

### For Educators
- Demonstrate climate change in real-time
- Show students how to interpret climate data
- Create educational materials with infographics

### For Activists
- Monitor local air quality
- Share climate data on social media
- Create awareness with visual reports

## Data Privacy

This platform:
- ✅ Does NOT collect your personal data
- ✅ Does NOT use cookies for tracking
- ✅ Does NOT require registration or login
- ✅ Does NOT share data with third parties
- ✅ Runs entirely in your browser

All climate data comes from public, open-source APIs.

## Support

### Questions?
- Check the [README.md](./README.md)
- Read [DATA_SOURCES.md](./DATA_SOURCES.md)
- Open an issue on GitHub

### Found a Bug?
1. Check if it's already reported
2. Create a new issue with:
   - Browser and OS version
   - Steps to reproduce
   - Screenshots if applicable

### Want to Contribute?
See [CONTRIBUTING.md](./CONTRIBUTING.md)!

---

**Ready to fight climate change with data?** 🌍  
Start exploring at [http://localhost:3000](http://localhost:3000)!
