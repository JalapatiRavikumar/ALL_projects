import React from 'react';
import { useTaxHarvest } from '../context/TaxHarvestContext';
import { ShieldCheck, Sparkles, Landmark } from 'lucide-react';

export const CapitalGainsDashboard: React.FC = () => {
  const { calculations, taxRate } = useTaxHarvest();
  const { pre, post, taxSavings, hasSavings } = calculations;

  // Format number to INR currency layout
  const formatINR = (value: number) => {
    // If value is close to zero, format as zero to avoid scientific notation
    if (Math.abs(value) < 0.0001) {
      value = 0;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  const getNetClass = (net: number) => {
    if (net > 0) return 'positive';
    if (net < 0) return 'negative';
    return '';
  };

  return (
    <section className="dashboard-grid">
      {/* Pre-Harvesting Card (Left - Dark Background) */}
      <div className="gains-card pre-harvesting">
        <div className="card-title">
          <Landmark size={20} style={{ color: '#94a3b8' }} />
          <span>Pre-Harvesting</span>
          <span className="card-title-badge">Original</span>
        </div>

        <div className="metrics-group">
          {/* Short-Term Capital Gains (STCG) */}
          <div className="metric-row">
            <div className="metric-label-container">
              <span className="metric-label">Short-Term (STCG)</span>
              <span className="metric-sublabel">Assets held ≤ 1 year</span>
            </div>
            <div className="metric-values">
              <div className="metric-val profit">
                <span className="metric-val-num">{formatINR(pre.stcg.profits)}</span>
                <span className="metric-val-type">Profits</span>
              </div>
              <div className="metric-val loss">
                <span className="metric-val-num">{formatINR(pre.stcg.losses)}</span>
                <span className="metric-val-type">Losses</span>
              </div>
            </div>
          </div>

          <div className="net-gains-container">
            <div className="net-gains-row">
              <span className="metric-label">Net Short-Term Gains</span>
              <span className={`net-gains-value ${getNetClass(pre.stcg.net)}`}>
                {formatINR(pre.stcg.net)}
              </span>
            </div>
          </div>

          {/* Long-Term Capital Gains (LTCG) */}
          <div className="metric-row" style={{ marginTop: '0.5rem' }}>
            <div className="metric-label-container">
              <span className="metric-label">Long-Term (LTCG)</span>
              <span className="metric-sublabel">Assets held &gt; 1 year</span>
            </div>
            <div className="metric-values">
              <div className="metric-val profit">
                <span className="metric-val-num">{formatINR(pre.ltcg.profits)}</span>
                <span className="metric-val-type">Profits</span>
              </div>
              <div className="metric-val loss">
                <span className="metric-val-num">{formatINR(pre.ltcg.losses)}</span>
                <span className="metric-val-type">Losses</span>
              </div>
            </div>
          </div>

          <div className="net-gains-container">
            <div className="net-gains-row">
              <span className="metric-label">Net Long-Term Gains</span>
              <span className={`net-gains-value ${getNetClass(pre.ltcg.net)}`}>
                {formatINR(pre.ltcg.net)}
              </span>
            </div>
          </div>
        </div>

        {/* Realised Capital Gains Footer */}
        <div className="realised-gains-container">
          <span className="realised-label">Realised Capital Gains</span>
          <span className={`realised-value ${getNetClass(pre.realised)}`}>
            {formatINR(pre.realised)}
          </span>
        </div>
      </div>

      {/* After Harvesting Card (Right - Blue Background) */}
      <div className="gains-card after-harvesting">
        <div className="card-title">
          <Sparkles size={20} style={{ color: '#60a5fa' }} />
          <span>After Harvesting</span>
          <span className="card-title-badge" style={{ backgroundColor: '#2563eb' }}>Optimised</span>
        </div>

        <div className="metrics-group">
          {/* Short-Term Capital Gains (STCG) */}
          <div className="metric-row">
            <div className="metric-label-container">
              <span className="metric-label">Short-Term (STCG)</span>
              <span className="metric-sublabel">Optimised STCG values</span>
            </div>
            <div className="metric-values">
              <div className="metric-val profit">
                <span className="metric-val-num">{formatINR(post.stcg.profits)}</span>
                <span className="metric-val-type">Profits</span>
              </div>
              <div className="metric-val loss">
                <span className="metric-val-num">{formatINR(post.stcg.losses)}</span>
                <span className="metric-val-type">Losses</span>
              </div>
            </div>
          </div>

          <div className="net-gains-container">
            <div className="net-gains-row">
              <span className="metric-label">Net Short-Term Gains</span>
              <span className={`net-gains-value ${getNetClass(post.stcg.net)}`}>
                {formatINR(post.stcg.net)}
              </span>
            </div>
          </div>

          {/* Long-Term Capital Gains (LTCG) */}
          <div className="metric-row" style={{ marginTop: '0.5rem' }}>
            <div className="metric-label-container">
              <span className="metric-label">Long-Term (LTCG)</span>
              <span className="metric-sublabel">Optimised LTCG values</span>
            </div>
            <div className="metric-values">
              <div className="metric-val profit">
                <span className="metric-val-num">{formatINR(post.ltcg.profits)}</span>
                <span className="metric-val-type">Profits</span>
              </div>
              <div className="metric-val loss">
                <span className="metric-val-num">{formatINR(post.ltcg.losses)}</span>
                <span className="metric-val-type">Losses</span>
              </div>
            </div>
          </div>

          <div className="net-gains-container">
            <div className="net-gains-row">
              <span className="metric-label">Net Long-Term Gains</span>
              <span className={`net-gains-value ${getNetClass(post.ltcg.net)}`}>
                {formatINR(post.ltcg.net)}
              </span>
            </div>
          </div>
        </div>

        {/* Realised Capital Gains Footer */}
        <div className="realised-gains-container">
          <span className="realised-label">Realised Capital Gains</span>
          <span className={`realised-value ${getNetClass(post.realised)}`}>
            {formatINR(post.realised)}
          </span>
        </div>

        {/* Savings Line (Shows only if gains dropped) */}
        {hasSavings && (
          <div className="savings-callout">
            <ShieldCheck size={18} />
            <span>
              You're going to save <strong>{formatINR(taxSavings)}</strong> in taxes! (Assuming {taxRate}% Bracket)
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
