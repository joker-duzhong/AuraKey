import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Search, Heart, ImageIcon, ArrowUp, Share2, Download } from 'lucide-react';
import { galleryData, type GalleryItem } from '../mock/gallery';
import GalleryDetail from '../components/gallery/GalleryDetail';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(galleryData);
  const [filter, setFilter] = useState<'Newest' | 'Hottest'>('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 0. 过滤与排序逻辑
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let result = galleryData.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.prompt.toLowerCase().includes(query)
    );

    if (filter === 'Hottest') {
      result = [...result].sort((a, b) => b.likes - a.likes);
    } else {
      // 默认按日期排序，处理日期字符串为 Date 对象
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.createdAt.replace(/\./g, '/')).getTime();
        const dateB = new Date(b.createdAt.replace(/\./g, '/')).getTime();
        return dateB - dateA;
      });
    }
    return result;
  }, [searchQuery, filter]);

  // 当搜索或过滤改变时，重置显示的项目
  useEffect(() => {
    setItems(filteredData);
  }, [filteredData]);

  // 1. 动态自适应列数
  const getColumnCount = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width >= 1536) return 6; // 超大屏
    if (width >= 1280) return 5; // 大桌面
    if (width >= 1024) return 4; // 普通桌面
    if (width >= 768) return 3;  // iPad / 平板
    return 2;                    // 移动端
  };

  const [cols, setCols] = useState(getColumnCount());

  useEffect(() => {
    const handleResize = () => setCols(getColumnCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. 正式的瀑布流算法：高度优先贪婪分配
  const columnData = useMemo(() => {
    const columns: GalleryItem[][] = Array.from({ length: cols }, () => []);
    const heights = new Array(cols).fill(0);

    items.forEach((item) => {
      // 找到当前高度最短的那一列
      let shortestIndex = 0;
      for (let i = 1; i < cols; i++) {
        if (heights[i] < heights[shortestIndex]) {
          shortestIndex = i;
        }
      }
      
      columns[shortestIndex].push(item);
      // 使用纵横比累加高度 (height / width)
      heights[shortestIndex] += item.height / item.width;
    });

    return columns;
  }, [items, cols]);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const moreItems = filteredData.map(item => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setItems(prev => [...prev, ...moreItems]);
      setLoading(false);
    }, 1000);
  }, [loading, filteredData]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        loadMore();
      }
      setShowBackToTop(scrollTop > 400);
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pb-24" ref={scrollContainerRef}>
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 mt-2">
        <div className="flex bg-[#1e202b] rounded-xl p-1 gap-1 w-full sm:w-auto">
          <button 
            onClick={() => setFilter('Newest')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === 'Newest' ? 'bg-[#4f46e5]/20 text-[#818cf8] border border-[#4f46e5]/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            最新
          </button>
          <button 
            onClick={() => setFilter('Hottest')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === 'Hottest' ? 'bg-[#4f46e5]/20 text-[#818cf8] border border-[#4f46e5]/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            最热
          </button>
        </div>

        <div className="relative w-full sm:flex-1 sm:max-w-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#3b82f6] transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索画廊内容..." 
            className="w-full bg-[#1e202b] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm font-light focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/50 transition-all placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Waterfall Gallery - 使用 Flex 容器承载列 */}
      <div className="flex gap-4">
        {columnData.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-4">
            {col.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#1e202b] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)]"
              >
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                        <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-white/90 font-light truncate max-w-[80px]">{item.author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2.5">
                      <button className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                      <div className="flex items-center space-x-1 text-white/70 group/like">
                        <Heart className="w-4 h-4 group-hover/like:text-red-500 group-hover/like:fill-red-500 transition-all" />
                        <span className="text-xs font-light">{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="flex space-x-1.5">
            {[0, 1, 2].map(i => (
              <div 
                key={i}
                className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce" 
                style={{ animationDelay: `${i * 0.15}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Generate Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <button className="bg-[#1e1f2b]/90 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl flex items-center space-x-3 hover:bg-[#252636] transition-all group shadow-2xl">
          <div className="bg-[#2d2e3f] p-2 rounded-xl group-hover:bg-[#3b82f6] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-200">图片生成器</span>
        </button>
      </div>

      {/* Scroll to Top */}
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 bg-[#1e1f2b]/90 border border-white/5 p-3 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all z-40 group shadow-xl"
        >
          <ArrowUp className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
        </button>
      )}

      {/* Gallery Detail Modal */}
      {selectedItem && (
        <GalleryDetail 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default Gallery;
