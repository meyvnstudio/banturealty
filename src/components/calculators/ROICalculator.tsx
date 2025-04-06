import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const ROICalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(200000);
  const [downPayment, setDownPayment] = useState<number>(40000);
  const [monthlyRent, setMonthlyRent] = useState<number>(2000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(500);
  const [appreciationRate, setAppreciationRate] = useState<number>(3);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);

  const calculateROI = () => {
    // Monthly cash flow
    const monthlyCashFlow = monthlyRent - monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    // Property value after appreciation
    const futureValue = purchasePrice * Math.pow(1 + appreciationRate / 100, holdingPeriod);
    const totalAppreciation = futureValue - purchasePrice;

    // Total return
    const totalCashFlow = annualCashFlow * holdingPeriod;
    const totalReturn = totalCashFlow + totalAppreciation;

    // ROI calculation
    const initialInvestment = downPayment;
    const roi = (totalReturn / initialInvestment) * 100;

    return {
      monthlyCashFlow,
      annualCashFlow,
      futureValue,
      totalAppreciation,
      totalCashFlow,
      totalReturn,
      roi
    };
  };

  const results = calculateROI();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Investment ROI Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Price ($)</label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Down Payment ($)</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Rent ($)</label>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Expenses ($)</label>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Appreciation Rate (%)</label>
          <input
            type="number"
            value={appreciationRate}
            onChange={(e) => setAppreciationRate(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Holding Period (years)</label>
          <input
            type="number"
            value={holdingPeriod}
            onChange={(e) => setHoldingPeriod(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Investment Analysis</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monthly Cash Flow:</span>
              <span className="font-semibold">${results.monthlyCashFlow.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Annual Cash Flow:</span>
              <span className="font-semibold">${results.annualCashFlow.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Future Property Value:</span>
              <span className="font-semibold">${results.futureValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Appreciation:</span>
              <span className="font-semibold">${results.totalAppreciation.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Cash Flow:</span>
              <span className="font-semibold">${results.totalCashFlow.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Total ROI:</span>
              <span className="font-semibold">{results.roi.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;