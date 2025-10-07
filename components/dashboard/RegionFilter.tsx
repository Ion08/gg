'use client';

import { useState } from 'react';
import { RegionFilter as RegionFilterType } from '@/types/climate';

interface RegionFilterProps {
  onFilterChange: (filter: RegionFilterType) => void;
}

const continents = [
  'All',
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
];

const countries = [
  'All',
  'United States',
  'China',
  'India',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'Brazil',
  'Australia',
  'Canada',
];

export default function RegionFilter({ onFilterChange }: RegionFilterProps) {
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const handleContinentChange = (continent: string) => {
    setSelectedContinent(continent);
    onFilterChange({
      continent: continent === 'All' ? undefined : continent,
      country: selectedCountry === 'All' ? undefined : selectedCountry,
    });
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    onFilterChange({
      continent: selectedContinent === 'All' ? undefined : selectedContinent,
      country: country === 'All' ? undefined : country,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Filter by Region</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="continent-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Continent
          </label>
          <select
            id="continent-select"
            value={selectedContinent}
            onChange={(e) => handleContinentChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select continent"
          >
            {continents.map((continent) => (
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="country-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Country
          </label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select country"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
