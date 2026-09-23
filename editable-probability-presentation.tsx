import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Animated Tree Diagram Component for Slide 18
function AnimatedTreeDiagram({ slide }) {
  const canvasRef = useRef(null);
  const animationStepRef = useRef(0);
  const animationProgressRef = useRef(0);
  const pulseTimeRef = useRef(0);
  const pulseStartTimeRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 1000;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    const steps = [
      { type: 'startPoint', duration: 800 },
      { type: 'callout1', duration: 1200 },
      { type: 'firstBranch1', duration: 800 },
      { type: 'firstBranch2', duration: 800 },
      { type: 'callout2', duration: 1200 },
      { type: 'secondBranch1', duration: 800 },
      { type: 'secondBranch2', duration: 800 },
      { type: 'secondBranch3', duration: 800 },
      { type: 'secondBranch4', duration: 800 },
      { type: 'callout3', duration: 1200 },
      { type: 'callout4', duration: 1200 },
      { type: 'pulse', duration: 3000 }
    ];

    const elements = {
      startPoint: { x: 100, y: 250, show: false },
      branches: [
        { x1: 100, y1: 250, x2: 350, y2: 150, label: 'H', prob: '0.5', show: false, progress: 0 },
        { x1: 100, y1: 250, x2: 350, y2: 350, label: 'T', prob: '0.5', show: false, progress: 0 },
        { x1: 350, y1: 150, x2: 600, y2: 100, label: 'H', prob: '0.5', show: false, progress: 0 },
        { x1: 350, y1: 150, x2: 600, y2: 200, label: 'T', prob: '0.5', show: false, progress: 0 },
        { x1: 350, y1: 350, x2: 600, y2: 300, label: 'H', prob: '0.5', show: false, progress: 0 },
        { x1: 350, y1: 350, x2: 600, y2: 400, label: 'T', prob: '0.5', show: false, progress: 0 }
      ],
      outcomes: [
        { x: 650, y: 100, label: 'HH', show: false },
        { x: 650, y: 200, label: 'HT', show: false },
        { x: 650, y: 300, label: 'TH', show: false },
        { x: 650, y: 400, label: 'TT', show: false }
      ],
      callouts: [
        { x: 100, y: 180, text: 'Starts with\none point', show: false },
        { x: 225, y: 80, text: 'Branches show\noptions', show: false },
        { x: 750, y: 150, text: 'Each path is\none outcome', show: false },
        { x: 750, y: 450, text: 'Easy to count\npossibilities', show: false }
      ]
    };

    function drawCircle(x, y, radius, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    function drawBranch(x1, y1, x2, y2, progress = 1) {
      const currentX = x1 + (x2 - x1) * progress;
      const currentY = y1 + (y2 - y1) * progress;

      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }

    function drawLabel(x1, y1, x2, y2, text, prob) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(midX - 20, midY - 18, 40, 36);
      
      ctx.fillStyle = '#8B5CF6';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, midX, midY);
      
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const offsetX = Math.sin(angle) * 25;
      const offsetY = -Math.cos(angle) * 25;
      
      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(prob, midX + offsetX, midY + offsetY);
    }

    function drawOutcome(x, y, text, pulse = 0) {
      const scale = 1 + pulse * 0.2;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      
      ctx.fillStyle = '#8B5CF6';
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-40, -25, 80, 50, 10);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, 0);
      
      ctx.restore();
    }

    function drawCallout(x, y, text, show = false) {
      if (!show) return;

      const lines = text.split('\n');
      const lineHeight = 24;
      const padding = 15;
      const width = 150;
      const height = lines.length * lineHeight + padding * 2;

      ctx.fillStyle = '#FCD34D';
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.moveTo(x, y + height / 2);
      ctx.lineTo(x - 15, y + height / 2 - 10);
      ctx.lineTo(x - 15, y + height / 2 + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      lines.forEach((line, i) => {
        ctx.fillText(line, x + padding, y + padding + lineHeight / 2 + i * lineHeight);
      });
    }

    function animate() {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (elements.startPoint.show) {
        drawCircle(elements.startPoint.x, elements.startPoint.y, 15, '#06B6D4');
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Start', 100, 220);
      }

      elements.branches.forEach((branch) => {
        if (branch.show) {
          drawBranch(branch.x1, branch.y1, branch.x2, branch.y2, branch.progress);
          if (branch.progress >= 1) {
            drawLabel(branch.x1, branch.y1, branch.x2, branch.y2, branch.label, branch.prob);
            drawCircle(branch.x2, branch.y2, 12, '#06B6D4');
          }
        }
      });

      elements.outcomes.forEach((outcome) => {
        if (outcome.show) {
          let pulse = 0;
          if (animationStepRef.current === steps.length - 1) {
            const elapsedPulseTime = pulseStartTimeRef.current ? (Date.now() - pulseStartTimeRef.current) / 1000 : 0;
            if (elapsedPulseTime < 10) {
              pulse = Math.abs(Math.sin(pulseTimeRef.current * 3));
            }
          }
          drawOutcome(outcome.x, outcome.y, outcome.label, pulse);
        }
      });

      elements.callouts.forEach(callout => {
        drawCallout(callout.x, callout.y, callout.text, callout.show);
      });

      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      if (elements.branches[0].show) {
        ctx.fillText('First Flip', 225, 30);
      }
      if (elements.branches[2].show) {
        ctx.fillText('Second Flip', 475, 30);
      }
      if (elements.outcomes[0].show) {
        ctx.fillText('Outcomes', 700, 30);
      }
    }

    function updateAnimation(timestamp) {
      if (!animationProgressRef.current) animationProgressRef.current = timestamp;
      
      const elapsed = timestamp - animationProgressRef.current;
      const currentStep = steps[animationStepRef.current];
      
      if (!currentStep) {
        pulseTimeRef.current += 0.05;
        animate();
        animationIdRef.current = requestAnimationFrame(updateAnimation);
        return;
      }

      const progress = Math.min(elapsed / currentStep.duration, 1);

      switch (currentStep.type) {
        case 'startPoint':
          elements.startPoint.show = true;
          break;
        case 'callout1':
          elements.callouts[0].show = true;
          break;
        case 'firstBranch1':
          elements.branches[0].show = true;
          elements.branches[0].progress = progress;
          break;
        case 'firstBranch2':
          elements.branches[1].show = true;
          elements.branches[1].progress = progress;
          break;
        case 'callout2':
          elements.callouts[0].show = false;
          elements.callouts[1].show = true;
          break;
        case 'secondBranch1':
          elements.branches[2].show = true;
          elements.branches[2].progress = progress;
          break;
        case 'secondBranch2':
          elements.branches[3].show = true;
          elements.branches[3].progress = progress;
          break;
        case 'secondBranch3':
          elements.branches[4].show = true;
          elements.branches[4].progress = progress;
          break;
        case 'secondBranch4':
          elements.branches[5].show = true;
          elements.branches[5].progress = progress;
          if (progress >= 1) {
            elements.outcomes.forEach(o => o.show = true);
          }
          break;
        case 'callout3':
          elements.callouts[1].show = false;
          elements.callouts[2].show = true;
          break;
        case 'callout4':
          elements.callouts[2].show = false;
          elements.callouts[3].show = true;
          break;
        case 'pulse':
          if (!pulseStartTimeRef.current) {
            pulseStartTimeRef.current = Date.now();
          }
          pulseTimeRef.current += 0.05;
          break;
      }

      animate();

      if (progress >= 1 && animationStepRef.current < steps.length - 1) {
        animationStepRef.current++;
        animationProgressRef.current = timestamp;
      }

      animationIdRef.current = requestAnimationFrame(updateAnimation);
    }

    setTimeout(() => {
      animationIdRef.current = requestAnimationFrame(updateAnimation);
    }, 500);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <div className="animate-fadeIn max-w-6xl w-full">
      <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
      <div className="bg-white rounded-2xl p-10 shadow-2xl">
        <p className="text-purple-700 text-2xl text-center mb-6 font-semibold">{slide.subtitle}</p>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
          <h3 className="text-purple-800 font-bold text-xl mb-2">What is a Tree Diagram?</h3>
          <p className="text-gray-700 text-lg">A tree diagram is a visual tool that shows all possible outcomes of an experiment. Each branch represents a different choice or outcome, making it easy to see and count all possibilities.</p>
        </div>
        <canvas 
          ref={canvasRef}
          className="w-full rounded-xl border-2 border-purple-200"
        />
      </div>
    </div>
  );
}
function MysticalTreeSlide({ slide }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationIdRef = useRef(null);
  const branchesRef = useRef([]);
  const leavesRef = useRef([]);
  const swayOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 800;
    canvas.height = 600;

    class Branch {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      depth: number;
      prob: number;
      progress: number;
      glowIntensity: number;

      constructor(x1: number, y1: number, x2: number, y2: number, depth: number, prob: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.depth = depth;
        this.prob = prob;
        this.progress = 0;
        this.glowIntensity = Math.random() * 0.5 + 0.5;
      }

      update() {
        if (this.progress < 1) {
          this.progress += 0.02;
        }
      }

      draw(ctx, sway, canvasHeight) {
        if (this.progress <= 0) return;

        const currentX2 = this.x1 + (this.x2 - this.x1) * this.progress;
        const currentY2 = this.y1 + (this.y2 - this.y1) * this.progress;
        const swayAmount = sway * (1 - this.y2 / canvasHeight) * 5;
        const finalX2 = currentX2 + swayAmount;

        const gradient = ctx.createLinearGradient(this.x1, this.y1, finalX2, currentY2);
        const purple = `rgba(138, 43, 226, ${0.8 * this.glowIntensity})`;
        const cyan = `rgba(0, 255, 255, ${0.6 * this.glowIntensity})`;
        gradient.addColorStop(0, purple);
        gradient.addColorStop(1, cyan);

        ctx.shadowBlur = 15 + Math.sin(Date.now() * 0.001 + this.depth) * 5;
        ctx.shadowColor = this.depth % 2 === 0 ? purple : cyan;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(1, 8 - this.depth);
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(finalX2, currentY2);
        ctx.stroke();

        if (this.depth > 0 && this.progress > 0.8) {
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * this.progress})`;
          ctx.font = '10px Arial';
          ctx.fillText('→', (this.x1 + finalX2) / 2, (this.y1 + currentY2) / 2);
        }
      }
    }

    class Leaf {
      x: number;
      y: number;
      prob: string;
      delay: number;
      age: number;
      size: number;
      maxSize: number;
      hue: number;

      constructor(x: number, y: number, prob: string, delay: number) {
        this.x = x;
        this.y = y;
        this.prob = prob;
        this.delay = delay;
        this.age = 0;
        this.size = 0;
        this.maxSize = 20 + Math.random() * 10;
        this.hue = Math.random() > 0.5 ? 270 : 180;
      }

      update() {
        if (this.age > this.delay) {
          if (this.size < this.maxSize) {
            this.size += 0.5;
          }
        }
        this.age++;
      }

      draw(ctx, sway) {
        if (this.size <= 0) return;

        const swayAmount = sway * 3;
        const x = this.x + swayAmount;

        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        
        const gradient = ctx.createRadialGradient(x, this.y, 0, x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 0.9)`);
        gradient.addColorStop(0.7, `hsla(${this.hue}, 100%, 50%, 0.6)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 30%, 0.1)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        if (this.size >= this.maxSize * 0.8) {
          ctx.shadowBlur = 5;
          ctx.fillStyle = 'white';
          ctx.font = 'bold 11px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(this.prob, x, this.y + 4);
        }
      }
    }

    const playSproutSound = (frequency = 200) => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContextRef.current.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.15);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.15);
    };

    const playLeafSound = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContextRef.current.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    };

    const createTree = (x, y, length, angle, depth, prob, maxDepth = 5) => {
      if (depth > maxDepth) return;

      const x2 = x + length * Math.cos(angle);
      const y2 = y + length * Math.sin(angle);

      const branch = new Branch(x, y, x2, y2, depth, prob);
      branchesRef.current.push(branch);

      setTimeout(() => {
        playSproutSound(200 + depth * 50);
      }, depth * 200);

      if (depth >= 4) {
        const probValues = ['HH', 'HT', 'TH', 'TT'];
        const leafProb = probValues[branchesRef.current.filter(b => b.depth >= 4).length % 4];
        const leaf = new Leaf(x2, y2, leafProb, depth * 200 + 500);
        leavesRef.current.push(leaf);
        
        setTimeout(() => {
          playLeafSound();
        }, depth * 200 + 500);
      }

      if (depth < maxDepth) {
        const angleChange = Math.PI / 6;
        const lengthReduction = 0.7;
        
        createTree(x2, y2, length * lengthReduction, angle - angleChange, depth + 1, prob * 0.5, maxDepth);
        createTree(x2, y2, length * lengthReduction, angle + angleChange, depth + 1, prob * 0.5, maxDepth);
      }
    };

    const animate = () => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.fillStyle = `rgba(138, 43, 226, ${Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      swayOffsetRef.current = Math.sin(Date.now() * 0.001) * 2;

      branchesRef.current.forEach(branch => {
        branch.update();
        branch.draw(ctx, swayOffsetRef.current, canvas.height);
      });

      leavesRef.current.forEach(leaf => {
        leaf.update();
        leaf.draw(ctx, swayOffsetRef.current);
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      branchesRef.current = [];
      leavesRef.current = [];
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      const startX = canvas.width / 2;
      const startY = canvas.height - 50;
      const initialLength = 120;
      const initialAngle = -Math.PI / 2;

      createTree(startX, startY, initialLength, initialAngle, 0, 1.0, 5);
      animate();
    };

    setTimeout(startAnimation, 500);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const handleGrowAgain = () => {
    branchesRef.current = [];
    leavesRef.current = [];
    
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Trigger re-mount by updating a key would be cleaner, but we'll just restart
    window.location.reload();
  };

  return (
    <div className="animate-fadeIn max-w-6xl w-full">
      <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
          <p className="text-white text-2xl mb-6 font-semibold">{slide.description}</p>
          {slide.features.map((feat, i) => (
            <p key={i} className="text-white text-lg my-2">✓ {feat}</p>
          ))}
        </div>
        
        <div className="relative bg-gradient-to-b from-slate-900 to-black rounded-2xl border-2 border-purple-500/30 overflow-hidden shadow-xl shadow-cyan-500/20">
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: 'block' }}
          />
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur rounded-lg p-3 border border-cyan-400/30">
            <p className="text-cyan-300 text-xs font-mono mb-1">🌟 Mystical Tree Diagram</p>
            <p className="text-purple-300 text-xs">Each leaf = Outcome</p>
            <p className="text-cyan-300 text-xs">Watch it grow!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// EDIT THIS ARRAY TO MODIFY SLIDES
const slides = [
  {
    type: 'title',
    title: 'PROBABILITY',
    subtitle: 'aka How to Predict the Unpredictable',
    note: 'swipe for magic'
  },
  {
    type: 'grid',
    title: 'YOU ALREADY KNOW THIS',
    items: [
      { emoji: '🌧️', label: 'Weather App', detail: '"70% rain"' },
      { emoji: '🎮', label: 'Loot Box', detail: '"2% rare drop"' },
      { emoji: '🎵', label: 'Spotify', detail: '"Top 15%"' },
      { emoji: '👻', label: 'Your crush', detail: 'viewed story' }
    ],
    footer: 'Probability is EVERYWHERE in your life'
  },
  {
    type: 'skill-tree',
    title: 'POWER-UPS TO UNLOCK',
    skills: [
      '📚 Master Probability Vocabulary',
      '🎯 Calculate Event Probability',
      '🌳 Tree Diagram Wizardry',
      '⚡ Spot Independent vs Exclusive Events'
    ]
  },
  {
    type: 'section',
    part: 'PART 1',
    title: 'SPEAK PROBABILITY',
    subtitle: 'Vocabulary Loading...'
  },
  {
    type: 'split',
    title: 'EXPERIMENT',
    left: {
      heading: 'EXPERIMENT 🔬',
      text: 'Any action or process where the outcome is uncertain',
      emoji: '❓'
    },
    right: {
      heading: 'Examples:',
      examples: [
        { emoji: '🪙', text: 'Coin Flip' },
        { emoji: '🎲', text: 'Die Roll' },
        { emoji: '🃏', text: 'Card Draw' }
      ]
    },
    footer: 'TL;DR: Anything where you don\'t know what\'ll happen'
  },
  {
    type: 'content',
    title: 'OUTCOME 🎯',
    content: [
      { type: 'text', text: 'ONE specific result from an experiment' },
      { type: 'example', title: 'EXPERIMENT: Roll a die 🎲', text: 'These are all OUTCOMES', dice: true },
      { type: 'text', text: 'TL;DR: One specific thing that could happen' }
    ]
  },
  {
    type: 'content',
    title: 'EVENT 🎪',
    content: [
      { type: 'text', text: 'A collection of one or more outcomes' },
      { type: 'example', title: 'EXPERIMENT: Roll a die 🎲', events: [
        { name: 'Roll an even number', highlight: [2, 4, 6] },
        { name: 'Roll less than 4', highlight: [1, 2, 3] }
      ]},
      { type: 'text', text: 'TL;DR: A group of outcomes that match your criteria' }
    ]
  },
  {
    type: 'content',
    title: 'SAMPLE SPACE 🌌',
    content: [
      { type: 'text', text: 'ALL possible outcomes of an experiment' },
      { type: 'example', title: 'EXPERIMENT: Flip 2 coins 🪙🪙', coinFlips: ['HH', 'HT', 'TH', 'TT'] },
      { type: 'text', text: 'TL;DR: EVERYTHING that could possibly happen' }
    ]
  },
  {
    type: 'grid',
    title: 'VOCAB RECAP 📝',
    items: [
      { emoji: '🔬', label: 'EXPERIMENT', detail: 'The thing you do' },
      { emoji: '🎯', label: 'OUTCOME', detail: 'One result' },
      { emoji: '🎲', label: 'EVENT', detail: 'Group of results' },
      { emoji: '🌐', label: 'SAMPLE SPACE', detail: 'All possible results' }
    ]
  },
  {
    type: 'section',
    part: 'PART 2',
    title: 'MATH TIME 🔢',
    subtitle: 'Don\'t worry, it\'s easy'
  },
  {
    type: 'formula',
    title: 'THE BASIC CONCEPT',
    text: 'PROBABILITY = How likely something is to happen',
    formula: 'P(A) = n(A) / n(S)',
    subformula: 'P(Event) = Number of favorable outcomes / Total number of outcomes',
    example: {
      text: 'Example: Jar with 10 balls (3 pink, 7 grey)',
      question: 'What\'s P(picking pink)?',
      answer: 'P(pink) = n(pink)/n(total) = 3/10 = 0.3 = 30%'
    }
  },
  {
    type: 'scale',
    title: 'PROBABILITY SCALE',
    description: 'Probability is always between 0 (impossible) and 1 (certain). We can express it as a fraction, decimal, or percentage.',
    examples: [
      { percent: '0% (0)', text: 'Getting a 7 when rolling a standard die', why: 'Impossible - the die only has 1-6!' },
      { percent: '16.7% (1/6)', text: 'Rolling exactly a 4 on a die', why: 'One favorable outcome out of six possible' },
      { percent: '50% (1/2)', text: 'Your favorite song playing next on shuffle with 2 songs', why: 'Equally likely - could go either way' },
      { percent: '75% (3/4)', text: 'Not getting a 6 when rolling a die', why: 'Five favorable outcomes (1,2,3,4,5) out of six' },
      { percent: '100% (1)', text: 'The sun rising tomorrow', why: 'Certain - it will definitely happen' }
    ]
  },
  {
    type: 'calculation',
    title: 'EXAMPLE 1: Simple Calculation',
    problem: 'You roll a standard die. What\'s the probability of rolling a 4? 🎲',
    steps: [
      { label: 'STEP 1: Identify the sample space', text: '{1, 2, 3, 4, 5, 6} = 6 outcomes' },
      { label: 'STEP 2: Identify favorable outcomes', text: '{4} = 1 outcome' },
      { label: 'STEP 3: Calculate!', formula: 'P(rolling a 4) = 1/6 ≈ 0.167 = 16.7%' }
    ]
  },
  {
    type: 'calculation',
    title: 'EXAMPLE 2: Multiple Outcomes',
    problem: 'Draw one card from a deck. What\'s P(King)? 🃏',
    steps: [
      { label: 'STEP 1: Sample space', text: '52 cards total' },
      { label: 'STEP 2: Favorable outcomes', text: '4 Kings (♠♥♣♦)' },
      { label: 'STEP 3: Calculate!', formula: 'P(King) = 4/52 = 1/13 ≈ 7.7%' }
    ],
    tip: '💡 Pro tip: Always simplify fractions! 4/52 = 1/13'
  },
  {
    type: 'practice',
    title: 'YOU TRY IT! 🎯',
    problem: 'A bag contains 5 red marbles, 3 blue marbles, and 2 green marbles. What\'s the probability of picking a blue marble?',
    options: [
      { label: 'A) 3/5 = 60%', correct: false },
      { label: 'B) 3/10 = 30% ✓', correct: true },
      { label: 'C) 3/8 = 37.5%', correct: false },
      { label: 'D) 1/3 = 33.3%', correct: false }
    ],
    answer: 'Answer: B - Total marbles = 10, Blue = 3, so 3/10 = 30%'
  },
  {
    type: 'section',
    part: 'PART 3',
    title: 'TREE DIAGRAMS 🌳',
    subtitle: 'Making the impossible visible'
  },
  {
    type: 'tree',
    title: 'TREE DIAGRAMS',
    description: 'Shows ALL possible outcomes of an experiment',
    tree: 'Flip a coin twice',
    features: ['Starts with one point', 'Branches show options', 'Each path is one outcome', 'Easy to count possibilities']
  },
  {
    type: 'animated-tree',
    title: '🌳 Probability Tree Diagram',
    subtitle: 'Experiment: Flip a coin twice'
  },
  {
    type: 'probability-table',
    title: '📊 Probability Table',
    subtitle: 'Same experiment, different view: Flip a coin twice',
    description: 'A probability table organizes all possible outcomes in a grid format. Rows represent one event, columns represent another event, and cells show combined outcomes.'
  },
  {
    type: 'section',
    part: 'PART 4',
    title: 'TYPES OF EVENTS',
    subtitle: 'Understanding how events relate to each other'
  },
  {
    type: 'comparison',
    title: 'INDEPENDENT EVENTS 🎲🪙',
    description: 'When one event happening doesn\'t change the probability of another event',
    yes: [
      'Flipping coin AND rolling die',
      'Drawing card, replacing it, drawing again',
      'Your quiz grade AND the weather',
      'Two different people flipping coins'
    ],
    no: [
      'Drawing card, NOT replacing, drawing again',
      'Picking 2 students from class',
      'Your grade AND studying'
    ]
  },
  {
    type: 'formula',
    title: 'INDEPENDENT: THE "AND" RULE',
    formula: 'P(A AND B) = P(A) × P(B)',
    text: 'Multiply the probabilities!',
    example: {
      text: '🪙 Flip a coin: P(Heads) = 1/2\n🎲 Roll a die: P(6) = 1/6',
      question: 'What\'s P(Heads AND Rolling a 6)?',
      answer: 'P(H and 6) = 1/2 × 1/6 = 1/12 ≈ 8.3%'
    },
    warning: '⚠️ ONLY use multiplication if events are INDEPENDENT!'
  },
  {
    type: 'multi-practice',
    title: 'PRACTICE: Multiplication Rule',
    problems: [
      {
        question: 'Problem 1: Two coins flipped. P(Heads on BOTH)?',
        setup: 'P(H) = 1/2, P(H) = 1/2',
        answer: 'P(H AND H) = 1/2 × 1/2 = 1/4 = 25%'
      },
      {
        question: 'Problem 2: Roll die twice. P(Even number BOTH times)?',
        setup: 'P(Even) = 3/6 = 1/2, P(Even) = 1/2',
        answer: 'P(Even AND Even) = 1/2 × 1/2 = 1/4 = 25%'
      },
      {
        question: 'Problem 3: Spin wheel (20% win) twice. P(Win BOTH)?',
        setup: 'P(Win) = 0.2, P(Win) = 0.2',
        answer: 'P(Win AND Win) = 0.2 × 0.2 = 0.04 = 4%'
      }
    ]
  },
  {
    type: 'comparison',
    title: 'MUTUALLY EXCLUSIVE 🚫',
    description: 'Events that CANNOT happen at the same time',
    yes: [
      'Rolling 3 AND rolling 5',
      'Turning left AND turning right',
      'Winning AND losing a game',
      'Drawing heart AND drawing spade (same card)'
    ],
    no: [
      'Rolling even AND rolling 4 (4 IS even!)',
      'Being student AND being tall',
      'Drawing heart AND drawing King (King of Hearts!)'
    ]
  },
  {
    type: 'formula',
    title: 'MUTUALLY EXCLUSIVE: "OR" RULE',
    formula: 'P(A OR B) = P(A) + P(B)',
    text: 'Add the probabilities!',
    example: {
      text: '🎲 Roll a die:\nP(Rolling 2) = 1/6, P(Rolling 5) = 1/6',
      question: 'What\'s P(Rolling 2 OR 5)?',
      answer: 'P(2 or 5) = 1/6 + 1/6 = 2/6 = 1/3 ≈ 33.3%'
    },
    warning: '⚠️ ONLY use addition if events are MUTUALLY EXCLUSIVE!'
  },
  {
    type: 'multi-practice',
    title: 'PRACTICE: Addition Rule',
    problems: [
      {
        question: 'Problem 1: Roll a die. P(1 OR 6)?',
        setup: 'P(1) = 1/6, P(6) = 1/6',
        answer: 'P(1 OR 6) = 1/6 + 1/6 = 2/6 = 1/3 ≈ 33.3%'
      },
      {
        question: 'Problem 2: Color wheel: Red=30%, Blue=25%. P(Red OR Blue)?',
        setup: 'P(Red) = 0.30, P(Blue) = 0.25',
        answer: 'P(Red OR Blue) = 0.30 + 0.25 = 0.55 = 55%'
      },
      {
        question: 'Problem 3: Pick card. P(Ace OR King OR Queen)?',
        setup: 'P(A) = 4/52, P(K) = 4/52, P(Q) = 4/52',
        answer: 'P(A or K or Q) = 4/52 + 4/52 + 4/52 = 12/52 = 3/13 ≈ 23.1%'
      }
    ]
  },
  {
    type: 'master-comparison',
    title: 'MASTER COMPARISON',
    independent: {
      question: 'Does one affect the other?',
      formula: 'P(A AND B) = P(A) × P(B)',
      keyword: 'AND',
      operation: 'MULTIPLY (×)',
      result: 'Probability DECREASES',
      example: 'Flip 2 coins, both heads',
      exampleCalc: '1/2 × 1/2 = 1/4'
    },
    exclusive: {
      question: 'Can both happen at once?',
      formula: 'P(A OR B) = P(A) + P(B)',
      keyword: 'OR',
      operation: 'ADD (+)',
      result: 'Probability INCREASES',
      example: 'Roll die, get 2 or 5',
      exampleCalc: '1/6 + 1/6 = 1/3'
    },
    tip: '💡 PRO TIP: Look for "AND" → multiply | Look for "OR" → add'
  },
  {
    type: 'grid',
    title: 'PROBABILITY IRL 🌍',
    items: [
      { emoji: '🎮', label: 'Gaming', detail: 'Loot box drop rates are probabilities. 2% legendary = You\'ll need ~50 boxes' },
      { emoji: '🌧️', label: 'Weather', detail: '70% rain = If conditions like today happen 100 times, it rains 70 times' },
      { emoji: '🏀', label: 'Sports', detail: 'Free throw %: 85% = Makes 85 out of 100. Independent events!' },
      { emoji: '📱', label: 'Social Media', detail: 'Algorithm uses probability to predict what you\'ll engage with' }
    ],
    footer: 'Probability is literally everywhere. Now you can understand it. 🎯'
  },
  {
    type: 'achievement',
    title: 'ACHIEVEMENT UNLOCKED! 🏆',
    skills: [
      '✓ LEVEL 1: Mastered Vocabulary',
      '✓ LEVEL 2: Calculated Probabilities',
      '✓ LEVEL 3: Constructed Tree Diagrams',
      '✓ LEVEL 4: Distinguished Event Types'
    ],
    badge: 'PROBABILITY EXPERT 🎓'
  },
  {
    type: 'tree-calculation',
    title: 'TREE CALCULATION',
    problem: 'You have 2 tops (T-shirt, Hoodie) and 2 bottoms (Jeans, Shorts). What\'s P(wearing jeans)?',
    description: 'Let\'s use a tree diagram to solve this step by step.',
    totalOutcomes: 4,
    favorableOutcomes: ['TJ', 'HJ'],
    calculation: 'P(Jeans) = 2/4 = 1/2 = 50%',
    footer: 'Tree diagrams make counting outcomes super easy!'
  },
  {
    type: 'final',
    title: 'YOU JUST LEVELED UP 🎉',
    achievements: [
      'Probability: UNDERSTOOD ✓',
      'Calculations: MASTERED 🔢',
      'Trees: DRAWN 🌳',
      'Events: DISTINGUISHED ⚡'
    ],
    quote: 'Remember: The universe is random, but now YOU can calculate the odds.',
    footer: '✨ STAY CURIOUS ✨'
  }
];

export default function ProbabilityPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setSelectedAnswer(null); // Reset answer when changing slides
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedAnswer(null); // Reset answer when changing slides
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 overflow-hidden relative">
      <div className="fixed top-6 right-6 bg-slate-800/90 px-4 py-2 rounded-full text-white z-50">
        {currentSlide + 1} / {slides.length}
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center p-12 overflow-y-auto">
        {slide.type === 'title' && (
          <div className="text-center animate-fadeIn">
            <h1 className="text-8xl font-black text-white mb-4 animate-pulse">{slide.title}</h1>
            <p className="text-4xl text-white/90">{slide.subtitle}</p>
            {slide.note && <p className="text-white/70 mt-10">{slide.note}</p>}
          </div>
        )}

        {slide.type === 'section' && (
          <div className="text-center animate-fadeIn">
            <h1 className="text-6xl font-black text-white mb-6">{slide.part}</h1>
            <h2 className="text-5xl font-bold text-white">{slide.title}</h2>
            <p className="text-3xl text-white/90 mt-4">{slide.subtitle}</p>
          </div>
        )}

        {slide.type === 'grid' && (
          <div className="animate-fadeIn max-w-5xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="grid grid-cols-2 gap-6">
              {slide.items?.map((item, i) => (
                <div key={i} className="bg-slate-800/80 rounded-2xl p-8 text-center border-2 border-purple-400/30 hover:scale-105 transition">
                  <div className="text-6xl mb-4">{item.emoji}</div>
                  <p className="text-white font-semibold text-xl mb-2">{item.label}</p>
                  <p className="text-white/80 text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
            {slide.footer && <h3 className="text-3xl text-white text-center mt-10">{slide.footer}</h3>}
          </div>
        )}

        {slide.type === 'skill-tree' && (
          <div className="animate-fadeIn max-w-3xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="flex flex-col gap-4 items-center">
              {slide.skills?.map((skill, i) => (
                <React.Fragment key={i}>
                  <div className="bg-purple-600/40 border-4 border-purple-400 rounded-2xl px-10 py-6 text-white text-2xl font-semibold animate-pulse">
                    {skill}
                  </div>
                  {i < slide.skills.length - 1 && <div className="text-purple-400 text-4xl">↓</div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {slide.type === 'split' && (
          <div className="animate-fadeIn max-w-6xl w-full">
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
                <h2 className="text-4xl font-bold text-white mb-4">{slide.left?.heading}</h2>
                <p className="text-white text-xl mb-6">{slide.left?.text}</p>
                <div className="text-6xl text-center">{slide.left?.emoji}</div>
              </div>
              <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
                <h3 className="text-3xl font-bold text-white mb-6">{slide.right?.heading}</h3>
                {slide.right?.examples?.map((ex, i) => (
                  <div key={i} className="bg-pink-500/20 rounded-xl p-4 mb-4 border-l-4 border-pink-500">
                    <div className="text-4xl mb-2">{ex.emoji}</div>
                    <p className="text-white text-xl">{ex.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {slide.footer && (
              <div className="bg-slate-800/80 rounded-2xl p-6 mt-6 text-center">
                <p className="text-white text-xl"><strong>TL;DR:</strong> {slide.footer}</p>
              </div>
            )}
          </div>
        )}

        {slide.type === 'content' && (
          <div className="animate-fadeIn max-w-4xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
              {slide.content?.map((item, i) => (
                <div key={i}>
                  {item.type === 'text' && <p className="text-white text-2xl mb-6 font-semibold">{item.text}</p>}
                  {item.type === 'example' && (
                    <div className="bg-pink-500/20 rounded-xl p-6 my-6 border-l-4 border-pink-500">
                      <p className="text-white text-2xl mb-4">{item.title}</p>
                      {item.dice && (
                        <div className="flex justify-around text-5xl my-4">
                          {[1,2,3,4,5,6].map(n => <span key={n}>⚀</span>)}
                        </div>
                      )}
                      {item.coinFlips && (
                        <div className="flex justify-around text-4xl my-4">
                          {item.coinFlips.map((flip, i) => (
                            <div key={i} className="text-center">
                              <div className="mb-2">🪙</div>
                              <div className="text-white">{flip}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.events && item.events.map((event, j) => (
                        <div key={j} className="my-4">
                          <p className="text-green-400 text-xl mb-2">{event.name}</p>
                          <div className="flex justify-center gap-4 text-4xl">
                            {[1,2,3,4,5,6].map(n => (
                              <span key={n} className={event.highlight.includes(n) ? 'text-green-400' : 'opacity-30'}>⚀</span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {item.text && <p className="text-white text-center mt-4">{item.text}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.type === 'formula' && (
          <div className="animate-fadeIn max-w-4xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
              {slide.text && <p className="text-white text-3xl text-center mb-8 font-semibold">{slide.text}</p>}
              <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-6 text-center">
                <p className="text-green-400 text-4xl font-mono mb-3">{slide.formula}</p>
                {slide.subformula && <p className="text-green-300 text-xl font-mono opacity-80">{slide.subformula}</p>}
              </div>
              {slide.example && (
                <div className="bg-pink-500/20 rounded-xl p-6 mt-8 border-l-4 border-pink-500">
                  <p className="text-white text-xl whitespace-pre-line mb-4">{slide.example.text}</p>
                  {slide.example.question && <p className="text-pink-400 text-2xl mb-4">{slide.example.question}</p>}
                  <p className="text-white text-2xl font-semibold text-center">{slide.example.answer}</p>
                </div>
              )}
              {slide.warning && (
                <div className="bg-red-500/20 rounded-xl p-4 mt-6 border-l-4 border-red-500">
                  <p className="text-white text-lg font-semibold">{slide.warning}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {slide.type === 'scale' && (
          <div className="animate-fadeIn max-w-5xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
              {slide.description && (
                <p className="text-white text-2xl text-center mb-8 font-semibold">{slide.description}</p>
              )}
              <div className="h-16 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mb-16 relative">
                <div className="absolute -top-12 left-0 text-white text-center text-sm">
                  <div className="font-bold">0%</div>
                  <div>IMPOSSIBLE</div>
                </div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-white text-center text-sm">
                  <div className="font-bold">50%</div>
                  <div>MAYBE</div>
                </div>
                <div className="absolute -top-12 right-0 text-white text-center text-sm">
                  <div className="font-bold">100%</div>
                  <div>CERTAIN</div>
                </div>
              </div>
              <div className="space-y-4">
                {slide.examples?.map((ex, i) => (
                  <div key={i} className="bg-pink-500/20 rounded-xl p-5 border-l-4 border-pink-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-600 text-white font-bold px-4 py-2 rounded-lg text-lg min-w-[120px] text-center">
                        {ex.percent}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xl font-semibold mb-2">{ex.text}</p>
                        {ex.why && <p className="text-green-300 text-base italic">💡 {ex.why}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {slide.type === 'calculation' && (
          <div className="animate-fadeIn max-w-4xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
              <div className="bg-pink-500/20 rounded-xl p-6 mb-6 border-l-4 border-pink-500">
                <p className="text-white text-2xl font-semibold">{slide.problem}</p>
              </div>
              {slide.steps?.map((step, i) => (
                <div key={i} className="my-6">
                  <p className="text-white text-xl mb-2 font-semibold">{step.label}</p>
                  {step.text && <p className="text-white/90 ml-8">{step.text}</p>}
                  {step.formula && (
                    <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-4 text-center mt-4">
                      <p className="text-green-400 text-3xl font-mono">{step.formula}</p>
                    </div>
                  )}
                </div>
              ))}
              {slide.tip && (
                <div className="bg-red-500/20 rounded-xl p-4 mt-6 border-l-4 border-red-500">
                  <p className="text-white">{slide.tip}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {slide.type === 'practice' && (
          <div className="animate-fadeIn max-w-4xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
              <div className="bg-pink-500/20 rounded-xl p-8 mb-6 border-l-4 border-pink-500">
                <p className="text-white text-2xl">{slide.problem}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 my-6">
                {slide.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAnswer(i)}
                    className={`rounded-xl p-6 text-white text-xl text-center border-2 transition-all cursor-pointer ${
                      selectedAnswer === null 
                        ? 'bg-slate-700/50 border-purple-400/30 hover:border-purple-400 hover:scale-105'
                        : selectedAnswer === i && opt.correct
                        ? 'bg-green-500/30 border-green-500 scale-105'
                        : selectedAnswer === i && !opt.correct
                        ? 'bg-red-500/30 border-red-500'
                        : opt.correct && selectedAnswer !== null
                        ? 'bg-green-500/20 border-green-500'
                        : 'bg-slate-700/30 border-slate-600/30 opacity-50'
                    }`}
                  >
                    {opt.label}
                    {selectedAnswer !== null && selectedAnswer === i && opt.correct && (
                      <div className="text-green-400 text-3xl mt-2">✓</div>
                    )}
                    {selectedAnswer !== null && selectedAnswer === i && !opt.correct && (
                      <div className="text-red-400 text-3xl mt-2">✗</div>
                    )}
                  </button>
                ))}
              </div>
              {selectedAnswer !== null && (
                <div className="mt-6 animate-fadeIn">
                  <p className="text-green-400 text-center text-xl">{slide.answer}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {slide.type === 'tree' && <MysticalTreeSlide slide={slide} />}

        {slide.type === 'animated-tree' && <AnimatedTreeDiagram slide={slide} />}

        {slide.type === 'probability-table' && (
          <div className="animate-fadeIn max-w-6xl w-full">
            <h2 className="text-5xl font-bold text-white mb-6 text-center drop-shadow-lg">{slide.title}</h2>
            <p className="text-white text-2xl text-center mb-10 drop-shadow-lg font-semibold">{slide.subtitle}</p>
            <div className="bg-white/95 backdrop-blur rounded-2xl p-10 shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-xl mb-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-3">What is a Probability Table?</h3>
                <p className="leading-relaxed text-lg">{slide.description}</p>
              </div>
              
              <div className="flex justify-center mb-8">
                <table className="border-collapse shadow-2xl">
                  <thead>
                    <tr>
                      <th className="border-4 border-purple-700 p-4 bg-gradient-to-br from-purple-600 to-purple-800 text-white"></th>
                      <th colSpan={2} className="border-4 border-purple-700 p-4 bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-xl">
                        Second Flip
                      </th>
                    </tr>
                    <tr>
                      <th className="border-4 border-purple-700 p-4 bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-xl">
                        First Flip
                      </th>
                      <th className="border-4 border-purple-700 p-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-3xl">H</th>
                      <th className="border-4 border-purple-700 p-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-3xl">T</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="border-4 border-purple-700 p-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-3xl">H</th>
                      <td className="border-4 border-purple-700 p-8 bg-purple-600 text-white text-center hover:bg-purple-500 transition-colors cursor-pointer">
                        <div className="text-5xl font-bold mb-2">HH</div>
                        <div className="text-lg font-semibold">1/4 = 0.25 = 25%</div>
                      </td>
                      <td className="border-4 border-purple-700 p-8 bg-purple-600 text-white text-center hover:bg-purple-500 transition-colors cursor-pointer">
                        <div className="text-5xl font-bold mb-2">HT</div>
                        <div className="text-lg font-semibold">1/4 = 0.25 = 25%</div>
                      </td>
                    </tr>
                    <tr>
                      <th className="border-4 border-purple-700 p-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-3xl">T</th>
                      <td className="border-4 border-purple-700 p-8 bg-purple-600 text-white text-center hover:bg-purple-500 transition-colors cursor-pointer">
                        <div className="text-5xl font-bold mb-2">TH</div>
                        <div className="text-lg font-semibold">1/4 = 0.25 = 25%</div>
                      </td>
                      <td className="border-4 border-purple-700 p-8 bg-purple-600 text-white text-center hover:bg-purple-500 transition-colors cursor-pointer">
                        <div className="text-5xl font-bold mb-2">TT</div>
                        <div className="text-lg font-semibold">1/4 = 0.25 = 25%</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-2xl font-bold text-purple-800 mb-4">Key Features:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-3 text-xl">✓</span>
                    <span className="text-lg text-gray-800"><strong className="text-purple-800">Organized Grid Format:</strong> Table structure makes outcomes easy to visualize</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-3 text-xl">✓</span>
                    <span className="text-lg text-gray-800"><strong className="text-purple-800">Rows show First Event:</strong> Each row represents an outcome of the first coin flip</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-3 text-xl">✓</span>
                    <span className="text-lg text-gray-800"><strong className="text-purple-800">Columns show Second Event:</strong> Each column represents an outcome of the second coin flip</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-3 text-xl">✓</span>
                    <span className="text-lg text-gray-800"><strong className="text-purple-800">Cells show Combined Outcomes:</strong> Each cell displays the result of both flips together</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-3 text-xl">✓</span>
                    <span className="text-lg text-gray-800"><strong className="text-purple-800">Easy to Count:</strong> 4 total possible outcomes with equal probability (25% each)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {slide.type === 'tree-steps' && (
          <div className="animate-fadeIn max-w-5xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  {slide.steps?.map((step, i) => (
                    <p key={i} className="text-white text-xl my-4">{step}</p>
                  ))}
                </div>
                <div className="bg-slate-900/90 rounded-xl p-6 font-mono text-white text-sm whitespace-pre flex items-center justify-center">
{`Coin Flip Example:
   H ──── HH
──<
*  T ──── HT
   H ──── TH
──<
   T ──── TT

4 total outcomes!`}
                </div>
              </div>
              {slide.tip && (
                <div className="bg-red-500/20 rounded-xl p-4 mt-6 border-l-4 border-red-500">
                  <p className="text-white">{slide.tip}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {slide.type === 'tree-example' && (
          <div className="animate-fadeIn max-w-4xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
              <p className="text-white text-2xl mb-4"><strong>Problem:</strong> {slide.problem}</p>
              <p className="text-white text-xl mb-6 whitespace-pre-line">{slide.description}</p>
              <div className="bg-slate-900/90 rounded-xl p-6 font-mono text-white text-sm whitespace-pre mb-6">
{`  Top    Bottom   Outfit
   ──── J ──── TJ
── T ──<
*  ──── S ──── TS
   ──── J ──── HJ
── H ──<
   ──── S ──── HS

Total: 4 outfit combinations!`}
              </div>
              <p className="text-green-400 text-center text-xl">{slide.footer}</p>
            </div>
          </div>
        )}

        {slide.type === 'tree-calculation' && (
          <div className="animate-fadeIn max-w-4xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
              <p className="text-white text-2xl mb-6"><strong>Problem:</strong> {slide.problem}</p>
              <div className="bg-slate-900/90 rounded-xl p-6 font-mono text-white text-sm whitespace-pre mb-6">
{`  Top    Bottom   Outcome
   ──── J ──── TJ ✓
── T ──<
*  ──── S ──── TS
   ──── J ──── HJ ✓
── H ──<
   ──── S ──── HS`}
              </div>
              <div className="space-y-4">
                <p className="text-white text-xl"><strong>STEP 1:</strong> Count total outcomes → <span className="text-green-400 font-semibold">{slide.totalOutcomes} outcomes</span></p>
                <p className="text-white text-xl"><strong>STEP 2:</strong> Count favorable (with jeans) → <span className="text-green-400 font-semibold">{slide.favorableOutcomes?.length} outcomes ({slide.favorableOutcomes?.join(', ')})</span></p>
                <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-4 text-center mt-4">
                  <p className="text-green-400 text-2xl font-mono">{slide.calculation}</p>
                </div>
              </div>
              <p className="text-green-400 text-center text-xl mt-6">{slide.footer}</p>
            </div>
          </div>
        )}

        {slide.type === 'multi-practice' && (
          <div className="animate-fadeIn max-w-4xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30 space-y-6">
              {slide.problems?.map((prob, i) => (
                <div key={i} className="bg-pink-500/20 rounded-xl p-6 border-l-4 border-pink-500">
                  <p className="text-white text-xl mb-3 font-semibold">{prob.question}</p>
                  <p className="text-white/90 ml-6 mb-3">{prob.setup}</p>
                  <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-3 text-center">
                    <p className="text-green-400 text-xl font-mono">{prob.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.type === 'comparison' && (
          <div className="animate-fadeIn max-w-5xl w-full">
            <h2 className="text-5xl font-bold text-white mb-6 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-purple-400/30">
              <p className="text-white text-2xl text-center mb-8">{slide.description}</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-green-400 text-2xl mb-4 font-semibold">✓ YES:</p>
                  <ul className="space-y-3">
                    {slide.yes?.map((item, i) => (
                      <li key={i} className="text-white text-lg pl-6 relative before:content-['→'] before:absolute before:left-0 before:text-green-400">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-red-400 text-2xl mb-4 font-semibold">✗ NO:</p>
                  <ul className="space-y-3">
                    {slide.no?.map((item, i) => (
                      <li key={i} className="text-white text-lg pl-6 relative before:content-['→'] before:absolute before:left-0 before:text-red-400">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {slide.type === 'master-comparison' && (
          <div className="animate-fadeIn max-w-6xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="bg-purple-600/70 p-5 rounded-t-2xl">
                  <p className="text-white text-3xl font-bold text-center">INDEPENDENT</p>
                </div>
                <div className="bg-slate-800/90 p-6 rounded-b-2xl border-2 border-purple-400/30 space-y-4">
                  <p className="text-white text-lg">{slide.independent?.question}</p>
                  <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-3 text-center">
                    <p className="text-green-400 text-2xl font-mono">{slide.independent?.formula}</p>
                  </div>
                  <p className="text-white">Key Word: <span className="text-green-400 font-bold text-xl">{slide.independent?.keyword}</span></p>
                  <p className="text-white">Operation: <span className="text-green-400 font-bold text-xl">{slide.independent?.operation}</span></p>
                  <p className="text-white">Result: {slide.independent?.result}</p>
                  <div className="bg-pink-500/20 rounded-xl p-4 mt-4 border-l-4 border-pink-500">
                    <p className="text-white">Example: {slide.independent?.example}</p>
                    <p className="text-green-400 text-xl mt-2">{slide.independent?.exampleCalc}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-pink-600/70 p-5 rounded-t-2xl">
                  <p className="text-white text-3xl font-bold text-center">MUTUALLY EXCLUSIVE</p>
                </div>
                <div className="bg-slate-800/90 p-6 rounded-b-2xl border-2 border-purple-400/30 space-y-4">
                  <p className="text-white text-lg">{slide.exclusive?.question}</p>
                  <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-3 text-center">
                    <p className="text-green-400 text-2xl font-mono">{slide.exclusive?.formula}</p>
                  </div>
                  <p className="text-white">Key Word: <span className="text-green-400 font-bold text-xl">{slide.exclusive?.keyword}</span></p>
                  <p className="text-white">Operation: <span className="text-green-400 font-bold text-xl">{slide.exclusive?.operation}</span></p>
                  <p className="text-white">Result: {slide.exclusive?.result}</p>
                  <div className="bg-pink-500/20 rounded-xl p-4 mt-4 border-l-4 border-pink-500">
                    <p className="text-white">Example: {slide.exclusive?.example}</p>
                    <p className="text-green-400 text-xl mt-2">{slide.exclusive?.exampleCalc}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-4 mt-6 text-center border-2 border-purple-400/30">
              <p className="text-white text-xl">{slide.tip}</p>
            </div>
          </div>
        )}

        {slide.type === 'achievement' && (
          <div className="animate-fadeIn max-w-4xl w-full">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">{slide.title}</h2>
            <div className="bg-slate-800/80 rounded-2xl p-10 border-2 border-purple-400/30">
              <div className="flex flex-col gap-4 items-center">
                {slide.skills?.map((skill, i) => (
                  <div key={i} className="bg-green-600/40 border-4 border-green-400 rounded-2xl px-10 py-6 text-white text-2xl font-semibold w-full text-center">
                    {skill}
                  </div>
                ))}
              </div>
              <h1 className="text-6xl font-black text-green-400 text-center mt-10">{slide.badge}</h1>
            </div>
          </div>
        )}

        {slide.type === 'final' && (
          <div className="animate-fadeIn max-w-4xl w-full text-center">
            <h1 className="text-7xl font-black text-white mb-10">{slide.title}</h1>
            <div className="bg-slate-800/80 rounded-2xl p-10 border-2 border-purple-400/30">
              {slide.achievements?.map((ach, i) => (
                <p key={i} className="text-white text-3xl my-4">
                  {ach}
                </p>
              ))}
              <p className="text-white text-3xl font-semibold mt-10">{slide.quote}</p>
              <p className="text-5xl mt-10">{slide.footer}</p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="bg-purple-600/90 hover:bg-pink-600 disabled:opacity-30 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition"
        >
          <ChevronLeft size={20} /> Previous
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="bg-purple-600/90 hover:bg-pink-600 disabled:opacity-30 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition"
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}