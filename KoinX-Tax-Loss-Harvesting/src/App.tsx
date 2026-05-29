import { TaxHarvestProvider } from './context/TaxHarvestContext';
import { Header } from './components/Header';
import { CapitalGainsDashboard } from './components/CapitalGainsDashboard';
import { HoldingsTable } from './components/HoldingsTable';

function App() {
  return (
    <TaxHarvestProvider>
      <div className="app-container">
        <Header />
        
        <main>
          {/* Main comparison dashboard showing pre- and post-harvesting details */}
          <CapitalGainsDashboard />
          
          {/* Table displaying all assets and handles row selections */}
          <HoldingsTable />
        </main>

        <footer className="app-footer">
          <p>
            &copy; {new Date().getFullYear()} KoinX Tax Optimization Engine. Designed for the KoinX Frontend Intern Challenge.
          </p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.725rem' }}>
            Disclaimer: This dashboard simulates Tax-Loss Harvesting based on standard capital gains offsetting rules. Cryptocurrency tax treatments vary by jurisdiction (such as Section 115BBH in India or IRS Virtual Currency Guidelines in the U.S.). Please consult a certified public accountant or tax professional before making financial filings.
          </p>
        </footer>
      </div>
    </TaxHarvestProvider>
  );
}

export default App;
