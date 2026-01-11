import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Download, Upload } from 'lucide-react';
import { MenuItem } from '../types';

interface SavedMenuList {
  id: string;
  name: string;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

interface MenuListManagerProps {
  currentItems: MenuItem[];
  onLoadMenuList: (items: MenuItem[]) => void;
  onSaveCurrentList: () => void;
}

const SAVED_LISTS_KEY = 'menu_roulette_saved_lists';

export const MenuListManager: React.FC<MenuListManagerProps> = ({ 
  currentItems, 
  onLoadMenuList,
  onSaveCurrentList 
}) => {
  const [savedLists, setSavedLists] = useState<SavedMenuList[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Load saved lists from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_LISTS_KEY);
    if (saved) {
      try {
        setSavedLists(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved lists:', e);
      }
    }
  }, []);

  // Save lists to localStorage
  const saveLists = (lists: SavedMenuList[]) => {
    localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify(lists));
    setSavedLists(lists);
  };

  // Save current menu list
  const handleSave = () => {
    if (!newListName.trim()) {
      alert('メニュー名を入力してください');
      return;
    }

    if (currentItems.length === 0) {
      alert('保存するメニューがありません');
      return;
    }

    const now = new Date().toISOString();
    const newList: SavedMenuList = {
      id: crypto.randomUUID(),
      name: newListName.trim(),
      items: currentItems,
      createdAt: now,
      updatedAt: now
    };

    saveLists([...savedLists, newList]);
    setNewListName('');
    setShowSaveDialog(false);
    onSaveCurrentList();
    alert(`「${newList.name}」を保存しました！`);
  };

  // Load a saved menu list
  const handleLoad = (list: SavedMenuList) => {
    if (window.confirm(`「${list.name}」を読み込みますか？\n現在のリストは上書きされます。`)) {
      onLoadMenuList(list.items);
      setShowLoadDialog(false);
      alert(`「${list.name}」を読み込みました！`);
    }
  };

  // Delete a saved list
  const handleDelete = (listId: string, listName: string) => {
    if (window.confirm(`「${listName}」を削除しますか？`)) {
      saveLists(savedLists.filter(list => list.id !== listId));
      alert(`「${listName}」を削除しました`);
    }
  };

  // Export all lists as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(savedLists, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `menu-lists-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import lists from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          saveLists([...savedLists, ...imported]);
          alert(`${imported.length} 件のリストをインポートしました`);
        }
      } catch (error) {
        alert('ファイルの読み込みに失敗しました');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-purple-600">💾</span> メニューリスト管理
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setShowSaveDialog(true)}
          disabled={currentItems.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-bold text-sm transition-colors"
        >
          <Save size={18} /> 現在のリストを保存
        </button>
        
        <button
          onClick={() => setShowLoadDialog(true)}
          disabled={savedLists.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-bold text-sm transition-colors"
        >
          <FolderOpen size={18} /> 保存済みリストを開く
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          disabled={savedLists.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 text-gray-700 rounded-lg font-bold text-xs transition-colors"
        >
          <Download size={14} /> エクスポート
        </button>
        
        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xs transition-colors cursor-pointer">
          <Upload size={14} /> インポート
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        保存済み: {savedLists.length} 件
      </p>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">メニューリストを保存</h3>
            <p className="text-sm text-gray-600 mb-4">
              現在のメニューリスト（{currentItems.length} 件）を保存します
            </p>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="例: 駅前ラーメン屋のメニュー"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[80vh] flex flex-col">
            <h3 className="text-xl font-bold mb-4">保存済みリストを開く</h3>
            
            {savedLists.length === 0 ? (
              <p className="text-gray-500 text-center py-8">保存済みのリストがありません</p>
            ) : (
              <div className="overflow-y-auto flex-1 space-y-2 mb-4">
                {savedLists.map((list) => (
                  <div
                    key={list.id}
                    className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{list.name}</h4>
                        <p className="text-xs text-gray-500">
                          {list.items.length} 件のメニュー
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(list.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoad(list)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold"
                        >
                          開く
                        </button>
                        <button
                          onClick={() => handleDelete(list.id, list.name)}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setShowLoadDialog(false)}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
