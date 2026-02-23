import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Trash2,
  Image as ImageIcon,
  X,
  Pencil,
  ChevronDown
} from 'lucide-react';
import * as srefService from '../services/srefService';
import { useSrefStore } from '../store/srefStore';
import type { Sref } from '../services/srefService';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ui/ConfirmModal';

const Srefs: React.FC = () => {
  const { showToast } = useToast();
  const { srefs, fetchSrefs, loading: storeLoading } = useSrefStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingSref, setEditingSref] = useState<Sref | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    code: '',
    previewUrl: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  // Confirm states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchSrefs();
  }, [fetchSrefs]);

  const handleSaveSref = async () => {
    if (!formData.code.trim()) return;
    
    setModalLoading(true);
    try {
      if (editingSref) {
        await srefService.updateSref(editingSref.id, formData);
        showToast('更新成功');
      } else {
        await srefService.createSref(formData);
        showToast('添加成功');
      }
      setIsModalOpen(false);
      fetchSrefs(true);
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteSref = async () => {
    if (!itemToDelete) return;

    setModalLoading(true);
    try {
      await srefService.deleteSref(itemToDelete);
      showToast('删除成功');
      setConfirmOpen(false);
      fetchSrefs(true);
    } catch (error: any) {
      showToast(error.message || '删除失败', 'error');
    } finally {
      setModalLoading(false);
      setItemToDelete(null);
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    if (formData.tags.includes(newTag.trim())) {
      showToast('标签已存在', 'error');
      return;
    }
    setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const openAddModal = () => {
    setEditingSref(null);
    setFormData({ code: '', previewUrl: '', tags: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (sref: Sref) => {
    setEditingSref(sref);
    setFormData({ 
      code: sref.code, 
      previewUrl: sref.previewUrl || '', 
      tags: sref.tags || [] 
    });
    setIsModalOpen(true);
  };

  const filteredSrefs = srefs.filter(sref => 
    sref.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sref.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">MJ 风格码管理</h2>
          <p className="text-sm text-gray-400">管理 Midjourney --sref 风格码、预览图和标签</p>
        </div>
      </div>

      {/* Search and Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="搜索风格码或标签"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-48 relative">
            <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-600">
              <option>全部类型</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <ChevronDown size={18} />
            </span>
          </div>
        </div>
        
        <button 
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#0091ff] hover:bg-[#007ce6] text-white font-medium rounded-lg flex items-center transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} className="mr-2" />
          添加风格码
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">预览图</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">风格代码 (Code)</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">标签</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {storeLoading && srefs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-gray-400">加载中...</span>
                  </div>
                </td>
              </tr>
            ) : filteredSrefs.length > 0 ? (
              filteredSrefs.map((sref) => (
                <tr key={sref.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                      {sref.previewUrl ? (
                        <img src={sref.previewUrl} alt={sref.code} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => openEditModal(sref)}>
                      {sref.code}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      {sref.tags && sref.tags.length > 0 ? sref.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                          {tag}
                        </span>
                      )) : (
                        <span className="text-gray-300 text-xs italic">无标签</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => openEditModal(sref)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="编辑"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setItemToDelete(sref.id);
                          setConfirmOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-400">
                  未找到相关风格码
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSref ? '编辑风格码' : '添加风格码'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">风格代码 (Code)</label>
                <input 
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="例如: 123456789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">预览图 URL</label>
                <input 
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  value={formData.previewUrl}
                  onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">标签</label>
                <div className="flex space-x-2 mb-3">
                  <input 
                    type="text"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="输入标签并按回车"
                  />
                  <button 
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm border border-blue-100 transition-all hover:bg-blue-100">
                      <span>{tag}</span>
                      <button onClick={() => removeTag(tag)} className="text-blue-400 hover:text-blue-600 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && (
                    <span className="text-sm text-gray-400 italic">暂无标签</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 bg-gray-50/50 border-t border-gray-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                disabled={modalLoading}
              >
                取消
              </button>
              <button 
                onClick={handleSaveSref}
                className="flex items-center space-x-2 bg-[#0091ff] hover:bg-[#007ce6] text-white px-6 py-2.5 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:scale-100"
                disabled={modalLoading}
              >
                {modalLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{editingSref ? '保存更改' : '立即创建'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmOpen}
        title="删除风格码"
        message="确定要删除这个风格码吗？该操作将从系统中永久移除此数据，不可撤销。"
        confirmText="确认删除"
        cancelText="取消"
        onConfirm={handleDeleteSref}
        onCancel={() => setConfirmOpen(false)}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default Srefs;
