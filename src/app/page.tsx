"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShoppingBag, 
  Download, 
  RefreshCw, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  CloudSun,
  Palette,
  Layers,
  Share2,
  Shirt,
  Star,
  Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StyleResult {
  imageUrl: string;
  analysis: {
    outfitDescription: string;
    items: string[];
    rationale: string;
    palette: string[];
  };
}

const vibes = [
  { id: 'Parisian Chic', name: 'Parisian', icon: '🍷' },
  { id: 'Quiet Luxury', name: 'Luxury', icon: '👜' },
  { id: 'Streetwear Edge', name: 'Street', icon: '👟' },
  { id: 'Boho Minimal', name: 'Boho', icon: '🌵' },
  { id: 'Dark Academia', name: 'Classic', icon: '📚' },
];

export default function StyleForge() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StyleResult | null>(null);
  const [selectedVibe, setSelectedVibe] = useState(vibes[0].id);
  const [formData, setFormData] = useState({
    occasion: '',
    weather: '',
    customPreferences: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.occasion || !formData.weather) return;

    setLoading(true);
    try {
      const response = await fetch('/api/style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          styleVibe: selectedVibe
        }),
      });

      if (!response.ok) throw new Error('Styling failed');

      const data = await response.json();
      setResult(data);
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fb7185', '#be123c']
      });
    } catch (error) {
      console.error(error);
      alert('Failed to generate outfit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    try {
      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `outfit-moodboard-${formData.occasion.toLowerCase().replace(' ', '-')}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fff1f2, transparent)' }}>
      <div className="container" style={{ padding: '4rem 2rem' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              background: 'var(--accent)',
              borderRadius: '20px',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <Star size={14} />
              Personal AI Stylist
            </div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#1c1917' }}>
              Style <span className="premium-gradient">MoodForge</span>
            </h1>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Your personal fashion board. Perfect outfits curated for any occasion, 
              weather, and aesthetic vibe.
            </p>
          </motion.div>
        </header>

        <div className="grid-layout">
          {/* Left: Styling Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card" 
            style={{ padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(225, 29, 72, 0.1)' }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Occasion</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Job Interview"
                    value={formData.occasion}
                    onChange={e => setFormData({...formData, occasion: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Weather</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Rainy & Chilly"
                    value={formData.weather}
                    onChange={e => setFormData({...formData, weather: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Vibe Presets */}
              <div>
                <label className="input-label">Select Your Vibe</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {vibes.map((vibe) => (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => setSelectedVibe(vibe.id)}
                      style={{ 
                        padding: '1rem',
                        borderRadius: '16px',
                        border: selectedVibe === vibe.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: selectedVibe === vibe.id ? 'white' : 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{vibe.icon}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, textAlign: 'center', color: selectedVibe === vibe.id ? 'var(--primary)' : 'inherit' }}>{vibe.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Extra Preferences</label>
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '80px', resize: 'none' }}
                  placeholder="e.g. Only vegan leather, no bright colors, add a trench coat..."
                  value={formData.customPreferences}
                  onChange={e => setFormData({...formData, customPreferences: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', paddingTop: '1.2rem', paddingBottom: '1.2rem', gap: '0.75rem' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Curating Wardrobe...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Mood Board
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right: Mood Board Display */}
          <div style={{ position: 'sticky', top: '2rem' }}>
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card"
                  style={{ 
                    height: '100%', 
                    minHeight: '520px',
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '2rem',
                    textAlign: 'center',
                    borderStyle: 'dashed',
                    borderWidth: '2px',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    background: 'var(--accent)', 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '1.5rem',
                  }}>
                    <ShoppingBag size={32} />
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Start Your Style Journey</h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Your curated fashion mood board and styling tips will appear here.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card"
                  style={{ 
                    height: '100%', 
                    minHeight: '520px',
                    padding: '2rem'
                  }}
                >
                  <div className="logo-preview-container loading-shimmer" style={{ width: '100%', height: '350px', marginBottom: '2rem', border: 'none', background: 'var(--accent)' }}>
                    <Shirt size={64} className="animate-spin" style={{ color: 'var(--primary)', opacity: 0.2 }} />
                  </div>
                  <div style={{ height: '24px', width: '60%', marginBottom: '1rem', borderRadius: '4px' }} className="loading-shimmer" />
                  <div style={{ height: '80px', width: '100%', borderRadius: '4px' }} className="loading-shimmer" />
                </motion.div>
              )}

              {result && !loading && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--primary-rgb)' }}>
                    <div style={{ position: 'relative', aspectRatio: '1' }}>
                      <img 
                        src={result.imageUrl} 
                        alt="Style Mood Board" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        left: '1rem', 
                        background: 'rgba(255,255,255,0.9)', 
                        backdropFilter: 'blur(10px)',
                        color: 'var(--primary)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}>
                        <CheckCircle2 size={12} /> VOGUE-READY BOARD
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)' }}>
                      <button onClick={handleDownload} className="btn" style={{ borderRadius: 0, background: 'white', gap: '0.5rem', padding: '1.25rem', color: 'var(--primary)' }}>
                        <Download size={18} /> Save Board
                      </button>
                      <button className="btn" style={{ borderRadius: 0, background: 'white', gap: '0.5rem', padding: '1.25rem', color: 'var(--primary)' }}>
                        <Share2 size={18} /> Share Style
                      </button>
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <Palette size={18} style={{ color: 'var(--primary)' }} />
                      <h4 style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stylist Rationale</h4>
                    </div>
                    
                    <div style={{ background: 'var(--accent)', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--secondary-foreground)', lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{result.analysis.rationale}"
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Essential Items</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                          {result.analysis.items.map((item, i) => (
                            <span key={i} style={{ fontSize: '0.75rem', background: 'white', padding: '0.25rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Color Palette</span>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                          {result.analysis.palette.map((color, i) => (
                            <div key={i} title={color} style={{ width: '24px', height: '24px', borderRadius: '50%', background: color, border: '1px solid var(--border)' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Benefits */}
        <div style={{ 
          marginTop: '6rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2rem',
          paddingBottom: '4rem'
        }}>
          {[
            { icon: <Wind size={24} />, title: 'Weather Optimized', desc: 'Layering and fabric recommendations based on real-time conditions.' },
            { icon: <Layers size={24} />, title: 'Complete Sets', desc: 'From outerwear to the smallest accessory details, perfectly matched.' },
            { icon: <CloudSun size={24} />, title: 'Occasion Ready', desc: 'Etiquette-appropriate styling for weddings, interviews, or dates.' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="glass-card" 
              style={{ padding: '2rem', borderTop: '4px solid rgba(225, 29, 72, 0.1)' }}
            >
              <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{feature.icon}</div>
              <h4 style={{ marginBottom: '0.5rem' }}>{feature.title}</h4>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .animate-spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hover-trigger:hover {
          border-color: var(--primary) !important;
          background: rgba(var(--primary-rgb), 0.05) !important;
        }
        .premium-gradient {
          background: linear-gradient(135deg, #e11d48 0%, #fb7185 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </main>
  );
}
