import React, { useState } from "react";
import {
  Sparkles,
  FlaskConical,
  Plus,
  Trash2,
  Copy,
  Download,
  Save,
  Play,
  Layers,
  Sliders,
  CheckCircle2,
  FileCode,
  Share2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export const LabsView: React.FC = () => {
  const { personalLabs, createPersonalLab, deletePersonalLab } = useApp();

  const [selectedLabId, setSelectedLabId] = useState<string>(
    personalLabs.length > 0 ? personalLabs[0].id : ""
  );

  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Inflation");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newModelType, setNewModelType] = useState<string>("Multivariate OLS");

  // Active Lab Parameters State
  const activeLab =
    personalLabs.find((l) => l.id === selectedLabId) || personalLabs[0];

  const [paramShock, setParamShock] = useState<number>(10);
  const [paramLagWeeks, setParamLagWeeks] = useState<number>(3);
  const [paramInterestBps, setParamInterestBps] = useState<number>(75);
  const [simulationRan, setSimulationRan] = useState<boolean>(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createPersonalLab({
      title: newTitle,
      category: newCategory,
      description: newDescription || "Custom user economic simulation model.",
      modelType: newModelType,
      parameters: { paramShock: 10, paramLagWeeks: 2, paramInterestBps: 50 },
      notes: "Newly created user lab.",
      resultsSummary: "Baseline model initialized.",
    });

    setIsCreatingNew(false);
    setNewTitle("");
    setNewDescription("");
  };

  const handleDuplicate = (lab: any) => {
    createPersonalLab({
      title: `${lab.title} (Copy)`,
      category: lab.category,
      description: lab.description,
      modelType: lab.modelType,
      parameters: { ...lab.parameters },
      notes: `Duplicated from ${lab.title}.`,
      resultsSummary: lab.resultsSummary,
    });
  };

  const handleExportJSON = (lab: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lab, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${lab.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Generate dynamic simulation trajectory based on sliders
  const trajectoryData = [
    { period: "T-0", baseline: 6.5, simulated: 6.5 },
    { period: "T+1", baseline: 6.6, simulated: Number((6.5 + paramShock * 0.15).toFixed(2)) },
    { period: "T+2", baseline: 6.4, simulated: Number((6.5 + paramShock * 0.28 - paramInterestBps * 0.005).toFixed(2)) },
    { period: "T+3", baseline: 6.5, simulated: Number((6.5 + paramShock * 0.22 - paramInterestBps * 0.012).toFixed(2)) },
    { period: "T+4", baseline: 6.3, simulated: Number((6.5 + paramShock * 0.14 - paramInterestBps * 0.016).toFixed(2)) },
    { period: "T+5", baseline: 6.2, simulated: Number((6.5 + paramShock * 0.06 - paramInterestBps * 0.018).toFixed(2)) },
    { period: "T+6", baseline: 6.0, simulated: Number((6.5 + paramShock * 0.02 - paramInterestBps * 0.02).toFixed(2)) },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="bg-[#141519] border border-white/15 p-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>User Sandbox // Custom Model Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-black text-white tracking-tight">
              Personal Labs Studio
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl font-light">
              Create, customize, calibrate, and export bespoke economic simulation labs. Test transmission lags, fiscal multipliers, and spatial arbitrage.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingNew(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono uppercase tracking-wider font-bold shadow-md transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Lab</span>
          </button>
        </div>
      </div>

      {/* Creation Modal / Inline Drawer */}
      {isCreatingNew && (
        <div className="bg-[#17181D] border-2 border-red-600/60 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-serif italic font-bold text-white">
              Initialize New Personal Economic Lab
            </h3>
            <button
              onClick={() => setIsCreatingNew(false)}
              className="text-neutral-400 hover:text-white text-xs font-mono"
            >
              Cancel ✕
            </button>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                Lab Title & Model Focus
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bangladesh Fuel Pass-Through to Regional Vegetables..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                Discipline Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 text-white font-mono"
              >
                <option value="Inflation">Inflation & Price Indices</option>
                <option value="Growth">Growth & Capital Accumulation</option>
                <option value="Commodity Market">Commodity Market Equilibrium</option>
                <option value="Monetary Policy">Monetary Policy & Taylor Rule</option>
                <option value="Fiscal Policy">Fiscal Multipliers & Debt</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                Econometric / Mathematical Framework
              </label>
              <select
                value={newModelType}
                onChange={(e) => setNewModelType(e.target.value)}
                className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 text-white font-mono"
              >
                <option value="Multivariate OLS">Multivariate OLS Regression</option>
                <option value="Distributed Lag">Autoregressive Distributed Lag (ARDL)</option>
                <option value="Taylor Rule 1993">Taylor Rule Policy Equation</option>
                <option value="IS-LM Non-Linear">IS-LM Simultaneous Equilibrium</option>
                <option value="Solow-Swan">Solow-Swan Steady State Growth</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                Hypothesis & Experimental Notes
              </label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe what transmission channel or price shock you are testing..."
                className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 text-white"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 bg-white/5 text-neutral-300 border border-white/10 font-mono text-xs uppercase"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold shadow-md"
              >
                Save & Instantiate Lab
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Studio View: Left Lab List, Right Calibration Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Saved Labs */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 px-1">
            Your Active Curation ({personalLabs.length})
          </div>

          {personalLabs.map((lab) => {
            const isSelected = lab.id === (activeLab ? activeLab.id : "");
            return (
              <div
                key={lab.id}
                onClick={() => setSelectedLabId(lab.id)}
                className={`p-4 border transition-all cursor-pointer space-y-2 text-xs ${
                  isSelected
                    ? "bg-red-950/20 border-red-600 shadow-md ring-1 ring-red-600/30"
                    : "bg-[#141519] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-2 py-0.5 uppercase bg-white/5 border border-white/10 text-neutral-300">
                    {lab.category}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {lab.updatedAt}
                  </span>
                </div>

                <h4 className="font-serif italic font-bold text-sm text-white">
                  {lab.title}
                </h4>

                <p className="text-[11px] text-neutral-400 line-clamp-2 font-sans">
                  {lab.description}
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>Model: {lab.modelType}</span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDuplicate(lab)}
                      title="Duplicate Lab"
                      className="p-1 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleExportJSON(lab)}
                      title="Export JSON"
                      className="p-1 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {personalLabs.length > 1 && (
                      <button
                        onClick={() => deletePersonalLab(lab.id)}
                        title="Delete Lab"
                        className="p-1 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Active Lab Calibration & Visualization */}
        {activeLab && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#141519] border border-white/15 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-white/10 gap-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    <span>{activeLab.category}</span>
                    <span>•</span>
                    <span className="text-red-400">{activeLab.modelType}</span>
                  </div>
                  <h2 className="text-xl font-serif italic font-bold text-white mt-1">
                    {activeLab.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportJSON(activeLab)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17181D] hover:bg-[#1E2026] text-neutral-300 border border-white/15 font-mono text-xs uppercase tracking-wider"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => setSimulationRan(true)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-md"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Model</span>
                  </button>
                </div>
              </div>

              {/* Sliders Calibration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#0C0D10] border border-white/10 font-mono text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Exogenous Shock:</span>
                    <span className="text-red-400 font-bold">+{paramShock}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={paramShock}
                    onChange={(e) => setParamShock(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <div className="text-[9px] text-neutral-400">e.g. Fuel or Import Tariff Shock</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Transmission Lag:</span>
                    <span className="text-amber-400 font-bold">{paramLagWeeks} Weeks</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={paramLagWeeks}
                    onChange={(e) => setParamLagWeeks(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-[9px] text-neutral-400">Storage buffer inventory period</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Central Bank Reaction:</span>
                    <span className="text-emerald-400 font-bold">+{paramInterestBps} bps</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="25"
                    value={paramInterestBps}
                    onChange={(e) => setParamInterestBps(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="text-[9px] text-neutral-400">Monetary tightening rate response</div>
                </div>
              </div>

              {/* Simulation Trajectory Chart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    6-Period Simulated Impulse Response Function (IRF)
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">
                    R² = 0.78 // Stationarity Confirmed
                  </span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trajectoryData}>
                      <XAxis dataKey="period" stroke="#666" tick={{ fill: "#888", fontSize: 10 }} />
                      <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111215", borderColor: "#333", fontSize: "11px" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line
                        type="monotone"
                        dataKey="baseline"
                        name="Baseline Unshocked Path"
                        stroke="#6B7280"
                        strokeDasharray="4 4"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="simulated"
                        name="Simulated Post-Shock Path"
                        stroke="#EF4444"
                        strokeWidth={2.5}
                        dot={{ fill: "#EF4444", r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Lab Notes & Results Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-3 bg-[#0C0D10] border border-white/10 space-y-1">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    Model Notes & Constraints
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {activeLab.notes}
                  </p>
                </div>

                <div className="p-3 bg-[#0C0D10] border border-white/10 space-y-1">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    Current Estimated Parameter Fit
                  </div>
                  <p className="text-emerald-400 font-mono text-[11px]">
                    {activeLab.resultsSummary || "Convergence achieved in 12 iterations."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
