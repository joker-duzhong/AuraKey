import React from 'react';
import { X, Heart, MoreHorizontal, Copy, RotateCcw, Maximize2, Share2, Download } from 'lucide-react';
import type { GalleryItem } from '../../services/gallery.service';
import { useGalleryStore } from '../../hooks/useGalleryStore';

interface GalleryDetailProps {
  item: GalleryItem;
  onClose: () => void;
}

  const GalleryDetail: React.FC<GalleryDetailProps> = ({ item, onClose }) => {
  const { likeItem } = useGalleryStore();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeItem(item.id).catch(() => {});
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in zoom-in-95 duration-200"
      onClick={onClose}
    >
      {/* Container - Truly Full Screen on Mobile, Large on Desktop */}
      <div 
        className="w-full h-full md:h-[95vh] md:w-[95vw] md:max-w-7xl md:rounded-[32px] bg-[#0c0d13] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Section: Image Display */}
        <div className="flex-1 bg-[#06070a] flex items-center justify-center relative min-h-[40vh] md:min-h-0 overflow-hidden">
          <img 
            src={item.url} 
            alt={item.title} 
            className="w-full h-full object-contain md:p-8"
          />
          
          {/* Top Left Close Button for Mobile/Desktop relative to image */}
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 rounded-full text-white/70 hover:text-white transition-all z-10 border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Optional: Navigation or other overlay icons from design could go here */}
        </div>

        {/* Right Section: Info Panel */}
        <div className="w-full md:w-[420px] lg:w-[460px] flex flex-col bg-[#0c0d12] border-l border-white/5 overflow-y-auto h-full scrollbar-hidden">
          {/* User Header */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src={item.avatar} alt={item.author} className="w-12 h-12 rounded-full border border-white/10" />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-[#0c0d12]"></div>
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-white tracking-tight">{item.author}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] text-gray-500 font-light">{item.createdAt}</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span className="text-[11px] text-gray-500 font-light">内容由AI生成</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-500 hover:text-white p-2 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-white p-2 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center px-2">
                  <button onClick={handleLike} className="cursor-pointer">
                    <Heart className="w-5 h-5 text-white/40 hover:text-red-500 transition-colors" />
                  </button>
                  <span className="text-[10px] text-gray-500 mt-1">{item.likes}</span>
                </div>
                <button className="text-gray-500 hover:text-white p-2 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Prompt Content Card */}
            <div className="mb-8 group">
              <div className="bg-[#1e1f2b] rounded-2xl p-5 border border-white/5 relative hover:border-white/10 transition-colors">
                <p className="text-[13px] leading-relaxed text-gray-300 font-light tracking-wide">
                  {item.prompt}
                </p>
                <button 
                  className="absolute top-4 right-4 text-gray-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 p-1.5"
                  title="复制提示词"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reference Images Section */}
            {item.refImages && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-[12px] text-gray-500 font-medium uppercase tracking-wider">参考图</h5>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {item.refImages.map((img, i) => (
                    <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 relative group/ref cursor-pointer">
                      <img src={img} className="w-full h-full object-cover transition-transform group-hover/ref:scale-110" alt="" />
                      <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover/ref:opacity-100 transition-opacity" />
                    </div>
                  ))}
                  <div className="w-16 h-16 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-gray-600 hover:border-white/20 hover:text-gray-400 transition-all cursor-pointer">
                     <span className="text-xl">+</span>
                  </div>
                </div>
              </div>
            )}

            {/* Model & Meta Info */}
            <div className="space-y-5 py-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 font-light">模型信息：</span>
                <span className="text-[13px] text-gray-200 font-medium">{item.model}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 font-light">比例：</span>
                <span className="text-[13px] text-gray-200 font-medium">{item.ratio}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500 font-light">分辨率：</span>
                <span className="text-[13px] text-gray-200 font-medium">{item.resolution}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="mt-auto p-8 border-t border-white/5 bg-[#0c0d12]/80 backdrop-blur-md sticky bottom-0">
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center space-x-2 bg-[#1e1f2b] hover:bg-[#252636] border border-white/5 text-white py-3 rounded-2xl text-[13px] font-medium transition-all">
                <RotateCcw className="w-4 h-4 opacity-70" />
                <span>作为参考图</span>
              </button>
              <button className="flex-[1.2] flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl text-[13px] font-semibold transition-all shadow-[0_4px_15px_rgba(79,70,229,0.3)] group">
                <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>做同款</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetail;
