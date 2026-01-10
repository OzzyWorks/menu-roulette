
import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Trash2, Edit2, Check, X, Wand2 } from 'lucide-react';

interface MenuManagerProps {
  items: MenuItem[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, name: string) => void;
  onLoadSample: () => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({ items, onAdd, onRemove, onUpdate, onLoadSample }) => {
  const [newItemName, setNewItemName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim());
      setNewItemName('');
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdate(editingId, editingName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-blue-600">📋</span> メニューリスト
      </h2>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="メニュー名を入力..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1 font-bold text-sm whitespace-nowrap"
        >
          <Plus size={18} /> 追加
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2 pr-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <p className="text-gray-400 text-center text-sm leading-relaxed">
              メニューがありません。<br/>
              スキャンするか手動で追加してください。
            </p>
            <button 
              onClick={onLoadSample}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full border border-purple-100 hover:bg-purple-100 transition-all font-bold text-xs"
            >
              <Wand2 size={14} /> サンプルメニューを読み込む
            </button>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg group border border-transparent hover:border-gray-200 transition-all">
              <span className="text-xs font-bold text-gray-400 w-5">{index + 1}</span>
              {editingId === item.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-green-600 p-1 hover:bg-green-50 rounded"><Check size={18} /></button>
                  <button onClick={() => setEditingId(null)} className="text-red-500 p-1 hover:bg-red-50 rounded"><X size={18} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 truncate font-medium text-gray-700 text-sm">{item.name}</span>
                  <button
                    onClick={() => startEdit(item)}
                    className="text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        {items.length > 0 && (
          <button 
            onClick={onLoadSample}
            className="text-[10px] text-purple-500 font-bold hover:underline flex items-center gap-1"
          >
            <Wand2 size={10} /> サンプルを追加
          </button>
        )}
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          Total {items.length} items
        </div>
      </div>
    </div>
  );
};
