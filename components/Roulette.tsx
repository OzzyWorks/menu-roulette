
import React, { useState, useEffect, useRef } from 'react';
import { MenuItem, RouletteState } from '../types';
import { playTaDaSound, playTickSound } from '../services/audioService';

interface RouletteProps {
  items: MenuItem[];
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
  '#F7DC6F', '#BB8FCE', '#82E0AA', '#F1948A', '#85C1E9'
];

export const Roulette: React.FC<RouletteProps> = ({ items }) => {
  const [state, setState] = useState<RouletteState>('idle');
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<MenuItem | null>(null);
  
  const rotationRef = useRef(0);
  const lastTickAngleRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  const spinSpeedRef = useRef(0);
  const stateRef = useRef<RouletteState>('idle');

  // Sync state ref
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Reset internal state when items list changes (initialization, new scan, etc.)
  useEffect(() => {
    setState('idle');
    setRotation(0);
    setWinner(null);
    rotationRef.current = 0;
    spinSpeedRef.current = 0;
    lastTickAngleRef.current = 0;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, [items]);

  const numItems = items.length;
  const arcSize = 360 / Math.max(numItems, 1);

  useEffect(() => {
    const currentAngle = rotation;
    const step = arcSize;
    
    if (Math.abs(currentAngle - lastTickAngleRef.current) >= step) {
      if (state === 'spinning' || state === 'slowing') {
        playTickSound(state === 'spinning' ? 0.15 : 0.05);
      }
      lastTickAngleRef.current = currentAngle;
    }
  }, [rotation, state, arcSize]);

  const spin = () => {
    if (stateRef.current === 'spinning') {
      spinSpeedRef.current = Math.min(spinSpeedRef.current + 0.5, 18);
      rotationRef.current += spinSpeedRef.current;
      setRotation(rotationRef.current);
      requestRef.current = requestAnimationFrame(spin);
    } else if (stateRef.current === 'slowing') {
      spinSpeedRef.current *= 0.988;
      rotationRef.current += spinSpeedRef.current;
      setRotation(rotationRef.current);

      if (spinSpeedRef.current < 0.1) {
        setState('finished');
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        playTaDaSound();
        
        const normalizedRotation = (rotationRef.current % 360 + 360) % 360;
        const winningAngle = (360 - normalizedRotation) % 360;
        const winningIndex = Math.floor(winningAngle / arcSize);
        setWinner(items[winningIndex]);
      } else {
        requestRef.current = requestAnimationFrame(spin);
      }
    }
  };

  const handleStart = () => {
    if (numItems < 2) {
      alert("メニューを2つ以上登録してください。");
      return;
    }
    setWinner(null);
    spinSpeedRef.current = 3;
    setState('spinning');
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(spin);
  };

  const handleStop = () => {
    if (stateRef.current === 'spinning') {
      setState('slowing');
    }
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (numItems === 0) {
    return (
      <div className="bg-gray-800 rounded-3xl p-14 text-center text-white border-4 border-yellow-500 shadow-inner w-full max-w-sm">
        <p className="text-2xl font-black mb-3">リストが空です</p>
        <p className="text-sm text-gray-400 leading-relaxed">
          カメラでメニューを撮るか、<br/>
          手動で追加してください。
        </p>
      </div>
    );
  }

  const getSlicePath = (index: number) => {
    const startAngle = index * arcSize;
    const endAngle = (index + 1) * arcSize;
    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
    const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
    const largeArcFlag = arcSize > 180 ? 1 : 0;
    return `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <div className="relative w-72 h-72 md:w-[420px] md:h-[420px]">
        {/* Pointer Arrow */}
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 w-12 h-12 drop-shadow-2xl">
          <div className="w-0 h-0 border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent border-r-[40px] border-r-red-600"></div>
        </div>

        {/* Circular Wheel */}
        <div 
          className="w-full h-full rounded-full border-[14px] border-yellow-400 shadow-[0_15px_40px_rgba(0,0,0,0.2)] relative overflow-hidden bg-white"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {items.map((item, i) => (
              <g key={item.id}>
                <path
                  d={getSlicePath(i)}
                  fill={COLORS[i % COLORS.length]}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
                <text
                  x="78"
                  y="50"
                  fill="white"
                  fontSize={numItems > 15 ? "2" : numItems > 8 ? "3" : "4"}
                  fontWeight="black"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${i * arcSize + arcSize / 2}, 50, 50)`}
                  style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                >
                  {item.name.length > 8 ? item.name.substring(0, 7) + '..' : item.name}
                </text>
              </g>
            ))}
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border-8 border-yellow-400 rounded-full z-10 shadow-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm flex gap-4">
        {state === 'idle' || state === 'finished' ? (
          <button
            onClick={handleStart}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-6 rounded-2xl shadow-[0_8px_0_rgb(185,28,28)] transform active:translate-y-1 active:shadow-none transition-all text-3xl uppercase tracking-tighter"
          >
            スタート！
          </button>
        ) : state === 'spinning' ? (
          <button
            onClick={handleStop}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-black py-6 rounded-2xl shadow-[0_8px_0_rgb(202,138,4)] transform active:translate-y-1 active:shadow-none transition-all text-3xl"
          >
            ストップ！
          </button>
        ) : (
          <button
            disabled
            className="flex-1 bg-gray-400 text-white font-black py-6 rounded-2xl shadow-[0_8px_0_rgb(156,163,175)] text-3xl cursor-not-allowed"
          >
            ...
          </button>
        )}
      </div>

      {state === 'finished' && winner && (
        <div className="mt-2 text-center animate-in zoom-in duration-300">
          <div className="inline-block bg-white px-12 py-8 rounded-[2rem] border-[8px] border-red-500 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-3 bg-red-500/20 animate-pulse"></div>
             <p className="text-gray-400 text-xs mb-2 font-black uppercase tracking-widest">Selected Item</p>
             <h3 className="text-4xl md:text-5xl font-black text-red-600 font-pixel drop-shadow-sm leading-tight">
               {winner.name}
             </h3>
             <div className="mt-4 text-sm text-gray-500 font-bold">本日はこちらをお召し上がりください！</div>
          </div>
        </div>
      )}
    </div>
  );
};
