import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Cpu,
  GraduationCap,
  Scale,
  Award,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { TheoryKnowledgeConcept } from "../../types";
import { THEORY_CONCEPTS } from "../../data/theoryKnowledgeData";

export const TheoryKnowledgeView: React.FC = () => {
  const { aiExplanationLevel, setAiExplanationLevel } = useApp();
  const [concepts, setConcepts] = useState<TheoryKnowledgeConcept[]>(THEORY_CONCEPTS);
  const [selectedConcept, setSelectedConcept] = useState<TheoryKnowledgeConcept>(THEORY_CONCEPTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // AI Interactive Explanation state
  const [customExplanation, setCustomExplanation] = useState<string>("");
  const [isExplaining, setIsExplaining] = useState(false);

  const fetchAiExplanation = async () => {
    setIsExplaining(true);
    setCustomExplanation("");
    try {
      const res = await fetch("/api/ai/theory-explainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptName: selectedConcept.name,
          level: aiExplanationLevel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCustomExplanation(data.explanation);
      }
    } catch (e) {
      setCustomExplanation(
        `[${aiExplanationLevel} Explanation of ${selectedConcept.name}]: ${selectedConcept.summary}`
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const filteredConcepts = concepts.filter((c) => {
    const matchesCat = categoryFilter === "all" || c.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.economists.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto text-neutral-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Foundational & Frontier Econometrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Economics <span className="text-red-500">Knowledge & Theory Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Explore mathematical formulas, foundational models, empirical case studies, and calibrate explanations by academic rigor.
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 bg-[#121318] p-1 border border-white/10 rounded-lg">
          <span className="text-[11px] font-mono text-neutral-400 pl-2">Rigor:</span>
          {(["ELI5", "Beginner", "University", "Advanced", "Professional"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setAiExplanationLevel(lvl);
                setCustomExplanation("");
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                aiExplanationLevel === lvl
                  ? "bg-red-600 text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left List (1 col), Right Detail (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concept Directory */}
        <div className="space-y-4">
          <div className="bg-[#121318] border border-white/10 rounded-xl p-3 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search theory, economist, formula..."
                className="w-full pl-8 pr-2.5 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white placeholder-neutral-500 outline-none font-mono"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1">
              {["all", "Monetary", "Macroeconomics", "Microeconomics", "Trade", "Behavioral"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? "bg-red-600 text-white"
                      : "bg-white/5 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredConcepts.map((concept) => {
              const isSelected = selectedConcept.id === concept.id;
              return (
                <button
                  key={concept.id}
                  onClick={() => {
                    setSelectedConcept(concept);
                    setCustomExplanation("");
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 ${
                    isSelected
                      ? "bg-red-950/40 border-red-500 text-white"
                      : "bg-[#121318] border-white/10 hover:border-white/20 text-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-red-400 font-bold uppercase">{concept.category}</span>
                    <span className="text-neutral-500">{concept.year}</span>
                  </div>
                  <div className="font-bold text-xs text-white">{concept.name}</div>
                  <div className="text-[11px] text-neutral-400 line-clamp-1">{concept.summary}</div>
                  <div className="text-[10px] font-mono text-neutral-500 pt-0.5">
                    By: {concept.economists.join(", ")}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Concept Details Panel (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#121318] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
                  <span className="text-red-400 font-bold">{selectedConcept.category}</span>
                  <span>•</span>
                  <span>Formulated in {selectedConcept.year}</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{selectedConcept.name}</h2>
                <div className="text-xs text-neutral-400 font-mono pt-0.5">
                  Originated by: {selectedConcept.economists.join(" & ")}
                </div>
              </div>

              <button
                onClick={fetchAiExplanation}
                disabled={isExplaining}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExplaining ? "Calibrating..." : `Explain as ${aiExplanationLevel}`}</span>
              </button>
            </div>

            {/* Custom AI Explanation Box if fetched */}
            {customExplanation && (
              <div className="p-4 bg-red-950/30 border border-red-800/40 rounded-xl space-y-2">
                <div className="text-xs font-bold text-red-300 font-mono flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Pedagogy: {aiExplanationLevel} Level</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                  {customExplanation}
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-1">
              <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Concept Summary</div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {selectedConcept.summary}
              </p>
            </div>

            {/* Mathematical Formula Box */}
            {selectedConcept.formula && (
              <div className="p-4 bg-black/60 rounded-xl border border-white/10 space-y-3 font-mono">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="uppercase text-red-400 font-bold">Mathematical Formulation</span>
                  <span>LATEX SPECIFICATION</span>
                </div>
                <div className="p-3 bg-black rounded border border-white/5 text-center text-sm font-bold text-emerald-400">
                  {selectedConcept.formula}
                </div>
                {selectedConcept.parameters && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-300 pt-1">
                    {selectedConcept.parameters.map((p, i) => (
                      <div key={i} className="p-1.5 bg-white/5 rounded">
                        <span className="font-bold text-white">{p.symbol}: </span>
                        <span className="text-neutral-400">{p.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Core Assumptions & Limitations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Key Theoretical Assumptions</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-400 list-disc list-inside">
                  {selectedConcept.assumptions.map((a, i) => (
                    <li key={i} className="leading-relaxed">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-black/30 rounded-xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Criticisms & Empirical Limitations</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-400 list-disc list-inside">
                  {selectedConcept.criticisms.map((c, i) => (
                    <li key={i} className="leading-relaxed">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Real World Application */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-red-400" />
                <span>Real-World Empirical Application</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedConcept.realWorldApplication}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
