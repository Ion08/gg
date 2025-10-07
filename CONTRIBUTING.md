# Contributing to Climate Change Data Visualization Platform

Thank you for your interest in contributing to this open-source climate action project! This platform is built entirely with free and open-source tools to promote transparency and accessibility in climate data visualization.

## Core Principles

1. **100% Free & Open-Source**: Only use libraries, APIs, and services that are completely free and open-source
2. **No Paid Services**: No premium tiers, API keys, or subscription-based services
3. **Accessibility First**: Follow WCAG 2.1 AA standards
4. **Educational Focus**: Make climate data understandable for everyone
5. **Data Transparency**: All data sources must be publicly accessible and properly attributed

## How to Contribute

### Reporting Bugs
- Use GitHub Issues to report bugs
- Include browser version, OS, and steps to reproduce
- Add screenshots if applicable

### Suggesting Features
- Check existing issues first
- Explain the use case and benefit
- Ensure the feature aligns with free/open-source principles

### Adding Data Sources
When adding new data sources:
1. **Verify it's free**: No API keys, no rate limits (or very generous ones)
2. **Check licensing**: Must be open data (CC BY, public domain, etc.)
3. **Document it**: Add to README with endpoint, license, and documentation link
4. **Add types**: Create TypeScript interfaces for the data
5. **Error handling**: Handle API failures gracefully

Example data sources that fit our criteria:
- ✅ Open-Meteo (no API key, open data)
- ✅ OpenAQ (open data, CC BY 4.0)
- ✅ Global Warming API (free, no auth)
- ✅ NASA Earthdata (free registration, open data)
- ❌ OpenWeatherMap (requires API key, has limits)
- ❌ Google Maps API (paid tiers)

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns
- Use Tailwind CSS for styling
- Add comments only when necessary
- Keep components small and focused

### Testing
Before submitting a PR:
1. Run `npm run build` to ensure it builds
2. Test on mobile devices
3. Check accessibility with screen readers
4. Verify all data sources work
5. Test with slow network conditions

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`feature/add-nasa-api`)
3. Make your changes
4. Test thoroughly
5. Update documentation if needed
6. Submit PR with clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/climate-platform.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Code of Conduct

### Our Standards
- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize the mission: climate action through open data
- Help others learn and grow

### Not Acceptable
- Harassment or discrimination
- Trolling or inflammatory comments
- Promoting paid services or products
- Sharing credentials or API keys

## Data Privacy
- Never commit API keys or credentials
- Don't collect user data without explicit consent
- Follow GDPR and privacy best practices
- All analytics must be optional and privacy-focused

## License
By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Questions?
Open an issue with the "question" label, and the community will help!

---

**Remember**: Every contribution helps fight climate change by making data more accessible. Thank you for being part of this mission! 🌍
