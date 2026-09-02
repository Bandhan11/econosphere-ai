import React, { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  DollarSign,
  Search,
  Filter,
  Bot,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";
import { JobListing } from "../../types";

const MOCK_JOBS: JobListing[] = [
  {
    id: "job-1",
    title: "Senior Macroeconomic Forecaster",
    organization: "International Monetary Fund (IMF)",
    location: "Washington, D.C.",
    country: "United States",
    remote: false,
    type: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "$145,000 - $185,000",
    requiredSkills: ["Time Series Econometrics", "Vector Autoregression (VAR)", "Python / R", "Stata"],
    preferredSkills: ["DSGE Modeling", "Multilateral Surveillance Experience"],
    education: "Ph.D. or Master's in Economics",
    description: "Lead surveillance missions and construct dynamic stochastic general equilibrium models for sovereign fiscal and monetary policy assessments.",
    postedDate: "2026-08-25",
    deadline: "2026-09-30",
    category: "Economist",
  },
  {
    id: "job-2",
    title: "Economic Policy & Trade Analyst",
    organization: "Asian Development Bank (ADB)",
    location: "Manila / Dhaka Regional Office",
    country: "Bangladesh",
    remote: true,
    type: "Full-time",
    experienceLevel: "Mid-level",
    salaryRange: "$72,000 - $95,000",
    requiredSkills: ["Bilateral Trade Modeling", "Gravity Equation", "SQL", "Stata / R"],
    preferredSkills: ["LDC Graduation Policy", "Tariff Pass-Through Analysis"],
    education: "Master's in Development Economics",
    description: "Analyze trade agreements, tariff lines, and export diversification strategies for emerging South Asian economies.",
    postedDate: "2026-08-28",
    deadline: "2026-10-15",
    category: "Economic Analyst",
  },
  {
    id: "job-3",
    title: "Central Bank Quantitative Research Fellow",
    organization: "Bangladesh Bank / Policy Research Institute",
    location: "Dhaka",
    country: "Bangladesh",
    remote: false,
    type: "Fellowship",
    experienceLevel: "Entry",
    salaryRange: "৳1,200,000 - ৳1,800,000 / yr",
    requiredSkills: ["Microeconometrics", "Panel Data Analysis", "Excel Modeling", "Python"],
    preferredSkills: ["Food Inflation Pass-Through", "Banking Sector NPL Analytics"],
    education: "Bachelor's or Master's in Economics / Finance",
    description: "Conduct empirical investigations into agricultural wholesale price transmission, interest rate pass-through, and sovereign debt sustainability.",
    postedDate: "2026-08-30",
    deadline: "2026-10-05",
    category: "Research Assistant",
  },
  {
    id: "job-4",
    title: "Quantitative Commodities Strategist",
    organization: "Morgan Stanley / Global Macro Research",
    location: "London / Singapore",
    country: "United Kingdom",
    remote: true,
    type: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "£120,000 - £160,000 + Bonus",
    requiredSkills: ["Commodity Futures", "Econometrics", "Python", "SQL", "Bloomberg API"],
    preferredSkills: ["Energy Derivatives", "Geopolitical Risk Indexing"],
    education: "M.Sc. in Financial Economics or Econometrics",
    description: "Develop automated high-frequency models forecasting crude oil, agricultural commodities, and industrial metal price cycles.",
    postedDate: "2026-09-01",
    deadline: "2026-10-20",
    category: "Economist",
  },
  {
    id: "job-5",
    title: "Data & Labor Market Analyst",
    organization: "International Labour Organization (ILO)",
    location: "Geneva",
    country: "Switzerland",
    remote: true,
    type: "Contract",
    experienceLevel: "Mid-level",
    salaryRange: "$80,000 - $105,000",
    requiredSkills: ["Household Survey Microdata", "Stata", "R", "Welfare Economics"],
    preferredSkills: ["Informal Labor Analytics", "Gender Wage Gap Models"],
    education: "Master's in Economics / Statistics",
    description: "Harmonize international labor force surveys and evaluate minimum wage impacts across low and middle-income nations.",
    postedDate: "2026-08-20",
    deadline: "2026-09-28",
    category: "Data Analyst",
  },
];

export const CareerView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"jobs" | "skills" | "cv" | "advisor">("jobs");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [jobSearch, setJobSearch] = useState<string>("");

  // AI Advisor State
  const [targetRole, setTargetRole] = useState<string>("Economic Policy Analyst");
  const [education, setEducation] = useState<string>("B.Sc. in Economics");
  const [experience, setExperience] = useState<string>("2 years academic research & data analytics");
  const [advisorLoading, setAdvisorLoading] = useState<boolean>(false);
  const [advisorOutput, setAdvisorOutput] = useState<string | null>(null);

  // Interactive CV State
  const [cvData, setCvData] = useState({
    fullName: "Ayesha Rahman",
    title: "Associate Macroeconomist & Econometrician",
    email: "ayesha.rahman@example.org",
    phone: "+880 1711 000000",
    location: "Dhaka, Bangladesh",
    summary:
      "Empirically oriented economist specialized in time-series forecasting, food inflation pass-through, and trade gravity modeling. Proficient in Stata, R, Python, and SQL for institutional policy analysis.",
    education: [
      { degree: "M.Sc. in Applied Economics", school: "University of Dhaka", year: "2024 - 2025" },
      { degree: "B.Sc. in Economics & Statistics", school: "Jahangirnagar University", year: "2020 - 2024" },
    ],
    experience: [
      {
        role: "Junior Research Associate",
        org: "Policy Research Institute (PRI)",
        period: "2024 - Present",
        bullet: "Constructed multivariate OLS models evaluating fuel price transmission to rural consumer food baskets across 8 administrative divisions.",
      },
      {
        role: "Econometrics Teaching Assistant",
        org: "University Department of Economics",
        period: "2023 - 2024",
        bullet: "Led lab seminars covering Gauss-Markov assumptions, instrumental variable identification, and panel fixed effects in Stata.",
      },
    ],
    skills: ["Time Series & ARIMA", "Panel Econometrics", "Stata", "Python (Pandas, Statsmodels)", "R (fixest)", "SQL", "Policy Brief Writing"],
  });

  const filteredJobs = MOCK_JOBS.filter((j) => {
    const matchCat = selectedCategory === "All" || j.category === selectedCategory;
    const matchSearch =
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.organization.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleRunAdvisor = async () => {
    setAdvisorLoading(true);
    try {
      const res = await fetch("/api/ai/career-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          education,
          experience,
          currentSkills: cvData.skills,
        }),
      });
      const data = await res.json();
      setAdvisorOutput(data.advice);
    } catch (err) {
      setAdvisorOutput(`### Professional Career Roadmap: ${targetRole}\n\n**1. Technical Benchmark:**\nTop institutions require proficiency in reproducible econometric scripting (R fixest or Stata) alongside relational SQL.\n\n**2. High-Impact Actionable Step:**\nPublish a reproducible policy note on food price transmission and upload the clean dataset and script to your personal research portfolio.`);
    } finally {
      setAdvisorLoading(false);
    }
  };

  const handlePrintCV = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#141519] border border-white/15 p-6 shadow-2xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-2">
              <Briefcase className="w-3.5 h-3.5 text-red-500" />
              <span>Career Center & Labor Market Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-black text-white tracking-tight">
              Economist Career Center & CV Studio
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl font-light">
              Explore global openings across central banks, think tanks, multilaterals, and financial institutions, benchmark econometric skills, and generate institutional CVs.
            </p>
          </div>

          {/* Sub Tab Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "jobs", label: "Job Openings", icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: "skills", label: "Skills Matrix", icon: <GraduationCap className="w-3.5 h-3.5" /> },
              { id: "cv", label: "Interactive CV Builder", icon: <FileText className="w-3.5 h-3.5" /> },
              { id: "advisor", label: "AI Career Advisor", icon: <Bot className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap ${
                  activeSubTab === tab.id
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

      {/* Sub Tab 1: Global Job Openings */}
      {activeSubTab === "jobs" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141519] border border-white/10 p-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Search job title, multilateral agency, or country..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#0C0D10] border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {["All", "Economist", "Economic Analyst", "Research Assistant", "Data Analyst"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-mono uppercase border transition-colors ${
                    selectedCategory === cat
                      ? "bg-white/10 text-white border-white/30 font-bold"
                      : "bg-[#0C0D10] text-neutral-400 border-white/10 hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#141519] border border-white/15 p-5 hover:border-red-600/50 transition-all space-y-4 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
                      <Building2 className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-white font-bold">{job.organization}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{job.location}</span>
                      {job.remote && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                          Remote Friendly
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-serif italic font-bold text-white mt-1 group-hover:text-red-400 transition-colors">
                      {job.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm font-bold text-emerald-400">{job.salaryRange}</div>
                    <div className="text-[10px] font-mono text-neutral-400">Deadline: {job.deadline}</div>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mr-1">
                      Required Skills:
                    </span>
                    {job.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 bg-[#0C0D10] text-neutral-200 border border-white/10 font-mono text-[10px]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => alert(`Application for "${job.title}" at ${job.organization} has been bookmarked in your profile.`)}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                  >
                    Apply Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab 2: Skills Intelligence Matrix */}
      {activeSubTab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Econometric & Statistical Tools",
              skills: [
                { name: "Stata", importance: "95%", usage: "Panel Data, Microeconometrics, IV, DiD" },
                { name: "R (tidyverse, fixest)", importance: "90%", usage: "Fast panel regressions & high-dimensional fixed effects" },
                { name: "Python (pandas, statsmodels)", importance: "88%", usage: "Machine learning, NLP news analysis, scraping" },
                { name: "SQL", importance: "82%", usage: "Relational querying of banking & enterprise transactions" },
              ],
            },
            {
              title: "Theoretical & Policy Frameworks",
              skills: [
                { name: "Time Series & Forecasting (ARIMA, VAR)", importance: "92%", usage: "Inflation, exchange rate, and GDP quarterly paths" },
                { name: "Bilateral Trade & Gravity Equations", importance: "85%", usage: "Tariff incidence, export elasticity, LDC graduation" },
                { name: "DSGE / Taylor Rule Calibrations", importance: "80%", usage: "Central bank monetary reaction functions" },
                { name: "Debt Sustainability Frameworks (DSA)", importance: "86%", usage: "External and public debt solvency ratios" },
              ],
            },
            {
              title: "Soft Skills & Institutional Deliverables",
              skills: [
                { name: "Executive Policy Briefs", importance: "98%", usage: "Distilling 80-page reports into 2-page cabinet memos" },
                { name: "Data Provenance & Audit Trails", importance: "90%", usage: "Replicable empirical research and script documentation" },
                { name: "Visual Data Storytelling", importance: "88%", usage: "High-contrast charts for non-economist policymakers" },
                { name: "Multilateral Consensus Building", importance: "84%", usage: "Harmonizing stakeholder models under uncertainty" },
              ],
            },
          ].map((cat) => (
            <div key={cat.title} className="bg-[#141519] border border-white/15 p-5 space-y-4">
              <div className="font-serif italic font-bold text-white text-base pb-2 border-b border-white/10">
                {cat.title}
              </div>
              <div className="space-y-3">
                {cat.skills.map((sk) => (
                  <div key={sk.name} className="p-3 bg-[#0C0D10] border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-white">{sk.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">Demand: {sk.importance}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans">{sk.usage}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub Tab 3: Interactive CV Builder & Printable View */}
      {activeSubTab === "cv" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CV Editor Controls */}
          <div className="bg-[#141519] border border-white/15 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="font-serif italic font-bold text-white text-base">
                Economist CV Editor
              </div>
              <button
                onClick={handlePrintCV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={cvData.fullName}
                  onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#0C0D10] border border-white/15 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={cvData.title}
                  onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#0C0D10] border border-white/15 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Email</label>
                  <input
                    type="text"
                    value={cvData.email}
                    onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#0C0D10] border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={cvData.location}
                    onChange={(e) => setCvData({ ...cvData, location: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#0C0D10] border border-white/15 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Executive Summary</label>
                <textarea
                  rows={3}
                  value={cvData.summary}
                  onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#0C0D10] border border-white/15 text-white text-xs font-sans"
                />
              </div>
            </div>
          </div>

          {/* Institutional CV Document Live Preview */}
          <div
            id="printable-cv"
            className="bg-white text-[#111] p-8 shadow-2xl border border-neutral-300 font-serif min-h-[500px] text-xs space-y-5 rounded-none"
          >
            {/* CV Header */}
            <div className="border-b-2 border-neutral-900 pb-3">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-black">{cvData.fullName}</h2>
              <div className="text-xs font-sans text-neutral-700 font-medium tracking-wide mt-0.5">{cvData.title}</div>
              <div className="text-[10px] font-mono text-neutral-600 mt-1 flex items-center gap-3">
                <span>{cvData.email}</span>
                <span>•</span>
                <span>{cvData.phone}</span>
                <span>•</span>
                <span>{cvData.location}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-0.5">
                Executive Profile
              </h3>
              <p className="text-[11px] font-sans leading-relaxed text-neutral-800">{cvData.summary}</p>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-0.5">
                Professional & Research Experience
              </h3>
              {cvData.experience.map((exp, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                    <span>{exp.role} — {exp.org}</span>
                    <span className="font-mono text-[10px] font-normal">{exp.period}</span>
                  </div>
                  <p className="text-[11px] font-sans text-neutral-700 leading-relaxed">• {exp.bullet}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-0.5">
                Education
              </h3>
              {cvData.education.map((edu, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="font-bold text-neutral-900">{edu.degree}</span>
                    <span className="text-neutral-600 ml-1">({edu.school})</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500">{edu.year}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="space-y-1">
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-0.5">
                Econometric & Technical Methodologies
              </h3>
              <div className="text-[11px] font-sans text-neutral-800 leading-relaxed">
                {cvData.skills.join(" • ")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 4: AI Career Advisor */}
      {activeSubTab === "advisor" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#141519] border border-white/15 p-5 space-y-4">
            <div className="font-serif italic font-bold text-white text-base pb-2 border-b border-white/10 flex items-center gap-2">
              <Bot className="w-4 h-4 text-red-500" />
              <span>Configure Career Parameters</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Aspirational Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 text-white font-mono"
                  placeholder="e.g. Senior IMF Economist, Central Bank Analyst..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Current Academic Background</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Years & Nature of Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 text-white font-mono"
                />
              </div>

              <button
                onClick={handleRunAdvisor}
                disabled={advisorLoading}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {advisorLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{advisorLoading ? "Consulting Advisor..." : "Generate Career Roadmap"}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#141519] border border-white/15 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
                AI Career Roadmap & Skill Gap Assessment
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-red-950/40 text-red-300 border border-red-800/40 uppercase">
                Institutional Benchmark
              </span>
            </div>

            {advisorOutput ? (
              <div className="bg-[#0C0D10] border border-white/10 p-5 rounded-sm text-xs font-mono text-neutral-200 whitespace-pre-line leading-relaxed">
                {advisorOutput}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-400 space-y-2">
                <Bot className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="text-xs">
                  Set your target role on the left and click "Generate Career Roadmap" for a bespoke institutional evaluation.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
