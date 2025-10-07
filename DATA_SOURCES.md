# Climate Data Sources

This document provides detailed information about all free and open-source data APIs used in this platform.

## Currently Integrated APIs

### 1. Open-Meteo
**Website**: https://open-meteo.com/  
**License**: Open Data, CC BY 4.0  
**API Key**: Not required  

**Features**:
- Current weather data
- Historical weather data (1940-present)
- Climate projections (up to 2050)
- 16-day weather forecasts
- No rate limits for non-commercial use

**Endpoints Used**:
```
https://api.open-meteo.com/v1/forecast
https://api.open-meteo.com/v1/archive
https://api.open-meteo.com/v1/climate
```

**Data Available**:
- Temperature (2m, surface)
- Precipitation
- Wind speed and direction
- Humidity
- Cloud cover
- Solar radiation

**Documentation**: https://open-meteo.com/en/docs

---

### 2. OpenAQ
**Website**: https://openaq.org/  
**License**: CC BY 4.0  
**API Key**: Not required  

**Features**:
- Real-time air quality measurements
- Historical air quality data
- 130+ countries covered
- Crowd-sourced and governmental data
- Updated every 10-30 minutes

**Endpoints Used**:
```
https://api.openaq.org/v2/latest
https://api.openaq.org/v2/measurements
```

**Data Available**:
- PM2.5 (fine particulate matter)
- PM10 (coarse particulate matter)
- CO (carbon monoxide)
- NO₂ (nitrogen dioxide)
- O₃ (ozone)
- SO₂ (sulfur dioxide)
- Air Quality Index (AQI)

**Documentation**: https://docs.openaq.org/

---

### 3. Global Warming API
**Website**: https://global-warming.org/  
**License**: Open Data  
**API Key**: Not required  

**Features**:
- Global CO₂ levels (Mauna Loa Observatory)
- Global temperature anomalies
- Arctic sea ice extent
- Methane levels
- NO₂ levels
- Historical data from 1880s

**Endpoints Used**:
```
https://global-warming.org/api/co2-api
https://global-warming.org/api/temperature-api
https://global-warming.org/api/arctic-api
https://global-warming.org/api/methane-api
https://global-warming.org/api/nitrous-oxide-api
```

**Data Available**:
- CO₂ concentration (ppm)
- Temperature anomaly (°C)
- Arctic ice extent (million km²)
- CH₄ levels (ppb)
- N₂O levels (ppb)

**Documentation**: https://global-warming.org/

---

## Ready-to-Integrate Free APIs

These APIs are free, open, and ready to be added to the platform:

### 4. NASA Earthdata
**Website**: https://earthdata.nasa.gov/  
**License**: Open Data, free registration required  
**API Key**: Free API key after registration  

**Features**:
- Satellite imagery
- Climate and weather data
- Earth science data
- Historical climate records
- Global fire data
- Sea level measurements

**Why not integrated yet**: Requires free registration for API key (though registration is free and open to all)

**Potential Data**:
- MODIS satellite imagery
- AIRS atmospheric data
- GRACE water storage
- ICESat ice measurements

---

### 5. Copernicus Climate Data Store
**Website**: https://cds.climate.copernicus.eu/  
**License**: Open Data  
**API Key**: Free API key after registration  

**Features**:
- European climate data
- Reanalysis datasets
- Climate projections
- Historical climate records
- Seasonal forecasts

---

### 6. World Bank Climate API
**Website**: https://datahelpdesk.worldbank.org/knowledgebase/articles/902061  
**License**: CC BY 4.0  
**API Key**: Not required  

**Features**:
- Country-level climate data
- Historical temperature and precipitation
- Climate change projections
- GCM (Global Circulation Model) data

**Example Endpoints**:
```
http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/tas/year/USA
```

---

### 7. Global Forest Watch API
**Website**: https://www.globalforestwatch.org/  
**License**: Open Data  
**API Key**: Free API key  

**Features**:
- Deforestation data
- Forest cover change
- Fire alerts
- Tree cover loss/gain
- Forest carbon emissions

---

### 8. Ocean Color (NASA)
**Website**: https://oceancolor.gsfc.nasa.gov/  
**License**: Open Data  
**API Key**: Not required for some datasets  

**Features**:
- Ocean temperature
- Chlorophyll concentration
- Sea ice extent
- Ocean color imagery

---

## Data Update Frequencies

| Source | Update Frequency | Latency |
|--------|-----------------|---------|
| Open-Meteo | Hourly | ~10 minutes |
| OpenAQ | Every 10-30 minutes | ~10-30 minutes |
| Global Warming API | Daily | ~24 hours |
| NASA Earthdata | Daily to weekly | Varies by product |
| Copernicus | Daily | ~5 days |
| World Bank | Annually | ~1 year |

## Data Attribution

All data visualizations should include proper attribution:

**Open-Meteo**: "Weather data provided by Open-Meteo.com"  
**OpenAQ**: "Air quality data from OpenAQ under CC BY 4.0"  
**Global Warming API**: "Climate data from Global-Warming.org"  

## API Rate Limits

| Source | Rate Limit | Notes |
|--------|-----------|-------|
| Open-Meteo | None for non-commercial | Fair use policy |
| OpenAQ | 10,000 requests/day | No API key needed |
| Global Warming API | None | Fair use policy |

## Data Quality and Reliability

### Open-Meteo
- **Quality**: High (uses multiple weather models)
- **Coverage**: Global
- **Reliability**: 99.9% uptime
- **Validation**: Data from ECMWF, NOAA, DWD

### OpenAQ
- **Quality**: Varies (crowd-sourced + governmental)
- **Coverage**: 130+ countries, urban areas
- **Reliability**: 95%+ uptime
- **Validation**: Some automated QA, varies by source

### Global Warming API
- **Quality**: High (from authoritative sources)
- **Coverage**: Global aggregates
- **Reliability**: 99%+ uptime
- **Sources**: NOAA, NASA, NSIDC

## Error Handling

All API integrations should:
1. Handle network errors gracefully
2. Show user-friendly error messages
3. Provide fallback data when possible
4. Cache data to reduce API calls
5. Implement retry logic with exponential backoff

## Privacy Considerations

All APIs used are:
- ✅ No user data collection
- ✅ No tracking or analytics
- ✅ No personal information required
- ✅ No cookies or fingerprinting
- ✅ GDPR compliant

## Future Data Sources

Potential additions being evaluated:
- [ ] NOAA Climate Data Online
- [ ] European Environment Agency
- [ ] Carbon Brief API
- [ ] Our World in Data
- [ ] UNEP Climate Data

## Contributing New Data Sources

To add a new data source, ensure it meets these criteria:

✅ **Must Have**:
- Completely free (no paid tiers)
- No API key OR free API key available to all
- Open data license (CC BY, public domain, etc.)
- Reliable uptime (95%+)
- Well-documented API
- Relevant to climate action

❌ **Cannot Have**:
- Paid subscription required
- Restrictive rate limits
- Proprietary data
- Requires approval process
- Collects user data

---

**Last Updated**: 2024  
**Maintained By**: Community Contributors  
**License**: CC BY 4.0
