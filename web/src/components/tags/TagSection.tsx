import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { usePromptStore } from "../../hooks/usePromptStore";
import type { PhraseItem } from "../../services/categories.service";

interface TagSectionProps {
  title: string;
  icon?: React.ReactNode;
  tags: string[];
  items?: PhraseItem[];
}

const TagSection: React.FC<TagSectionProps> = ({ title, icon, tags, items }) => {
  const appendPrompt = usePromptStore((state) => state.appendPrompt);
  const [hoveredItem, setHoveredItem] = useState<{ id: string; cover: string; name: string } | null>(null);
  const [showBelow, setShowBelow] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent, item: PhraseItem) => {
    if (!item.cover) return;

    // Check if the button is in the top portion of the screen
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const threshold = 300; // Expected height of preview + some margin
    setShowBelow(rect.top < threshold);

    setHoveredItem({ id: item.id, cover: item.cover, name: item.name });
  };

  return (
    <div className="mb-10 relative">
      <div className="flex items-center space-x-2 mb-6 group">
        <div className="text-blue-500 group-hover:scale-110 transition-transform duration-300">{icon || <Sparkles className="w-5 h-5" />}</div>
        <h2 className="text-lg font-semibold tracking-wide text-gray-200">{title}</h2>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 bg-[#FFFFFF03] p-4 rounded-[24px]"
        style={{
          boxShadow: "inset 0px 24px 48px 0px rgba(199, 211, 234, 0.05), inset 0px 1px 1px 0px rgba(199, 211, 234, 0.12)",
        }}
      >
        {items && items.length > 0
          ? items.map((item) => (
              <div
                key={item.id}
                className="relative group/tag-container"
              >
                <button
                  onClick={() => appendPrompt(item.name)}
                  onMouseEnter={(e) => handleMouseEnter(e, item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="w-full h-10 px-3 rounded-xl text-xs transition-all duration-200
                  bg-[#FFFFFF0D] border border-white/5 text-gray-400
                  hover:bg-[#FFFFFF1A] hover:text-white hover:border-white/20 hover:scale-[1.02]
                  flex items-center justify-center space-x-2 active:scale-95 text-center"
                >
                  {item.cover && (
                    <div className="w-4 h-4 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                      <img
                        src={item.cover}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {!item.cover && item.name.startsWith("🖼️") && <span className="text-base">{item.name.split(" ")[0]}</span>}
                  <span className="truncate">{item.name.startsWith("🖼️") ? item.name.split(" ").slice(1).join(" ") : item.name}</span>
                </button>

                {/* Hover Preview Tooltip */}
                {hoveredItem?.id === item.id && (
                  <div
                    className={`absolute z-50 left-1/2 -translate-x-1/2 pointer-events-none animate-in fade-in zoom-in duration-200 
                    ${showBelow ? "top-full mt-4 origin-top" : "bottom-full mb-4 origin-bottom"}`}
                  >
                    <div className="bg-[#1A1B23]/80 backdrop-blur-xl p-1.5 rounded-[32px] border border-white/10 shadow-2xl shadow-black/80 overflow-hidden w-64 aspect-square">
                      <img
                        src={hoveredItem.cover}
                        alt={hoveredItem.name}
                        className="w-full h-full object-cover rounded-[26px]"
                      />
                    </div>
                    <div className="absolute -inset-2 bg-blue-500/10 blur-2xl -z-10 rounded-full" />
                  </div>
                )}
              </div>
            ))
          : tags.map((tag, idx) => {
              const cleanTag = tag.startsWith("🖼️") ? tag.split(" ").slice(1).join(" ") : tag;
              return (
                <button
                  key={`${tag}-${idx}`}
                  onClick={() => appendPrompt(cleanTag)}
                  className="h-10 px-3 rounded-xl text-xs transition-all duration-200
                  bg-[#FFFFFF0D] border border-white/5 text-gray-400
                  hover:bg-[#FFFFFF1A] hover:text-white hover:border-white/20 hover:scale-[1.02]
                  flex items-center justify-center space-x-2 group/tag active:scale-95"
                >
                  {tag.startsWith("🖼️") ? <span className="text-base">{tag.split(" ")[0]}</span> : null}
                  <span className="truncate">{cleanTag}</span>
                </button>
              );
            })}
      </div>
    </div>
  );
};

export default TagSection;
