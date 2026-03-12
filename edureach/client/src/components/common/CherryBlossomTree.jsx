import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Stage logic ──────────────────────────────────────────────────────────
const stageInfo = [
  { label: '\ud83c\udf31 Bare Branches',  next: 3  },
  { label: '\ud83c\udf31 First Buds',     next: 7  },
  { label: '\ud83c\udf38 Early Bloom',    next: 14 },
  { label: '\ud83c\udf38 Half Bloom',     next: 30 },
  { label: '\ud83c\udf38\ud83c\udf38 Full Bloom', next: 60 },
  { label: '\u2728 Peak Bloom',           next: null },
];

const getStage = (streak) => {
  if (streak >= 60) return 5;
  if (streak >= 30) return 4;
  if (streak >= 14) return 3;
  if (streak >= 7)  return 2;
  if (streak >= 3)  return 1;
  return 0;
};

const getNextMilestone = (streak) => {
  const stage = getStage(streak);
  const { next } = stageInfo[Math.min(stage, stageInfo.length - 1)];
  if (next == null) return 0;
  return next - streak;
};

// ─── Blossom ──────────────────────────────────────────────────────────────
const Blossom = ({ x, y, size = 1, gradId = 'petalGrad1', opacity = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${size})`} opacity={opacity} filter="url(#blossomGlow)">
    {[0, 72, 144, 216, 288].map((angle, i) => {
      const rad = angle * Math.PI / 180;
      const px  = Math.cos(rad) * 7;
      const py  = Math.sin(rad) * 7;
      return (
        <ellipse key={i} cx={px} cy={py} rx="6.5" ry="4"
          fill={`url(#${gradId})`}
          transform={`rotate(${angle} ${px} ${py})`}
        />
      );
    })}
    <circle cx="0" cy="0" r="3.5" fill="#fff9c4"/>
    <circle cx="0" cy="0" r="2"   fill="#f9a825"/>
    {[0,60,120,180,240,300].map((a, i) => (
      <circle key={i}
        cx={Math.cos(a * Math.PI / 180) * 4.5}
        cy={Math.sin(a * Math.PI / 180) * 4.5}
        r="0.8" fill="#e91e63" opacity="0.7"
      />
    ))}
  </g>
);

// ─── Bud ──────────────────────────────────────────────────────────────────
const Bud = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse cx="0" cy="0" rx="3" ry="5" fill="#f48fb1"/>
    <ellipse cx="0" cy="0" rx="2" ry="4" fill="#fce4ec"/>
    <ellipse cx="-1" cy="-1" rx="1" ry="2" fill="#fff" opacity="0.5"/>
  </g>
);

// ─── CSS keyframes ─────────────────────────────────────────────────────────
const TREE_CSS = `
  @keyframes fall1 {
    0%   { transform: translate(0,0) rotate(0deg); opacity: 0.9; }
    100% { transform: translate(-40px,180px) rotate(180deg); opacity: 0; }
  }
  @keyframes fall2 {
    0%   { transform: translate(0,0) rotate(0deg); opacity: 0.8; }
    100% { transform: translate(30px,200px) rotate(-150deg); opacity: 0; }
  }
  @keyframes fall3 {
    0%   { transform: translate(0,0) rotate(20deg); opacity: 0.7; }
    100% { transform: translate(-25px,160px) rotate(200deg); opacity: 0; }
  }
  @keyframes fall4 {
    0%   { transform: translate(0,0) rotate(-10deg); opacity: 0.85; }
    100% { transform: translate(45px,190px) rotate(-180deg); opacity: 0; }
  }
  @keyframes sway {
    0%,100% { transform: translateX(0); }
    50%     { transform: translateX(8px); }
  }
`;

// ─── Main component ────────────────────────────────────────────────────────
export default function CherryBlossomTree({
  studyStreak      = 0,
  lessonsCompleted = 0,
  quizScore        = 0,
  hasMentor        = false,
  hasStudyPlan     = false,
}) {
  const stage   = getStage(studyStreak);
  const info    = stageInfo[Math.min(stage, stageInfo.length - 1)];
  const progPct = info.next ? Math.min((studyStreak / info.next) * 100, 100) : 100;

  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevStage = useRef(stage);

  useEffect(() => {
    if (stage > prevStage.current) {
      setShowLevelUp(true);
      prevStage.current = stage;
      const t = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <div style={{
      position:      'relative',
      width:         '100%',
      background:    'linear-gradient(180deg, #87CEEB 0%, #b0d4f1 35%, #d4eac8 65%, #90c060 85%, #70a840 100%)',
      borderRadius:  20,
      overflow:      'hidden',
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      paddingBottom: 16,
    }}>

      {/* Level-up toast */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y:   0, scale: 1   }}
            exit={{    opacity: 0, y: -20, scale: 0.8 }}
            style={{
              position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg,#e91e63,#f48fb1)',
              color: '#fff', fontWeight: 800, fontSize: 13,
              padding: '7px 22px', borderRadius: 50,
              boxShadow: '0 4px 20px rgba(233,30,99,0.4)',
              zIndex: 20, whiteSpace: 'nowrap', pointerEvents: 'none',
            }}
          >
            🌸 New Bloom Stage! {info.label}
          </motion.div>
        )}
      </AnimatePresence>

      <svg width="100%" height="420" viewBox="0 0 400 420" style={{ display:'block' }}>
        <style>{TREE_CSS}</style>
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#87CEEB"/>
            <stop offset="55%"  stopColor="#b0d4f1"/>
            <stop offset="100%" stopColor="#d4eac8"/>
          </linearGradient>
          <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#4e342e"/>
            <stop offset="30%"  stopColor="#6d4c41"/>
            <stop offset="60%"  stopColor="#8d6e63"/>
            <stop offset="100%" stopColor="#5d4037"/>
          </linearGradient>
          <linearGradient id="branchGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#5d4037"/>
            <stop offset="50%"  stopColor="#795548"/>
            <stop offset="100%" stopColor="#6d4c41"/>
          </linearGradient>
          <radialGradient id="petalGrad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff"/>
            <stop offset="40%"  stopColor="#fce4ec"/>
            <stop offset="100%" stopColor="#f48fb1"/>
          </radialGradient>
          <radialGradient id="petalGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff9fc"/>
            <stop offset="50%"  stopColor="#f8bbd0"/>
            <stop offset="100%" stopColor="#ec407a"/>
          </radialGradient>
          <radialGradient id="petalGrad3" cx="30%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#ffffff"/>
            <stop offset="60%"  stopColor="#f48fb1"/>
            <stop offset="100%" stopColor="#e91e63"/>
          </radialGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#90c060"/>
            <stop offset="100%" stopColor="#5a8c28"/>
          </linearGradient>
          <filter id="blossomGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#c2185b" floodOpacity="0.15"/>
          </filter>
          <filter id="petalShadow">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#e91e63" floodOpacity="0.2"/>
          </filter>
          <radialGradient id="goldPetal" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff9e6"/>
            <stop offset="50%"  stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#f57f17"/>
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="400" height="420" fill="url(#skyGrad)"/>

        {/* Water/lake reflection */}
        <ellipse cx="200" cy="408" rx="165" ry="22" fill="#87CEEB" opacity="0.38"/>
        <rect x="35" y="393" width="330" height="35" rx="6" fill="#87CEEB" opacity="0.22"/>
        <ellipse cx="192" cy="410" rx="85"  ry="14" fill="#f48fb1" opacity="0.18"/>

        {/* Rolling hills */}
        <ellipse cx="200" cy="420" rx="280" ry="60" fill="url(#groundGrad)" opacity="0.95"/>
        <ellipse cx="80"  cy="420" rx="140" ry="45" fill="#6aaa2e"/>
        <ellipse cx="330" cy="420" rx="120" ry="40" fill="#6aaa2e"/>
        <ellipse cx="200" cy="400" rx="180" ry="20" fill="#8cc040" opacity="0.55"/>

        {/* Trunk */}
        <path d="M 185 400 Q 178 370 175 340 Q 172 310 178 280 Q 182 255 190 230 Q 194 215 192 200"
          stroke="url(#trunkGrad)" strokeWidth="22" fill="none" strokeLinecap="round"/>
        <path d="M 188 395 Q 182 365 180 335 Q 178 308 183 278 Q 187 255 193 232"
          stroke="#8d6e63" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.5"/>
        <path d="M 183 350 Q 190 345 185 338" stroke="#4e342e" strokeWidth="1.5" fill="none" opacity="0.4"/>
        <path d="M 180 320 Q 188 314 183 308" stroke="#4e342e" strokeWidth="1.5" fill="none" opacity="0.3"/>
        <path d="M 182 290 Q 189 285 184 279" stroke="#4e342e" strokeWidth="1.5" fill="none" opacity="0.3"/>
        <path d="M 185 400 Q 170 395 155 405" stroke="url(#trunkGrad)" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M 188 400 Q 205 395 220 405" stroke="url(#trunkGrad)" strokeWidth="12" fill="none" strokeLinecap="round"/>

        {/* Tiny branch stubs — stage 1 only */}
        {stage === 1 && <>
          <path d="M 182 260 Q 165 252 148 246" stroke="url(#branchGrad)" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M 196 255 Q 213 247 228 242" stroke="url(#branchGrad)" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M 190 228 Q 186 210 183 192" stroke="url(#branchGrad)" strokeWidth="7" fill="none" strokeLinecap="round"/>
        </>}

        {/* Full branches — stage >= 2 */}
        {stage >= 2 && <>
          {/* Left main */}
          <path d="M 182 260 Q 158 238 128 218 Q 105 202 82 195"
            stroke="url(#branchGrad)" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M 128 218 Q 108 198 92 178"
            stroke="#795548" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <path d="M 105 208 Q 88 195 72 188"
            stroke="#795548" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M 82 195 Q 65 182 52 168"
            stroke="#6d4c41" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* Right main */}
          <path d="M 196 255 Q 222 232 252 212 Q 275 196 300 188"
            stroke="url(#branchGrad)" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M 252 212 Q 272 192 288 172"
            stroke="#795548" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <path d="M 275 200 Q 292 186 308 178"
            stroke="#795548" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M 300 188 Q 318 174 332 160"
            stroke="#6d4c41" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* Upper center */}
          <path d="M 190 220 Q 186 195 180 170 Q 176 150 178 128"
            stroke="url(#branchGrad)" strokeWidth="9" fill="none" strokeLinecap="round"/>
          <path d="M 180 165 Q 162 148 145 132 Q 132 120 118 108"
            stroke="#795548" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M 183 152 Q 202 135 220 118 Q 235 106 248 95"
            stroke="#795548" strokeWidth="6" fill="none" strokeLinecap="round"/>
          {/* Twig tips */}
          {[
            "M 52 168 Q 42 155 38 142",
            "M 52 168 Q 48 152 52 138",
            "M 82 195 Q 72 178 68 162",
            "M 332 160 Q 342 147 348 132",
            "M 308 178 Q 320 162 325 146",
            "M 118 108 Q 108 94 102 80",
            "M 118 108 Q 122 92 128 78",
            "M 248 95 Q 258 80 262 66",
            "M 248 95 Q 252 78 245 65",
            "M 178 128 Q 170 112 165 96",
            "M 178 128 Q 185 110 188 94",
          ].map((d, i) => (
            <path key={i} d={d} stroke="#8d6e63" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8"/>
          ))}
        </>}

        {/* Stage 0 — single top bud */}
        {stage === 0 && <Bud x={192} y={200}/>}

        {/* Stage 1 — buds at stub tips */}
        {stage === 1 && [[148,246],[228,242],[183,192]].map(([x,y],i) => <Bud key={i} x={x} y={y}/>)}

        {/* Stage 2 — buds + first blossoms */}
        {stage === 2 && <>
          {[[38,142],[52,138],[68,162],[348,132],[325,146]].map(([x,y],i) => <Bud key={`b${i}`} x={x} y={y}/>)}
          {[[102,80],[128,78],[165,96],[188,94],[262,66],[245,65]].map(([x,y],i) => (
            <Blossom key={`bl${i}`} x={x} y={y} size={0.7} gradId="petalGrad1" opacity={0.7}/>
          ))}
        </>}

        {/* Stage 3 — half bloom */}
        {stage === 3 && [
          [38,142],[52,138],[68,162],[102,80],[128,78],[165,96],[188,94],
          [262,66],[245,65],[325,146],[348,132],[82,195],[52,168],
          [300,188],[332,160],[118,108],[248,95],[178,128],
        ].map(([x,y],i) => (
          <Blossom key={i} x={x} y={y} size={0.85} gradId={i%2===0?'petalGrad1':'petalGrad2'} opacity={0.85}/>
        ))}

        {/* STAGE 4 — dense cluster base + blossoms on top */}
        {stage === 4 && <>
          {/* Depth shadow */}
          <ellipse cx="192" cy="205" rx="130" ry="20" fill="#e91e63" opacity="0.07"/>

          {/* Far-left cluster */}
          <ellipse cx="55"  cy="178" rx="62"  ry="48" fill="#f48fb1" opacity="0.82"/>
          <ellipse cx="40"  cy="160" rx="50"  ry="40" fill="#f06292" opacity="0.72"/>
          <ellipse cx="70"  cy="154" rx="56"  ry="42" fill="#fce4ec" opacity="0.68"/>
          <ellipse cx="52"  cy="138" rx="44"  ry="34" fill="#f48fb1" opacity="0.78"/>

          {/* Left-mid cluster */}
          <ellipse cx="122" cy="150" rx="60"  ry="46" fill="#f48fb1" opacity="0.82"/>
          <ellipse cx="106" cy="132" rx="52"  ry="40" fill="#f06292" opacity="0.72"/>
          <ellipse cx="140" cy="134" rx="57"  ry="42" fill="#fce4ec" opacity="0.68"/>
          <ellipse cx="116" cy="116" rx="46"  ry="36" fill="#f48fb1" opacity="0.78"/>

          {/* Center cluster */}
          <ellipse cx="192" cy="118" rx="70"  ry="54" fill="#f48fb1" opacity="0.85"/>
          <ellipse cx="174" cy="100" rx="60"  ry="46" fill="#f06292" opacity="0.74"/>
          <ellipse cx="212" cy="104" rx="62"  ry="48" fill="#fce4ec" opacity="0.70"/>
          <ellipse cx="192" cy="86"  rx="54"  ry="42" fill="#f48fb1" opacity="0.80"/>
          <ellipse cx="192" cy="70"  rx="44"  ry="34" fill="#f9a8c9" opacity="0.85"/>

          {/* Right-mid cluster */}
          <ellipse cx="264" cy="150" rx="60"  ry="46" fill="#f48fb1" opacity="0.82"/>
          <ellipse cx="280" cy="132" rx="52"  ry="40" fill="#f06292" opacity="0.72"/>
          <ellipse cx="246" cy="134" rx="57"  ry="42" fill="#fce4ec" opacity="0.68"/>
          <ellipse cx="268" cy="116" rx="46"  ry="36" fill="#f48fb1" opacity="0.78"/>

          {/* Far-right cluster */}
          <ellipse cx="345" cy="178" rx="62"  ry="48" fill="#f48fb1" opacity="0.82"/>
          <ellipse cx="360" cy="160" rx="50"  ry="40" fill="#f06292" opacity="0.72"/>
          <ellipse cx="330" cy="154" rx="56"  ry="42" fill="#fce4ec" opacity="0.68"/>
          <ellipse cx="348" cy="138" rx="44"  ry="34" fill="#f48fb1" opacity="0.78"/>

          {/* Bottom fill — connects all clusters */}
          <ellipse cx="148" cy="180" rx="68"  ry="38" fill="#f48fb1" opacity="0.68"/>
          <ellipse cx="192" cy="188" rx="80"  ry="40" fill="#f9a8c9" opacity="0.62"/>
          <ellipse cx="238" cy="180" rx="68"  ry="38" fill="#f48fb1" opacity="0.68"/>

          {/* Crown highlight */}
          <ellipse cx="192" cy="68"  rx="48"  ry="35" fill="#fce4ec" opacity="0.90"/>
          <ellipse cx="174" cy="60"  rx="34"  ry="26" fill="#fff0f5" opacity="0.85"/>
          <ellipse cx="212" cy="63"  rx="34"  ry="26" fill="#fff0f5" opacity="0.85"/>
          <ellipse cx="182" cy="63"  rx="20"  ry="13" fill="#ffffff" opacity="0.24"/>

          {/* Individual blossoms on top for detail */}
          {[
            [52,160,0.9],[40,142,0.85],[70,136,0.9],[88,158,0.85],
            [106,120,0.9],[126,112,0.85],[118,140,0.9],[140,127,0.85],[154,107,0.9],
            [165,97,0.9],[175,110,0.85],[155,89,0.9],[188,97,0.9],
            [192,80,1.0],[192,63,1.0],[180,73,0.95],[206,70,0.95],
            [210,98,0.9],[227,90,0.85],[242,80,0.9],[260,70,0.85],
            [250,107,0.9],[264,120,0.85],[280,112,0.9],[290,137,0.85],
            [307,127,0.9],[320,114,0.85],[334,140,0.9],[350,127,0.85],[360,144,0.9],
            [80,187,0.85],[60,180,0.85],[100,197,0.85],
            [287,187,0.85],[310,190,0.85],[332,200,0.85],
          ].map(([x,y,op],i) => (
            <Blossom key={i} x={x} y={y}
              size={0.88 + Math.sin(i) * 0.14}
              gradId={['petalGrad1','petalGrad2','petalGrad3'][i%3]}
              opacity={op}
            />
          ))}
        </>}

        {/* STAGE 5 — peak eternal bloom, maximum density */}
        {stage >= 5 && <>
          {/* Depth shadow */}
          <ellipse cx="192" cy="210" rx="145" ry="24" fill="#e91e63" opacity="0.09"/>

          <ellipse cx="42"  cy="186" rx="68"  ry="53" fill="#f48fb1" opacity="0.86"/>
          <ellipse cx="28"  cy="165" rx="55"  ry="44" fill="#f06292" opacity="0.76"/>
          <ellipse cx="66"  cy="158" rx="60"  ry="46" fill="#fce4ec" opacity="0.72"/>
          <ellipse cx="46"  cy="138" rx="48"  ry="38" fill="#f48fb1" opacity="0.82"/>
          <ellipse cx="68"  cy="118" rx="42"  ry="32" fill="#f9a8c9" opacity="0.76"/>

          <ellipse cx="116" cy="150" rx="64"  ry="50" fill="#f48fb1" opacity="0.86"/>
          <ellipse cx="100" cy="130" rx="56"  ry="44" fill="#f06292" opacity="0.76"/>
          <ellipse cx="134" cy="132" rx="60"  ry="46" fill="#fce4ec" opacity="0.72"/>
          <ellipse cx="110" cy="108" rx="50"  ry="38" fill="#f48fb1" opacity="0.82"/>
          <ellipse cx="130" cy="90"  rx="42"  ry="32" fill="#f9a8c9" opacity="0.76"/>

          <ellipse cx="192" cy="114" rx="74"  ry="58" fill="#f48fb1" opacity="0.86"/>
          <ellipse cx="172" cy="94"  rx="64"  ry="50" fill="#f06292" opacity="0.76"/>
          <ellipse cx="214" cy="98"  rx="66"  ry="52" fill="#fce4ec" opacity="0.72"/>
          <ellipse cx="192" cy="78"  rx="58"  ry="46" fill="#f48fb1" opacity="0.82"/>
          <ellipse cx="192" cy="60"  rx="48"  ry="37" fill="#f9a8c9" opacity="0.87"/>
          <ellipse cx="192" cy="45"  rx="36"  ry="28" fill="#fce4ec" opacity="0.82"/>

          <ellipse cx="270" cy="150" rx="64"  ry="50" fill="#f48fb1" opacity="0.86"/>
          <ellipse cx="286" cy="130" rx="56"  ry="44" fill="#f06292" opacity="0.76"/>
          <ellipse cx="252" cy="132" rx="60"  ry="46" fill="#fce4ec" opacity="0.72"/>
          <ellipse cx="274" cy="108" rx="50"  ry="38" fill="#f48fb1" opacity="0.82"/>
          <ellipse cx="256" cy="90"  rx="42"  ry="32" fill="#f9a8c9" opacity="0.76"/>

          <ellipse cx="358" cy="186" rx="68"  ry="53" fill="#f48fb1" opacity="0.86"/>
          <ellipse cx="372" cy="165" rx="55"  ry="44" fill="#f06292" opacity="0.76"/>
          <ellipse cx="337" cy="158" rx="60"  ry="46" fill="#fce4ec" opacity="0.72"/>
          <ellipse cx="354" cy="138" rx="48"  ry="38" fill="#f48fb1" opacity="0.82"/>
          <ellipse cx="336" cy="118" rx="42"  ry="32" fill="#f9a8c9" opacity="0.76"/>

          <ellipse cx="140" cy="188" rx="72"  ry="40" fill="#f48fb1" opacity="0.72"/>
          <ellipse cx="192" cy="198" rx="85"  ry="42" fill="#f9a8c9" opacity="0.66"/>
          <ellipse cx="246" cy="188" rx="72"  ry="40" fill="#f48fb1" opacity="0.72"/>

          <ellipse cx="192" cy="56"  rx="52"  ry="38" fill="#fce4ec" opacity="0.92"/>
          <ellipse cx="170" cy="48"  rx="36"  ry="28" fill="#fff0f5" opacity="0.87"/>
          <ellipse cx="216" cy="50"  rx="36"  ry="28" fill="#fff0f5" opacity="0.87"/>
          <ellipse cx="182" cy="52"  rx="22"  ry="15" fill="#ffffff" opacity="0.27"/>

          {[
            [42,152,1.0],[54,135,0.96],[68,120,1.0],[82,138,0.96],[96,158,1.0],[70,170,0.93],
            [108,110,1.0],[122,98,0.96],[136,90,1.0],[148,102,0.96],[162,114,1.0],[140,130,0.93],
            [155,84,1.0],[165,72,0.96],[178,62,1.0],[192,55,1.0],[207,64,0.96],[220,74,1.0],
            [232,86,0.96],[247,80,1.0],[260,90,0.96],[274,102,1.0],[287,114,0.96],[267,130,0.93],
            [297,97,1.0],[310,110,0.96],[324,124,1.0],[340,112,0.96],[354,130,1.0],[364,150,0.93],
            [86,188,0.90],[66,198,0.88],[106,202,0.88],
            [292,194,0.90],[312,202,0.88],[337,207,0.88],
            [192,168,0.90],[165,150,0.88],[220,150,0.88],[140,165,0.86],[246,165,0.86],
          ].map(([x,y,op],i) => (
            <Blossom key={i} x={x} y={y}
              size={0.95 + Math.cos(i) * 0.18}
              gradId={['petalGrad1','petalGrad2','petalGrad3'][i%3]}
              opacity={op}
            />
          ))}
        </>}

        {/* Falling petals — stage 3: gentle drift */}
        {stage === 3 && [
          [ 90,120,'fall1','3.2s','0.0s'],
          [150, 80,'fall2','4.0s','0.5s'],
          [200,100,'fall3','3.5s','1.0s'],
          [260, 90,'fall4','4.5s','0.3s'],
          [310,130,'fall1','3.8s','1.5s'],
          [130,110,'fall2','4.2s','0.8s'],
          [240,140,'fall3','3.2s','2.0s'],
          [180, 70,'fall4','4.0s','1.2s'],
          [100,150,'fall1','3.6s','0.6s'],
          [280,110,'fall2','4.8s','1.8s'],
        ].map(([x,y,anim,dur,delay],i) => (
          <g key={i} style={{ animation:`${anim} ${dur} ${delay} infinite linear` }}>
            <ellipse cx={x} cy={y} rx="5" ry="3"
              fill="#f48fb1"
              transform={`rotate(${i*37} ${x} ${y})`}
              filter="url(#petalShadow)"
              opacity="0.80"
            />
          </g>
        ))}

        {/* Falling petals — stage 4+: 20 petals, more visible */}
        {stage >= 4 && [
          [ 90,120,'fall1','3.0s','0.0s'],
          [150, 80,'fall2','4.0s','0.5s'],
          [200,100,'fall3','3.5s','1.0s'],
          [260, 90,'fall4','4.5s','0.3s'],
          [310,130,'fall1','3.8s','1.5s'],
          [130,110,'fall2','4.2s','0.8s'],
          [240,140,'fall3','3.2s','2.0s'],
          [180, 70,'fall4','4.0s','1.2s'],
          [100,150,'fall1','3.6s','0.6s'],
          [280,110,'fall2','4.8s','1.8s'],
          [ 60,105,'fall3','3.3s','0.2s'],
          [342, 95,'fall4','4.1s','1.1s'],
          [222,128,'fall1','3.7s','0.4s'],
          [172,148,'fall2','4.3s','1.6s'],
          [322,118,'fall3','3.9s','0.9s'],
          [142, 92,'fall4','4.6s','1.3s'],
          [252,168,'fall1','3.4s','2.2s'],
          [362,142,'fall2','4.0s','0.7s'],
          [ 48,162,'fall3','3.8s','1.9s'],
          [195, 58,'fall4','4.2s','0.1s'],
        ].map(([x,y,anim,dur,delay],i) => (
          <g key={i} style={{ animation:`${anim} ${dur} ${delay} infinite linear` }}>
            <ellipse cx={x} cy={y} rx="7" ry="4"
              fill="#f48fb1"
              transform={`rotate(${i*37} ${x} ${y})`}
              filter="url(#petalShadow)"
              opacity="0.85"
            />
          </g>
        ))}

        {/* Golden blossom — quiz score */}
        {quizScore > 0 && stage >= 2 && (
          <g transform="translate(178,128)" filter="url(#blossomGlow)">
            {[0,72,144,216,288].map((angle,i) => {
              const rad = angle * Math.PI / 180;
              return (
                <ellipse key={i}
                  cx={Math.cos(rad)*7} cy={Math.sin(rad)*7}
                  rx="6.5" ry="4"
                  fill="url(#goldPetal)"
                  transform={`rotate(${angle} ${Math.cos(rad)*7} ${Math.sin(rad)*7})`}
                  opacity="0.95"
                />
              );
            })}
            <circle cx="0" cy="0" r="3.5" fill="#fff176"/>
            <circle cx="0" cy="0" r="2"   fill="#f57f17"/>
          </g>
        )}

        {/* Butterfly — study plan */}
        {hasStudyPlan && stage >= 2 && (
          <g transform="translate(285,155)" style={{ animation:'sway 2s ease-in-out infinite' }}>
            <ellipse cx="-12" cy="0" rx="14" ry="10" fill="#ce93d8" opacity="0.85" transform="rotate(-20 -12 0)"/>
            <ellipse cx=" 12" cy="0" rx="14" ry="10" fill="#ba68c8" opacity="0.85" transform="rotate( 20  12 0)"/>
            <ellipse cx="-8"  cy="5" rx="9"  ry="7"  fill="#e1bee7" opacity="0.75" transform="rotate(-15 -8 5)"/>
            <ellipse cx=" 8"  cy="5" rx="9"  ry="7"  fill="#e1bee7" opacity="0.75" transform="rotate( 15  8 5)"/>
            <circle cx="-10" cy="-1" r="3" fill="#9c27b0" opacity="0.4"/>
            <circle cx=" 10" cy="-1" r="3" fill="#9c27b0" opacity="0.4"/>
            <ellipse cx="0" cy="2" rx="2.5" ry="8" fill="#6a1b9a"/>
            <path d="M -1 -6 Q -8 -16 -6 -22" stroke="#6a1b9a" strokeWidth="1.2" fill="none"/>
            <path d="M  1 -6 Q  8 -16  6 -22" stroke="#6a1b9a" strokeWidth="1.2" fill="none"/>
            <circle cx="-6" cy="-22" r="2" fill="#ce93d8"/>
            <circle cx=" 6" cy="-22" r="2" fill="#ce93d8"/>
          </g>
        )}

        {/* Bird — mentor */}
        {hasMentor && stage >= 2 && (
          <g transform="translate(72,185)">
            <ellipse cx="0" cy="0"  rx="11" ry="8" fill="#e8f5e9"/>
            <ellipse cx="8" cy="-2" rx="7"  ry="5" fill="#f1f8e9"/>
            <ellipse cx="-3" cy="3" rx="10" ry="5" fill="#a5d6a7" transform="rotate(-15 -3 3)"/>
            <path d="M -10 2 Q -18 0 -20 5 Q -18 8 -10 6" fill="#81c784"/>
            <polygon points="14,-2 20,0 14,2" fill="#ff8f00"/>
            <circle cx="10"   cy="-3"   r="2.5" fill="#1a237e"/>
            <circle cx="10.8" cy="-3.5" r="1"   fill="#fff"/>
            <line x1="-2" y1="7" x2="-5" y2="14" stroke="#795548" strokeWidth="1.5"/>
            <line x1=" 2" y1="7" x2=" 0" y2="14" stroke="#795548" strokeWidth="1.5"/>
            <line x1=" 6" y1="7" x2=" 8" y2="14" stroke="#795548" strokeWidth="1.5"/>
          </g>
        )}
      </svg>

      {/* Info */}
      <div style={{ textAlign:'center', width:'100%', padding:'0 16px' }}>
        <div style={{ fontWeight:700, fontSize:15, color:'#880e4f' }}>
          🌸 My Cherry Blossom Tree
        </div>
        <div style={{ fontSize:12, color:'#c2185b', marginTop:4 }}>
          {studyStreak} day streak — {info.label}
        </div>
        {info.next != null && (
          <div style={{ fontSize:11, color:'#ad1457', marginTop:2 }}>
            {getNextMilestone(studyStreak)} more days to next bloom stage ✨
          </div>
        )}
        <div style={{ width:'80%', maxWidth:280, margin:'10px auto 0' }}>
          <div style={{ height:7, background:'#fce4ec', borderRadius:50, overflow:'hidden' }}>
            <motion.div
              style={{ height:'100%', borderRadius:50, background:'linear-gradient(90deg,#f48fb1,#e91e63)' }}
              animate={{ width:`${progPct}%` }}
              transition={{ duration:1.2, ease:'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
