
import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Image as ImageIcon, Sparkles, RotateCcw, Search, Cpu, FileText, CheckCircle2, Wand2, Trash2 } from 'lucide-react';
import { MenuItem } from './types';
import { extractMenuItemsFromImage } from './services/geminiService';
import { MenuManager } from './components/MenuManager';
import { Roulette } from './components/Roulette';

const LOCAL_STORAGE_KEY = 'menu_roulette_items_v5';

const LOADING_MESSAGES = [
  "画像を最適化中...",
  "AIがお品書きをスキャン中...",
  "手書きの文字を解読中...",
  "メニューを整理しています...",
  "もうすぐ完了します！"
];

const SAMPLE_ITEMS: string[] = ["醤油ラーメン", "カツカレー", "カルボナーラ", "特上牛丼", "おまかせ握り寿司", "天ぷら定食"];

const App: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [lastSaved, setLastSaved] = useState<string>('');

  // Helper: Resize image for faster processing
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1280;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height *= maxDim / width;
              width = maxDim;
            } else {
              width *= maxDim / height;
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
          setLastSaved(new Date().toLocaleTimeString());
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  // Auto-save to local storage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [items]);

  // Loading animation message cycle
  useEffect(() => {
    let interval: number;
    if (loading) {
      setLoadingMsgIndex(0);
      interval = window.setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const base64Data = await resizeImage(file);
      const extractedNames = await extractMenuItemsFromImage(base64Data);
      
      if (extractedNames && extractedNames.length > 0) {
        const newItems: MenuItem[] = extractedNames.map(name => ({
          id: crypto.randomUUID(),
          name
        }));
        // REPLACE current list with new items
        setItems(newItems);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("メニューが見つかりませんでした。別の写真を試してください。");
      }
    } catch (error) {
      console.error(error);
      alert("解析中にエラーが発生しました。インターネット接続を確認してください。");
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const addItem = (name: string) => setItems(prev => [...prev, { id: crypto.randomUUID(), name }]);
  const removeItem = (id: string) => setItems(prev => prev.filter(item => item.id !== id));
  const updateItem = (id: string, name: string) => setItems(prev => prev.map(item => item.id === id ? { ...item, name } : item));

  // Load Demo Data
  const loadSampleData = () => {
    const newItems: MenuItem[] = SAMPLE_ITEMS.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    setItems(newItems);
  };

  // Factory Reset / Initialize
  const initializeApp = useCallback(() => {
    if (window.confirm("アプリを初期化しますか？保存されたメニューリストもすべて削除されます。")) {
      setItems([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setLastSaved('');
      // Force page reload for a clean slate if necessary, but state management should suffice
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32 relative min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center border-4 border-orange-400">
            <div className="relative mb-6 flex justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-orange-100 opacity-75"></div>
              <div className="relative bg-orange-500 p-5 rounded-full text-white shadow-xl animate-bounce">
                <Cpu size={48} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-2">爆速解析中...</h3>
            <div className="h-16 flex items-center justify-center px-4 bg-orange-50 rounded-xl">
              <p className="text-orange-700 font-bold animate-pulse text-sm text-center">
                {LOADING_MESSAGES[loadingMsgIndex]}
              </p>
            </div>
          </div>
        </div>
      )}

      <header className="text-center mb-10">
        <h1 className="text-5xl font-black text-blue-950 mb-3 flex items-center justify-center gap-4">
          <span className="bg-yellow-400 p-3 rounded-2xl -rotate-3 shadow-xl border-2 border-white">🍲</span>
          メニュールーレット
        </h1>
        <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px] flex items-center justify-center gap-2">
          AI Selection {items.length > 0 && lastSaved && (
            <span className="text-green-500 flex items-center gap-1">
              <CheckCircle2 size={12}/> 保存済み ({lastSaved})
            </span>
          )}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          {/* Scan Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-800">
              <span className="bg-orange-100 p-2 rounded-lg text-orange-500">📸</span> 
              お品書きを読込
            </h2>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center w-full h-44 border-4 border-dashed rounded-3xl cursor-pointer transition-all duration-300
                  ${loading ? 'bg-gray-100 border-gray-200 pointer-events-none' : 'bg-orange-50/30 border-orange-200 hover:bg-orange-50 hover:border-orange-400 hover:scale-[1.01]'}
                `}
              >
                <ImageIcon className={`w-12 h-12 mb-3 ${loading ? 'text-gray-300' : 'text-orange-400 group-hover:text-orange-500'}`} />
                <span className={`text-lg font-black ${loading ? 'text-gray-300' : 'text-gray-700 group-hover:text-orange-600'}`}>
                  {loading ? '読み込み中...' : '写真をスキャン'}
                </span>
                <p className="text-[11px] text-gray-400 font-bold mt-2 px-4 text-center leading-tight">
                  ※スキャンすると現在のリストは<br/>新しく上書きされます
                </p>
              </label>
            </div>
          </div>

          <MenuManager 
            items={items} 
            onAdd={addItem} 
            onRemove={removeItem} 
            onUpdate={updateItem} 
            onLoadSample={loadSampleData}
          />

          {items.length > 0 && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={initializeApp}
                className="w-full py-4 bg-white rounded-2xl text-red-500 hover:bg-red-50 border-2 border-dashed border-red-200 flex items-center justify-center gap-2 transition-all text-sm font-black shadow-sm"
              >
                <Trash2 size={18} /> アプリを初期化する
              </button>
              <p className="text-[10px] text-gray-400 text-center font-bold">初期化すると全てのデータが消去されます</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-blue-50 sticky top-8 flex flex-col items-center ring-1 ring-blue-900/5">
            <div className="mb-10 w-full text-center">
              <h2 className="text-3xl font-black text-blue-950 inline-flex items-center gap-3">
                <Sparkles className="text-yellow-500 fill-yellow-500" />
                お楽しみ抽選
              </h2>
              <p className="text-gray-400 text-sm mt-1 font-bold">何を食べるか迷った時の救世主</p>
            </div>
            
            <Roulette items={items} />
          </div>
        </div>
      </div>

      {/* Footer Mobile Nav */}
      <footer className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 py-4 px-8 flex justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
        <button 
          onClick={() => document.getElementById('file-upload')?.click()}
          className="flex flex-col items-center gap-1 text-orange-500 font-black"
        >
          <Camera size={24} />
          <span className="text-[10px]">スキャン</span>
        </button>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-blue-600 font-black"
        >
          <RotateCcw size={24} />
          <span className="text-[10px]">トップ</span>
        </button>
        <button 
          onClick={initializeApp}
          className={`flex flex-col items-center gap-1 font-black text-red-500`}
        >
          <Trash2 size={24} />
          <span className="text-[10px]">初期化</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
