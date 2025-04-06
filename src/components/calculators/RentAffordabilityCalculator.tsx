import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

const RentAffordabilityCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(1000);
  const [otherExpenses, setOtherExpenses] = useState<number>(500);

  const calculateAffordableRent = () => {
    // Using the 30% rule for rent affordability
    const maxRentPercentage = 0.3;
    const disposableIncome = monthlyIncome - monthlyDebts - otherExpenses;
    return disposableIncome * maxRentPercentage;
  };

  const affordableRent = calculateAffordableRent();
  const rentToIncomeRatio = (affordableRent / monthlyIncome) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Rent Affordability Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Income ($)</label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Debts ($)</label>
          <input
            type="number"
            value={monthlyDebts}
            onChange={(e) => setMonthlyDebts(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Other Monthly Expenses ($)</label>
          <input
            type="number"
            value={otherExpenses}
            onChange={(e) => setOtherExpenses(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Affordability Analysis</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Maximum Affordable Rent:</span>
              <span className="font-semibold">${affordableRent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Rent-to-Income Ratio:</span>
              <span className="font-semibold">{rentToIncomeRatio.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Disposable Income After Expenses:</span>
              <span className="font-semibold">
                ${(monthlyIncome - monthlyDebts - otherExpenses - affordableRent).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg text-sm">
            {rentToIncomeRatio > 30 ? (
              <p className="text-red-600">
                Warning: Your rent would be more than 30% of your income, which might be financially stressful.
              </p>
            ) : (
              <p className="text-green-600">
                Good: Your rent would be within the recommended 30% of your income.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentAffordabilityCalculator;