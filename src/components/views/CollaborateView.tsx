import React, { useState, useEffect } from "react";
import {
  Users2,
  MessageSquare,
  Send,
  FolderOpen,
  Lock,
  PlusCircle,
  FileText,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface CollaborativeNote {
  id: string;
  workspace: string;
  authorId: string;
  authorName: string;
  authorPersonalId?: string;
  role?: string;
  text: string;
  timestamp: string;
}

export const CollaborateView: React.FC = () => {
  const { currentUser, authToken, setIsAuthModalOpen } = useApp();
  const [activeBoard, setActiveBoard] = useState("Rangpur Potato Shock 2026 Analysis");
  const [newComment, setNewComment] = useState("");
  const [notes, setNotes] = useState<CollaborativeNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch notes from server
  const fetchNotes = async (workspace: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collaborate/notes?workspace=${encodeURIComponent(workspace)}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (e) {
      // offline fallback
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(activeBoard);
  }, [activeBoard]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || !authToken) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/collaborate/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          workspace: activeBoard,
          text: newComment.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.note) {
          setNotes((prev) => [data.note, ...prev]);
        }
        setNewComment("");
      }
    } catch (err) {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Users2 className="w-4 h-4" />
            <span>Academic & Institutional Collaboration Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
            Peer Review & <span className="text-red-500">Collaboration Space</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Collaborate on shared policy models, annotate econometric regressions, and exchange real peer findings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Shared Rooms */}
        <div className="bg-[#141519] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <FolderOpen className="w-4 h-4 text-red-400" />
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
                    ? "bg-red-950/40 border-red-700/80 text-red-200 font-semibold"
                    : "bg-[#0E0F12] border-white/5 text-neutral-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {workspace}
              </button>
            ))}
          </div>
        </div>

        {/* Notes & Peer Discussion Stream */}
        <div className="lg:col-span-2 bg-[#141519] border border-white/10 rounded-xl p-5 space-y-5 flex flex-col justify-between min-h-[420px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h2 className="font-bold text-sm text-white">{activeBoard}</h2>
                <p className="text-[11px] text-neutral-400">Real Scholar Contributions & Econometric Findings</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/50">
                Live Room
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-neutral-400 font-mono">
                Loading research contributions...
              </div>
            ) : notes.length === 0 ? (
              <div className="py-12 px-6 text-center rounded-xl bg-[#0E0F12] border border-dashed border-white/10 space-y-3">
                <FileText className="w-8 h-8 text-neutral-500 mx-auto" />
                <div className="text-sm font-semibold text-neutral-300">
                  No collaborative research notes in this workspace yet.
                </div>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Be the first registered researcher to contribute empirical insights, model calibrations, or policy critiques.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-[#0E0F12] border border-white/10 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{note.authorName}</span>
                        {note.authorPersonalId && (
                          <span className="text-[10px] font-mono text-red-400">
                            {note.authorPersonalId}
                          </span>
                        )}
                        {note.role && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
                            {note.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">{note.timestamp}</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Comment Form or Auth Prompt */}
          <div className="pt-3 border-t border-white/10">
            {currentUser ? (
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Contribute note as ${currentUser.fullName} (${currentUser.personalId})...`}
                  className="flex-1 px-3.5 py-2.5 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>{submitting ? "Saving..." : "Post Note"}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="p-3 bg-[#0C0D10] border border-white/10 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>Log in with your Personal ID to publish collaborative notes.</span>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded transition-colors"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
