import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const MortgageCalculator = () => {
  const [principal, setPrincipal] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [downPayment, setDownPayment] = useState<number>(20);

  const calculateMortgage = () => {
    const p = principal * (1 - downPayment / 100);
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return monthlyPayment;
  };

  const monthlyPayment = calculateMortgage();
  const totalPayment = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPayment - principal * (1 - downPayment / 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Mortgage Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Property Price ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Down Payment (%)</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Loan Term (years)</label>
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monthly Payment:</span>
              <span className="font-semibold">${monthlyPayment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Down Payment:</span>
              <span className="font-semibold">${(principal * downPayment / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Interest:</span>
              <span className="font-semibold">${totalInterest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Total Payment:</span>
              <span className="font-semibold">${totalPayment.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;