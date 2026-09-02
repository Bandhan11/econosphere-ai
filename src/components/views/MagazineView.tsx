import React, { useState } from "react";
import {
  BookMarked,
  Heart,
  MessageSquare,
  Share2,
  Clock,
  User,
  Tag,
  Search,
  Sparkles,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { MagazineArticle } from "../../types";

const ARTICLES: MagazineArticle[] = [
  {
    id: "mag-1",
    title: "The Anatomy of Agro-Cartels: Why High Policy Rates Cannot Tame Potato Prices",
    author: "Dr. Farhan Chowdhury",
    authorRole: "Senior Fellow, Center for Policy Dialogue",
    date: "August 28, 2026",
    readTime: "7 min read",
    category: "Bangladesh Economy",
    tags: ["Agriculture", "Inflation", "Market Structure", "Cold Storage"],
    excerpt:
      "A forensic breakdown of the three-tier intermediary syndicate in Bogura and Rangpur, where farmgate margins of ৳22 transform into ৳45 retail prices regardless of Bangladesh Bank repo hikes.",
    content: `### 1. The Monetary Policy Transmission Blindspot
When central banks escalate benchmark policy rates from 8.5% to 10.0%, standard macroeconomic textbook theory dictates that consumer demand cools, business inventory financing costs rise, and inflationary momentum recedes.

However, in sub-national agricultural corridors across South Asia, informal credit networks and oligopolistic cold-storage cartels neutralize conventional monetary policy transmission.

### 2. The Microeconomic Value Chain Wedge
Our field survey tracking 120,000 Metric Tons of high-yield Diamond potatoes in northern Bangladesh reveals a stark structural dichotomy:
- **Farmgate Production Cost:** ৳16.50 / kg
- **Procurement Spot Price at Harvest:** ৳21.00 / kg (Farmer margin: +27%)
- **Cold Storage Electricity & Preservation Fee:** ৳6.20 / kg (Over 5 months)
- **Wholesale Syndicate Realization:** ৳36.00 / kg
- **Urban Retail Consumer Outflow:** ৳46.00 / kg

The cumulative markup between harvest exit and Dhaka wet-market stands at **+119%**. Crucially, the financing of this inventory occurs not through commercial bank term loans, but through cash advances (*Dadan*) provided by commission agents (*Aratdars*). Consequently, a 150 bps hike in central bank repo rates exerts zero contracting pressure on hoarding margins.

### 3. Structural Policy Remedies
True disinflation requires structural micro-interventions:
1. Decentralized municipal cold storage facilities with digital spot warehouse-receipt auctions.
2. Automated tracking of wholesale trade volumes to eliminate artificial artificial withholding.
3. Rapid open-market logistics corridors connecting Rajshahi and Rangpur directly to consumer co-ops.`,
    likes: 142,
    commentsCount: 29,
  },
  {
    id: "mag-2",
    title: "The LDC Graduation Cliff: Recalibrating Bangladesh's Apparel Export Paradigm",
    author: "Tahmina Begum",
    authorRole: "Lead Trade Economist, Global Commerce Forum",
    date: "August 22, 2026",
    readTime: "9 min read",
    category: "Policy",
    tags: ["Trade", "LDC Graduation", "Tariffs", "Apparel"],
    excerpt:
      "As Bangladesh prepares to forfeit Duty-Free Quota-Free (DFQF) access under the EU Generalised Scheme of Preferences, how will 9.8% applied tariffs impact RMG volume?",
    content: `### 1. The End of Non-Reciprocal Preference
For two decades, Bangladesh has leveraged the European Union's Everything But Arms (EBA) initiative to build a $47 billion apparel export engine. The impending graduation from Least Developed Country (LDC) status presents an unprecedented competitive test.

Without immediate bilateral Free Trade Agreements (FTAs) or GSP+ qualification, Bangladeshi shipments will encounter standard Most Favoured Nation (MFN) tariffs averaging 9.6% across knitted and woven garments.

### 2. The Elasticity Equation
Econometric gravity modeling indicates a price elasticity of demand for standardized cotton apparel around -1.4. An unmitigated 9.6% tariff increase implies a potential **13.4% contraction in European export volume** unless offset by productivity gains or vertical integration into synthetic fibers.

### 3. Strategic Pathways Forward
To avert an industrial balance-of-payments shock, policymakers must execute three rapid transitions:
- Scale man-made fiber (MMF) spinning mills to reduce reliance on imported Indian and Chinese cotton yarn.
- Conclude Comprehensive Economic Partnership Agreements (CEPA) with key bilateral partners.
- Upgrade customs logistics through automated green-channel clearance at Chittagong Port.`,
    likes: 218,
    commentsCount: 44,
  },
  {
    id: "mag-3",
    title: "The Great Deglobalization: Industrial Subsidies and Supply Chain Realignment",
    author: "Prof. Marcus Vance",
    authorRole: "Professor of Political Economy, Oxford",
    date: "August 15, 2026",
    readTime: "8 min read",
    category: "Global Economy",
    tags: ["Geoeconomics", "Industrial Policy", "Subsidies", "Chips"],
    excerpt:
      "From the US CHIPS Act to European green transition subsidies, state capitalism has supplanted Washington Consensus orthodoxy. Who pays the deadweight loss?",
    content: `### 1. The Resurgence of State-Directed Capital
For four decades following the Uruguay Round, international trade consensus prioritized Ricardian comparative advantage and lean just-in-time global value chains. 

Today, that paradigm has been aggressively dismantled in favor of resilience, nearshoring, and strategic autonomy. Trillions of dollars in public capital are now deployed directly into semiconductor fabrication, battery gigafactories, and rare-earth processing facilities.

### 2. The Deadweight Loss Dilemma
While industrial policy cushions economies against geopolitical black-swan events, the macroeconomic trade-offs are inescapable:
- Global capital misallocation as redundant production lines are built across allied blocs.
- Retaliatory tariff spirals that elevate final consumer prices.
- Disproportionate fiscal pressure on emerging markets that lack the sovereign debt headroom to match G7 subsidy budgets.`,
    likes: 189,
    commentsCount: 31,
  },
];

export const MagazineView: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [likesMap, setLikesMap] = useState<Record<string, number>>({
    "mag-1": 142,
    "mag-2": 218,
    "mag-3": 189,
  });

  const activeArticle = ARTICLES.find((a) => a.id === selectedArticleId);

  const filteredArticles = ARTICLES.filter((a) => {
    if (selectedCategory === "All") return true;
    return a.category === selectedCategory;
  });

  const handleLike = (id: string) => {
    setLikesMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#141519] border border-white/15 p-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-2">
              <BookMarked className="w-3.5 h-3.5 text-red-500" />
              <span>Editorial Journal // EconoSphere Magazine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-black text-white tracking-tight">
              EconoSphere Economic Review
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl font-light">
              Long-form macroeconomic investigations, field research memos, trade policy audits, and analytical explainers from leading global economists.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "Bangladesh Economy", "Policy", "Global Economy"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white border-red-500 font-bold shadow-md"
                    : "bg-[#17181D] text-neutral-300 border-white/10 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article Detail View or Article Grid */}
      {activeArticle ? (
        <div className="bg-[#141519] border border-white/15 p-6 sm:p-10 space-y-6 max-w-4xl mx-auto shadow-2xl">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider pb-2 border-b border-white/10"
          >
            <ChevronLeft className="w-4 h-4 text-red-500" />
            <span>Back to All Articles</span>
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-red-400">
              <span>{activeArticle.category}</span>
              <span>•</span>
              <Clock className="w-3 h-3 text-neutral-400" />
              <span>{activeArticle.readTime}</span>
              <span>•</span>
              <span>{activeArticle.date}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-white tracking-tight leading-tight">
              {activeArticle.title}
            </h1>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 bg-red-950/60 border border-red-600/40 rounded-full flex items-center justify-center text-white font-serif font-bold text-sm">
                {activeArticle.author[0]}
              </div>
              <div>
                <div className="text-xs font-bold text-white font-sans">{activeArticle.author}</div>
                <div className="text-[10px] text-neutral-400 font-mono">{activeArticle.authorRole}</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-neutral-200 text-sm font-sans leading-relaxed whitespace-pre-line space-y-4 font-light">
            {activeArticle.content}
          </div>

          {/* Social Feedback Bar */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(activeArticle.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0C0D10] border border-white/10 text-neutral-300 hover:text-red-400 transition-colors"
              >
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>{likesMap[activeArticle.id] || activeArticle.likes} Likes</span>
              </button>

              <span className="flex items-center gap-1.5 text-neutral-400">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{activeArticle.commentsCount} Peer Discussions</span>
              </span>
            </div>

            <button
              onClick={() => alert("Article link copied to clipboard!")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Memo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticleId(art.id)}
              className="bg-[#141519] border border-white/15 p-6 hover:border-red-600/50 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  <span className="text-red-400">{art.category}</span>
                  <span>{art.readTime}</span>
                </div>

                <h3 className="text-lg font-serif italic font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-3 font-light">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white font-sans text-xs">{art.author}</span>
                    <span className="text-[10px] text-neutral-400 block font-mono">{art.date}</span>
                  </div>

                  <span className="text-xs font-mono text-red-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Memo →
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {art.tags.map((tg) => (
                    <span
                      key={tg}
                      className="text-[9px] font-mono px-1.5 py-0.5 bg-[#0C0D10] text-neutral-400 border border-white/5"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
