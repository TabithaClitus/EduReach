import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Stage config ──────────────────────────────────────────────── */
const STAGES = [
  { min: 0,  label: 'Space Rock',   next: 3,  size: 60,  color: '#3d3d3d', glow: '#555',     atm: null           },
  { min: 3,  label: 'Awakening',    next: 7,  size: 80,  color: '#5e3a8a', glow: '#9b59b6',  atm: '#7d3c98'      },
  { min: 7,  label: 'Planet Born',  next: 14, size: 120, color: '#1a6ba0', glow: '#3498db',  atm: '#1f8ac0'      },
  { min: 14, label: 'Ringed World', next: 30, size: 140, color: '#148a6b', glow: '#1abc9c',  atm: '#1aaa80'      },
  { min: 30, label: 'Star System',  next: 60, size: 160, color: '#6a1b9a', glow: '#ab47bc',  atm: '#8e24aa'      },
  { min: 60, label: 'Galaxy',       next: null,size:180, color: '#b8860b', glow: '#ffd700',  atm: '#d4a017'      },
];

function getStage(streak) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (streak >= STAGES[i].min) return i;
  }
  return 0;
}

function daysToNext(streak) {
  const idx = getStage(streak);
  const s = STAGES[idx];
  if (s.next == null) return null;
  return s.next - streak;
}

/* ─── Deterministic pseudo-random (seeded) ─────────────────────── */
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── CSS injected once ─────────────────────────────────────────── */
const GALAXY_CSS = `
@keyframes gp-twinkle {
  0%,100% { opacity: 0.25; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.6); }
}
@keyframes gp-float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-14px); }
}
@keyframes gp-glow-pulse {
  0%,100% { opacity: 0.55; }
  50%      { opacity: 0.90; }
}
@keyframes gp-orbit-a {
  from { transform: rotate(0deg)   translateX(var(--orbit-r)) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
}
@keyframes gp-orbit-b {
  from { transform: rotate(120deg)   translateX(var(--orbit-r)) rotate(-120deg); }
  to   { transform: rotate(480deg)   translateX(var(--orbit-r)) rotate(-480deg); }
}
@keyframes gp-orbit-c {
  from { transform: rotate(240deg)   translateX(var(--orbit-r)) rotate(-240deg); }
  to   { transform: rotate(600deg)   translateX(var(--orbit-r)) rotate(-600deg); }
}
@keyframes gp-orbit-gold {
  from { transform: rotate(60deg)  translateX(var(--orbit-r)) rotate(-60deg); }
  to   { transform: rotate(420deg) translateX(var(--orbit-r)) rotate(-420deg); }
}
@keyframes gp-shoot {
  0%   { transform: translateX(-120px) translateY(0px)  scaleX(0.4); opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { transform: translateX(420px)  translateY(80px) scaleX(1);   opacity: 0; }
}
@keyframes gp-comet {
  0%   { transform: translateX(-60px) translateY(-40px) rotate(35deg) scaleX(0.3); opacity: 0; }
  6%   { opacity: 0.9; }
  94%  { opacity: 0.9; }
  100% { transform: translateX(450px) translateY(180px) rotate(35deg) scaleX(1);   opacity: 0; }
}
@keyframes gp-asteroid {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes gp-sparkle {
  0%,100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1.3) rotate(180deg); }
}
@keyframes gp-rocket-lr {
  0%   { transform: translateX(-80px); opacity: 0; }
  6%   { opacity: 1; }
  94%  { opacity: 1; }
  100% { transform: translateX(560px); opacity: 0; }
}
@keyframes gp-rocket-diag {
  0%   { transform: translateX(-80px) translateY(60px); opacity: 0; }
  6%   { opacity: 1; }
  94%  { opacity: 1; }
  100% { transform: translateX(560px) translateY(-50px); opacity: 0; }
}
@keyframes gp-rocket-rl {
  0%   { transform: translateX(0px) scaleX(-1); opacity: 0; }
  6%   { opacity: 1; }
  94%  { opacity: 1; }
  100% { transform: translateX(-580px) scaleX(-1); opacity: 0; }
}
@keyframes gp-astronaut {
  0%   { transform: translate(0px, 0px) rotate(0deg); }
  25%  { transform: translate(10px, -20px) rotate(10deg); }
  50%  { transform: translate(0px, -30px) rotate(0deg); }
  75%  { transform: translate(-10px, -20px) rotate(-10deg); }
  100% { transform: translate(0px, 0px) rotate(0deg); }
}
@keyframes gp-ufo {
  0%   { transform: translateX(-60px); opacity: 0; }
  8%   { opacity: 0.9; }
  92%  { opacity: 0.9; }
  100% { transform: translateX(560px); opacity: 0; }
}
@keyframes gp-wormhole-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes gp-wormhole-inner {
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(-180deg) scale(0.88); }
  100% { transform: rotate(-360deg) scale(1); }
}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected) return;
  cssInjected = true;
  const el = document.createElement('style');
  el.textContent = GALAXY_CSS;
  document.head.appendChild(el);
}

/* ─── Sub-components ────────────────────────────────────────────── */

function Stars() {
  const rand = seededRand(42);
  return (
    <>
      {Array.from({ length: 120 }, (_, i) => {
        const x = rand() * 100;
        const y = rand() * 100;
        const size = 1 + rand() * 2.5;
        const delay = (rand() * 4).toFixed(2);
        const dur   = (1.5 + rand() * 3).toFixed(2);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top:  `${y}%`,
              width:  size,
              height: size,
              borderRadius: '50%',
              background: '#fff',
              animation: `gp-twinkle ${dur}s ${delay}s ease-in-out infinite`,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
}

function Nebulae() {
  return (
    <>
      <div style={{
        position:'absolute', left:'5%', top:'10%',
        width:200, height:110,
        background:'radial-gradient(ellipse, rgba(120,40,200,0.28) 0%, transparent 70%)',
        filter:'blur(28px)', pointerEvents:'none', borderRadius:'50%',
      }}/>
      <div style={{
        position:'absolute', right:'4%', top:'25%',
        width:160, height:90,
        background:'radial-gradient(ellipse, rgba(20,90,180,0.25) 0%, transparent 70%)',
        filter:'blur(24px)', pointerEvents:'none', borderRadius:'50%',
      }}/>
      <div style={{
        position:'absolute', left:'30%', bottom:'15%',
        width:140, height:70,
        background:'radial-gradient(ellipse, rgba(0,160,160,0.20) 0%, transparent 70%)',
        filter:'blur(20px)', pointerEvents:'none', borderRadius:'50%',
      }}/>
    </>
  );
}

function Planet({ stageIdx, size, color, glow, atm }) {
  const glowSize = size * 0.55;
  return (
    <div style={{ position:'relative', width: size, height: size }}>
      {/* Outer glow pulse */}
      <div style={{
        position:'absolute',
        inset: -glowSize / 2,
        borderRadius:'50%',
        background:`radial-gradient(circle, ${glow}55 0%, transparent 70%)`,
        animation:'gp-glow-pulse 2.5s ease-in-out infinite',
        pointerEvents:'none',
      }}/>

      {/* Planet sphere */}
      <div style={{
        position:'relative',
        width: size, height: size,
        borderRadius:'50%',
        background: `radial-gradient(circle at 36% 34%, ${lighten(color, 50)} 0%, ${color} 45%, ${darken(color, 40)} 100%)`,
        boxShadow: `0 0 ${size * 0.4}px ${glow}88, inset -${size*0.12}px -${size*0.1}px ${size*0.2}px rgba(0,0,0,0.5)`,
        overflow:'hidden',
      }}>
        {/* Cloud bands */}
        {stageIdx >= 2 && <>
          <div style={{ position:'absolute', top:'28%', left:0, right:0, height: size*0.08, background:`${atm}44`, borderRadius:4 }}/>
          <div style={{ position:'absolute', top:'48%', left:0, right:0, height: size*0.06, background:`${atm}33`, borderRadius:4 }}/>
          <div style={{ position:'absolute', top:'65%', left:0, right:0, height: size*0.05, background:`${atm}22`, borderRadius:4 }}/>
        </>}
        {/* Storm spot */}
        {stageIdx >= 3 && (
          <div style={{
            position:'absolute',
            top:'38%', left:'60%',
            width: size * 0.18, height: size * 0.12,
            borderRadius:'50%',
            background:`radial-gradient(circle, ${lighten(glow, 60)}99 0%, ${glow}55 100%)`,
            boxShadow:`0 0 6px ${glow}`,
          }}/>
        )}
        {/* Atmosphere rim */}
        {atm && (
          <div style={{
            position:'absolute', inset:0, borderRadius:'50%',
            boxShadow:`inset 0 0 ${size*0.25}px ${atm}66`,
          }}/>
        )}
      </div>
    </div>
  );
}

const RING_DEFS = (size) => [
  { w: size * 1.8, h: size * 0.38, op: 0.7, border: 8 },
  { w: size * 2.1, h: size * 0.44, op: 0.45, border: 5 },
  { w: size * 2.4, h: size * 0.50, op: 0.25, border: 3 },
];

/* Back half of rings — rendered before the planet, sits behind it */
function RingsBack({ size, color }) {
  return (
    <>
      {RING_DEFS(size).map((r, i) => (
        <div key={i} style={{
          position:'absolute',
          left: size / 2 - r.w / 2,
          top:  size / 2 - r.h / 2,
          width: r.w, height: r.h,
          borderRadius:'50%',
          border: `${r.border}px solid ${color}`,
          opacity: r.op,
          transform: 'rotateX(75deg)',
          boxShadow:`0 0 10px ${color}88`,
          clipPath:'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
          pointerEvents:'none',
        }}/>
      ))}
    </>
  );
}

/* Front half of rings — rendered after the planet, sits in front of it */
function RingsFront({ size, color }) {
  return (
    <>
      {RING_DEFS(size).map((r, i) => (
        <div key={i} style={{
          position:'absolute',
          left: size / 2 - r.w / 2,
          top:  size / 2 - r.h / 2,
          width: r.w, height: r.h,
          borderRadius:'50%',
          border: `${r.border}px solid ${color}`,
          opacity: r.op,
          transform: 'rotateX(75deg)',
          boxShadow:`0 0 10px ${color}88`,
          clipPath:'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
          pointerEvents:'none',
        }}/>
      ))}
    </>
  );
}

function Moon({ orbitR, size, col, animName, dur }) {
  return (
    <div style={{
      position:'absolute',
      inset:0,
      display:'flex', alignItems:'center', justifyContent:'center',
      pointerEvents:'none',
    }}>
      <div style={{
        '--orbit-r': `${orbitR}px`,
        width: size, height: size,
        borderRadius:'50%',
        background: `radial-gradient(circle at 35% 35%, ${lighten(col, 60)} 0%, ${col} 60%, ${darken(col, 30)} 100%)`,
        boxShadow:`0 0 8px ${col}`,
        animation:`${animName} ${dur} linear infinite`,
      }}/>
    </div>
  );
}

function AsteroidBelt({ size }) {
  const rand = seededRand(77);
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', animation:'gp-asteroid 28s linear infinite' }}>
      {Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * 360;
        const r     = size * 1.55 + rand() * 14 - 7;
        const x     = Math.cos((angle * Math.PI) / 180) * r;
        const y     = Math.sin((angle * Math.PI) / 180) * r * 0.28; // flat belt
        const s     = 2 + rand() * 4;
        return (
          <div key={i} style={{
            position:'absolute',
            left:`calc(50% + ${x}px)`,
            top:`calc(50% + ${y}px)`,
            width: s, height: s,
            borderRadius: '40%',
            background:'#aaa',
            opacity: 0.55 + rand() * 0.35,
          }}/>
        );
      })}
    </div>
  );
}

function ShootingStar({ delay }) {
  const rand = seededRand(delay * 100 | 0);
  const top  = 10 + rand() * 55;
  return (
    <div style={{
      position:'absolute',
      left: 0, top:`${top}%`,
      width: 80, height: 2,
      background:'linear-gradient(90deg, transparent 0%, #ffffffcc 40%, #fff 60%, transparent 100%)',
      borderRadius: 2,
      animation:`gp-shoot 1.1s ${delay}s ease-in-out infinite`,
      pointerEvents:'none',
    }}/>
  );
}

function Comet() {
  return (
    <div style={{
      position:'absolute',
      left: '8%', top:'18%',
      width: 100, height: 3,
      background:'linear-gradient(90deg, transparent 0%, #00e5ff88 30%, #00e5ff 60%, transparent 100%)',
      borderRadius: 2,
      animation:`gp-comet 3.5s 7s ease-in-out infinite`,
      pointerEvents:'none',
    }}/>
  );
}

function QuizStars({ count }) {
  const rand = seededRand(99);
  const capped = Math.min(count, 12);
  return (
    <>
      {Array.from({ length: capped }, (_, i) => {
        const x = 10 + rand() * 80;
        const y = 10 + rand() * 75;
        const delay = (rand() * 5).toFixed(2);
        const dur   = (1.5 + rand() * 2).toFixed(2);
        return (
          <div key={i} style={{
            position:'absolute',
            left:`${x}%`, top:`${y}%`,
            fontSize: 13,
            animation:`gp-sparkle ${dur}s ${delay}s ease-in-out infinite`,
            pointerEvents:'none',
            userSelect:'none',
          }}>⭐</div>
        );
      })}
    </>
  );
}

function Rocket({ top, animName, dur, delay, rtl = false }) {
  return (
    <div style={{
      position:'absolute',
      ...(rtl ? { right:'-10px' } : { left:'-10px' }),
      top,
      fontSize: 18,
      lineHeight: 1,
      animation:`${animName} ${dur} ${delay} linear infinite`,
      pointerEvents:'none',
      zIndex: 5,
    }}>🚀</div>
  );
}

function Astronaut({ left, top, delay }) {
  return (
    <div style={{
      position:'absolute',
      left, top,
      fontSize: 20,
      lineHeight: 1,
      animation:`gp-astronaut 7s ${delay} ease-in-out infinite`,
      pointerEvents:'none',
      zIndex: 4,
      opacity: 0.88,
    }}>👨‍🚀</div>
  );
}

function UFO() {
  return (
    <div style={{
      position:'absolute',
      left: '-10px',
      top: '36%',
      fontSize: 24,
      lineHeight: 1,
      animation:`gp-ufo 15s 4.5s linear infinite`,
      pointerEvents:'none',
      zIndex: 5,
    }}>🛸</div>
  );
}

function Wormhole() {
  return (
    <div style={{
      position:'absolute',
      bottom: 72,
      right: 18,
      width: 54,
      height: 54,
      borderRadius:'50%',
      background:'conic-gradient(from 0deg, #7b2fbe, #ffd700, #ce93d8, #ff8c00, #9b59b6, #ffd700, #7b2fbe)',
      animation:'gp-wormhole-spin 3s linear infinite',
      pointerEvents:'none',
      zIndex: 4,
      boxShadow:'0 0 20px #7b2fbeaa, 0 0 38px #ffd70044',
      overflow:'hidden',
    }}>
      <div style={{
        position:'absolute',
        inset: 9,
        borderRadius:'50%',
        background:'radial-gradient(circle, #0d001f 50%, #1a0a2e88 100%)',
        animation:'gp-wormhole-inner 4.5s linear infinite',
      }}/>
    </div>
  );
}

/* ─── Colour helpers ────────────────────────────────────────────── */
function lighten(hex, amt) {
  const n = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `#${(r<<16|g<<8|b).toString(16).padStart(6,'0')}`;
}
function darken(hex, amt) { return lighten(hex, -amt); }

/* ─── Main component ────────────────────────────────────────────── */
export default function GalaxyPlanet({
  studyStreak   = 0,
  quizScore     = 0,
  hasMentor     = false,
  hasStudyPlan  = false,
}) {
  useEffect(() => { injectCSS(); }, []);

  const [levelUp, setLevelUp]   = useState(false);
  const prevStage               = useRef(getStage(studyStreak));

  const stageIdx  = getStage(studyStreak);
  const info      = STAGES[stageIdx];

  // level-up flash when stage changes
  useEffect(() => {
    const cur = getStage(studyStreak);
    if (cur !== prevStage.current) {
      setLevelUp(true);
      prevStage.current = cur;
      const t = setTimeout(() => setLevelUp(false), 2800);
      return () => clearTimeout(t);
    }
  }, [studyStreak]);

  // progress percentage toward next stage
  const prev   = STAGES[stageIdx].min;
  const nxt    = STAGES[stageIdx].next ?? (prev + 1);
  const progPct = stageIdx === STAGES.length - 1 ? 100 : Math.min(100, ((studyStreak - prev) / (nxt - prev)) * 100);

  const { size, color, glow, atm } = info;
  const rings      = stageIdx >= 3;
  const moons      = stageIdx >= 4;
  const thirdMoon  = stageIdx >= 5;
  const asteroids  = stageIdx >= 5;
  const sparkles   = stageIdx >= 5;
  const orbitR     = size * 0.72;

  return (
    <div
      style={{
        position:'relative',
        width:'100%',
        minHeight: 400,
        borderRadius: 20,
        overflow:'hidden',
        background:'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0d001f 40%, #000008 100%)',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        padding:'32px 20px 24px',
        boxSizing:'border-box',
        cursor:'default',
        userSelect:'none',
      }}
    >
      {/* Stars */}
      <Stars/>

      {/* Nebulae */}
      <Nebulae/>

      {/* Shooting stars — stage 3+ */}
      {stageIdx >= 2 && <>
        <ShootingStar delay={3.0}/>
        <ShootingStar delay={7.5}/>
        <ShootingStar delay={12.0}/>
      </>}

      {/* Comet — if study plan */}
      {hasStudyPlan && <Comet/>}

      {/* Quiz stars scattered */}
      {quizScore > 0 && <QuizStars count={quizScore}/>}

      {/* Rockets — always present, staggered so they don't all fire at once */}
      <Rocket top="18%"  animName="gp-rocket-lr"   dur="9s"   delay="1s"/>
      <Rocket top="50%"  animName="gp-rocket-diag" dur="12s"  delay="6s"/>
      <Rocket top="70%"  animName="gp-rocket-rl"   dur="10s"  delay="3.5s" rtl/>

      {/* Astronauts — stage 3+ */}
      {stageIdx >= 2 && <>
        <Astronaut left="7%"  top="30%" delay="0s"/>
        <Astronaut left="78%" top="54%" delay="2.2s"/>
        <Astronaut left="56%" top="13%" delay="4.5s"/>
      </>}

      {/* UFO — stage 4+ */}
      {stageIdx >= 3 && <UFO/>}

      {/* Wormhole — stage 6 */}
      {stageIdx >= 5 && <Wormhole/>}

      {/* Level-up toast */}
      <AnimatePresence>
        {levelUp && (
          <motion.div
            initial={{ opacity:0, y:-24, scale:0.85 }}
            animate={{ opacity:1, y:0,   scale:1    }}
            exit   ={{ opacity:0, y:-16, scale:0.9  }}
            transition={{ duration:0.5 }}
            style={{
              position:'absolute', top:16,
              background:'rgba(30,0,60,0.92)',
              border:'1.5px solid #ab47bc',
              color:'#e1bee7',
              padding:'7px 18px',
              borderRadius:20,
              fontSize:13,
              fontWeight:700,
              zIndex:20,
              boxShadow:'0 0 16px #ab47bc88',
            }}
          >
            🪐 New Stage: {info.label}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Planet area */}
      <div style={{ position:'relative', width: size * 2.8, height: size * 2.4, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>

        {/* Asteroid belt — doesn't float with planet */}
        {asteroids && <AsteroidBelt size={size}/>}

        {/* Moons — orbit independently */}
        {moons && (
          <Moon orbitR={orbitR}        size={18} col="#c0c0c0" animName="gp-orbit-a"    dur="6s"/>
        )}
        {moons && (
          <Moon orbitR={orbitR * 1.3}  size={14} col="#9fc7e8" animName="gp-orbit-b"    dur="10s"/>
        )}
        {thirdMoon && (
          <Moon orbitR={orbitR * 1.6}  size={12} col="#ffd580" animName="gp-orbit-c"    dur="15s"/>
        )}
        {hasMentor && stageIdx >= 1 && (
          <Moon orbitR={orbitR * 1.1}  size={16} col="#ffd700" animName="gp-orbit-gold" dur="8s"/>
        )}

        {/* Floating group: back rings + planet sphere + front rings all float together
             so the ring equator always stays aligned with the planet */}
        <div style={{ position:'relative', width:size, height:size, animation:'gp-float 4s ease-in-out infinite', overflow:'visible', zIndex:2 }}>
          {rings && <RingsBack size={size} color={glow}/>}
          <Planet stageIdx={stageIdx} size={size} color={color} glow={glow} atm={atm}/>
          {rings && <RingsFront size={size} color={glow}/>}

          {/* Stage 6 sparkles orbit the floating planet */}
          {sparkles && (
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'visible' }}>
              {[0,60,120,180,240,300].map((deg, i) => {
                const r = size * 0.95;
                const x = Math.cos((deg * Math.PI)/180) * r + size / 2 - 8;
                const y = Math.sin((deg * Math.PI)/180) * r + size / 2 - 8;
                return (
                  <div key={i} style={{
                    position:'absolute',
                    left: x, top: y,
                    fontSize:14,
                    animation:`gp-sparkle ${1.2 + i*0.3}s ${i*0.4}s ease-in-out infinite`,
                  }}>✨</div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div style={{ textAlign:'center', color:'#e1bee7', marginTop: 8, width:'100%', padding:'0 16px', boxSizing:'border-box' }}>
        <div style={{ fontWeight:700, fontSize:16, color:'#ce93d8', letterSpacing:0.5 }}>
          🪐 {info.label}
        </div>
        <div style={{ fontSize:12, color:'#b39ddb', marginTop:4 }}>
          {studyStreak} day streak
        </div>
        {info.next != null && (
          <div style={{ fontSize:11, color:'#9575cd', marginTop:2 }}>
            {daysToNext(studyStreak)} more days to evolve ⚡
          </div>
        )}
        {info.next == null && (
          <div style={{ fontSize:11, color:'#ffd700', marginTop:2 }}>✨ Maximum evolution reached!</div>
        )}

        {/* Progress bar */}
        <div style={{ width:'75%', maxWidth:260, margin:'10px auto 0' }}>
          <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:50, overflow:'hidden' }}>
            <motion.div
              style={{ height:'100%', borderRadius:50, background:`linear-gradient(90deg, ${darken(glow,10)}, ${glow})` }}
              animate={{ width:`${progPct}%` }}
              transition={{ duration:1.2, ease:'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
