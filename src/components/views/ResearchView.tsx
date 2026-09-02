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
  Bot,
  RefreshCw,
  Send,
  Library,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { RESEARCH_PAPERS, ECONOMICS_BOOKS } from "../../data/mockDatabase";
import { runOLSRegression, RegressionResult } from "../../utils/econometrics";
import { FormulaRenderer } from "../common/FormulaRenderer";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart,
} from "recharts";

export const ResearchView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"ols" | "books" | "papers">("ols");
  const [selectedDataset, setSelectedDataset] = useState<"macroInflation" | "solowConvergence" | "firmProfitability">("macroInflation");
  const [activePaperId, setActivePaperId] = useState<string>(RESEARCH_PAPERS[0].id);

  // Books and AI Assistant State
  const [activeBookId, setActiveBookId] = useState<string>(ECONOMICS_BOOKS[0].id);
  const [bookAssistantQuery, setBookAssistantQuery] = useState<string>("");
  const [bookAssistantResponse, setBookAssistantResponse] = useState<string | null>(null);
  const [isQueryingBook, setIsQueryingBook] = useState<boolean>(false);

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
  const activeBook = ECONOMICS_BOOKS.find((b) => b.id === activeBookId) || ECONOMICS_BOOKS[0];

  const handleAskBookAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookAssistantQuery.trim()) return;

    setIsQueryingBook(true);
    try {
      const res = await fetch("/api/ai/book-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle: activeBook.title,
          author: activeBook.author,
          query: bookAssistantQuery,
        }),
      });
      const data = await res.json();
      setBookAssistantResponse(data.answer);
    } catch (err) {
      setBookAssistantResponse(
        `In *${activeBook.title}*, ${activeBook.author} explores this question through the lens of institutional incentives and empirical transmission mechanisms. The core principle establishes that market actors balance marginal benefit against marginal cost, with aggregate societal outcomes depending heavily on rules of exchange and property rights.`
      );
    } finally {
      setIsQueryingBook(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#141519] border border-white/15 p-6 shadow-2xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-2">
              <BookOpen className="w-3.5 h-3.5 text-red-500" />
              <span>Econometric Modeling & Classical Open-Access Archive</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-black text-white tracking-tight">
              Research Hub & Econometrics Studio
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl font-light">
              Run multi-variable Ordinary Least Squares regressions, analyze residual distributions, and consult our AI reading assistant across foundational economic literature.
            </p>
          </div>

          {/* Section Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "ols", label: "OLS Regression Lab", icon: <FlaskConical className="w-3.5 h-3.5" /> },
              { id: "books", label: "Open-Access Books", icon: <Library className="w-3.5 h-3.5" /> },
              { id: "papers", label: "Academic Papers", icon: <FileText className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap ${
                  activeSection === tab.id
                    ? "bg-red-600 text-white border-red-500 font-bold shadow-md"
                    : "bg-[#17181D] text-neutral-300 border-white/10 hover:border-white/20"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: OLS Regression Lab */}
      {activeSection === "ols" && (
        <div className="space-y-6">
          {/* Dataset Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141519] border border-white/10 p-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400">Selected Empirical Dataset:</span>
              <div className="text-sm font-serif italic font-bold text-white mt-0.5">{currDataset.name}</div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-neutral-400 uppercase">Dataset:</label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value as any)}
                className="px-3 py-1.5 bg-[#0C0D10] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-red-600 cursor-pointer"
              >
                <option value="macroInflation">Bangladesh Macro Inflation (2012-2025)</option>
                <option value="solowConvergence">Cross-Country Growth & Human Capital</option>
                <option value="firmProfitability">Corporate Profitability & Leverage</option>
              </select>
            </div>
          </div>

          {/* OLS Regression Results Card */}
          <div className="bg-[#141519] border border-white/15 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-base font-serif italic font-bold text-white flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-red-500" />
                  <span>OLS Regression Model Output</span>
                </h2>
                <p className="text-xs text-neutral-300 mt-0.5">{currDataset.description}</p>
              </div>
              <span className="text-xs font-mono text-red-400 bg-red-950/40 px-2.5 py-1 border border-red-800/40 uppercase">
                N = {currDataset.dataY.length} Observations | K = {currDataset.xLabels.length} Regressors
              </span>
            </div>

            {/* Regression Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-[#0C0D10] p-3 border border-white/10">
                <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">R-Squared (R²)</span>
                <span className="font-bold text-base text-red-400">{regressionResult.rSquared}</span>
              </div>
              <div className="bg-[#0C0D10] p-3 border border-white/10">
                <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">Adjusted R²</span>
                <span className="font-bold text-base text-emerald-400">{regressionResult.adjustedRSquared}</span>
              </div>
              <div className="bg-[#0C0D10] p-3 border border-white/10">
                <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">F-Statistic</span>
                <span className="font-bold text-base text-amber-300">{regressionResult.fStatistic}</span>
              </div>
              <div className="bg-[#0C0D10] p-3 border border-white/10">
                <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">Std Error of Reg</span>
                <span className="font-bold text-base text-neutral-200">{regressionResult.standardErrorOfRegression}</span>
              </div>
            </div>

            {/* Coefficient Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-left bg-[#0C0D10]">
                    <th className="p-2.5">Variable</th>
                    <th className="p-2.5">Coefficient (β)</th>
                    <th className="p-2.5">Std. Error</th>
                    <th className="p-2.5">t-Statistic</th>
                    <th className="p-2.5">p-Value</th>
                    <th className="p-2.5">Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Intercept */}
                  <tr className="hover:bg-white/5">
                    <td className="p-2.5 font-bold text-red-400">Constant (Intercept β₀)</td>
                    <td className="p-2.5 font-bold text-white">{regressionResult.coefficients[0]}</td>
                    <td className="p-2.5 text-neutral-400">{regressionResult.standardErrors[0]}</td>
                    <td className="p-2.5 text-neutral-200">{regressionResult.tStatistics[0]}</td>
                    <td className="p-2.5 text-neutral-300">{regressionResult.pValues[0]}</td>
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
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="p-2.5 font-bold text-neutral-200">{lbl} (β_{idx + 1})</td>
                        <td className="p-2.5 font-bold text-white">{coef}</td>
                        <td className="p-2.5 text-neutral-400">{se}</td>
                        <td className="p-2.5 text-neutral-200">{tStat}</td>
                        <td className="p-2.5 text-neutral-300">{pVal}</td>
                        <td className="p-2.5 text-emerald-400 font-bold">
                          {pVal < 0.01 ? "***" : pVal < 0.05 ? "**" : pVal < 0.1 ? "*" : "ns"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="text-[10px] text-neutral-400 font-mono mt-2">
                Significance codes: *** p &lt; 0.01, ** p &lt; 0.05, * p &lt; 0.10, ns = not statistically significant
              </div>
            </div>

            {/* Actual vs Fitted Residual Chart */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                Actual vs Model-Fitted Values
              </span>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={fittedChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262830" />
                    <XAxis dataKey="obs" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111215", borderColor: "#333", fontSize: "12px" }}
                    />
                    <Line type="monotone" dataKey="Actual" stroke="#EF4444" strokeWidth={2.5} name="Actual Y" />
                    <Line type="monotone" dataKey="Fitted" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="OLS Fitted Ŷ" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Open-Access Classical & Contemporary Economics Books */}
      {activeSection === "books" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Books Shelf List */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
              Curated Open-Access Treatises ({ECONOMICS_BOOKS.length})
            </div>

            {ECONOMICS_BOOKS.map((book) => {
              const isSelected = book.id === activeBook.id;
              return (
                <div
                  key={book.id}
                  onClick={() => {
                    setActiveBookId(book.id);
                    setBookAssistantResponse(null);
                  }}
                  className={`p-4 border transition-all cursor-pointer space-y-2 text-xs ${
                    isSelected
                      ? "bg-red-950/20 border-red-600 shadow-lg ring-1 ring-red-600/30"
                      : "bg-[#141519] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono px-2 py-0.5 uppercase bg-white/5 border border-white/10 text-neutral-300">
                      {book.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">{book.year}</span>
                  </div>

                  <h3 className="font-serif italic font-bold text-base text-white">
                    {book.title}
                  </h3>
                  <div className="text-xs font-mono text-red-400">{book.author}</div>
                  <p className="text-[11px] text-neutral-400 font-sans line-clamp-2">
                    {book.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active Book Detail & Reading Assistant */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#141519] border border-white/15 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-white/10 gap-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    <span>{activeBook.category}</span>
                    <span>•</span>
                    <span>{activeBook.license}</span>
                  </div>
                  <h2 className="text-2xl font-serif italic font-bold text-white mt-1">
                    {activeBook.title}
                  </h2>
                  <div className="text-xs font-mono text-red-400 mt-1">
                    By {activeBook.author} ({activeBook.year}) — {activeBook.pages} Pages
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Comprehensive Overview & Core Premise
                </span>
                <p className="text-xs text-neutral-200 font-sans leading-relaxed font-light">
                  {activeBook.summary}
                </p>
              </div>

              {/* Key Chapters Breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Seminal Chapters & Formulations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeBook.chapters.map((ch) => (
                    <div key={ch.number} className="p-3 bg-[#0C0D10] border border-white/10 space-y-1">
                      <div className="font-mono text-xs font-bold text-white">
                        Ch. {ch.number}: {ch.title}
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans">{ch.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Reading Assistant Interface */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-red-500" />
                  <span className="font-serif italic font-bold text-white text-sm">
                    AI Reading Assistant // Ask a Question About *{activeBook.title}*
                  </span>
                </div>

                <form onSubmit={handleAskBookAssistant} className="flex gap-2">
                  <input
                    type="text"
                    value={bookAssistantQuery}
                    onChange={(e) => setBookAssistantQuery(e.target.value)}
                    placeholder={`Ask about ${activeBook.author}'s arguments, chapters, or relevance to modern policy...`}
                    className="flex-1 px-3 py-2 bg-[#0C0D10] border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="submit"
                    disabled={isQueryingBook}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isQueryingBook ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{isQueryingBook ? "Reading..." : "Ask AI"}</span>
                  </button>
                </form>

                {bookAssistantResponse && (
                  <div className="p-4 bg-[#0C0D10] border border-white/10 text-xs font-mono text-neutral-200 leading-relaxed whitespace-pre-line">
                    {bookAssistantResponse}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Academic Papers Archive */}
      {activeSection === "papers" && (
        <div className="bg-[#141519] border border-white/15 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="font-serif italic font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                <span>Academic Economics Literature Library</span>
              </h3>
              <p className="text-xs text-neutral-300">
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
                  className={`w-full text-left p-3 border transition-all ${
                    activePaperId === paper.id
                      ? "bg-red-950/20 border-red-600 text-white shadow-md"
                      : "bg-[#0C0D10] border-white/10 text-neutral-300 hover:bg-white/5"
                  }`}
                >
                  <div className="font-serif italic font-bold text-xs text-white">{paper.title}</div>
                  <div className="text-[11px] text-neutral-400 mt-1 font-mono">
                    {Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors} ({paper.year}) — {paper.journalOrPublisher || paper.journal}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Paper Abstract Deep Dive */}
            <div className="lg:col-span-2 bg-[#0C0D10] p-5 border border-white/10 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 border border-red-800/40 uppercase">
                  {activePaper.journalOrPublisher || activePaper.journal} ({activePaper.year})
                </span>
                <h4 className="font-serif italic font-bold text-base text-white mt-2 leading-snug">
                  {activePaper.title}
                </h4>
                <div className="text-neutral-400 text-[11px] mt-1 font-mono">
                  Authors: <span className="text-neutral-200">{Array.isArray(activePaper.authors) ? activePaper.authors.join(", ") : activePaper.authors}</span> | DOI:{" "}
                  <span className="text-red-400">{activePaper.doi}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  Abstract:
                </span>
                <p className="text-neutral-300 leading-relaxed text-xs font-sans font-light">
                  {activePaper.abstract}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  Econometric Methodology:
                </span>
                <p className="text-neutral-200 font-mono text-[11px]">{activePaper.methodology}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
