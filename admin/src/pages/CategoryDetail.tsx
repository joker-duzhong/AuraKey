import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Plus, ChevronDown, ArrowLeft, Image as ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import * as categoryService from "../services/categoryService";
import { useCategoryStore } from "../store/categoryStore";
import type { Category } from "../store/categoryStore";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ui/ConfirmModal";

interface PhraseItem {
  id: string;
  name: string;
  cover?: string;
  tags: string[];
}

const CategoryDetail: React.FC = () => {
  const { id, subName } = useParams<{ id: string; subName: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { categories, fetchCategories, loading: storeLoading } = useCategoryStore();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<PhraseItem[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PhraseItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    cover: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  // Confirm states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id, subName, categories]);

  const fetchData = async () => {
    if (!id || !subName) return;

    // Check if we already have the data in store
    let data = categories.find((c) => c.id === id);

    if (!data) {
      setLoading(true);
      try {
        // If not in store, fetch all (this will populate the store)
        await fetchCategories();
        data = useCategoryStore.getState().categories.find((c) => c.id === id);
      } catch (error) {
        showToast("加载数据失败", "error");
        setLoading(false);
        return;
      }
    }

    if (data) {
      setCategory(data);
      const sub = data.subCategories.find((s) => s.name === decodeURIComponent(subName));
      if (sub) {
        // Handle migration from phrases string[] to items objects if necessary
        const existingItems =
          sub.items ||
          (sub.phrases || []).map((p, idx) => ({
            id: `legacy-${idx}`,
            name: p,
            tags: [],
            cover: "",
          }));
        setItems(existingItems);
      }
      setLoading(false);
    } else if (!storeLoading) {
      setLoading(false);
    }
  };

  const handleSaveItem = async () => {
    if (!formData.name.trim() || !category || !subName) return;

    setModalLoading(true);
    try {
      const sub = category.subCategories.find((s) => s.name === decodeURIComponent(subName));
      if (!sub) throw new Error("子分类不存在");

      // Correctly merge existing items or migrate from phrases
      const currentItems =
        sub.items ||
        (sub.phrases || []).map((p, idx) => ({
          id: `legacy-${idx}`,
          name: p,
          tags: [],
          cover: "",
        }));

      let updatedItems;

      if (editingItem) {
        updatedItems = currentItems.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item));
      } else {
        updatedItems = [
          ...currentItems,
          {
            ...formData,
            id: Date.now().toString(),
          },
        ];
      }

      await categoryService.updateSubCategoryItems(category.id, decodeURIComponent(subName), updatedItems);
      showToast(editingItem ? "更新成功" : "添加成功");
      setIsModalOpen(false);
      fetchCategories(true); // Force refresh store after update
    } catch (error: any) {
      showToast(error.message || "操作失败", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete || !category || !subName) return;

    setModalLoading(true);
    try {
      const sub = category.subCategories.find((s) => s.name === decodeURIComponent(subName));
      if (!sub) throw new Error("子分类不存在");

      // Correctly handle migration/fallback
      const currentItems =
        sub.items ||
        (sub.phrases || []).map((p, idx) => ({
          id: `legacy-${idx}`,
          name: p,
          tags: [],
          cover: "",
        }));

      const updatedItems = currentItems.filter((item) => item.id !== itemToDelete);

      await categoryService.updateSubCategoryItems(category.id, decodeURIComponent(subName), updatedItems);
      showToast("删除成功");
      setConfirmOpen(false);
      fetchCategories(true); // Force refresh store after delete
    } catch (error: any) {
      showToast(error.message || "删除失败", "error");
    } finally {
      setModalLoading(false);
      setItemToDelete(null);
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    if (formData.tags.includes(newTag.trim())) {
      showToast("标签已存在", "error");
      return;
    }
    setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: "", cover: "", tags: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (item: PhraseItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, cover: item.cover || "", tags: item.tags || [] });
    setIsModalOpen(true);
  };

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{decodeURIComponent(subName || "")}</h2>
            <p className="text-sm text-gray-400">所属分类：{category?.mainCategory}</p>
          </div>
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
              placeholder="请输入你要搜索的内容"
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
          <Plus
            size={18}
            className="mr-2"
          />
          新建词条
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">封面</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">词条名称</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">标签</th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-20 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-gray-400">加载中...</span>
                  </div>
                </td>
              </tr>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon
                          size={20}
                          className="text-gray-300"
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={() => openEditModal(item)}
                    >
                      {item.name}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      {item.tags && item.tags.length > 0 ? (
                        item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-300 text-xs italic">无标签</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => {
                        setItemToDelete(item.id);
                        setConfirmOpen(true);
                      }}
                      className="text-rose-500 hover:text-rose-600 text-sm font-medium transition-colors"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-20 text-center text-gray-400"
                >
                  暂无词条，点击右上角新建
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <button
          className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 disabled:opacity-50"
          disabled
        >
          <ChevronLeft size={18} />
        </button>
        <button className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-medium">1</button>
        <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{editingItem ? "编辑词条" : "新建词条"}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">图片地址</label>
                <div className="flex space-x-3">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                    {formData.cover ? (
                      <img
                        src={formData.cover}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="text-gray-300" />
                    )}
                  </div>
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="请输入封面图片 URL"
                    value={formData.cover}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">词条名称</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="请输入词条名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">标签内容</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="输入标签按回车"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-medium"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm group"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-300 hover:text-blue-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-5 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                disabled={modalLoading}
              >
                取消
              </button>
              <button
                onClick={handleSaveItem}
                className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center"
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    同步中...
                  </>
                ) : (
                  "完成"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="删除词条"
        message="确定要删除这个词条吗？删除后不可恢复。"
        onConfirm={handleDeleteItem}
        onCancel={() => setConfirmOpen(false)}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default CategoryDetail;
