import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Building,
  GraduationCap,
  Sparkles,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { VERIFIED_ECONOMISTS } from "../../data/economicSocialData";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    registerUser,
  } = useApp();

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [region, setRegion] = useState("Rajshahi Division");
  const [city, setCity] = useState("Naogaon / Dhaka");
  const [education, setEducation] = useState("M.S. in Economics");
  const [institution, setInstitution] = useState("University of Dhaka");
  const [fieldOfStudy, setFieldOfStudy] = useState("Applied Macro & Development");
  const [role, setRole] = useState("researcher");
  const [professionalRole, setProfessionalRole] = useState("Empirical Research Fellow");
  const [skillsText, setSkillsText] = useState("Econometrics, Time Series, Value Chains");
  const [interestsText, setInterestsText] = useState("Food Security, Price Transmission, Inflation");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);
    if (res.success) {
      setIsAuthModalOpen(false);
    } else {
      setErrorMessage(res.error || "Authentication failed.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    const skills = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    const researchInterests = interestsText.split(",").map((s) => s.trim()).filter(Boolean);

    const res = await registerUser({
      fullName,
      username,
      email,
      phone,
      password,
      country,
      region,
      city,
      education,
      institution,
      fieldOfStudy,
      role,
      professionalRole,
      skills,
      researchInterests,
    });

    setLoading(false);
    if (res.success) {
      setSuccessMessage("Account created successfully! Your Personal ID is generated.");
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1200);
    } else {
      setErrorMessage(res.error || "Registration failed.");
    }
  };

  const quickLoginAs = async (user: typeof VERIFIED_ECONOMISTS[0]) => {
    setIdentifier(user.personalId);
    setPassword("EconoSphere2026!");
    setLoading(true);
    const res = await login(user.personalId, "EconoSphere2026!");
    setLoading(false);
    if (res.success) {
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141519] border border-white/15 rounded-xl shadow-2xl overflow-hidden my-8 text-neutral-200 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0E0F12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold font-serif text-sm">
              ES
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>EconoSphere Institutional Identity</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10">
                  {authModalMode === "login" ? "SESSION LOGIN" : "RESEARCH REGISTRATION"}
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Peer network for economic discovery, empirical research, and publication.
              </p>
            </div>
          </div>
          <button
            id="auth-modal-close"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-white/10 bg-[#121317]">
          <button
            onClick={() => {
              setAuthModalMode("login");
              setErrorMessage("");
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors ${
              authModalMode === "login"
                ? "border-red-500 text-white bg-white/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Log In to Account
          </button>
          <button
            onClick={() => {
              setAuthModalMode("register");
              setErrorMessage("");
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors ${
              authModalMode === "register"
                ? "border-red-500 text-white bg-white/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Create Personal ID & Profile
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-950/60 border border-red-800/80 rounded text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Body Form */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {authModalMode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Personal ID, Username (@...), or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. ECN-000001, @wahid_econ, or email"
                    className="w-full pl-9 pr-3 py-2 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white placeholder-neutral-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Account Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white placeholder-neutral-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PBKDF2 Salted Verification</span>
                </span>
                <button
                  type="button"
                  onClick={() => alert("Password reset link simulation dispatched to registered email.")}
                  className="hover:text-red-400 underline underline-offset-2"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Sign In to EconoSphere"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Scholar Logins */}
              <div className="pt-4 border-t border-white/10 mt-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-2">
                  Fast Demo Sign-In as Certified Scholar:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {VERIFIED_ECONOMISTS.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => quickLoginAs(u)}
                      className="text-left p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/50 transition-colors text-xs"
                    >
                      <div className="font-semibold text-white truncate">{u.fullName}</div>
                      <div className="text-[10px] font-mono text-red-400">{u.personalId} • {u.role}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Dynamic Personal ID Preview */}
              <div className="p-3 bg-red-950/30 border border-red-800/40 rounded flex items-center justify-between text-xs">
                <div>
                  <div className="font-mono text-[10px] text-red-400 uppercase tracking-wider">
                    Assigned EconoSphere Personal ID
                  </div>
                  <div className="font-mono font-bold text-white text-sm">
                    {username ? `@${username.replace(/^@/, "")}` : "ECN-000XXX"}
                  </div>
                </div>
                <span className="text-[11px] text-neutral-400">
                  Unique public identity for citations & collaboration
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Arefin Shuvo"
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Unique Username (@...) *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    placeholder="e.g. arefin_macro"
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Account Password * (Min. 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full px-3 pr-9 py-2 bg-[#0C0D10] border border-white/15 focus:border-red-500 rounded text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Region / Division</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">City / District</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Primary Academic Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                  >
                    <option value="student">Economics Student</option>
                    <option value="researcher">Academic Researcher</option>
                    <option value="economist">Senior Economist</option>
                    <option value="teacher">University Professor</option>
                    <option value="policymaker">Government Policymaker</option>
                    <option value="business">Market & Business Analyst</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Institution / Organization</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. University of Dhaka, CPD, BIDS"
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Agricultural Economics, Monetary Theory"
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={professionalRole}
                    onChange={(e) => setProfessionalRole(e.target.value)}
                    placeholder="e.g. Research Fellow, Graduate Scholar"
                    className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="e.g. Stata, Time Series, OLS Regression, Python"
                  className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Research Interests</label>
                <input
                  type="text"
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  placeholder="e.g. Rural Credit, Food Inflation, Central Banking"
                  className="w-full px-3 py-2 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Creating Identity..." : "Create Account & Generate Personal ID"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
