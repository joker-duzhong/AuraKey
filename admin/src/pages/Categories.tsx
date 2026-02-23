import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  ChevronDown,
  Pencil,
  PlusSquare,
  MinusSquare
} from 'lucide-react';
import * as categoryService from '../services/categoryService';
import { useCategoryStore } from '../store/categoryStore';
import type { Category } from '../store/categoryStore';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ui/ConfirmModal';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { 
    categories, 
    loading: storeLoading, 
    fetchCategories,
  } = useCategoryStore();

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('全部类型');

  // Modal states
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isPhraseModalOpen, setIsPhraseModalOpen] = useState(false);


  // Confirm states
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Status states
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategoryIndex, setEditingSubCategoryIndex] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [currentPhrases, setCurrentPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCategories(true);
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Main Category Handlers
  const handleAddMainCategory = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setModalError(null);
    setIsMainModalOpen(true);
  };

  const handleEditMainCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.mainCategory);
    setModalError(null);
    setIsMainModalOpen(true);
  };

  const saveMainCategory = async () => {
    if (!newCategoryName.trim()) return;

    setModalLoading(true);
    setModalError(null);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, { mainCategory: newCategoryName });
        showToast('更新成功');
      } else {
        await categoryService.createCategory({ mainCategory: newCategoryName, subCategories: [] });
        showToast('创建成功');
      }
      setIsMainModalOpen(false);
      fetchCategories(true); // Force refresh
    } catch (error: any) {
      setModalError(error.message || '保存失败');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: '删除一级目录',
      message: '确定要删除这个一级目录及其下所有二级目录吗？此操作不可撤销。',
      onConfirm: async () => {
        setModalLoading(true);
        try {
          await categoryService.deleteCategory(id);
          showToast('删除成功');
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
          fetchCategories(true); // Force refresh
        } catch (error: any) {
          showToast(error.message || '删除失败', 'error');
        } finally {
          setModalLoading(false);
        }
      }
    });
  };

  // Sub Category Handlers
  const handleAddSubCategory = (category: Category) => {
    setEditingCategory(category);
    setEditingSubCategoryIndex(null);
    setNewSubCategoryName('');
    setModalError(null);
    setIsSubModalOpen(true);
  };

  const handleEditSubCategory = (category: Category, index: number) => {
    setEditingCategory(category);
    setEditingSubCategoryIndex(index);
    setNewSubCategoryName(category.subCategories[index].name);
    setModalError(null);
    setIsSubModalOpen(true);
  };

  const saveSubCategory = async () => {
    if (!newSubCategoryName.trim() || !editingCategory) return;

    setModalLoading(true);
    setModalError(null);

    const updatedSubCategories = [...editingCategory.subCategories];
    if (editingSubCategoryIndex !== null) {
      updatedSubCategories[editingSubCategoryIndex].name = newSubCategoryName;
    } else {
      updatedSubCategories.push({ name: newSubCategoryName, phrases: [] });
    }

    try {
      await categoryService.updateCategory(editingCategory.id, { subCategories: updatedSubCategories });
      showToast('设置成功');
      setIsSubModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      setModalError(error.message || '保存失败');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteSubCategory = (category: Category, index: number) => {
    setConfirmConfig({
      isOpen: true,
      title: '删除二级目录',
      message: `确定要删除二级目录 "${category.subCategories[index].name}" 吗？`,
      onConfirm: async () => {
        setModalLoading(true);
        const updatedSubCategories = category.subCategories.filter((_, i) => i !== index);
        try {
          await categoryService.updateCategory(category.id, { subCategories: updatedSubCategories });
          showToast('删除成功');
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
          fetchCategories();
        } catch (error: any) {
          showToast(error.message || '删除失败', 'error');
        } finally {
          setModalLoading(false);
        }
      }
    });
  };

  // Phrase Handlers
  const handleViewPhrases = (category: Category, index: number) => {
    const subName = category.subCategories[index].name;
    navigate(`/categories/${category.id}/${encodeURIComponent(subName)}`);
  };

  const addPhrase = () => {
    if (!newPhrase.trim()) return;
    if (currentPhrases.includes(newPhrase.trim())) {
      setModalError('该标签已存在');
      return;
    }
    setModalError(null);
    setCurrentPhrases([...currentPhrases, newPhrase.trim()]);
    setNewPhrase('');
  };

  const removePhrase = (phraseToRemove: string) => {
    setCurrentPhrases(currentPhrases.filter(p => p !== phraseToRemove));
  };

  const savePhrases = async () => {
    if (!editingCategory || editingSubCategoryIndex === null) return;

    setModalLoading(true);
    setModalError(null);

    const updatedSubCategories = [...editingCategory.subCategories];
    updatedSubCategories[editingSubCategoryIndex].phrases = currentPhrases;

    try {
      await categoryService.updateCategory(editingCategory.id, { subCategories: updatedSubCategories });
      showToast('标签更新成功');
      setIsPhraseModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      setModalError(error.message || '保存失败');
    } finally {
      setModalLoading(false);
    }
  };

  const renderCategoryRow = (category: Category) => {
    const isExpanded = expandedRows.has(category.id);

    return (
      <React.Fragment key={category.id}>
        <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
          <td className="py-4 px-6">
            <div className="flex items-center">
              <button 
                onClick={() => toggleRow(category.id)}
                className="mr-3 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
              >
                {isExpanded ? <MinusSquare size={18} /> : <PlusSquare size={18} />}
              </button>
              <div 
                className="flex items-center group cursor-pointer"
                onClick={() => handleEditMainCategory(category)}
              >
                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.mainCategory}
                </span>
                <Pencil 
                  size={14} 
                  className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 transition-all" 
                />
              </div>
            </div>
          </td>
          <td className="py-4 px-6 text-right">
            <div className="flex items-center justify-end space-x-6">
              <button 
                onClick={() => handleAddSubCategory(category)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                新建二级目录
              </button>
              <button 
                onClick={() => handleDelete(category.id)}
                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center"
              >
                删除
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && category.subCategories.length > 0 && category.subCategories.map((sub, index) => (
          <tr key={`${category.id}-${index}`} className="border-b border-gray-100 bg-gray-50/20 hover:bg-gray-50/50 transition-colors">
            <td className="py-4 px-6">
              <div 
                className="flex items-center ml-12 group cursor-pointer"
                onClick={() => handleEditSubCategory(category, index)}
              >
                <span className="text-gray-900 group-hover:text-blue-600 transition-colors">
                  {sub.name}
                </span>
                <Pencil 
                  size={14} 
                  className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 transition-all" 
                />
              </div>
            </td>
            <td className="py-4 px-6 text-right">
              <div className="flex items-center justify-end space-x-6">
                <button 
                  onClick={() => handleViewPhrases(category, index)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  查看标签
                </button>
                <button 
                  onClick={() => handleDeleteSubCategory(category, index)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
        ))}
        {isExpanded && category.subCategories.length === 0 && (
          <tr className="border-b border-gray-100 bg-gray-50/10">
            <td colSpan={2} className="py-4 px-6 text-center text-gray-400 text-xs">
              无二级目录，点击右侧“新建二级目录”添加
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const filteredCategories = categories.filter(cat => {
    // Type filter
    if (selectedType !== '全部类型' && cat.mainCategory !== selectedType) return false;
    
    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const matchMain = cat.mainCategory.toLowerCase().includes(lowerSearch);
      const matchSub = cat.subCategories.some(sub => 
        sub.name.toLowerCase().includes(lowerSearch) || 
        sub.phrases.some(p => p.toLowerCase().includes(lowerSearch))
      );
      if (!matchMain && !matchSub) return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="搜索目录或标签..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-48 relative">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-600"
            >
              <option value="全部类型">全部类型</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.mainCategory}>{cat.mainCategory}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <ChevronDown size={18} />
            </span>
          </div>
          <button 
            type="submit"
            disabled={storeLoading}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg transition-all flex items-center justify-center min-w-[80px]"
          >
            {storeLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : '搜索'}
          </button>
        </form>
        
        <button 
          onClick={handleAddMainCategory}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={18} className="mr-2" />
          新建一级目录
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">目录名称</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {storeLoading ? (
              <tr>
                <td colSpan={2} className="py-20 text-center text-gray-400">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    加载中...
                  </div>
                </td>
              </tr>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map(category => renderCategoryRow(category))
            ) : (
              <tr>
                <td colSpan={2} className="py-20 text-center text-gray-400">
                  {searchTerm ? '未找到相关目录' : '发现没有目录，请点击上面按钮创建'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Main Category Modal */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? '编辑一级目录' : '新建一级目录'}
              </h3>
              <button onClick={() => setIsMainModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">目录名称</label>
              <input
                type="text"
                autoFocus
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="请输入一级目录名称"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={modalLoading}
              />
              {modalError && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <span className="mr-1">⚠️</span> {modalError}
                </p>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={() => setIsMainModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                disabled={modalLoading}
              >
                取消
              </button>
              <button 
                onClick={saveMainCategory}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center disabled:bg-blue-400"
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    保存中...
                  </>
                ) : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Category Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingSubCategoryIndex !== null ? '编辑二级目录' : '新建二级目录'}
              </h3>
              <p className="text-sm text-gray-400 mt-1">所属一级：{editingCategory?.mainCategory}</p>
              <button onClick={() => setIsSubModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">目录名称</label>
              <input
                type="text"
                autoFocus
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="请输入二级目录名称"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                disabled={modalLoading}
              />
              {modalError && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <span className="mr-1">⚠️</span> {modalError}
                </p>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={() => setIsSubModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                disabled={modalLoading}
              >
                取消
              </button>
              <button 
                onClick={saveSubCategory}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center disabled:bg-blue-400"
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    保存中...
                  </>
                ) : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phrase Management Modal */}
      {isPhraseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">管理标签</h3>
                <p className="text-sm text-gray-400">{editingCategory?.mainCategory} / {editingSubCategoryIndex !== null && editingCategory?.subCategories[editingSubCategoryIndex].name}</p>
              </div>
              <button onClick={() => setIsPhraseModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {modalError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                  <span className="mr-2">⚠️</span> {modalError}
                </div>
              )}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">添加新标签</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="输入标签名称按回车或点添加"
                    value={newPhrase}
                    onChange={(e) => {
                      setNewPhrase(e.target.value);
                      if (modalError) setModalError(null);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && addPhrase()}
                  />
                  <button 
                    onClick={addPhrase}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                  >
                    添加
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">已有标签 ({currentPhrases.length})</label>
                <div className="flex flex-wrap gap-2">
                  {currentPhrases.map((phrase, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm group"
                    >
                      {phrase}
                      <button 
                        onClick={() => removePhrase(phrase)}
                        className="ml-2 text-blue-300 hover:text-blue-600 transition-colors"
                      >
                        <Plus size={14} className="rotate-45" />
                      </button>
                    </span>
                  ))}
                  {currentPhrases.length === 0 && (
                    <p className="text-gray-400 text-sm italic">暂无标签，请添加</p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={() => setIsPhraseModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                disabled={modalLoading}
              >
                取消
              </button>
              <button 
                onClick={savePhrases}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center disabled:bg-blue-400"
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    保存中...
                  </>
                ) : '保存更改'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default Categories;
