import React, { useState } from "react";
import TagSection from "../components/tags/TagSection";
import { categoriesData } from "../mock/categories";
import { Sparkles, Search } from "lucide-react";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState(categoriesData.categories[0].mainCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = categoriesData.categories.find((cat) => cat.mainCategory === activeTab);

  // 模糊搜索逻辑
  const filteredSubCategories =
    activeCategory?.subCategories
      .map((sub) => ({
        ...sub,
        phrases: sub.phrases.filter((phrase) => phrase.toLowerCase().includes(searchQuery.toLowerCase())),
      }))
      .filter((sub) => sub.phrases.length > 0) || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0B0C0E]">
      {/* Top Header Section */}
      <div className="border-b border-white/5 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto py-4 px-10 flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-gray-900/80 p-1.5 rounded-xl border border-white/5">
            {categoriesData.categories.map((cat) => (
              <button
                key={cat.mainCategory}
                onClick={() => setActiveTab(cat.mainCategory)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === cat.mainCategory ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
              >
                {cat.mainCategory.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="搜索提示词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900/50 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 w-64 transition-all"
              />
            </div>
            <button className="text-gray-400 text-sm hover:text-white flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/50 border border-white/5 hover:bg-gray-800 transition-colors">
              最新词条
              <span className="text-[10px] text-gray-600">▼</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area - Tags Section */}
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
          {filteredSubCategories.length > 0 ? (
            filteredSubCategories.map((sub, idx) => (
              <TagSection
                key={`${sub.name}-${idx}`}
                title={sub.name}
                icon={<Sparkles className="w-5 h-5 text-blue-500" />}
                tags={sub.phrases}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
              <Search className="w-12 h-12 opacity-20" />
              <p>未找到包含 "{searchQuery}" 的提示词</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
