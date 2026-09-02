import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FormulaRenderer } from "../common/FormulaRenderer";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LearnView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"micro" | "macro" | "trade" | "econometrics">("micro");
  const [activeConceptIndex, setActiveConceptIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const concepts = {
    micro: [
      {
        title: "Price Elasticity of Demand (PED)",
        tagline: "Measuring consumer sensitivity to price changes",
        content:
          "Price Elasticity of Demand measures the percentage change in quantity demanded in response to a one percent change in the price of a good. When PED > 1, demand is price-elastic (luxury goods, items with close substitutes). When PED < 1, demand is inelastic (food staples, life-saving medicines, electricity).",
        formulaTitle: "Point Elasticity Formula",
        formula: "E_d = \\frac{\\% \\Delta Q_d}{\\% \\Delta P} = \\frac{\\partial Q}{\\partial P} \\cdot \\frac{P}{Q}",
        variables: [
          { symbol: "E_d", label: "Price Elasticity of Demand coefficient" },
          { symbol: "dQ/dP", label: "First derivative of demand with respect to price" },
          { symbol: "P/Q", label: "Initial price to quantity ratio" },
        ],
        mechanism:
          "For perishable agricultural items in developing economies (like potatoes in Rangpur or onions in Dinajpur), demand is highly inelastic in the short run (PED approx -0.2 to -0.4), which causes severe price volatility when minor supply disruptions occur.",
      },
      {
        title: "Consumer & Producer Surplus",
        tagline: "Economic welfare and market efficiency measurement",
        content:
          "Consumer surplus is the monetary difference between the maximum price consumers are willing to pay and the actual equilibrium market price paid. Producer surplus is the difference between the market price and the marginal cost of production.",
        formulaTitle: "Total Economic Welfare",
        formula: "W = CS + PS = \\int_0^{Q^*} (P_d(q) - P^*) dq + \\int_0^{Q^*} (P^* - P_s(q)) dq",
        variables: [
          { symbol: "CS", label: "Consumer surplus (area under demand curve above P*)" },
          { symbol: "PS", label: "Producer surplus (area above supply curve below P*)" },
          { symbol: "W", label: "Total social economic welfare at competitive equilibrium" },
        ],
        mechanism:
          "In perfectly competitive markets without externalities, competitive equilibrium maximizes Total Welfare. Any artificial price distortion (such as price ceilings below market equilibrium) introduces Deadweight Loss (DWL).",
      },
    ],
    macro: [
      {
        title: "The Keynesian Fiscal Multiplier",
        tagline: "How autonomous government spending propagates through aggregate demand",
        content:
          "The fiscal multiplier quantifies how an initial exogenous increase in government spending ($G$) leads to a larger cumulative increase in national output ($Y$). Because one person's expenditure is another person's income, successive rounds of consumption occur based on the Marginal Propensity to Consume ($c$).",
        formulaTitle: "Open Economy Multiplier with Income Tax",
        formula: "k_{fiscal} = \\frac{\\Delta Y}{\\Delta G} = \\frac{1}{1 - c(1 - t) + m}",
        variables: [
          { symbol: "c", label: "Marginal Propensity to Consume (MPC)" },
          { symbol: "t", label: "Marginal tax rate" },
          { symbol: "m", label: "Marginal Propensity to Import (MPI leakage)" },
        ],
        mechanism:
          "In economies with high import leakages or aggressive monetary policy tightening, the realized fiscal multiplier is damped, often falling between 0.6x and 1.2x compared to theoretical closed-economy values.",
      },
      {
        title: "Monetary Policy Transmission Mechanism",
        tagline: "From policy rate hikes to inflation control",
        content:
          "Central banks adjust the short-term policy interest rate (Repo rate) to alter interbank liquidity. This transmits through bank lending rates, exchange rates, asset valuations, and aggregate demand to steer core and headline inflation toward target bands.",
        formulaTitle: "Taylor Rule Formulation",
        formula: "i_t = r^* + \\pi_t + 0.5(\\pi_t - \\pi^*) + 0.5(y_t - y^*)",
        variables: [
          { symbol: "i_t", label: "Target nominal policy rate" },
          { symbol: "r*", label: "Equilibrium neutral real interest rate" },
          { symbol: "pi - pi*", label: "Inflation gap (actual vs target)" },
          { symbol: "y - y*", label: "Output gap (actual vs potential GDP)" },
        ],
        mechanism:
          "When inflation exceeds target by 1%, the Taylor principle states the central bank must raise nominal rates by more than 1% to ensure the real interest rate ($r = i - \\pi$) increases.",
      },
    ],
    trade: [
      {
        title: "Ricardian Comparative Advantage",
        tagline: "Why nations gain from trade even without absolute advantages",
        content:
          "David Ricardo demonstrated that trade benefits all nations if each specializes in the good with the lowest opportunity cost of production, regardless of absolute labor productivity differences.",
        formulaTitle: "Opportunity Cost Ratio Condition",
        formula: "\\frac{a_{1A}}{a_{2A}} < \\frac{P_1}{P_2} < \\frac{a_{1B}}{a_{2B}}",
        variables: [
          { symbol: "a_1, a_2", label: "Unit labor requirements for Good 1 and Good 2" },
          { symbol: "A, B", label: "Trading Country A and Country B" },
          { symbol: "P_1/P_2", label: "World terms of trade relative price" },
        ],
        mechanism:
          "Bangladesh specializes in Ready-Made Garments (RMG) due to lower opportunity costs in labor-intensive assembly, trading with capital-intensive high-tech machinery producers.",
      },
    ],
    econometrics: [
      {
        title: "Ordinary Least Squares (OLS) Estimator",
        tagline: "Best Linear Unbiased Estimator (BLUE) under Gauss-Markov",
        content:
          "OLS minimizes the sum of squared residuals between observed dependent variables and the linear regression line. Under Gauss-Markov assumptions (zero conditional mean of errors, homoskedasticity, no autocorrelation, no perfect multicollinearity), OLS is the Best Linear Unbiased Estimator.",
        formulaTitle: "Matrix Form OLS Estimator",
        formula: "\\hat{\\beta} = (X'X)^{-1} X'Y, \\quad \\text{Var}(\\hat{\\beta}) = \\sigma^2 (X'X)^{-1}",
        variables: [
          { symbol: "X", label: "Design matrix of independent explanatory regressors (N x K)" },
          { symbol: "Y", label: "Vector of dependent variable observations (N x 1)" },
          { symbol: "beta_hat", label: "Vector of estimated econometric coefficients" },
          { symbol: "sigma^2", label: "Variance of error disturbances" },
        ],
        mechanism:
          "If error variance varies across observations (heteroskedasticity), OLS standard errors are biased, requiring White-Huber robust standard errors for valid hypothesis testing.",
      },
    ],
  };

  const currentConcept = concepts[activeCategory][activeConceptIndex] || concepts[activeCategory][0];

  // Voice narration handler
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser environment.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `${currentConcept.title}. ${currentConcept.content} ${currentConcept.mechanism}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Quiz Questions Pool
  const quizQuestions: QuizQuestion[] = [
    {
      id: "q1",
      question: "If the Price Elasticity of Demand (PED) for essential potatoes is -0.3, how will quantity demanded react if the market price increases by 10%?",
      options: [
        "Quantity demanded will drop by 30%",
        "Quantity demanded will drop by 3%",
        "Quantity demanded will rise by 3%",
        "Quantity demanded remains unchanged",
      ],
      correctIndex: 1,
      explanation:
        "Using %ΔQ = PED × %ΔP = (-0.3) × (+10%) = -3%. The negative sign indicates an inverse relationship between price and quantity.",
    },
    {
      id: "q2",
      question: "What is the consequence of imposing an effective Price Ceiling below the competitive market equilibrium price?",
      options: [
        "A market surplus and excess unsold inventory",
        "A market shortage, deadweight loss, and rationing pressure",
        "An increase in producer surplus",
        "Higher tax revenue for the government",
      ],
      correctIndex: 1,
      explanation:
        "A price ceiling set below equilibrium makes quantity demanded exceed quantity supplied, creating an acute shortage and deadweight loss.",
    },
    {
      id: "q3",
      question: "According to the Solow-Swan Neoclassical Growth Model, what is the sole driver of sustained per-capita GDP growth in the long-run steady state?",
      options: [
        "Higher physical capital investment rate (s)",
        "Exogenous technological progress (g)",
        "Faster population growth rate (n)",
        "Import tariffs on foreign industrial goods",
      ],
      correctIndex: 1,
      explanation:
        "Due to diminishing marginal returns to capital, capital accumulation alone cannot sustain long-run per-capita growth. Exogenous labor-augmenting technological progress (g) is the sole driver.",
    },
    {
      id: "q4",
      question: "Under the Gauss-Markov theorem, what makes the OLS estimator 'BLUE'?",
      options: [
        "It provides the maximum possible R-squared value",
        "It is Best Linear Unbiased Estimator with minimum variance",
        "It eliminates all measurement errors in the regressors",
        "It guarantees non-negative regression coefficients",
      ],
      correctIndex: 1,
      explanation:
        "BLUE stands for Best Linear Unbiased Estimator, meaning among all linear unbiased estimators, OLS achieves the lowest sampling variance.",
    },
  ];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleNextOrSubmit = () => {
    if (!isAnswerSubmitted) {
      if (selectedOption === null) return;
      setIsAnswerSubmitted(true);
      if (selectedOption === quizQuestions[currentQuestionIndex].correctIndex) {
        setScore((prev) => prev + 1);
      }
    } else {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
      } else {
        setQuizCompleted(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const restartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Economics Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Economics Mastery & <span className="text-cyan-400">Academy</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Master fundamental microeconomics, macroeconomic policy transmission, international trade theory, and econometric estimators with audio readouts and quizzes.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(["micro", "macro", "trade", "econometrics"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveConceptIndex(0);
                if (isPlayingAudio) {
                  window.speechSynthesis?.cancel();
                  setIsPlayingAudio(false);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeCategory === cat
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat === "micro" ? "Microeconomics" : cat === "macro" ? "Macroeconomics" : cat === "trade" ? "Global Trade" : "Econometrics"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Concept Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Concept Selector Column */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Topic Modules ({concepts[activeCategory].length})
          </span>

          <div className="space-y-2">
            {concepts[activeCategory].map((c, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveConceptIndex(idx);
                  if (isPlayingAudio) {
                    window.speechSynthesis?.cancel();
                    setIsPlayingAudio(false);
                  }
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  activeConceptIndex === idx
                    ? "bg-cyan-950/70 border-cyan-800/80 text-cyan-200"
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <div className="font-bold text-xs text-slate-100">{c.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{c.tagline}</div>
              </button>
            ))}
          </div>

          {/* Quick Quiz Banner */}
          <div className="pt-4 border-t border-slate-800">
            <div className="p-3.5 rounded-lg bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-800/50 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Knowledge Mastery Quiz</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Test your mastery with 4 econometric questions and unlock verified certification badges.
              </p>
              <button
                onClick={() => {
                  setQuizStarted(true);
                  setQuizCompleted(false);
                  setCurrentQuestionIndex(0);
                  setSelectedOption(null);
                  setIsAnswerSubmitted(false);
                  setScore(0);
                }}
                className="w-full mt-1 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
              >
                {quizStarted ? "Reset Quiz" : "Start Economics Quiz"}
              </button>
            </div>
          </div>
        </div>

        {/* Center & Right: Concept Deep Dive & Formula */}
        <div className="lg:col-span-2 space-y-6">
          {!quizStarted ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">{currentConcept.title}</h2>
                  <p className="text-xs text-cyan-400 mt-0.5">{currentConcept.tagline}</p>
                </div>

                <button
                  onClick={toggleSpeech}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                    isPlayingAudio
                      ? "bg-rose-950 text-rose-300 border-rose-800 animate-pulse"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  }`}
                  title="Audio Lecture Readout"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span>Listen Lecture</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed space-y-3">
                <p>{currentConcept.content}</p>
              </div>

              {/* Mathematical Formulation */}
              <FormulaRenderer
                title={currentConcept.formulaTitle}
                formula={currentConcept.formula}
                variables={currentConcept.variables}
              />

              {/* Real World Empirical Mechanism */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Real-World Empirical Case Mechanism</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentConcept.mechanism}</p>
              </div>
            </div>
          ) : (
            /* Interactive Quiz Container */
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
              {!quizCompleted ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-sm text-slate-100">
                        Economics Mastery Quiz (Question {currentQuestionIndex + 1} of {quizQuestions.length})
                      </span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      Score: {score}/{quizQuestions.length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-slate-100">
                      {quizQuestions[currentQuestionIndex].question}
                    </p>

                    <div className="space-y-2.5">
                      {quizQuestions[currentQuestionIndex].options.map((opt, i) => {
                        const isSelected = selectedOption === i;
                        const isCorrect = i === quizQuestions[currentQuestionIndex].correctIndex;
                        let optionClass = "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/70";

                        if (isAnswerSubmitted) {
                          if (isCorrect) {
                            optionClass = "bg-emerald-950/80 border-emerald-600 text-emerald-200 font-semibold";
                          } else if (isSelected && !isCorrect) {
                            optionClass = "bg-rose-950/80 border-rose-600 text-rose-200";
                          }
                        } else if (isSelected) {
                          optionClass = "bg-cyan-950/80 border-cyan-600 text-cyan-200 font-semibold";
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectOption(i)}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-3 ${optionClass}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isAnswerSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {isAnswerSubmitted && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswerSubmitted && (
                      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Econometric Explanation</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                          {quizQuestions[currentQuestionIndex].explanation}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setQuizStarted(false)}
                        className="text-xs text-slate-400 hover:text-slate-200"
                      >
                        Exit Quiz
                      </button>

                      <button
                        onClick={handleNextOrSubmit}
                        disabled={selectedOption === null}
                        className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow disabled:opacity-50 transition-colors"
                      >
                        {!isAnswerSubmitted
                          ? "Submit Answer"
                          : currentQuestionIndex < quizQuestions.length - 1
                          ? "Next Question →"
                          : "Finish Quiz & View Score"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Quiz Completed Results */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Quiz Completed!</h3>
                  <p className="text-sm text-slate-300">
                    You scored <span className="text-cyan-400 font-bold font-mono text-base">{score}</span> out of {quizQuestions.length} ({((score / quizQuestions.length) * 100).toFixed(0)}%).
                  </p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {score === quizQuestions.length
                      ? "Outstanding performance! You have mastered these key micro, macro, growth, and econometrics concepts."
                      : "Solid effort! Review the theoretical modules and mathematical derivations to achieve a perfect score."}
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={restartQuiz}
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-colors"
                    >
                      Retry Quiz
                    </button>
                    <button
                      onClick={() => setQuizStarted(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                    >
                      Return to Lectures
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
