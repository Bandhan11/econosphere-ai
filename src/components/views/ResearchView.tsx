import React, { useState, useMemo } from "react";
import {
  BookOpen,
  FlaskConical,
  Play,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  FileText,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { RESEARCH_PAPERS } from "../../data/mockDatabase";
import { runOLSRegression, RegressionResult } from "../../utils/econometrics";
import { FormulaRenderer } from "../common/FormulaRenderer";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart,
} from "recharts";

export const ResearchView: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<"macroInflation" | "solowConvergence" | "firmProfitability">("macroInflation");
  const [activePaperId, setActivePaperId] = useState<string>(RESEARCH_PAPERS[0].id);

  // Pre-configured Empirical Datasets
  const datasets = {
    macroInflation: {
      name: "Bangladesh Macro Inflation Dynamics (2012-2025)",
      description: "Quarterly observations on Headline CPI Inflation (Y) vs Money Supply Growth (X1) and Import Price Index (X2).",
      yLabel: "CPI Inflation (%)",
      xLabels: ["Money Supply M2 Growth (%)", "Import Price Index (% Change)"],
      dataY: [6.2, 7.5, 6.8, 5.9, 5.5, 6.1, 8.9, 9.4, 9.8, 9.7, 9.1, 8.5],
      dataX: [
        [11.2, 3.4],
        [14.5, 5.2],
        [12.8, 4.1],
        [10.5, 1.8],
        [9.8, 0.5],
        [11.0, 2.1],
        [16.2, 12.5],
        [17.5, 15.8],
        [18.2, 14.2],
        [16.8, 11.5],
        [15.1, 9.2],
        [13.8, 7.4],
      ],
    },
    solowConvergence: {
      name: "Cross-Country Growth & Human Capital (N=15)",
      description: "Average real GDP per capita growth (Y) vs Initial GDP (X1) and Secondary Schooling (X2).",
      yLabel: "Annual GDP Growth (%)",
      xLabels: ["Log Initial Income (X1)", "Secondary Schooling Rate % (X2)"],
      dataY: [5.8, 6.2, 4.5, 2.1, 1.8, 6.8, 5.1, 2.4, 1.9, 7.2, 4.9, 3.2, 2.0, 6.5, 5.4],
      dataX: [
        [7.2, 45],
        [7.5, 52],
        [8.1, 60],
        [10.2, 92],
        [10.5, 95],
        [6.8, 38],
        [7.9, 58],
        [9.8, 88],
        [10.4, 94],
        [6.5, 32],
        [8.2, 65],
        [9.1, 78],
        [10.6, 96],
        [7.0, 42],
        [7.8, 55],
      ],
    },
    firmProfitability: {
      name: "Corporate Profitability & Leverage (N=10)",
      description: "Return on Assets (Y) vs Debt-to-Equity (X1) and Asset Size Log (X2).",
      yLabel: "Return on Assets ROA (%)",
      xLabels: ["Debt-to-Equity Ratio (X1)", "Log Total Assets (X2)"],
      dataY: [12.5, 10.2, 8.4, 14.1, 6.8, 9.5, 11.2, 7.9, 13.5, 8.8],
      dataX: [
        [0.45, 14.2],
        [0.82, 15.1],
        [1.25, 13.8],
        [0.32, 16.5],
        [1.65, 12.9],
        [0.95, 14.7],
        [0.60, 15.8],
        [1.40, 13.2],
        [0.38, 17.1],
        [1.10, 14.0],
      ],
    },
  };

  const currDataset = datasets[selectedDataset];

  // Run OLS Regression via pure functional econometrics engine
  const regressionResult: RegressionResult = useMemo(() => {
    return runOLSRegression(currDataset.dataY, currDataset.dataX);
  }, [currDataset]);

  // Fitted vs Actual chart data
  const fittedChartData = currDataset.dataY.map((actual, i) => ({
    obs: `Obs ${i + 1}`,
    Actual: actual,
    Fitted: regressionResult.fittedValues[i],
    Residual: regressionResult.residuals[i],
  }));

  const activePaper = RESEARCH_PAPERS.find((p) => p.id === activePaperId) || RESEARCH_PAPERS[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Academic & Empirical Research Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            OLS Econometrics & <span className="text-cyan-400">Research Lab</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Run multi-variable Ordinary Least Squares regressions with standard errors, t-statistics, p-values, and browse peer-reviewed economic literature.
          </p>
        </div>

        {/* Dataset selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Dataset:</label>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="macroInflation">Bangladesh Macro Inflation (2012-2025)</option>
            <option value="solowConvergence">Cross-Country Growth & Human Capital</option>
            <option value="firmProfitability">Corporate Profitability & Leverage</option>
          </select>
        </div>
      </div>

      {/* OLS Regression Results Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span>OLS Regression Model Output</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{currDataset.description}</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/50">
            N = {currDataset.dataY.length} Observations | K = {currDataset.xLabels.length} Regressors
          </span>
        </div>

        {/* Regression Summary Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">R-Squared (R²)</span>
            <span className="font-bold text-base text-cyan-400">{regressionResult.rSquared}</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Adjusted R²</span>
            <span className="font-bold text-base text-emerald-400">{regressionResult.adjustedRSquared}</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">F-Statistic</span>
            <span className="font-bold text-base text-indigo-300">{regressionResult.fStatistic}</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Std Error of Reg</span>
            <span className="font-bold text-base text-amber-300">{regressionResult.standardErrorOfRegression}</span>
          </div>
        </div>

        {/* Coefficient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left bg-slate-950/60">
                <th className="p-2.5">Variable</th>
                <th className="p-2.5">Coefficient (β)</th>
                <th className="p-2.5">Std. Error</th>
                <th className="p-2.5">t-Statistic</th>
                <th className="p-2.5">p-Value</th>
                <th className="p-2.5">Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Intercept */}
              <tr className="hover:bg-slate-850/50">
                <td className="p-2.5 font-bold text-cyan-300">Constant (Intercept β₀)</td>
                <td className="p-2.5 font-bold text-slate-100">{regressionResult.coefficients[0]}</td>
                <td className="p-2.5 text-slate-400">{regressionResult.standardErrors[0]}</td>
                <td className="p-2.5 text-slate-200">{regressionResult.tStatistics[0]}</td>
                <td className="p-2.5 text-slate-300">{regressionResult.pValues[0]}</td>
                <td className="p-2.5 text-emerald-400 font-bold">
                  {regressionResult.pValues[0] < 0.01 ? "***" : regressionResult.pValues[0] < 0.05 ? "**" : "*"}
                </td>
              </tr>

              {/* Explanatory Regressors */}
              {currDataset.xLabels.map((lbl, idx) => {
                const coef = regressionResult.coefficients[idx + 1];
                const se = regressionResult.standardErrors[idx + 1];
                const tStat = regressionResult.tStatistics[idx + 1];
                const pVal = regressionResult.pValues[idx + 1];
                return (
                  <tr key={idx} className="hover:bg-slate-850/50">
                    <td className="p-2.5 font-bold text-slate-200">{lbl} (β_{idx + 1})</td>
                    <td className="p-2.5 font-bold text-slate-100">{coef}</td>
                    <td className="p-2.5 text-slate-400">{se}</td>
                    <td className="p-2.5 text-slate-200">{tStat}</td>
                    <td className="p-2.5 text-slate-300">{pVal}</td>
                    <td className="p-2.5 text-emerald-400 font-bold">
                      {pVal < 0.01 ? "***" : pVal < 0.05 ? "**" : pVal < 0.1 ? "*" : "ns"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-[10px] text-slate-500 font-mono mt-2">
            Significance codes: *** p &lt; 0.01, ** p &lt; 0.05, * p &lt; 0.10, ns = not statistically significant
          </div>
        </div>

        {/* Actual vs Fitted Residual Chart */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Actual vs Model-Fitted Values
          </span>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={fittedChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="obs" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "12px" }}
                />
                <Line type="monotone" dataKey="Actual" stroke="#38bdf8" strokeWidth={2.5} name="Actual Y" />
                <Line type="monotone" dataKey="Fitted" stroke="#34d399" strokeWidth={2} strokeDasharray="3 3" name="OLS Fitted Ŷ" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peer-Reviewed Research Literature Library */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Academic Economics Literature Library</span>
            </h3>
            <p className="text-xs text-slate-400">
              Foundational and contemporary empirical papers with methodology audits and citation data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Papers List */}
          <div className="space-y-2">
            {RESEARCH_PAPERS.map((paper) => (
              <button
                key={paper.id}
                onClick={() => setActivePaperId(paper.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  activePaperId === paper.id
                    ? "bg-cyan-950/70 border-cyan-800/80 text-cyan-200"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850"
                }`}
              >
                <div className="font-bold text-xs text-slate-100">{paper.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors} ({paper.year}) — {paper.journalOrPublisher || paper.journal}
                </div>
              </button>
            ))}
          </div>

          {/* Active Paper Abstract Deep Dive */}
          <div className="lg:col-span-2 bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40 uppercase">
                {activePaper.journalOrPublisher || activePaper.journal} ({activePaper.year})
              </span>
              <h4 className="font-bold text-sm text-white mt-2 leading-snug">{activePaper.title}</h4>
              <div className="text-slate-400 text-[11px] mt-1">
                Authors: <span className="text-slate-200">{Array.isArray(activePaper.authors) ? activePaper.authors.join(", ") : activePaper.authors}</span> | DOI:{" "}
                <span className="font-mono text-cyan-400">{activePaper.doi}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Abstract:
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">{activePaper.abstract}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Econometric Methodology:
              </span>
              <p className="text-cyan-300 font-mono text-[11px]">{activePaper.methodology}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
