# Climate Change Data Visualization Platform

A comprehensive, real-time web platform that visualizes global climate data through interactive maps, dashboards, and AI insights. Built to support SDG 13: Climate Action using **100% free and open-source** tools, APIs, libraries, and datasets.

## 🌍 Features

### Core Capabilities
- **Real-Time Data Integration**: Live updates from free, open APIs
- **Interactive Global Map**: Powered by Leaflet + OpenStreetMap
- **Dynamic Dashboards**: Customizable visualizations with filters
- **Climate Indicators**: Temperature, CO₂, air quality, arctic ice, and more
- **AI/ML Insights**: Trend detection and predictive modeling using TensorFlow.js
- **Data Upload**: Support for CSV/JSON file uploads
- **Export Functionality**: Download reports in CSV, JSON, or PDF format
- **Educational Content**: Learn about each climate metric and its impact
- **Mobile Responsive**: Fully responsive design with WCAG accessibility standards

### Key Climate Indicators Tracked
- 🌡️ Temperature change
- 🏭 CO₂ emissions
- 💨 Air quality index (AQI)
- 🌳 Deforestation rates
- 🌊 Sea level rise
- ⚡ Renewable energy usage
- 🌪️ Extreme weather events
- 🧊 Arctic ice extent

## 🛠️ Tech Stack

All tools and services used are **100% free and open-source**:

### Framework & Languages
- **Next.js 15** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS

### Data Visualization
- **Leaflet** - Interactive maps
- **Chart.js** - Charts and graphs
- **D3.js** - Advanced data visualizations
- **React-Chartjs-2** - React wrapper for Chart.js
- **React-Leaflet** - React components for Leaflet

### AI/ML
- **TensorFlow.js** - Machine learning in the browser

### Data Processing
- **Axios** - HTTP client
- **PapaParse** - CSV parsing
- **date-fns** - Date utilities

### Export Tools
- **jsPDF** - PDF generation
- **html2canvas** - Screenshot capture

## 🌐 Data Sources

All data sources are free, open, and require no API keys:

### 1. Open-Meteo API
- **Endpoint**: `https://api.open-meteo.com/v1`
- **Data**: Weather, historical temperature, climate projections
- **License**: Open data, no API key required
- **Docs**: https://open-meteo.com/

### 2. OpenAQ API
- **Endpoint**: `https://api.openaq.org/v2`
- **Data**: Global air quality measurements
- **License**: Open data, CC BY 4.0
- **Docs**: https://docs.openaq.org/

### 3. Global Warming API
- **Endpoint**: `https://global-warming.org/api`
- **Data**: CO₂ levels, temperature anomalies, arctic ice extent
- **License**: Open data
- **Docs**: https://global-warming.org/

### Other Free APIs (Ready to Integrate)
- **NASA Earthdata**: Climate and earth science data
- **Copernicus**: European climate data
- **Global Forest Watch**: Deforestation data
- **World Bank Climate API**: Climate statistics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed
- Git (optional)

### Installation

1. **Clone or download the repository**
   ```bash
   git clone <your-repo-url>
   cd rfr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
rfr/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (Dashboard)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── charts/           # Chart components (Line, Bar)
│   ├── dashboard/        # Dashboard, filters, upload
│   ├── indicators/       # Climate indicator cards
│   ├── map/              # Interactive map component
│   └── ui/               # UI components (buttons, etc.)
├── lib/                   # Utilities and APIs
│   ├── api/              # API integration layer
│   │   ├── openMeteo.ts  # Open-Meteo API
│   │   ├── openaq.ts     # OpenAQ API
│   │   └── co2.ts        # Global Warming API
│   └── utils/            # Utility functions
│       ├── dataProcessing.ts  # Data processing & ML
│       └── export.ts     # Export functionality
├── types/                 # TypeScript type definitions
│   └── climate.ts        # Climate data types
├── public/               # Static assets
└── README.md             # This file
```

## 📊 Usage Guide

### Viewing Climate Data
1. The dashboard loads with global climate data automatically
2. Click on the map to select a location and view local data
3. Use region filters to focus on specific continents or countries

### Uploading Your Data
1. Click "Upload CSV or JSON" in the Data Upload section
2. Select a file with climate data (CSV or JSON format)
3. The data will be processed and available for visualization

### Exporting Reports
1. Click the "Export Data" button
2. Choose your preferred format: CSV, JSON, or PDF
3. The file will download automatically

### Understanding Indicators
- Scroll to "About Climate Indicators" section
- Each indicator includes a description and its climate impact
- Color-coded cards show current values and trends

## 🔮 AI/ML Features

The platform includes TensorFlow.js-powered features:
- **Trend Detection**: Automatically identifies increasing/decreasing trends
- **Predictive Modeling**: Forecasts future climate indicators
- **Anomaly Detection**: Highlights unusual patterns in data

## ♿ Accessibility

This platform follows WCAG 2.1 AA standards:
- Semantic HTML for screen readers
- Keyboard navigation support
- ARIA labels on interactive elements
- Color contrast ratios meet accessibility guidelines
- Mobile-responsive design

## 🌱 Contributing

Contributions are welcome! This project is built entirely with free and open-source tools to promote transparency and collaboration in climate action.

### Guidelines
- Only use free, open-source libraries and APIs
- No paid or licensed services
- Maintain accessibility standards
- Add documentation for new features

## 📜 License

This project is open-source and available under the MIT License.

## 🙏 Acknowledgments

### Data Providers
- Open-Meteo for weather and climate data
- OpenAQ for air quality measurements
- Global Warming API for CO₂ and temperature data
- OpenStreetMap contributors for map tiles

### Open-Source Libraries
- Next.js team
- Leaflet maintainers
- Chart.js developers
- TensorFlow.js team
- All other open-source contributors

## 📧 Support

For issues, questions, or suggestions:
- Open an issue in the repository
- Check existing documentation
- Review API documentation for data sources

## 🎯 Future Enhancements

- [ ] Additional data sources (NASA, Copernicus)
- [ ] Real-time alerts for extreme weather
- [ ] Community discussion features
- [ ] Multi-language support
- [ ] Advanced ML models
- [ ] Historical data comparison tools
- [ ] Social media sharing integration

---

**Built for SDG 13: Climate Action** 🌍

Empowering policymakers, researchers, and citizens to monitor, understand, and act on climate change through completely free and open-source technology.
