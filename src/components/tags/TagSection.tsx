import React from 'react';
import { Sparkles } from 'lucide-react';
import { usePromptStore } from '../../hooks/usePromptStore';

interface TagSectionProps {
  title: string;
  icon?: React.ReactNode;
  tags: string[];
}

const TagSection: React.FC<TagSectionProps> = ({ title, icon, tags }) => {
  const appendPrompt = usePromptStore((state) => state.appendPrompt);

  return (
    <div className="mb-10">
      <div className="flex items-center space-x-2 mb-6 group">
        <div className="text-blue-500 group-hover:scale-110 transition-transform duration-300">
          {icon || <Sparkles className="w-5 h-5" />}
        </div>
        <h2 className="text-lg font-semibold tracking-wide text-gray-200">{title}</h2>
      </div>
      
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 bg-[#FFFFFF03] p-6 rounded-[24px]"
        style={{
          boxShadow: 'inset 0px 24px 48px 0px #C7D3EA0D, inset 0px 1px 1px 0px #C7D3EA1F'
        }}
      >
        {tags.map((tag, idx) => {
          const cleanTag = tag.startsWith('🖼️') ? tag.split(' ').slice(1).join(' ') : tag;
          return (
            <button
              key={`${tag}-${idx}`}
              onClick={() => appendPrompt(cleanTag)}
              className="px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                bg-[#FFFFFF1A] border border-white/5 text-gray-300
                hover:bg-[#FFFFFF26] hover:text-white hover:border-blue-500/30 hover:scale-102
                flex items-center justify-center space-x-2 group/tag active:scale-95"
            >
              {tag.startsWith('🖼️') ? (
                <span className="text-lg">{tag.split(' ')[0]}</span>
              ) : null}
              <span className="truncate">{cleanTag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagSection;
