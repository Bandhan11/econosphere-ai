import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserCheck,
  Award,
  Globe2,
  FileText,
  Lock,
  Cpu,
  CheckCircle2,
  MapPin,
  Building,
  GraduationCap,
  BookOpen,
  Users,
  UserPlus,
  UserMinus,
  Edit3,
  Share2,
  Sparkles,
  Link,
  MessageSquare,
  ThumbsUp,
  BarChart2,
  AlertCircle,
  Save,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { UserProfile, SocialPost } from "../../types";

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    targetProfileUser,
    setTargetProfileUser,
    followUser,
    connectUser,
    updateProfile,
    personalLabs,
    setIsAuthModalOpen,
  } = useApp();

  // Profile to display: target user if set, otherwise current authenticated user
  const profileUser: UserProfile | null = targetProfileUser || currentUser;
  const isOwnProfile = !targetProfileUser || (currentUser && targetProfileUser.id === currentUser.id);

  const [activeTab, setActiveTab] = useState<"publications" | "labs" | "network" | "edit" | "integrity">("publications");
  const [userPosts, setUserPosts] = useState<SocialPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Edit profile state
  const [editBio, setEditBio] = useState(profileUser?.bio || "");
  const [editRole, setEditRole] = useState(profileUser?.professionalRole || "");
  const [editInstitution, setEditInstitution] = useState(profileUser?.institution || "");
  const [editEducation, setEditEducation] = useState(profileUser?.education || "");
  const [editCity, setEditCity] = useState(profileUser?.city || "");
  const [editCountry, setEditCountry] = useState(profileUser?.country || "");
  const [editSkills, setEditSkills] = useState(profileUser?.skills?.join(", ") || "");
  const [editInterests, setEditInterests] = useState(profileUser?.researchInterests?.join(", ") || "");
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    if (profileUser) {
      setEditBio(profileUser.bio || "");
      setEditRole(profileUser.professionalRole || "");
      setEditInstitution(profileUser.institution || "");
      setEditEducation(profileUser.education || "");
      setEditCity(profileUser.city || "");
      setEditCountry(profileUser.country || "");
      setEditSkills(profileUser.skills?.join(", ") || "");
      setEditInterests(profileUser.researchInterests?.join(", ") || "");
    }
  }, [profileUser]);

  // Load posts by this user
  useEffect(() => {
    if (!profileUser) return;
    setLoadingPosts(true);
    fetch(`/api/posts?authorId=${encodeURIComponent(profileUser.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.posts) {
          setUserPosts(data.posts);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPosts(false));
  }, [profileUser?.id]);

  if (!profileUser) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
          <UserCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Profile Selected</h2>
        <p className="text-sm text-neutral-400">
          Sign in to access your researcher identity, or select an economist from the discovery feed.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const isFollowing = currentUser?.following?.includes(profileUser.id) || false;
  const isConnected = currentUser?.connections?.includes(profileUser.id) || false;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving changes...");
    const skillsArr = editSkills.split(",").map((s) => s.trim()).filter(Boolean);
    const interestsArr = editInterests.split(",").map((s) => s.trim()).filter(Boolean);

    const res = await updateProfile({
      bio: editBio,
      professionalRole: editRole,
      institution: editInstitution,
      education: editEducation,
      city: editCity,
      country: editCountry,
      skills: skillsArr,
      researchInterests: interestsArr,
    });

    if (res.success) {
      setSaveStatus("Profile updated successfully.");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("Error updating: " + res.error);
    }
  };

  const copyPersonalId = () => {
    navigator.clipboard?.writeText(profileUser.personalId);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-5xl mx-auto text-neutral-200 relative">
      {/* Toast Feedback */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-neutral-900 border border-emerald-500/60 text-emerald-400 text-xs font-mono rounded shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Personal ID {profileUser.personalId} copied to clipboard!</span>
        </div>
      )}

      {/* Back button if viewing another user's profile */}
      {targetProfileUser && currentUser && targetProfileUser.id !== currentUser.id && (
        <button
          onClick={() => setTargetProfileUser(null)}
          className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          ← Return to My Account Profile
        </button>
      )}

      {/* Hero Profile Banner */}
      <div className="bg-[#121318] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* Decorative Top Accent */}
        <div className="h-28 bg-gradient-to-r from-neutral-900 via-red-950/40 to-neutral-900 border-b border-white/10 relative">
          <div className="absolute top-3 right-4 flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/60 border border-white/10 text-neutral-300">
              ECONOSPHERE IDENTIFIER
            </span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={profileUser.avatarUrl}
                  alt={profileUser.fullName}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-[#121318] bg-neutral-800 shadow-xl"
                />
                {profileUser.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-red-600 text-white p-1 rounded-full border-2 border-[#121318]"
                    title="Certified Institutional Economist"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {profileUser.fullName}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    onClick={copyPersonalId}
                    className="font-mono text-xs font-bold text-red-400 bg-red-950/40 border border-red-900/50 px-2.5 py-0.5 rounded cursor-pointer hover:bg-red-900/50 transition-colors"
                    title="Click to copy Personal ID"
                  >
                    {profileUser.personalId}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">@{profileUser.username}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-300 capitalize">
                    {profileUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              {!isOwnProfile ? (
                <>
                  <button
                    onClick={() => followUser(profileUser.id)}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow ${
                      isFollowing
                        ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10"
                        : "bg-red-600 hover:bg-red-500 text-white"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow Scholar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => connectUser(profileUser.id)}
                    className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors border ${
                      isConnected
                        ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                        : "bg-white/5 hover:bg-white/10 border-white/15 text-white"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{isConnected ? "Connected Peer" : "Connect"}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setActiveTab("edit")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile & Skills</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio & Academic Meta */}
          <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
            <p className="text-neutral-300 text-sm leading-relaxed max-w-3xl">
              {profileUser.bio || "Economic researcher and policy analyst contributing to empirical and public economics."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-neutral-400 font-mono text-[11px] pt-1">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="truncate">{profileUser.institution || "Research Institution"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="truncate">{profileUser.education || "Economics Degree"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="truncate">{profileUser.city}, {profileUser.country}</span>
              </div>
            </div>

            {/* Skills & Research Interests Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {profileUser.skills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300"
                >
                  {skill}
                </span>
              ))}
              {profileUser.researchInterests?.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-red-950/40 border border-red-900/40 text-[11px] font-mono text-red-300"
                >
                  #{interest}
                </span>
              ))}
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/10 font-mono">
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <div className="text-[10px] text-neutral-400 uppercase">Followers</div>
                <div className="text-base font-bold text-white">{profileUser.followersCount || 0}</div>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <div className="text-[10px] text-neutral-400 uppercase">Following</div>
                <div className="text-base font-bold text-white">{profileUser.followingCount || 0}</div>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <div className="text-[10px] text-neutral-400 uppercase">Connections</div>
                <div className="text-base font-bold text-white">{profileUser.connectionsCount || 0}</div>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <div className="text-[10px] text-neutral-400 uppercase">Publications</div>
                <div className="text-base font-bold text-white">{profileUser.publicationsCount || userPosts.length}</div>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/10">
                <div className="text-[10px] text-neutral-400 uppercase">Citations</div>
                <div className="text-base font-bold text-red-400">{profileUser.citationsCount || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab("publications")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 px-3 ${
            activeTab === "publications"
              ? "border-red-500 text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Publications & Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("labs")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 px-3 ${
            activeTab === "labs"
              ? "border-red-500 text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Research Labs ({isOwnProfile ? personalLabs.length : 1})</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab("edit")}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 px-3 ${
              activeTab === "edit"
                ? "border-red-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Profile Editor</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("integrity")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 px-3 ${
            activeTab === "integrity"
              ? "border-red-500 text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Integrity & Governance</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "publications" && (
        <div className="space-y-4">
          {loadingPosts ? (
            <div className="p-8 text-center text-xs text-neutral-400 font-mono">
              Loading author publications...
            </div>
          ) : userPosts.length === 0 ? (
            <div className="p-8 text-center bg-[#121318] border border-white/10 rounded-xl space-y-2">
              <BookOpen className="w-8 h-8 text-neutral-500 mx-auto" />
              <div className="text-sm font-semibold text-white">No Publications Yet</div>
              <p className="text-xs text-neutral-400">
                This researcher has not published articles or simulations in the public feed yet.
              </p>
            </div>
          ) : (
            userPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#121318] border border-white/10 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-900/40">
                      {post.postType}
                    </span>
                    <span className="text-neutral-400 font-mono text-[11px]">{post.category}</span>
                  </div>
                  <span className="text-neutral-500 text-[11px] font-mono">{post.createdAt}</span>
                </div>

                <h3 className="text-base font-bold text-white">{post.title}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Tagged indicators */}
                {post.taggedIndicators && post.taggedIndicators.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
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

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-neutral-400 font-mono">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{post.likesCount}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{post.commentsCount}</span>
                    </span>
                  </div>
                  <div className="text-[11px]">Personal ID: {post.authorPersonalId}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "labs" && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-400">
            Active empirical models, econometric specifications, and micro-equilibrium labs.
          </div>
          {personalLabs.length === 0 ? (
            <div className="p-8 text-center bg-[#121318] border border-white/10 rounded-xl space-y-2">
              <BarChart2 className="w-8 h-8 text-neutral-500 mx-auto" />
              <div className="text-sm font-semibold text-white">No Research Labs Saved Yet</div>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Run econometric or market equilibrium simulations in the Macro & Micro modules to pin custom models to your scholar profile.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {personalLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="bg-[#121318] border border-white/10 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-red-400">{lab.category}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
                        {lab.modelType}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">Updated {lab.updatedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{lab.title}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{lab.description}</p>
                  <div className="p-3 bg-black/40 rounded border border-white/5 font-mono text-[11px] text-neutral-300 space-y-1">
                    <div><span className="text-neutral-500">Regression / Equilibrium Result: </span>{lab.resultsSummary}</div>
                    <div><span className="text-neutral-500">Policy Finding: </span>{lab.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "edit" && isOwnProfile && (
        <form onSubmit={handleSaveProfile} className="bg-[#121318] border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-red-400" />
              <span>Update Researcher Profile & Credentials</span>
            </h3>
            {saveStatus && (
              <span className="text-xs font-mono text-emerald-400">{saveStatus}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Academic Bio</label>
            <textarea
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full p-2.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Professional Title</label>
              <input
                type="text"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full p-2.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Affiliation / Institution</label>
              <input
                type="text"
                value={editInstitution}
                onChange={(e) => setEditInstitution(e.target.value)}
                className="w-full p-2.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Education</label>
              <input
                type="text"
                value={editEducation}
                onChange={(e) => setEditEducation(e.target.value)}
                className="w-full p-2.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">District / City</label>
              <input
                type="text"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full p-2.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Country</label>
              <input
                type="text"
                value={editCountry}
                onChange={(e) => setEditCountry(e.target.value)}
                className="w-full p-2.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Methodology & Skills (Comma-separated)</label>
            <input
              type="text"
              value={editSkills}
              onChange={(e) => setEditSkills(e.target.value)}
              className="w-full p-2.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Research Interests (Comma-separated)</label>
            <input
              type="text"
              value={editInterests}
              onChange={(e) => setEditInterests(e.target.value)}
              className="w-full p-2.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white font-mono outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Modifications</span>
          </button>
        </form>
      )}

      {activeTab === "integrity" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#121318] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 font-bold text-sm text-white">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Anti-Hallucination Data Charter</span>
            </div>
            <div className="space-y-2.5 text-xs text-neutral-300 leading-relaxed">
              <p>
                EconoSphere AI strictly enforces verified source attribution and rejects the generation of fabricated micro-data. Missing sub-district figures are labeled transparently with regional upper bounds.
              </p>
              <div className="space-y-1.5 pt-1 font-mono text-[11px] text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Personal IDs (ECN-XXXXXX)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PBKDF2 Salted Authentication Kernel</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>No Plaintext Credentials or API Keys</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#121318] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 font-bold text-sm text-white">
              <Cpu className="w-4 h-4 text-red-400" />
              <span>Computational Backend Architecture</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Personal ID Protocol:</span>
                <span className="font-mono text-red-400 font-bold">{profileUser.personalId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">AI Narrative Engine:</span>
                <span className="font-mono text-emerald-400">Server-Side Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Econometric Math Engine:</span>
                <span className="font-mono text-white">Pure TypeScript Mathematical Models</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Persistent Storage:</span>
                <span className="font-mono text-neutral-300">Cryptographic Auth & Social Store</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
