import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import type { Holding, CapitalGains } from '../utils/mockApi';

interface TaxHarvestContextType {
  holdings: Holding[];
  capitalGains: CapitalGains | null;
  selectedHoldings: string[]; // List of coinName
  loading: boolean;
  error: string | null;
  taxRate: number;
  setTaxRate: (rate: number) => void;
  toggleHolding: (coinName: string) => void;
  toggleAllHoldings: (checked: boolean) => void;
  fetchData: (simulateError?: boolean) => Promise<void>;
  
  // Calculated values
  calculations: {
    pre: {
      stcg: { profits: number; losses: number; net: number };
      ltcg: { profits: number; losses: number; net: number };
      realised: number;
    };
    post: {
      stcg: { profits: number; losses: number; net: number };
      ltcg: { profits: number; losses: number; net: number };
      realised: number;
    };
    taxSavings: number;
    hasSavings: boolean;
  };
}

const TaxHarvestContext = createContext<TaxHarvestContextType | undefined>(undefined);

// Extra mock assets with significant losses to demonstrate harvesting
const ADDITIONAL_LOSS_HOLDINGS: Holding[] = [
  {
    "coin": "BTC",
    "coinName": "Bitcoin (Simulated Harvest)",
    "logo": "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    "currentPrice": 5850000.00,
    "totalHolding": 0.085,
    "averageBuyPrice": 6250000.00,
    "stcg": {
      "balance": 0.085,
      "gain": -34000.00
    },
    "ltcg": {
      "balance": 0,
      "gain": 0
    }
  },
  {
    "coin": "ADA",
    "coinName": "Cardano (Simulated Harvest)",
    "logo": "https://coin-images.coingecko.com/coins/images/975/large/cardano.png?1696502090",
    "currentPrice": 42.50,
    "totalHolding": 650,
    "averageBuyPrice": 68.20,
    "stcg": {
      "balance": 0,
      "gain": 0
    },
    "ltcg": {
      "balance": 650,
      "gain": -16705.00
    }
  }
];

export const TaxHarvestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null);
  const [selectedHoldings, setSelectedHoldings] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [taxRate, setTaxRate] = useState<number>(30); // Default 30% tax rate

  const fetchData = async (simulateError = false) => {
    setLoading(true);
    setError(null);
    try {
      const [holdingsRes, gainsRes] = await Promise.all([
        mockApi.fetchHoldings(simulateError),
        mockApi.fetchCapitalGains(simulateError)
      ]);
      
      // Mix in the prompt holdings with our high-value simulated loss harvesting holdings
      const mergedHoldings = [...holdingsRes, ...ADDITIONAL_LOSS_HOLDINGS];
      
      setHoldings(mergedHoldings);
      setCapitalGains(gainsRes.capitalGains);
      setSelectedHoldings([]); // Reset selections on refresh
    } catch (err: any) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleHolding = (coinName: string) => {
    setSelectedHoldings(prev => 
      prev.includes(coinName) 
        ? prev.filter(name => name !== coinName) 
        : [...prev, coinName]
    );
  };

  const toggleAllHoldings = (checked: boolean) => {
    if (checked) {
      setSelectedHoldings(holdings.map(h => h.coinName));
    } else {
      setSelectedHoldings([]);
    }
  };

  // Base capital gains when no holdings are harvested
  const preStcgProfits = capitalGains?.stcg.profits ?? 0;
  const preStcgLosses = capitalGains?.stcg.losses ?? 0;
  const preLtcgProfits = capitalGains?.ltcg.profits ?? 0;
  const preLtcgLosses = capitalGains?.ltcg.losses ?? 0;

  const preStcgNet = preStcgProfits - preStcgLosses;
  const preLtcgNet = preLtcgProfits - preLtcgLosses;
  const preRealised = preStcgNet + preLtcgNet;

  // Calculate updated values based on selected assets for harvesting
  let postStcgProfits = preStcgProfits;
  let postStcgLosses = preStcgLosses;
  let postLtcgProfits = preLtcgProfits;
  let postLtcgLosses = preLtcgLosses;

  holdings.forEach(holding => {
    if (selectedHoldings.includes(holding.coinName)) {
      // Short term gains
      if (holding.stcg.gain > 0) {
        postStcgProfits += holding.stcg.gain;
      } else if (holding.stcg.gain < 0) {
        postStcgLosses += Math.abs(holding.stcg.gain);
      }

      // Long term gains
      if (holding.ltcg.gain > 0) {
        postLtcgProfits += holding.ltcg.gain;
      } else if (holding.ltcg.gain < 0) {
        postLtcgLosses += Math.abs(holding.ltcg.gain);
      }
    }
  });

  const postStcgNet = postStcgProfits - postStcgLosses;
  const postLtcgNet = postLtcgProfits - postLtcgLosses;
  const postRealised = postStcgNet + postLtcgNet;

  // Realised gain drops -> we save taxes
  const hasSavings = preRealised > postRealised;
  const taxSavings = hasSavings ? (preRealised - postRealised) * (taxRate / 100) : 0;

  const calculations = {
    pre: {
      stcg: { profits: preStcgProfits, losses: preStcgLosses, net: preStcgNet },
      ltcg: { profits: preLtcgProfits, losses: preLtcgLosses, net: preLtcgNet },
      realised: preRealised
    },
    post: {
      stcg: { profits: postStcgProfits, losses: postStcgLosses, net: postStcgNet },
      ltcg: { profits: postLtcgProfits, losses: postLtcgLosses, net: postLtcgNet },
      realised: postRealised
    },
    taxSavings,
    hasSavings
  };

  return (
    <TaxHarvestContext.Provider value={{
      holdings,
      capitalGains,
      selectedHoldings,
      loading,
      error,
      taxRate,
      setTaxRate,
      toggleHolding,
      toggleAllHoldings,
      fetchData,
      calculations
    }}>
      {children}
    </TaxHarvestContext.Provider>
  );
};

export const useTaxHarvest = () => {
  const context = useContext(TaxHarvestContext);
  if (context === undefined) {
    throw new Error('useTaxHarvest must be used within a TaxHarvestProvider');
  }
  return context;
};
