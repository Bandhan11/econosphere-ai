import React, { useState } from "react";
import {
  Users2,
  MessageSquare,
  Share2,
  CheckCircle2,
  Send,
  Sparkles,
  FileCode,
  FolderOpen,
} from "lucide-react";

export const CollaborateView: React.FC = () => {
  const [activeBoard, setActiveBoard] = useState("Rangpur Potato Shock 2026 Analysis");
  const [newComment, setNewComment] = useState("");
  const [notes, setNotes] = useState([
    {
      id: "note-1",
      author: "Dr. Farhana Rahman (Policy Lead)",
      role: "Lead Economist",
      text: "The middleman margin spread in the Rangpur potato supply chain is currently 62% above the historical 5-year average. We recommend combining open-market sales (OMS) with cold storage electricity tariff audits.",
      timestamp: "Today at 2:14 PM",
    },
    {
      id: "note-2",
      author: "Prof. Tariq Anam (University of Dhaka)",
      role: "Academic Researcher",
      text: "Our OLS regression confirms that transport freight costs (diesel) explain 48% of the urban retail markup, while asymmetric syndicate hoarding explains 34% of the residual volatility.",
      timestamp: "Today at 3:30 PM",
    },
  ]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        author: "You (Active Economist)",
        role: "Economist Peer",
        text: newComment,
        timestamp: "Just now",
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Users2 className="w-4 h-4" />
            <span>Academic & Institutional Collaboration Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Peer Review & <span className="text-cyan-400">Collaboration Space</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Collaborate on shared policy models, annotate econometric regressions, and distribute assignments across research groups.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Shared Rooms */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <FolderOpen className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-sm text-white">Active Research Workspaces</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              "Rangpur Potato Shock 2026 Analysis",
              "Bangladesh Central Bank Repo Rate Hikes",
              "Solow Convergence in Emerging Asia",
              "DuPont Ratio Decomposition Study",
            ].map((workspace, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBoard(workspace)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  activeBoard === workspace
                    ? "bg-cyan-950/80 border-cyan-700 text-cyan-200 font-semibold"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850"
                }`}
              >
                {workspace}
              </button>
            ))}
          </div>
        </div>

        {/* Notes & Peer Discussion Stream */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="font-bold text-sm text-white">{activeBoard}</h2>
              <p className="text-[11px] text-slate-400">Collaborative Peer Comments & Econometric Findings</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/50">
              Live Room
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{note.author}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                      {note.role}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{note.timestamp}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add policy note, regression critique, or empirical comment..."
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <span>Post Note</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
