import React, { useState } from 'react';
import { Calculator, X, TrendingUp, Info } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface MortgageCalculatorProps {
  onClose: () => void;
  defaultPrice?: number;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ onClose, defaultPrice = 5000000 }) => {
  const [loanAmount, setLoanAmount] = useState<number>(defaultPrice * 0.75);
  const [months, setMonths] = useState<number>(120);
  const [interestRate, setInterestRate] = useState<number>(3.05); // Aylık %3.05 varsayılan konut kredisi

  // Monthly interest payment calculation formula
  // PMT = P * [r(1+r)^n] / [(1+r)^n – 1]
  const r = interestRate / 100;
  const monthlyPayment = r > 0
    ? (loanAmount * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1)
    : loanAmount / months;

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Konut Kredisi Taksit Hesaplama</h3>
            <p className="text-xs text-slate-500">Tahmini aylık ödeme ve toplam maliyet analizi</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
              <span>Çekilecek Kredi Tutarı</span>
              <span className="text-amber-600 font-bold">{formatPrice(loanAmount)}</span>
            </div>
            <input
              type="range"
              min="200000"
              max="25000000"
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Vade (Months) */}
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
              <span>Kredi Vadesi</span>
              <span className="text-slate-900 font-bold">{months} Ay ({Math.round(months / 12)} Yıl)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[12, 36, 60, 120].map(m => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    months === m
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {m} Ay
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Interest Rate */}
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
              <span>Aylık Faiz Oranı (%)</span>
              <span className="text-slate-900 font-bold">%{interestRate.toFixed(2)}</span>
            </div>
            <input
              type="number"
              step="0.05"
              min="0.5"
              max="10"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Calculation Results Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-medium">Aylık Taksit Tutarı</span>
              <span className="text-2xl font-black text-amber-400">
                {formatPrice(monthlyPayment)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-slate-400 font-medium">Toplam Geri Ödeme:</span>
                <span className="font-bold text-slate-200 text-sm">{formatPrice(totalPayment)}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">Toplam Ödenecek Faiz:</span>
                <span className="font-bold text-rose-400 text-sm">{formatPrice(totalInterest)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-[11px] text-slate-500">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Hesaplama sonuçları bilgilendirme amaçlıdır. Bankaların güncel masraf, sigorta ve dosya masrafı oranlarına göre değişiklik gösterebilir.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
