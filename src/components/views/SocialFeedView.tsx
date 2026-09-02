import React, { useState, useEffect } from "react";
import {
  Send,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Repeat,
  Share2,
  Bookmark,
  CheckCircle2,
  Filter,
  Search,
  PlusCircle,
  HelpCircle,
  BarChart2,
  BookOpen,
  PieChart,
  TrendingUp,
  AlertTriangle,
  Globe,
  Sliders,
  UserCheck,
  UserPlus,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SocialPost, EconomicPostType, EconomicCategory, EconomicScaleLevel, UserProfile } from "../../types";

export const SocialFeedView: React.FC = () => {
  const {
    currentUser,
    viewUserProfile,
    followUser,
    connectUser,
    setIsAuthModalOpen,
  } = useApp();

  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [directoryScholars, setDirectoryScholars] = useState<UserProfile[]>([]);
  const [loadingDirectory, setLoadingDirectory] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedScale, setSelectedScale] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch registered scholars
  const fetchDirectory = async () => {
    setLoadingDirectory(true);
    try {
      const res = await fetch("/api/users/directory");
      if (res.ok) {
        const data = await res.json();
        setDirectoryScholars(data.users || []);
      }
    } catch (e) {
      setDirectoryScholars([]);
    } finally {
      setLoadingDirectory(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  // Post Creator State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<EconomicPostType>("article");
  const [postCategory, setPostCategory] = useState<EconomicCategory>("Macroeconomics");
  const [postScale, setPostScale] = useState<EconomicScaleLevel>("national");
  const [taggedIndicatorsInput, setTaggedIndicatorsInput] = useState("Inflation CPI, Food Index");
  const [methodology, setMethodology] = useState("BBS Time-Series & Spread Model");
  const [sourcesInput, setSourcesInput] = useState("Bangladesh Bureau of Statistics, Central Bank");

  // Poll state
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOption1, setPollOption1] = useState("Tighten further (+50 bps)");
  const [pollOption2, setPollOption2] = useState("Hold current repo rate");
  const [pollOption3, setPollOption3] = useState("Initiate targeted rate cuts");

  // AI Assistant state
  const [isImprovingAI, setIsImprovingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    critique?: string;
    improvedContent?: string;
    suggestedIndicators?: string[];
    missingVariables?: string[];
  } | null>(null);

  // Expanded comment threads
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedScale !== "all") params.append("scale", selectedScale);
      if (selectedType !== "all") params.append("postType", selectedType);

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (e) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedScale, selectedType]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!postTitle.trim() || !postContent.trim()) return;

    const taggedIndicators = taggedIndicatorsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const sources = sourcesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let poll = undefined;
    if (postType === "poll" && pollQuestion) {
      poll = {
        question: pollQuestion,
        options: [
          { text: pollOption1, votes: 0 },
          { text: pollOption2, votes: 0 },
          { text: pollOption3, votes: 0 },
        ].filter((o) => o.text.trim()),
        totalVotes: 0,
        hasVoted: false,
      };
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("econosphere_token") || ""}`,
        },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          postType,
          category: postCategory,
          scale: postScale,
          taggedIndicators,
          methodology,
          sources,
          poll,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPosts([data.post, ...posts]);
        setPostTitle("");
        setPostContent("");
        setAiSuggestions(null);
        setIsComposerOpen(false);
      }
    } catch (e) {
      // Local fallback
    }
  };

  const handleAiImprove = async () => {
    if (!postContent.trim()) return;
    setIsImprovingAI(true);
    setAiSuggestions(null);
    try {
      const res = await fetch("/api/ai/improve-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftContent: postContent,
          category: postCategory,
          postType,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(data);
      }
    } catch (e) {
      // fallback
    } finally {
      setIsImprovingAI(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("econosphere_token") || ""}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, isLiked: data.isLiked, likesCount: data.likesCount }
              : p
          )
        );
      }
    } catch (e) {
      // Local toggle
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
            : p
        )
      );
    }
  };

  const handleVote = async (postId: string, optionIndex: number) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("econosphere_token") || ""}`,
        },
        body: JSON.stringify({ optionIndex }),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, poll: data.poll } : p))
        );
      }
    } catch (e) {
      //
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("econosphere_token") || ""}`,
        },
        body: JSON.stringify({ content: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [...p.comments, data.comment],
                  commentsCount: p.commentsCount + 1,
                }
              : p
          )
        );
        setNewCommentText({ ...newCommentText, [postId]: "" });
      }
    } catch (e) {
      //
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.authorName.toLowerCase().includes(q) ||
      post.authorPersonalId.toLowerCase().includes(q) ||
      post.taggedIndicators.some((ind) => ind.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto text-neutral-200">
      {/* Platform Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Academic Economics Network & Peer Publishing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Social Economics <span className="text-red-500">Intelligence Feed</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Publish empirical findings, peer-review econometric hypotheses, run consensus polls, and discover research by Personal ID.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsComposerOpen(!isComposerOpen)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-2 shadow transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isComposerOpen ? "Collapse Composer" : "Publish Research / Insight"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Column (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Post Composer Card */}
          {isComposerOpen && (
            <div className="bg-[#121318] border border-red-900/40 rounded-xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                    ES
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      Publishing as: {currentUser?.fullName || "Visiting Scholar"}
                    </span>
                    <span className="text-[10px] font-mono text-red-400 block">
                      ID: {currentUser?.personalId || "Guest"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleAiImprove}
                  disabled={isImprovingAI || !postContent.trim()}
                  className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 text-xs font-medium rounded flex items-center gap-1.5 transition-colors disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>{isImprovingAI ? "Reviewing..." : "AI Hypothesis Check"}</span>
                </button>
              </div>

              {/* AI Suggestion Banner */}
              {aiSuggestions && (
                <div className="p-3.5 bg-red-950/30 border border-red-800/40 rounded text-xs space-y-2">
                  <div className="font-bold text-red-300 flex items-center gap-1.5 font-mono text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Economist Peer-Review Review</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">{aiSuggestions.critique}</p>

                  {aiSuggestions.missingVariables && aiSuggestions.missingVariables.length > 0 && (
                    <div className="text-[11px] text-neutral-400">
                      <span className="text-neutral-300 font-semibold">Suggested variables: </span>
                      {aiSuggestions.missingVariables.join(", ")}
                    </div>
                  )}

                  {aiSuggestions.improvedContent && (
                    <button
                      type="button"
                      onClick={() => setPostContent(aiSuggestions.improvedContent!)}
                      className="text-[11px] text-red-400 underline hover:text-red-300 font-mono"
                    >
                      Apply suggested econometric phrasing
                    </button>
                  )}
                </div>
              )}

              <form onSubmit={handleCreatePost} className="space-y-3">
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Title of research finding, empirical inquiry, or hypothesis..."
                  className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white outline-none font-semibold"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Post Type</label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value as EconomicPostType)}
                      className="w-full px-2.5 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                    >
                      <option value="article">Formal Article</option>
                      <option value="quick_thought">Quick Thought / Note</option>
                      <option value="chart_analysis">Chart & Spread Analysis</option>
                      <option value="simulation_result">Simulation Result</option>
                      <option value="poll">Consensus Poll</option>
                      <option value="indicator_alert">Indicator Warning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Category</label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value as EconomicCategory)}
                      className="w-full px-2.5 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                    >
                      <option value="Macroeconomics">Macroeconomics</option>
                      <option value="Microeconomics">Microeconomics</option>
                      <option value="Development Economics">Development Economics</option>
                      <option value="Monetary Economics">Monetary Economics</option>
                      <option value="International Trade">International Trade</option>
                      <option value="Agricultural Economics">Agricultural Economics</option>
                      <option value="Labor Economics">Labor Economics</option>
                      <option value="Behavioral Economics">Behavioral Economics</option>
                      <option value="Financial Economics">Financial Economics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Scale Level</label>
                    <select
                      value={postScale}
                      onChange={(e) => setPostScale(e.target.value as EconomicScaleLevel)}
                      className="w-full px-2.5 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                    >
                      <option value="household">Household / Micro</option>
                      <option value="local">Local Market / Hat</option>
                      <option value="district">District / Division</option>
                      <option value="national">National Macro</option>
                      <option value="global">Global / Trade</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={4}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Detail your economic reasoning, transmission mechanism, empirical data, or debate question..."
                  className="w-full p-3 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white outline-none leading-relaxed"
                />

                {/* Poll configuration if Poll is selected */}
                {postType === "poll" && (
                  <div className="p-3 bg-black/40 border border-white/10 rounded space-y-2">
                    <div className="text-xs font-bold text-neutral-200">Poll Question & Options</div>
                    <input
                      type="text"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      placeholder="e.g. What policy rate decision should Bangladesh Bank make at the next MPC?"
                      className="w-full px-2.5 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={pollOption1}
                        onChange={(e) => setPollOption1(e.target.value)}
                        placeholder="Option 1"
                        className="px-2.5 py-1 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        value={pollOption2}
                        onChange={(e) => setPollOption2(e.target.value)}
                        placeholder="Option 2"
                        className="px-2.5 py-1 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        value={pollOption3}
                        onChange={(e) => setPollOption3(e.target.value)}
                        placeholder="Option 3"
                        className="px-2.5 py-1 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 mb-1">Tagged Indicators</label>
                    <input
                      type="text"
                      value={taggedIndicatorsInput}
                      onChange={(e) => setTaggedIndicatorsInput(e.target.value)}
                      placeholder="CPI, Policy Rate"
                      className="w-full px-2.5 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 mb-1">Methodology</label>
                    <input
                      type="text"
                      value={methodology}
                      onChange={(e) => setMethodology(e.target.value)}
                      placeholder="OLS Regression, Equilibrium"
                      className="w-full px-2.5 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 mb-1">Data Sources (Verified)</label>
                    <input
                      type="text"
                      value={sourcesInput}
                      onChange={(e) => setSourcesInput(e.target.value)}
                      placeholder="BBS, Bangladesh Bank"
                      className="w-full px-2.5 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    className="px-3 py-1.5 bg-transparent hover:bg-white/10 text-neutral-400 text-xs rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish to Feed</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Feed Filter Bar */}
          <div className="bg-[#121318] border border-white/10 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Filter className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">Filter:</span>
              </div>

              <select
                value={selectedScale}
                onChange={(e) => setSelectedScale(e.target.value)}
                className="bg-[#0C0D10] border border-white/15 rounded px-2 py-1 text-neutral-300 text-xs outline-none"
              >
                <option value="all">All Scales</option>
                <option value="household">Household</option>
                <option value="local">Local Market</option>
                <option value="district">District</option>
                <option value="national">National</option>
                <option value="global">Global</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#0C0D10] border border-white/15 rounded px-2 py-1 text-neutral-300 text-xs outline-none"
              >
                <option value="all">All Topics</option>
                <option value="Macroeconomics">Macroeconomics</option>
                <option value="Agricultural Economics">Agricultural Economics</option>
                <option value="Monetary Economics">Monetary Economics</option>
                <option value="Development Economics">Development</option>
                <option value="International Trade">Trade</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#0C0D10] border border-white/15 rounded px-2 py-1 text-neutral-300 text-xs outline-none"
              >
                <option value="all">All Post Types</option>
                <option value="article">Articles</option>
                <option value="poll">Polls</option>
                <option value="simulation_result">Simulations</option>
                <option value="indicator_alert">Alerts</option>
              </select>
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, Personal ID, tags..."
                className="w-full pl-8 pr-2.5 py-1 bg-[#0C0D10] border border-white/15 rounded text-xs text-white placeholder-neutral-500 outline-none font-mono"
              />
            </div>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-400 font-mono">
              Fetching economic publications...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-8 text-center bg-[#121318] border border-white/10 rounded-xl space-y-2">
              <BookOpen className="w-8 h-8 text-neutral-500 mx-auto" />
              <div className="text-sm font-semibold text-white">No Publications Found</div>
              <p className="text-xs text-neutral-400">
                Adjust filters or be the first to publish an empirical inquiry in this category.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#121318] border border-white/10 rounded-xl p-5 space-y-4 hover:border-white/20 transition-all shadow-sm"
              >
                {/* Author Meta Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover bg-neutral-800 border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => viewUserProfile(post.authorPersonalId)}
                          className="text-sm font-bold text-white hover:text-red-400 transition-colors text-left"
                        >
                          {post.authorName}
                        </button>
                        {post.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" title="Verified Scholar" />
                        )}
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                          {post.authorRole}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                        <button
                          onClick={() => viewUserProfile(post.authorPersonalId)}
                          className="text-red-400 hover:underline font-bold"
                        >
                          {post.authorPersonalId}
                        </button>
                        <span>•</span>
                        <span className="truncate max-w-[200px]">{post.authorInstitution}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Badges */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-950/40 border border-red-900/40 text-red-300">
                      {post.scale} scale
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{post.category}</span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Poll View if Post has Poll */}
                {post.poll && (
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3 font-mono text-xs">
                    <div className="font-bold text-white flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-red-400" />
                      <span>{post.poll.question}</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {post.poll.options.map((opt, optIdx) => {
                        const total = post.poll?.totalVotes || 0;
                        const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                        const isVoted = post.poll?.hasVoted && post.poll?.userVotedIndex === optIdx;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleVote(post.id, optIdx)}
                            className={`w-full text-left p-2.5 rounded border transition-all relative overflow-hidden flex items-center justify-between ${
                              isVoted
                                ? "border-red-500 bg-red-950/30 text-white font-bold"
                                : "border-white/10 bg-white/5 hover:bg-white/10 text-neutral-200"
                            }`}
                          >
                            {/* Background percentage fill */}
                            <div
                              className="absolute top-0 bottom-0 left-0 bg-red-600/20 transition-all duration-500 pointer-events-none"
                              style={{ width: `${pct}%` }}
                            />
                            <span className="relative z-10">{opt.text}</span>
                            <span className="relative z-10 text-[11px] font-bold text-red-400">
                              {pct}% ({opt.votes})
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-neutral-500 text-right">
                      {post.poll.totalVotes} total verified scholar votes
                    </div>
                  </div>
                )}

                {/* Tagged Indicators & Methodology Strip */}
                <div className="space-y-2 pt-1">
                  {post.taggedIndicators && post.taggedIndicators.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.taggedIndicators.map((ind, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300"
                        >
                          📊 {ind}
                        </span>
                      ))}
                    </div>
                  )}

                  {(post.methodology || (post.sources && post.sources.length > 0)) && (
                    <div className="p-2.5 bg-black/20 rounded border border-white/5 font-mono text-[10px] text-neutral-400 flex flex-wrap gap-x-4 gap-y-1">
                      {post.methodology && (
                        <div>
                          <span className="text-neutral-500">Method: </span>
                          <span className="text-neutral-300">{post.methodology}</span>
                        </div>
                      )}
                      {post.sources && post.sources.length > 0 && (
                        <div>
                          <span className="text-neutral-500">Sources: </span>
                          <span className="text-neutral-300">{post.sources.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Interaction Footer Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-neutral-400 font-mono">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.isLiked ? "text-red-400 font-bold" : "hover:text-white"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      <span>{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                      }
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentsCount} Comments</span>
                    </button>

                    <button
                      onClick={() => alert(`Research publication URL with Personal ID ${post.authorPersonalId} copied.`)}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                      title="Share Citation"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Cite</span>
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                    }
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white"
                  >
                    <span>{expandedComments[post.id] ? "Hide" : "Discussion"}</span>
                    {expandedComments[post.id] ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Comments Thread Accordion */}
                {expandedComments[post.id] && (
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="space-y-2.5">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-3 bg-[#0E0F12] border border-white/5 rounded-lg space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white">{comment.authorName}</span>
                                <button
                                  onClick={() => viewUserProfile(comment.authorPersonalId)}
                                  className="font-mono text-red-400 hover:underline text-[10px]"
                                >
                                  {comment.authorPersonalId}
                                </button>
                                {comment.authorRole && (
                                  <span className="text-[9px] px-1 rounded bg-white/10 text-neutral-300">
                                    {comment.authorRole}
                                  </span>
                                )}
                              </div>
                              <span className="text-neutral-500 font-mono text-[10px]">
                                {comment.createdAt}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-300 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-2 text-xs text-neutral-500 font-mono">
                          No peer comments yet. Be the first to analyze this hypothesis.
                        </div>
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newCommentText[post.id] || ""}
                        onChange={(e) =>
                          setNewCommentText({ ...newCommentText, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                        placeholder="Add academic peer comment or critique..."
                        className="flex-1 px-3 py-1.5 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Sidebar: Scholar Discovery & Personal IDs (1 col) */}
        <div className="space-y-5">
          {/* Active User Mini Identity Card */}
          <div className="bg-[#121318] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">
              Active EconoSphere Identity
            </div>
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="font-bold text-white text-sm">{currentUser.fullName}</div>
                    <div className="font-mono text-xs text-red-400 font-bold">
                      {currentUser.personalId}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                      {currentUser.institution}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px] p-2 bg-black/30 rounded border border-white/5">
                  <div>
                    <div className="text-neutral-500 text-[10px]">Followers</div>
                    <div className="font-bold text-white">{currentUser.followersCount}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-[10px]">Following</div>
                    <div className="font-bold text-white">{currentUser.followingCount}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-[10px]">Connections</div>
                    <div className="font-bold text-white">{currentUser.connectionsCount}</div>
                  </div>
                </div>

                <button
                  onClick={() => viewUserProfile(currentUser.personalId)}
                  className="w-full py-1.5 text-xs font-semibold rounded bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-colors"
                >
                  View My Public Profile
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <p className="text-neutral-400">
                  Join the academic network to publish articles, vote on policy polls, and collaborate on models.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded"
                >
                  Log In or Register
                </button>
              </div>
            )}
          </div>

          {/* Certified Economists Directory */}
          <div className="bg-[#121318] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <UserCheck className="w-4 h-4 text-red-400" />
                <span>Certified Economists Directory</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Real Registered</span>
            </div>

            <div className="space-y-3">
              {loadingDirectory ? (
                <div className="py-6 text-center text-xs text-neutral-500 font-mono">
                  Loading registered scholars...
                </div>
              ) : directoryScholars.length === 0 ? (
                <div className="py-6 px-3 text-center rounded-lg bg-black/20 border border-dashed border-white/10 space-y-2">
                  <div className="text-xs font-semibold text-neutral-300">No users yet.</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Be the first real economist to create an account and obtain a unique Personal ID.
                  </p>
                  {!currentUser && (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="mt-1 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded transition-colors"
                    >
                      Register Profile
                    </button>
                  )}
                </div>
              ) : (
                directoryScholars
                  .filter((s) => s.id !== currentUser?.id)
                  .map((scholar) => {
                    const isFollowing = currentUser?.following?.includes(scholar.id) || false;
                    const isConnected = currentUser?.connections?.includes(scholar.id) || false;

                    return (
                      <div
                        key={scholar.id}
                        className="p-2.5 rounded bg-black/30 border border-white/5 hover:border-white/15 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={scholar.avatarUrl}
                              alt={scholar.fullName}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-lg object-cover"
                            />
                            <div>
                              <button
                                onClick={() => viewUserProfile(scholar.personalId)}
                                className="text-xs font-bold text-white hover:text-red-400 text-left block"
                              >
                                {scholar.fullName}
                              </button>
                              <div className="text-[10px] font-mono text-red-400 font-bold">
                                {scholar.personalId}
                              </div>
                              <div className="text-[10px] text-neutral-400 truncate max-w-[160px]">
                                {scholar.institution}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => followUser(scholar.id)}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded transition-colors flex items-center justify-center gap-1 ${
                              isFollowing
                                ? "bg-neutral-800 text-neutral-300"
                                : "bg-red-600/80 hover:bg-red-500 text-white"
                            }`}
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>{isFollowing ? "Following" : "Follow"}</span>
                          </button>

                          <button
                            onClick={() => connectUser(scholar.id)}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-colors flex items-center justify-center gap-1 ${
                              isConnected
                                ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                                : "border-white/10 hover:bg-white/10 text-neutral-300"
                            }`}
                          >
                            <Users className="w-3 h-3" />
                            <span>{isConnected ? "Connected" : "Connect"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
