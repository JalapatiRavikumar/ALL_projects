import React from 'react';
import { useTaxHarvest } from '../context/TaxHarvestContext';
import { TrendingDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { taxRate, setTaxRate } = useTaxHarvest();
  const taxRates = [15, 20, 30];

  return (
    <header className="app-header">
      <div className="brand-section">
        {/* Modern Vector SVG Logo for KoinX */}
        <svg 
          className="brand-logo" 
          width="40" 
          height="40" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="200" height="200" rx="44" fill="#060913" />
          {/* Circular glowing grid representing blockchain & portfolio tracking */}
          <circle cx="100" cy="100" r="70" stroke="#1e293b" strokeWidth="6" />
          <circle cx="100" cy="100" r="45" stroke="#334155" strokeWidth="4" />
          {/* Main K logo path combined with trend line */}
          <path 
            d="M75 55V145" 
            stroke="#3b82f6" 
            strokeWidth="16" 
            strokeLinecap="round" 
          />
          <path 
            d="M75 100L125 55" 
            stroke="#10b981" 
            strokeWidth="16" 
            strokeLinecap="round" 
          />
          <path 
            d="M95 100L135 145" 
            stroke="#3b82f6" 
            strokeWidth="16" 
            strokeLinecap="round" 
          />
          {/* Glowing node point */}
          <circle cx="125" cy="55" r="10" fill="#34d399" />
          <circle cx="135" cy="145" r="10" fill="#60a5fa" />
        </svg>
        <h1 className="brand-title">KoinX</h1>
        <span className="brand-tag">Tax Loss Harvesting</span>
      </div>

      <div className="settings-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingDown size={16} className="text-secondary" style={{ color: '#60a5fa' }} />
          <span className="tax-selector-label">Tax Rate Bracket:</span>
        </div>
        <div className="tax-selector-container">
          {taxRates.map((rate) => (
            <button
              key={rate}
              onClick={() => setTaxRate(rate)}
              className={`tax-btn ${taxRate === rate ? 'active' : ''}`}
              title={`Calculate tax savings assuming a ${rate}% tax bracket`}
            >
              {rate}%
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
