import React from 'react';
import { Calculator, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import MortgageCalculator from '../components/calculators/MortgageCalculator';
import RentAffordabilityCalculator from '../components/calculators/RentAffordabilityCalculator';
import ROICalculator from '../components/calculators/ROICalculator';
import CurrencyConverter from '../components/CurrencyConverter';

const Tools = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Property Tools</h1>
        <p className="text-gray-600 mt-2">
          Calculate mortgage payments, check rent affordability, and analyze investment returns
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <MortgageCalculator />
          <ROICalculator />
        </div>
        <div className="space-y-8">
          <RentAffordabilityCalculator />
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
};

export default Tools;