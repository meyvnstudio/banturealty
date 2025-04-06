import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('RWF');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' }
  ];

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoading(true);
      try {
        // In a real application, you would use a proper currency exchange API
        // For demo purposes, using fixed rates
        const rates = {
          USD: { RWF: 1200, EUR: 0.85, GBP: 0.73 },
          RWF: { USD: 1/1200, EUR: 0.00071, GBP: 0.00061 },
          EUR: { USD: 1.18, RWF: 1411.76, GBP: 0.86 },
          GBP: { USD: 1.37, RWF: 1639.34, EUR: 1.16 }
        };

        if (fromCurrency === toCurrency) {
          setExchangeRate(1);
        } else {
          setExchangeRate(rates[fromCurrency][toCurrency]);
        }
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const convertedAmount = amount * exchangeRate;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <RefreshCw className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Currency Converter</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Exchange Rate:</span>
              <span className="font-semibold">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Converted Amount:</span>
              <span className="text-xl font-bold text-blue-600">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  `${convertedAmount.toFixed(2)} ${toCurrency}`
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;