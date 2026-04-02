import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import whiskeyData from './whiskey_data.json';
import './App.css';

interface Whiskey {
  id: number;
  brand: string;
  name: string;
  quantity: string;
  price: number;
  priceStr: string;
  probability: number;
  grade: string;
  color: string;
}

function App() {
  const [items] = useState<Whiskey[]>(whiskeyData);
  const [results, setResults] = useState<Whiskey[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [drawCount, setDrawCount] = useState(1);

  const totalQty = items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const getQuantityPercent = (item: Whiskey) =>
    totalQty > 0 ? (Number(item.quantity) / totalQty) * 100 : 0;

  const drawWhiskey = () => {
    setIsDrawing(true);
    setResults([]);

    // Simulate drawing animation delay
    setTimeout(() => {
      const newResults: Whiskey[] = [];
      
      for (let i = 0; i < drawCount; i++) {
        // 뽑기 확률은 화면의 리스트처럼 "quantity/전체병수" 기준으로 맞춘다.
        const randomQty = Math.random() * (totalQty || 1);
        let cumulative = 0;
        let drawnItem = items[0]; // Fallback

        for (const item of items) {
          cumulative += Number(item.quantity);
          if (randomQty <= cumulative) {
            drawnItem = item;
            break;
          }
        }
        newResults.push(drawnItem);
      }

      setResults(newResults);
      setIsDrawing(false);

      // Fanfare for high grades in results
      const hasHighGrade = newResults.some(item => item.grade === 'SSR' || item.grade === 'SR');
      if (hasHighGrade) {
        const bestGrade = newResults.find(item => item.grade === 'SSR') ? 'SSR' : 'SR';
        triggerFanfare(bestGrade);
      }
    }, 2000);
  };

  const triggerFanfare = (grade: string) => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: grade === 'SSR' ? ['#facc15', '#fbbf24', '#f59e0b'] : ['#c084fc', '#a855f7', '#9333ea']
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: grade === 'SSR' ? ['#facc15', '#fbbf24', '#f59e0b'] : ['#c084fc', '#a855f7', '#9333ea']
      });
    }, 250);
  };

  return (
    <div className="app-container">
      <header>
        <h1>🥃 NAVI Whiskey Gacha</h1>
        <p>단 한 잔에 담긴 당신의 운명</p>
      </header>

      <main>
        <div className={`gacha-machine ${isDrawing ? 'animating' : ''}`}>
          {isDrawing ? (
            <div className="drawing-effect">
              <Sparkles className="icon-spin" size={64} color="#facc15" />
              <p>최고의 오크통을 고르는 중...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="results-container">
              {results.map((result, idx) => (
                <div key={`${result.id}-${idx}`} className={`result-card grade-${result.grade}`}>
                  <div className="grade-badge" style={{ backgroundColor: result.color }}>{result.grade}</div>
                  <h3>{result.brand}</h3>
                  <h2>{result.name}</h2>
                  <p className="price">{result.priceStr}</p>
                </div>
              ))}
              <button onClick={() => setResults([])} className="btn-retry">
                <RotateCcw size={20} /> 다시 시도하기
              </button>
            </div>
          ) : (
            <div className="idle-state">
              <Trophy size={80} color="#d97706" />
              <p>한 잔 시음하시겠습니까?</p>
              
              <div className="draw-selector">
                {[1, 5, 10].map(count => (
                  <button 
                    key={count} 
                    className={`count-btn ${drawCount === count ? 'active' : ''}`}
                    onClick={() => setDrawCount(count)}
                  >
                    {count}회
                  </button>
                ))}
              </div>

              <button onClick={drawWhiskey} className="btn-draw">
                {drawCount}회 뽑기
              </button>
            </div>
          )}
        </div>

        <div className="probability-table">
          <h3>컬렉션 및 획득 확률</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>등급</th>
                  <th>브랜드</th>
                  <th>제품명</th>
                  <th>확률</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><span className="badge" style={{ backgroundColor: item.color }}>{item.grade}</span></td>
                    <td>{item.brand}</td>
                    <td>{item.name}</td>
                    <td>{getQuantityPercent(item).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer>
        <p>© 2026 NAVI Whiskey Gacha. 지나친 음주는 건강에 해롭습니다.</p>
        <button className="sound-toggle" onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </footer>
    </div>
  );
}

export default App;
