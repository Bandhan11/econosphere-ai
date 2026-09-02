import React, { useState, useMemo } from "react";
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Sliders,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { holtWintersForecast, ForecastResult } from "../../utils/econometrics";
import { FormulaRenderer } from "../common/FormulaRenderer";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export const ForecastView: React.FC = () => {
  const { activeCountry } = useApp();
  const [selectedIndicator, setSelectedIndicator] = useState<"cpi" | "gdp" | "reserves">("cpi");
  const [forecastHorizon, setForecastHorizon] = useState<number>(8); // 8 quarters (2 years)
  const [alpha, setAlpha] = useState<number>(0.3); // level smoothing
  const [beta, setBeta] = useState<number>(0.15); // trend smoothing
  const [gamma, setGamma] = useState<number>(0.2); // seasonal smoothing

  // Historical Series (Quarterly data for last 4 years)
  const historicalData = {
    cpi: {
      name: `${activeCountry.name} Headline CPI Inflation Rate (%)`,
      history: [6.5, 6.8, 7.2, 7.5, 8.1, 8.6, 9.2, 9.8, 9.9, 9.7, 9.5, 9.2],
      unit: "%",
    },
    gdp: {
      name: `${activeCountry.name} Real GDP Growth Rate (%)`,
      history: [6.8, 7.1, 6.5, 6.0, 5.8, 5.5, 5.2, 5.4, 5.6, 5.7, 5.8, 5.9],
      unit: "%",
    },
    reserves: {
      name: `${activeCountry.name} Foreign Exchange Reserves ($B)`,
      history: [44.2, 42.1, 38.5, 34.2, 31.0, 27.5, 24.1, 21.5, 19.8, 20.5, 21.2, 21.8],
      unit: "$B",
    },
  }[selectedIndicator];

  // Run Holt-Winters forecast engine
  const forecast: ForecastResult = useMemo(() => {
    return holtWintersForecast(
      historicalData.history,
      forecastHorizon,
      4, // 4 quarters per year
      alpha,
      beta,
      gamma
    );
  }, [historicalData, forecastHorizon, alpha, beta, gamma]);

  // Combine Historical and Forecast into single charting array with 95% confidence bounds
  const combinedChartData = useMemo(() => {
    const data = [];
    const len = historicalData.history.length;

    // Historical points
    for (let i = 0; i < len; i++) {
      data.push({
        period: `Q${(i % 4) + 1} Y${Math.floor(i / 4) + 2022}`,
        Historical: historicalData.history[i],
        Forecast: undefined,
        UpperCI: undefined,
        LowerCI: undefined,
      });
    }

    // Connect last historical point to forecast
    const lastHist = historicalData.history[len - 1];
    data[len - 1].Forecast = lastHist;
    data[len - 1].UpperCI = lastHist;
    data[len - 1].LowerCI = lastHist;

    // Forecast points
    for (let h = 0; h < forecastHorizon; h++) {
      const qIdx = len + h;
      data.push({
        period: `Q${(qIdx % 4) + 1} Y${Math.floor(qIdx / 4) + 2022} (F)`,
        Historical: undefined,
        Forecast: forecast.forecastValues[h],
        UpperCI: forecast.upperConfidence95[h],
        LowerCI: forecast.lowerConfidence95[h],
      });
    }
    return data;
  }, [historicalData, forecast, forecastHorizon]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <LineChartIcon className="w-4 h-4" />
            <span>Advanced Econometric Forecasting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Holt-Winters & <span className="text-cyan-400">Monte Carlo Projections</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Triple exponential smoothing with additive seasonality, trend extraction, and 95% empirical uncertainty confidence bands.
          </p>
        </div>

        {/* Indicator Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Indicator:</label>
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="cpi">Headline CPI Inflation (%)</option>
            <option value="gdp">Real GDP Growth (%)</option>
            <option value="reserves">Foreign Exchange Reserves ($B)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Smoothing Parameters */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Smoothing Coefficients
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Forecast Horizon:</span>
                <span className="font-mono font-bold text-cyan-400">{forecastHorizon} Quarters</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                value={forecastHorizon}
                onChange={(e) => setForecastHorizon(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Level Parameter (α):</span>
                <span className="font-mono font-bold text-cyan-400">{alpha.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Trend Parameter (β):</span>
                <span className="font-mono font-bold text-emerald-400">{beta.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.5"
                step="0.02"
                value={beta}
                onChange={(e) => setBeta(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Seasonality Parameter (γ):</span>
                <span className="font-mono font-bold text-amber-400">{gamma.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.6"
                step="0.05"
                value={gamma}
                onChange={(e) => setGamma(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Confidence Band Width
            </span>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
              Mean Projected Value: <span className="text-cyan-400 font-bold">{forecast.forecastValues[forecast.forecastValues.length - 1]} {historicalData.unit}</span>
            </div>
          </div>
        </div>

        {/* Right: Forecast Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-100">{historicalData.name}</h3>
              <p className="text-[11px] text-slate-400">Historical observations vs 8-quarter Holt-Winters forecast trajectory</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/50">
              95% Confidence Fan
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#475569" fontSize={10} />
                <YAxis stroke="#475569" fontSize={11} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="Historical"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  name="Historical Actual"
                />
                <Line
                  type="monotone"
                  dataKey="Forecast"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  name="Holt-Winters Forecast"
                />
                <Area
                  type="monotone"
                  dataKey="UpperCI"
                  stroke="none"
                  fill="#10b981"
                  fillOpacity={0.15}
                  name="95% Upper Bound"
                />
                <Area
                  type="monotone"
                  dataKey="LowerCI"
                  stroke="none"
                  fill="#10b981"
                  fillOpacity={0.15}
                  name="95% Lower Bound"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <FormulaRenderer
        title="Holt-Winters Triple Exponential Smoothing Equations"
        formula="\ell_t = \alpha (y_t - s_{t-m}) + (1-\alpha)(\ell_{t-1} + b_{t-1}), \quad b_t = \beta(\ell_t - \ell_{t-1}) + (1-\beta)b_{t-1}"
        description="The additive Holt-Winters model decomposes time series into a baseline level (ell_t), a linear trend (b_t), and seasonal component (s_t) with seasonal period m."
      />
    </div>
  );
};
