import React, { useState } from 'react';
import TagSection from '../components/tags/TagSection';
import { categoriesData, ArtistData, SrefData } from '../mock/categories';
import { Sparkles, Search, Copy, Check } from 'lucide-react';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState(categoriesData.categories[0].mainCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCategory = categoriesData.categories.find(
    cat => cat.mainCategory === activeTab
  );

  // 模糊搜索逻辑
  const filteredSubCategories = activeCategory?.subCategories.map(sub => ({
    ...sub,
    phrases: sub.phrases.filter(phrase => 
      phrase.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(sub => sub.phrases.length > 0) || [];

  const filteredArtists = ArtistData.filter(artist => 
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSrefs = SrefData.filter(sref => 
    sref.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sref.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0B0C0E]">
      {/* Top Header Section */}
      <div className="border-b border-white/5 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto py-4 px-10 flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-gray-900/80 p-1.5 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
            {categoriesData.categories.map((cat) => (
              <button
                key={cat.mainCategory}
                onClick={() => setActiveTab(cat.mainCategory)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === cat.mainCategory 
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {cat.mainCategory.split(' ')[0]}
              </button>
            ))}
            <button
              onClick={() => setActiveTab('艺术家')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === '艺术家' 
                  ? 'bg-blue-700 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              艺术家
            </button>
            <button
              onClick={() => setActiveTab('Midjourney风格码')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'Midjourney风格码' 
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Midjourney风格码
            </button>
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <div className="max-w-7xl mx-auto pb-20">
          {activeTab === '艺术家' ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-10">
              {filteredArtists.length > 0 ? (
                filteredArtists.map((artist) => (
                  <div key={artist.id} className="group cursor-pointer">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-900/50 border border-white/5 group-hover:border-blue-500/30 transition-all relative">
                      <img 
                        src={artist.previewUrl} 
                        alt={artist.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-gray-400 text-xs font-medium">by {artist.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
                  <Search className="w-12 h-12 opacity-20" />
                  <p>未找到相关艺术家</p>
                </div>
              )}
            </div>
          ) : activeTab === 'Midjourney风格码' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSrefs.length > 0 ? (
                  filteredSrefs.map((sref) => (
                    <div key={sref.id} className="group bg-gray-900/40 rounded-3xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img 
                          src={sref.previewUrl} 
                          alt={sref.code} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-5 space-y-4">
                        <div 
                          onClick={() => handleCopy(sref.code, sref.id)}
                          className="flex items-center justify-between bg-black/40 hover:bg-black/60 p-3 rounded-2xl cursor-pointer border border-white/5 transition-colors group/code"
                        >
                          <code className="text-blue-400 font-medium text-sm truncate mr-2">{sref.code}</code>
                          {copiedId === sref.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500 group-hover/code:text-white transition-colors" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {sref.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="px-2.5 py-1 rounded-lg bg-gray-800/50 text-gray-400 text-[10px] hover:text-white hover:bg-gray-700 transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
                    <Search className="w-12 h-12 opacity-20" />
                    <p>未找到相关风格码</p>
                  </div>
                )}
             </div>
          ) : (
            <div className="space-y-10">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
