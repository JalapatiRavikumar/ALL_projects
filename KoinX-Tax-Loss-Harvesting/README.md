# KoinX - Tax Loss Harvesting & Optimization Dashboard

**Live Production Link**: [https://konix-alpha.vercel.app](https://konix-alpha.vercel.app)

Welcome to the **KoinX Tax Loss Harvesting Dashboard**! This application is a high-fidelity, fully interactive frontend tool built using **React**, **TypeScript**, **Vite**, and **Vanilla CSS**. It enables crypto investors to track their capital gains liabilities and simulate tax-loss harvesting by realizing strategic losses.

---

## 🌟 Key Features

### 1. Comparison Dashboard Cards
- **Pre-Harvesting Card (Left - Sleek Dark Theme)**: Displays initial short-term (STCG) and long-term (LTCG) profits, losses, and net gains parsed directly from the simulated **Capital Gains API**.
- **After Harvesting Card (Right - Glowing Blue Gradient Theme)**: Live-calculates and displays optimised capital gains in real-time as users select/deselect holdings in the table.
- **Dynamic Tax Savings Callout**: Computes exact tax savings and renders a glowing banner message: `"You're going to save ₹X in taxes!"` whenever the user optimizes their gains.

### 2. Interactive holdings Portfolio Table
- **Multi-Line Structural Cells**: 
  - **Asset**: Renders high-quality coin logos (with fallback SVGs), coin symbols, full names, and highlights potential "Harvesting Opportunities" (assets containing net losses).
  - **Holdings**: Displays exact asset counts formatted cleanly, alongside total value in INR.
  - **STCG / LTCG Gains**: Displays net gain in green (profit) or red (loss) alongside balance allocations.
- **Sorting**: Toggle table headers to sort assets instantly by Ticker, Value, Price, STCG, or LTCG.
- **Instant Search Filter**: Integrated filter bar to search/filter assets by coin symbol or name.
- **Checkbox Systems**: Select/deselect individual assets, or toggle all assets on the current screen with a single header checkbox.
- **"Amount to Sell"**: Displays the precise token size to sell to realize the respective gain/loss when selected.
- **"View All" Toggle**: Collapses the table to 5 items by default to keep the dashboard concise, with a beautiful "View All / View Less" expansion control.

### 3. Dynamic Settings & Mocking Controls
- **Interactive Tax Bracket Selector**: Toggle between **15%**, **20%**, and **30%** tax brackets in the header to see savings change instantly.
- **Mock API Delays**: Simulated loading state displays skeleton loading screens to users.
- **API Error Simulation Switch**: A custom toggle to let reviewers force an API load failure, inspect the illustrated error recovery screen, and click "Try Again" to verify robust reload behaviors.
- **Responsive Fluid Layout**: Complete flex and grid transitions that stack elements beautifully on tablets and mobile screens, enabling frictionless horizontal table scrolling.

---

## 📐 Math & Business Logic

### Core Calculations

1. **Pre-Harvesting Gains**:
   - $\text{STCG Net}_{\text{pre}} = \text{STCG Profits}_{\text{pre}} - \text{STCG Losses}_{\text{pre}}$
   - $\text{LTCG Net}_{\text{pre}} = \text{LTCG Profits}_{\text{pre}} - \text{LTCG Losses}_{\text{pre}}$
   - $\text{Realised Capital Gains}_{\text{pre}} = \text{STCG Net}_{\text{pre}} + \text{LTCG Net}_{\text{pre}}$

2. **After Harvesting Gains (Selected Holdings)**:
   - For each *selected* holding:
     - If $\text{STCG Gain} > 0 \rightarrow \text{STCG Profits}_{\text{post}} = \text{STCG Profits}_{\text{pre}} + \text{STCG Gain}$
     - If $\text{STCG Gain} < 0 \rightarrow \text{STCG Losses}_{\text{post}} = \text{STCG Losses}_{\text{pre}} + |\text{STCG Gain}|$
     - If $\text{LTCG Gain} > 0 \rightarrow \text{LTCG Profits}_{\text{post}} = \text{LTCG Profits}_{\text{pre}} + \text{LTCG Gain}$
     - If $\text{LTCG Gain} < 0 \rightarrow \text{LTCG Losses}_{\text{post}} = \text{LTCG Losses}_{\text{pre}} + |\text{LTCG Gain}|$
   - $\text{Realised Capital Gains}_{\text{post}} = \text{STCG Net}_{\text{post}} + \text{LTCG Net}_{\text{post}}$

3. **Tax Savings Calculation**:
   - Tax savings apply only if optimised gains are lower than initial gains:
     $$\text{Tax Saved} = (\text{Realised Capital Gains}_{\text{pre}} - \text{Realised Capital Gains}_{\text{post}}) \times \text{Tax Rate}\%$$
   - If $\text{Realised Capital Gains}_{\text{post}} \ge \text{Realised Capital Gains}_{\text{pre}}$ (e.g. only profits are realized), Tax Saved is $\text{₹}0.00$ and the savings banner is hidden.

### Core Assumptions

- **Standard Global Offsetting**: The tool assumes that short-term and long-term capital losses can offset overall gains under standard rules (rather than strict Indian crypto rules which prohibit offsetting). This is aligned with the KoinX assignment prompt example.
- **Simulated Tax Opportunities**: Standard mock holdings data contains almost exclusively positive capital gains. To provide a high-value demonstration of tax-loss harvesting, we mixed in two simulated high-value harvesting assets:
  - `BTC (Bitcoin)` containing a Short-Term loss of `-₹34,000`
  - `ADA (Cardano)` containing a Long-Term loss of `-₹16,705`
  This enables reviewers to check significant tax savings and verify calculation correctness immediately!

---

## 🛠️ Local Setup Instructions

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Clone the project and navigate to the directory:
```bash
cd konix
```

### 2. Install package dependencies:
```bash
npm install
```

### 3. Start the Vite local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the dashboard.

### 4. Build the production package:
```bash
npm run build
```
This compiles typescript and outputs static HTML, CSS, and JS to the `dist/` directory, ready to deploy to Netlify or Vercel.

---

## 📂 Code Directory Structure

```text
konix/
├── dist/                         # Compiled static production bundle
├── public/                       # Public static assets
├── src/
│   ├── assets/                   # React logo assets
│   ├── components/
│   │   ├── Header.tsx            # Header, Logo, and Tax Bracket buttons
│   │   ├── CapitalGainsDashboard.tsx # Comparison Pre/Post gains cards
│   │   └── HoldingsTable.tsx     # Portfolio list with search, sorting & error triggers
│   ├── context/
│   │   └── TaxHarvestContext.tsx # Centralized React State and computations engine
│   ├── utils/
│   │   └── mockApi.ts            # Delayed Promises and dummy responses
│   ├── App.tsx                   # Integrates layouts inside context provider
│   ├── index.css                 # Premium glassmorphic CSS styling stylesheet
│   └── main.tsx                  # Main client entrypoint
├── index.html                    # SEO optimized index markup
├── package.json                  # Dependencies configuration
├── tsconfig.json                 # TypeScript rules
└── vite.config.ts                # Vite configurations
```

---

*Thank you for reviewing my submission for the KoinX Frontend Intern Challenge! Crafted with precision.*
