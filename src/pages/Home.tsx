import React, { useState } from 'react';
import TagSection from '../components/tags/TagSection';
import { categoriesData } from '../mock/categories';
import { Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState(categoriesData.categories[0].mainCategory);

  const activeCategory = categoriesData.categories.find(
    cat => cat.mainCategory === activeTab
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Category Tab Bar */}
      <div className="border-gray-800 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-gray-900/50 p-1 rounded-xl">
            {categoriesData.categories.map((cat) => (
              <button
                key={cat.mainCategory}
                onClick={() => setActiveTab(cat.mainCategory)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                  activeTab === cat.mainCategory 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {cat.mainCategory.split(' ')[0]}
              </button>
            ))}
          </div>
          
          <button className="text-gray-400 text-sm hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
            最新词条
            <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-10 py-8 pb-40">
        <div className="max-w-7xl mx-auto space-y-12">
          {activeCategory?.subCategories.map((sub, idx) => (
            <TagSection 
              key={`${sub.name}-${idx}`}
              title={sub.name} 
              icon={<Sparkles className="w-5 h-5 text-blue-500" />}
              tags={sub.phrases} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
