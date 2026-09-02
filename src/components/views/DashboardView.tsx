import React, { useState } from "react";
import {
  Sliders,
  Bell,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const DashboardView: React.FC = () => {
  const { alerts, addAlert, removeAlert, activeCountry } = useApp();

  const [newTitle, setNewTitle] = useState("");
  const [newMetric, setNewMetric] = useState("Inflation CPI (%)");
  const [newCondition, setNewCondition] = useState<">" | "<" | "=">(">");
  const [newThreshold, setNewThreshold] = useState<number>(8.5);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAlert({
      title: newTitle,
      metric: newMetric,
      condition: newCondition,
      threshold: newThreshold,
      currentValue: activeCountry.indicators?.inflationRate ?? activeCountry.macro?.inflation ?? 7.5,
    });

    setNewTitle("");
  };

  const exportReport = (format: "JSON" | "CSV") => {
    const gdpVal = activeCountry.indicators?.gdpNominalUSD ?? activeCountry.macro?.gdp ?? 460;
    const gdpGrowthVal = activeCountry.indicators?.gdpGrowthAnnual ?? activeCountry.macro?.realGdpGrowth ?? 5.8;
    const inflationVal = activeCountry.indicators?.inflationRate ?? activeCountry.macro?.inflation ?? 8.2;
    const rateVal = activeCountry.indicators?.centralBankRate ?? activeCountry.macro?.centralBankRate ?? 8.5;

    const reportData = {
      generatedAt: new Date().toISOString(),
      country: activeCountry.name,
      macro: activeCountry.macro,
      alerts: alerts,
    };

    const dataStr =
      format === "JSON"
        ? "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2))
        : "data:text/csv;charset=utf-8," +
          encodeURIComponent(
            `Indicator,Value\nGDP Nominal,$${gdpVal}B\nGDP Growth,${gdpGrowthVal}%\nInflation CPI,${inflationVal}%\nPolicy Rate,${rateVal}%`
          );

    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `econosphere-report-${activeCountry.code.toLowerCase()}.${format.toLowerCase()}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Personalized Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Economist Dashboard & <span className="text-cyan-400">Alert Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure custom economic alert monitors, track threshold breaches, and export verified institutional research datasets.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReport("JSON")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => exportReport("CSV")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Alert Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-sm text-white">Create Economic Alert Trigger</span>
          </div>

          <form onSubmit={handleCreateAlert} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">Alert Title / Target:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Bangladesh Food Inflation Spike"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Macroeconomic Metric:</label>
              <select
                value={newMetric}
                onChange={(e) => setNewMetric(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Inflation CPI (%)">Inflation CPI (%)</option>
                <option value="Policy Rate (%)">Policy Repo Rate (%)</option>
                <option value="FX Reserves ($B)">Foreign Exchange Reserves ($B)</option>
                <option value="Wholesale Price (BDT/kg)">Wholesale Price (BDT/kg)</option>
                <option value="Oil Price ($/bbl)">Brent Oil Price ($/bbl)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-300 block mb-1">Condition:</label>
                <select
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 font-mono font-bold"
                >
                  <option value=">">Greater than (&gt;)</option>
                  <option value="<">Less than (&lt;)</option>
                  <option value="=">Equals (=)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Threshold Value:</label>
                <input
                  type="number"
                  step="0.1"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow transition-colors"
            >
              Add Active Alert Monitor
            </button>
          </form>
        </div>

        {/* Active Alerts List */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-white">
                Active Economic Monitors ({alerts.length})
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {alerts.filter((a) => a.isTriggered).length} Triggered
            </span>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active alert monitors configured. Add one on the left.
              </div>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    a.isTriggered
                      ? "bg-rose-950/40 border-rose-800/70 text-rose-100"
                      : "bg-slate-950/60 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{a.title}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.2 rounded border ${
                          a.isTriggered
                            ? "bg-rose-900/60 text-rose-200 border-rose-700/60"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {a.isTriggered ? "BREACH TRIGGERED" : "NOMINAL"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Rule: {a.metric} {a.condition} {a.threshold} | Current:{" "}
                      <span className="font-bold text-slate-200">{a.currentValue}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeAlert(a.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
