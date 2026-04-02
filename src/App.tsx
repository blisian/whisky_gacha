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
  const [result, setResult] = useState<Whiskey | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const drawWhiskey = () => {
    setIsDrawing(true);
    setResult(null);

    // Simulate drawing animation delay
    setTimeout(() => {
      const random = Math.random() * 100;
      let cumulative = 0;
      let drawnItem = items[items.length - 1]; // Fallback

      for (const item of items) {
        cumulative += item.probability;
        if (random <= cumulative) {
          drawnItem = item;
          break;
        }
      }

      setResult(drawnItem);
      setIsDrawing(false);

      // Fanfare for high grades
      if (drawnItem.grade === 'SSR' || drawnItem.grade === 'SR') {
        triggerFanfare(drawnItem.grade);
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
        <h1>🥃 Premium Whiskey Gacha</h1>
        <p>Your destiny in a single dram</p>
      </header>

      <main>
        <div className={`gacha-machine ${isDrawing ? 'animating' : ''}`}>
          {isDrawing ? (
            <div className="drawing-effect">
              <Sparkles className="icon-spin" size={64} color="#facc15" />
              <p>Choosing the finest barrel...</p>
            </div>
          ) : result ? (
            <div className={`result-card grade-${result.grade}`}>
              <div className="grade-badge" style={{ backgroundColor: result.color }}>{result.grade}</div>
              <h3>{result.brand}</h3>
              <h2>{result.name}</h2>
              <p className="price">{result.priceStr}</p>
              <button onClick={() => setResult(null)} className="btn-retry">
                <RotateCcw size={20} /> Try Again
              </button>
            </div>
          ) : (
            <div className="idle-state">
              <Trophy size={80} color="#d97706" />
              <p>Ready for a pour?</p>
              <button onClick={drawWhiskey} className="btn-draw">
                DRAW NOW
              </button>
            </div>
          )}
        </div>

        <div className="probability-table">
          <h3>Collection & Probabilities</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Brand</th>
                  <th>Product</th>
                  <th>Prob.</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 10).map((item) => (
                  <tr key={item.id}>
                    <td><span className="badge" style={{ backgroundColor: item.color }}>{item.grade}</span></td>
                    <td>{item.brand}</td>
                    <td>{item.name}</td>
                    <td>{item.probability}%</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                    And {items.length - 10} more items...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer>
        <p>© 2026 Whiskey Gacha Collector. Responsibility in every drop.</p>
        <button className="sound-toggle" onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </footer>
    </div>
  );
}

export default App;
