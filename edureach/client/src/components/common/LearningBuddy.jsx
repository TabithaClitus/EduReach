import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Stage logic ──────────────────────────────────────────────────────────
const getStage = (streak, lessons, quiz) => {
  const val = Math.max(streak ?? 0, lessons ?? 0, quiz ?? 0);
  if (val >= 60) return 4;
  if (val >= 30) return 3;
  if (val >= 10) return 2;
  return 1;
};
const NEXT   = { 1: 10, 2: 30, 3: 60, 4: null };
const LABELS = { 1: '🐾 Tiny Pup', 2: '🐶 Growing Pup', 3: '🐕 Young Dog', 4: '🌟 Companion' };
const STATUS_MSG = {
  excited:  'Amazing progress! 🎉',
  happy:    'Keep it up! 🔥',
  playing:  'Fun time! 🎾',
  sleeping: 'Resting… study to wake me 😴',
};

// ─── Palette ──────────────────────────────────────────────────────────────
const P = {
  darkShadow: '#3D1F00',
  shadow:     '#7A3E0A',
  mid:        '#C47818',
  gold:       '#E8A022',
  bright:     '#F2C040',
  highlight:  '#FDE075',
  cream:      '#FDF4DC',
  innerEar:   '#F08050',
  nose:       '#1A0800',
  eyeSclera:  '#FFFFF8',
  eyeIris:    '#3D2208',
  eyePupil:   '#0A0400',
  blush:      '#F4846A',
  tongue:     '#E8506A',
  tongueMid:  '#C03050',
};

// ─── Gradient / filter defs ───────────────────────────────────────────────
function Defs() {
  return (
    <defs>
      <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#B8E0F7"/>
        <stop offset="100%" stopColor="#DDF5E8"/>
      </linearGradient>
      <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#87CEEB"/>
        <stop offset="100%" stopColor="#C5EBC5"/>
      </linearGradient>
      <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#60B8E8"/>
        <stop offset="100%" stopColor="#A8DCAA"/>
      </linearGradient>
      <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#42A5F5"/>
        <stop offset="100%" stopColor="#81C784"/>
      </linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#66BB6A"/>
        <stop offset="100%" stopColor="#388E3C"/>
      </linearGradient>
      <radialGradient id="rg-body" cx="34%" cy="20%" r="70%">
        <stop offset="0%"   stopColor="#FDE075"/>
        <stop offset="22%"  stopColor="#F2C040"/>
        <stop offset="52%"  stopColor="#E8A022"/>
        <stop offset="78%"  stopColor="#C47818"/>
        <stop offset="100%" stopColor="#7A3E0A"/>
      </radialGradient>
      <radialGradient id="rg-head" cx="36%" cy="22%" r="68%">
        <stop offset="0%"   stopColor="#FDE075"/>
        <stop offset="20%"  stopColor="#F2C040"/>
        <stop offset="50%"  stopColor="#E8A022"/>
        <stop offset="76%"  stopColor="#C47818"/>
        <stop offset="100%" stopColor="#7A3E0A"/>
      </radialGradient>
      <radialGradient id="rg-muzz" cx="40%" cy="28%" r="66%">
        <stop offset="0%"   stopColor="#FDF4DC"/>
        <stop offset="38%"  stopColor="#EDD898"/>
        <stop offset="75%"  stopColor="#C8A050"/>
        <stop offset="100%" stopColor="#C47818"/>
      </radialGradient>
      <radialGradient id="rg-ear-out" cx="52%" cy="38%" r="68%">
        <stop offset="0%"   stopColor="#F2C040"/>
        <stop offset="45%"  stopColor="#E8A022"/>
        <stop offset="78%"  stopColor="#C47818"/>
        <stop offset="100%" stopColor="#7A3E0A"/>
      </radialGradient>
      <radialGradient id="rg-ear-in" cx="45%" cy="42%" r="65%">
        <stop offset="0%"   stopColor="#FFA060"/>
        <stop offset="55%"  stopColor="#F08050"/>
        <stop offset="100%" stopColor="#C05030"/>
      </radialGradient>
      <radialGradient id="rg-leg" cx="30%" cy="18%" r="62%">
        <stop offset="0%"   stopColor="#F2C040"/>
        <stop offset="50%"  stopColor="#E8A022"/>
        <stop offset="100%" stopColor="#7A3E0A"/>
      </radialGradient>
      <radialGradient id="rg-paw" cx="38%" cy="25%" r="65%">
        <stop offset="0%"   stopColor="#F2C040"/>
        <stop offset="48%"  stopColor="#C47818"/>
        <stop offset="100%" stopColor="#3D1F00"/>
      </radialGradient>
      <radialGradient id="rg-haunch" cx="32%" cy="22%" r="68%">
        <stop offset="0%"   stopColor="#FDE075"/>
        <stop offset="28%"  stopColor="#F2C040"/>
        <stop offset="58%"  stopColor="#E8A022"/>
        <stop offset="82%"  stopColor="#C47818"/>
        <stop offset="100%" stopColor="#7A3E0A"/>
      </radialGradient>
      <radialGradient id="rg-eye" cx="28%" cy="22%" r="65%">
        <stop offset="0%"   stopColor="#6B4010"/>
        <stop offset="40%"  stopColor="#3D2208"/>
        <stop offset="100%" stopColor="#100600"/>
      </radialGradient>
      <radialGradient id="rg-nose" cx="30%" cy="24%" r="65%">
        <stop offset="0%"   stopColor="#3A1000"/>
        <stop offset="55%"  stopColor="#1A0800"/>
        <stop offset="100%" stopColor="#000000"/>
      </radialGradient>
      <radialGradient id="rg-tongue" cx="38%" cy="24%" r="65%">
        <stop offset="0%"   stopColor="#FFB8C8"/>
        <stop offset="48%"  stopColor="#E8506A"/>
        <stop offset="100%" stopColor="#C03050"/>
      </radialGradient>
      <radialGradient id="rg-eye-gloss" cx="35%" cy="22%" r="60%">
        <stop offset="0%"   stopColor="white" stopOpacity="0.94"/>
        <stop offset="55%"  stopColor="white" stopOpacity="0.28"/>
        <stop offset="100%" stopColor="white" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="ball-rg" cx="34%" cy="26%" r="65%">
        <stop offset="0%"   stopColor="#FF7043"/>
        <stop offset="55%"  stopColor="#E53935"/>
        <stop offset="100%" stopColor="#B71C1C"/>
      </radialGradient>
      <filter id="fur-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="shadow-soft" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#2A1400" floodOpacity="0.25"/>
      </filter>
    </defs>
  );
}

// ─── Environment ───────────────────────────────────────────────────────────
function Environment({ stage }) {
  const skyId = ['sky1','sky2','sky3','sky4'][stage - 1];
  return (
    <>
      <rect x="0" y="0" width="400" height="310" fill={`url(#${skyId})`}/>

      {stage >= 2 && (
        <motion.g
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '340px', originY: '42px' }}
        >
          <circle cx="340" cy="42" r="26" fill="#FFF176" opacity="0.5"/>
          <circle cx="340" cy="42" r="20" fill="#FFD700"/>
          <circle cx="340" cy="42" r="15" fill="#FFE94D"/>
          {[0,40,80,120,160,200,240,280,320].map((a,i) => {
            const rad = a * Math.PI / 180;
            return <line key={i}
              x1={340 + 24*Math.cos(rad)} y1={42 + 24*Math.sin(rad)}
              x2={340 + 36*Math.cos(rad)} y2={42 + 36*Math.sin(rad)}
              stroke="#FFD700" strokeWidth="3" strokeLinecap="round" opacity="0.75"/>;
          })}
        </motion.g>
      )}

      {stage >= 3 && (
        <motion.g animate={{ x: [0, 14, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx="72"  cy="38" rx="36" ry="16" fill="white" opacity="0.82"/>
          <ellipse cx="52"  cy="44" rx="22" ry="13" fill="white" opacity="0.80"/>
          <ellipse cx="96"  cy="44" rx="26" ry="13" fill="white" opacity="0.80"/>
          <ellipse cx="72"  cy="30" rx="20" ry="12" fill="white" opacity="0.72"/>
        </motion.g>
      )}
      {stage >= 4 && (
        <motion.g animate={{ x: [0, -12, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
          <ellipse cx="182" cy="26" rx="28" ry="12" fill="white" opacity="0.70"/>
          <ellipse cx="162" cy="32" rx="18" ry="10" fill="white" opacity="0.68"/>
          <ellipse cx="204" cy="32" rx="20" ry="10" fill="white" opacity="0.68"/>
        </motion.g>
      )}

      <ellipse cx="200" cy="296" rx="178" ry="26" fill="#3D8B40"/>
      <ellipse cx="200" cy="290" rx="172" ry="20" fill="url(#ground)"/>

      {(stage >= 3
        ? [54,68,84,98,114,132,152,172,192,212,230,248,268,288,308,328,344]
        : [72,100,130,164,200,238,270,304]
      ).map((x, i) => (
        <g key={i}>
          <line x1={x}   y1="284" x2={x-4}  y2="268" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1={x+6} y1="284" x2={x+9}  y2="267" stroke="#388E3C" strokeWidth="2"   strokeLinecap="round"/>
          <line x1={x+2} y1="284" x2={x+2}  y2="271" stroke="#66BB6A" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      ))}

      {stage >= 2 && [
        { x:82,  c:'#FFEB3B' },
        { x:138, c:'#F48FB1' },
        { x:262, c:'#80DEEA' },
        { x:318, c:'#FFB74D' },
        ...(stage >= 3 ? [
          { x:60,  c:'#EF9A9A' }, { x:342, c:'#CE93D8' },
          { x:108, c:'#A5D6A7' }, { x:292, c:'#FFF59D' },
        ] : []),
      ].map(({ x, c }, i) => (
        <g key={i}>
          <line x1={x} y1="276" x2={x} y2="284" stroke="#4CAF50" strokeWidth="2"/>
          <circle cx={x}   cy="274" r="5.5" fill={c} opacity="0.92"/>
          <circle cx={x+3} cy="272" r="3.5" fill={c} opacity="0.78"/>
          <circle cx={x-3} cy="272" r="3.5" fill={c} opacity="0.78"/>
          <circle cx={x}   cy="269" r="3.5" fill={c} opacity="0.78"/>
          <circle cx={x}   cy="274" r="2.8" fill="white" opacity="0.82"/>
        </g>
      ))}

      {stage === 1 && <Ball x={86} y={272} bounce={false}/>}
      {stage >= 2 && <><Ball x={86} y={270} bounce={true}/><BookProp x={316} y={268}/></>}
      {stage >= 3 && <><BoneProp x={284} y={272}/><Bush x={56} y={280} r={1}/><Bush x={344} y={280} r={-1}/></>}
      {stage >= 4 && <Doghouse x={322} y={258}/>}
    </>
  );
}

function Ball({ x, y, bounce }) {
  return (
    <motion.g animate={bounce ? { y: [0, -11, 0] } : {}} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}>
      <circle cx={x} cy={y} r="14" fill="#B71C1C" opacity="0.3"/>
      <circle cx={x} cy={y} r="13" fill="url(#ball-rg)"/>
      <path d={`M ${x-9} ${y-7} Q ${x} ${y-15} ${x+9} ${y-7}`} stroke="white" strokeWidth="2" fill="none" opacity="0.55" strokeLinecap="round"/>
      <path d={`M ${x-9} ${y+7} Q ${x} ${y+15} ${x+9} ${y+7}`} stroke="white" strokeWidth="2" fill="none" opacity="0.55" strokeLinecap="round"/>
      <ellipse cx={x-3} cy={y-5} rx="4" ry="2.5" fill="white" opacity="0.28"/>
    </motion.g>
  );
}

function BookProp({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-14" y="-22" width="28" height="22" rx="3" fill="#1A237E"/>
      <rect x="-12" y="-20" width="24" height="18" rx="2" fill="#283593"/>
      <line x1="-1" y1="-20" x2="-1" y2="-2"  stroke="#1A237E" strokeWidth="2.5"/>
      <line x1="-8" y1="-14" x2=" 6" y2="-14" stroke="#C5CAE9" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="-8" y1="-10" x2=" 4" y2="-10" stroke="#C5CAE9" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="-8" y1="-6"  x2=" 5" y2="-6"  stroke="#C5CAE9" strokeWidth="1.3" strokeLinecap="round"/>
    </g>
  );
}

function Bush({ x, y, r }) {
  return (
    <g transform={`translate(${x},${y}) scale(${r},1)`}>
      <ellipse cx="0"   cy="0"  rx="26" ry="18" fill="#2E7D32"/>
      <ellipse cx="-15" cy="4"  rx="18" ry="13" fill="#388E3C"/>
      <ellipse cx=" 15" cy="4"  rx="18" ry="13" fill="#388E3C"/>
      <ellipse cx="0"   cy="-6" rx="22" ry="15" fill="#43A047"/>
      <ellipse cx="-8"  cy="-8" rx="9"  ry="6"  fill="#E8F5E9" opacity="0.10"/>
    </g>
  );
}

function BoneProp({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-15" y="-4" width="30" height="8" rx="4" fill="#FFF9E6"/>
      {[[-17,-6],[-17,6],[17,-6],[17,6]].map(([bx,by],i) => (
        <circle key={i} cx={bx} cy={by} r="5.5" fill="#FFF9E6"/>
      ))}
      <rect x="-13" y="-3" width="26" height="6" rx="3" fill="#EDE0B8"/>
    </g>
  );
}

function Doghouse({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-30" y="-45" width="60" height="45" rx="4" fill="#8D6E63"/>
      <rect x="-28" y="-43" width="56" height="43" rx="3" fill="#A1887F"/>
      <polygon points="-36,-45 36,-45 0,-82" fill="#6D4C41"/>
      <polygon points="-34,-45 34,-45 0,-78" fill="#795548"/>
      <ellipse cx="0" cy="-18" rx="13" ry="16" fill="#4E342E"/>
      <ellipse cx="0" cy="-19" rx="11" ry="14" fill="#3E2723"/>
      <rect x="-16" y="-75" width="32" height="12" rx="3" fill="#FFEE88"/>
      <line x1="-6" y1="-63" x2="-6" y2="-45" stroke="#FFEE88" strokeWidth="2"/>
      <line x1=" 6" y1="-63" x2=" 6" y2="-45" stroke="#FFEE88" strokeWidth="2"/>
    </g>
  );
}

// ─── Dog drawing ──────────────────────────────────────────────────────────
function Dog({ stage, anim, hasMentor, hasStudyPlan, lidCls, showTongue, raisedBrows, tailClass, bodyAnim }) {
  return (
    <>
      {/* Tail */}
      <g className={tailClass}>
        <path d="M 4 -38 C 42 -48 72 -80 64 -118 C 56 -150 30 -156 20 -138"
          stroke="#3D1F00" strokeWidth="30" fill="none" strokeLinecap="round"/>
        <path d="M 4 -38 C 42 -48 72 -80 64 -118 C 56 -150 30 -156 20 -138"
          stroke="#C47818" strokeWidth="20" fill="none" strokeLinecap="round"/>
        <path d="M 4 -38 C 42 -48 72 -80 64 -118 C 56 -150 30 -156 20 -138"
          stroke="#E8A022" strokeWidth="11" fill="none" strokeLinecap="round"/>
        <path d="M 5 -39 C 42 -48 71 -79 63 -116 C 55 -147 31 -153 21 -136"
          stroke="#FDE075" strokeWidth="4"  fill="none" strokeLinecap="round" opacity="0.55"/>
        <ellipse cx="20" cy="-140" rx="16" ry="12" fill="#E8A022" transform="rotate(-28 20 -140)"/>
        <ellipse cx="20" cy="-140" rx="11" ry="8"  fill="#FDE075" transform="rotate(-28 20 -140)"/>
      </g>

      {/* Haunches */}
      <ellipse cx="-68" cy="-34" rx="46" ry="36" fill="#3D1F00" transform="rotate(14 -68 -34)"/>
      <ellipse cx="-68" cy="-34" rx="42" ry="32" fill="url(#rg-haunch)" transform="rotate(14 -68 -34)"/>
      <ellipse cx="-56" cy="-56" rx="14" ry="9"  fill="#FDE075" opacity="0.16" transform="rotate(14 -56 -56)"/>
      <ellipse cx=" 68" cy="-34" rx="46" ry="36" fill="#3D1F00" transform="rotate(-14 68 -34)"/>
      <ellipse cx=" 68" cy="-34" rx="42" ry="32" fill="url(#rg-haunch)" transform="rotate(-14 68 -34)"/>
      <ellipse cx=" 56" cy="-56" rx="14" ry="9"  fill="#FDE075" opacity="0.16" transform="rotate(-14 56 -56)"/>

      {/* Body */}
      <g style={{ animation: bodyAnim, transformBox:'fill-box', transformOrigin:'50% 50%' }}>
        <ellipse cx="0" cy="-98" rx="60" ry="76" fill="#3D1F00"/>
        <ellipse cx="0" cy="-97" rx="57" ry="73" fill="url(#rg-body)"/>
        <ellipse cx="0" cy="-80" rx="32" ry="44" fill="#FDF4DC" opacity="0.52"/>
        <ellipse cx="0" cy="-72" rx="20" ry="28" fill="#FDF4DC" opacity="0.36"/>
        <ellipse cx="-18" cy="-138" rx="18" ry="12" fill="#FDE075" opacity="0.16" transform="rotate(-10 -18 -138)"/>
      </g>

      {/* Front legs */}
      {[[-38], [16]].map(([lx], li) => (
        <g key={li}>
          <rect x={lx}   y="-60" width="24" height="62" rx="12" fill="#3D1F00"/>
          <rect x={lx+1} y="-59" width="21" height="60" rx="11" fill="url(#rg-leg)"/>
        </g>
      ))}

      {/* Paws */}
      {[[-26], [26]].map(([px], pi) => (
        <g key={pi}>
          <ellipse cx={px} cy="-2" rx="18" ry="13" fill="#3D1F00"/>
          <ellipse cx={px} cy="-2" rx="15" ry="11" fill="url(#rg-paw)"/>
          <ellipse cx={px} cy="-8" rx="8"  ry="4"  fill="#FDE075" opacity="0.22"/>
          <line x1={px-9} y1="-10" x2={px-9} y2="0"  stroke="#3D1F00" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
          <line x1={px}   y1="-10" x2={px}   y2="1"  stroke="#3D1F00" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
          <line x1={px+9} y1="-10" x2={px+9} y2="0"  stroke="#3D1F00" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
        </g>
      ))}

      {/* Neck */}
      <ellipse cx="0" cy="-168" rx="38" ry="28" fill="#3D1F00"/>
      <ellipse cx="0" cy="-167" rx="34" ry="25" fill="url(#rg-body)"/>

      {/* Left ear */}
      <path d="M -52 -272 C -94 -290 -118 -220 -104 -164 C -92 -118 -62 -128 -56 -172 C -50 -210 -48 -252 -52 -272 Z" fill="#3D1F00"/>
      <path d="M -55 -266 C -94 -282 -114 -216 -101 -164 C -89 -122 -64 -130 -58 -170 C -53 -206 -51 -246 -55 -266 Z" fill="url(#rg-ear-out)"/>
      <path d="M -60 -254 C -90 -264 -106 -208  -94 -164 C -83 -126 -68 -132  -62 -168 C -57 -196 -57 -238  -60 -254 Z" fill="url(#rg-ear-in)" opacity="0.60"/>
      <path d="M -68 -230 C -88 -214 -92 -172 -82 -146" stroke="#FDE075" strokeWidth="3.5" fill="none" opacity="0.18" strokeLinecap="round"/>

      {/* Right ear */}
      <path d="M  52 -272 C  94 -290  118 -220  104 -164 C  92 -118  62 -128  56 -172 C  50 -210  48 -252  52 -272 Z" fill="#3D1F00"/>
      <path d="M  55 -266 C  94 -282  114 -216  101 -164 C  89 -122  64 -130  58 -170 C  53 -206  51 -246  55 -266 Z" fill="url(#rg-ear-out)"/>
      <path d="M  60 -254 C  90 -264  106 -208   94 -164 C  83 -126  68 -132   62 -168 C  57 -196  57 -238   60 -254 Z" fill="url(#rg-ear-in)" opacity="0.60"/>
      <path d="M  68 -230 C  88 -214  92 -172  82 -146" stroke="#FDE075" strokeWidth="3.5" fill="none" opacity="0.18" strokeLinecap="round"/>

      {/* Head */}
      <circle cx="0" cy="-258" r="78" fill="#3D1F00"/>
      <circle cx="0" cy="-258" r="74" fill="url(#rg-head)"/>
      <ellipse cx="-22" cy="-302" rx="28" ry="18" fill="#FDE075" opacity="0.18" transform="rotate(-12 -22 -302)"/>

      {/* Blush */}
      <ellipse cx="-56" cy="-234" rx="20" ry="13" fill="#F4846A" opacity="0.13"/>
      <ellipse cx=" 56" cy="-234" rx="20" ry="13" fill="#F4846A" opacity="0.13"/>

      {/* Muzzle */}
      <ellipse cx="0" cy="-222" rx="42" ry="34" fill="#3D1F00"/>
      <ellipse cx="0" cy="-221" rx="38" ry="31" fill="url(#rg-muzz)"/>
      <ellipse cx="-10" cy="-238" rx="14" ry="9" fill="#FDF4DC" opacity="0.38"/>
      {[[-18,-214],[-8,-212],[4,-214],[-22,-220],[8,-220]].map(([wx,wy],i) => (
        <circle key={i} cx={wx} cy={wy} r="1.6" fill="#B8902A" opacity="0.32"/>
      ))}

      {/* Left eye */}
      <circle cx="-32" cy="-272" r="27" fill="#3D1F00"/>
      <circle cx="-32" cy="-272" r="24" fill="#FFFFF8" opacity="0.96"/>
      <circle cx="-32" cy="-272" r="19" fill="url(#rg-eye)"/>
      <circle cx="-32" cy="-272" r="13" fill="#0A0400"/>
      <ellipse cx="-22" cy="-284" rx="9" ry="8" fill="url(#rg-eye-gloss)"/>
      <circle  cx="-42" cy="-264" r="4"          fill="white" opacity="0.52"/>
      <circle  cx="-22" cy="-289" r="2.2"        fill="white" opacity="0.38"/>

      {/* Right eye */}
      <circle cx=" 32" cy="-272" r="27" fill="#3D1F00"/>
      <circle cx=" 32" cy="-272" r="24" fill="#FFFFF8" opacity="0.96"/>
      <circle cx=" 32" cy="-272" r="19" fill="url(#rg-eye)"/>
      <circle cx=" 32" cy="-272" r="13" fill="#0A0400"/>
      <ellipse cx=" 42" cy="-284" rx="9" ry="8" fill="url(#rg-eye-gloss)"/>
      <circle  cx=" 22" cy="-264" r="4"          fill="white" opacity="0.52"/>
      <circle  cx=" 42" cy="-289" r="2.2"        fill="white" opacity="0.38"/>

      {/* Eyelids */}
      <ellipse cx="-32" cy="-272" rx="27" ry="27" fill="#E8A022" className={lidCls}/>
      <ellipse cx=" 32" cy="-272" rx="27" ry="27" fill="#E8A022" className={lidCls}/>

      {/* Eyebrows */}
      <path
        d={raisedBrows ? "M -54 -308 Q -32 -322 -10 -308" : "M -54 -302 Q -32 -314 -10 -302"}
        stroke="#7A3E0A" strokeWidth="5" fill="none" strokeLinecap="round"
        style={{ transition: 'all 0.35s ease' }}
      />
      <path
        d={raisedBrows ? "M  10 -308 Q  32 -322  54 -308" : "M  10 -302 Q  32 -314  54 -302"}
        stroke="#7A3E0A" strokeWidth="5" fill="none" strokeLinecap="round"
        style={{ transition: 'all 0.35s ease' }}
      />

      {/* Nose */}
      <ellipse cx="0" cy="-208" rx="18" ry="14" fill="#3D1F00"/>
      <ellipse cx="0" cy="-207" rx="15" ry="12" fill="url(#rg-nose)"/>
      <ellipse cx="-5" cy="-202" rx="5" ry="3.5" fill="#3D1F00"/>
      <ellipse cx=" 5" cy="-202" rx="5" ry="3.5" fill="#3D1F00"/>
      <ellipse cx="-4" cy="-214" rx="5" ry="3"   fill="white" opacity="0.28"/>
      <ellipse cx="-3" cy="-217" rx="3" ry="2"   fill="white" opacity="0.44"/>
      <line x1="0" y1="-195" x2="0" y2="-188" stroke="#7A3E0A" strokeWidth="2.2" strokeLinecap="round" opacity="0.35"/>

      {/* Mouth */}
      <path d="M -20 -188 Q 0 -176 20 -188" stroke="#7A3E0A" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Tongue */}
      {showTongue && (
        <g>
          <ellipse cx="0" cy="-172" rx="16" ry="20" fill="url(#rg-tongue)"/>
          <line x1="0" y1="-192" x2="0" y2="-152" stroke="#C03050" strokeWidth="2.2"/>
          <ellipse cx="-5" cy="-180" rx="6" ry="8" fill="#FFB8C8" opacity="0.38"/>
        </g>
      )}
      {!showTongue && (
        <path d="M -12 -184 Q 0 -176 12 -184" stroke="#F06080" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"/>
      )}

      {/* Crown (stage 4) */}
      {stage === 4 && (
        <g>
          <rect x="-36" y="-356" width="72" height="20" rx="8" fill="#C8960A"/>
          <rect x="-35" y="-355" width="70" height="18" rx="7" fill="#FFD700"/>
          <polygon points="0,-390 -18,-354 18,-354"    fill="#FFD700"/>
          <polygon points="-28,-384 -36,-354 -12,-354" fill="#FFE030"/>
          <polygon points=" 28,-384  36,-354  12,-354" fill="#FFE030"/>
          <circle cx="0"   cy="-386" r="8"  fill="#EF5350"/>
          <circle cx="-30" cy="-372" r="6"  fill="#1565C0"/>
          <circle cx=" 30" cy="-372" r="6"  fill="#2E7D32"/>
          <circle cx="-15" cy="-348" r="4.5" fill="#FFF176"/>
          <circle cx=" 15" cy="-348" r="4.5" fill="#FFF176"/>
        </g>
      )}

      {/* Mentor bandana */}
      {hasMentor && (
        <g>
          <ellipse cx="0" cy="-162" rx="36" ry="13" fill="#B71C1C" opacity="0.82"/>
          <ellipse cx="0" cy="-163" rx="33" ry="11" fill="#EF5350"/>
          <polygon points="0,-150 -16,-128 16,-128" fill="#C62828"/>
          <circle cx="-11" cy="-150" r="2.5" fill="white" opacity="0.50"/>
          <circle cx=" 11" cy="-150" r="2.5" fill="white" opacity="0.50"/>
        </g>
      )}

      {/* Study plan grad cap */}
      {hasStudyPlan && (
        <text x="-84" y="-326" fontSize="28" style={{ userSelect:'none' }}>🎓</text>
      )}

      {/* Sleep ZZZ */}
      {anim === 'sleeping' && (
        <>
          <text x="52" y="-250" fontSize="20" fill="#9C88FF" fontWeight="bold"
            style={{ animation:'floatZ 1.9s ease-in-out infinite', userSelect:'none' }}>z</text>
          <text x="72" y="-276" fontSize="15" fill="#9C88FF"
            style={{ animation:'floatZ 1.9s ease-in-out 0.65s infinite', userSelect:'none' }}>z</text>
          <text x="88" y="-296" fontSize="11" fill="#9C88FF"
            style={{ animation:'floatZ 1.9s ease-in-out 1.3s infinite', userSelect:'none' }}>z</text>
        </>
      )}

      {/* Sparkles */}
      {anim === 'excited' && (
        [[-84,-90],[88,-78],[-78,20],[88,16],[0,-110],[-48,-62],[48,-60]].map(([x,y],i) => (
          <text key={i} x={x} y={y} fontSize="15" textAnchor="middle"
            style={{ userSelect:'none', animation:`spPop 0.65s ease-in-out ${i*0.1}s infinite` }}>
            ✨
          </text>
        ))
      )}
    </>
  );
}

// ─── CSS keyframes ─────────────────────────────────────────────────────────
const CSS = `
  @keyframes wagFast   { 0%{transform:rotate(-22deg)} 100%{transform:rotate(22deg)} }
  @keyframes wagMid    { 0%{transform:rotate(-16deg)} 100%{transform:rotate(16deg)} }
  @keyframes wagSlow   { 0%{transform:rotate(-8deg)}  100%{transform:rotate(8deg)}  }
  @keyframes breathe   { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.042)} }
  @keyframes sleepBrth { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.072)} }
  @keyframes blink     { 0%,86%,100%{transform:scaleY(0)} 90%{transform:scaleY(1)} }
  @keyframes floatZ    { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-44px) scale(1.7)} }
  @keyframes spPop     { 0%,100%{opacity:0;transform:scale(0.25)} 50%{opacity:1;transform:scale(1.15)} }

  .tail-fast { transform-box:fill-box; transform-origin:4px -38px; animation:wagFast 0.20s ease-in-out infinite alternate; }
  .tail-mid  { transform-box:fill-box; transform-origin:4px -38px; animation:wagMid  0.52s ease-in-out infinite alternate; }
  .tail-slow { transform-box:fill-box; transform-origin:4px -38px; animation:wagSlow 1.3s  ease-in-out infinite alternate; }
  .tail-off  { transform-box:fill-box; transform-origin:4px -38px; }

  .lid        { transform-box:fill-box; transform-origin:50% 0%; transform:scaleY(0); }
  .lid-blink  { animation: blink 5.2s ease-in-out 2s infinite; }
  .lid-closed { transform:scaleY(1) !important; animation:none !important; }
`;

// ─── Main component ────────────────────────────────────────────────────────
export default function LearningBuddy({
  lessonsCompleted = 0,
  quizScore        = 0,
  studyStreak      = 0,
  hasMentor        = false,
  hasStudyPlan     = false,
  onPet,
}) {
  const stage = getStage(studyStreak, lessonsCompleted, quizScore);
  const SCALE = { 1: 0.28, 2: 0.40, 3: 0.54, 4: 0.68 };
  const sc = SCALE[stage];

  const [anim,        setAnim]        = useState('idle');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [statusMsg,   setStatusMsg]   = useState('');

  const timerRef    = useRef(null);
  const msgRef      = useRef(null);
  const prevLessons = useRef(lessonsCompleted);
  const prevQuiz    = useRef(quizScore);
  const prevStreak  = useRef(studyStreak);
  const prevStage   = useRef(stage);

  const trigger = (state, dur = 3000) => {
    setAnim(state);
    setStatusMsg(STATUS_MSG[state] || '');
    clearTimeout(timerRef.current);
    clearTimeout(msgRef.current);
    timerRef.current = setTimeout(() => setAnim('idle'), dur);
    msgRef.current   = setTimeout(() => setStatusMsg(''), Math.min(dur, 2800));
  };

  useEffect(() => {
    if (lessonsCompleted > prevLessons.current) trigger('excited', 3500);
    prevLessons.current = lessonsCompleted;
  }, [lessonsCompleted]);

  useEffect(() => {
    if (quizScore > prevQuiz.current) trigger('excited', 3500);
    prevQuiz.current = quizScore;
  }, [quizScore]);

  useEffect(() => {
    if (studyStreak > prevStreak.current && studyStreak > 0) trigger('happy', 2800);
    if (studyStreak === 0) { setAnim('sleeping'); setStatusMsg(STATUS_MSG.sleeping); }
    prevStreak.current = studyStreak;
  }, [studyStreak]);

  useEffect(() => {
    if (stage > prevStage.current) {
      setShowLevelUp(true);
      trigger('excited', 4500);
      prevStage.current = stage;
      setTimeout(() => setShowLevelUp(false), 3200);
    }
  }, [stage]);

  useEffect(() => () => { clearTimeout(timerRef.current); clearTimeout(msgRef.current); }, []);

  const tailClass =
    anim === 'excited' || anim === 'happy' ? 'tail-fast' :
    anim === 'playing'                     ? 'tail-mid'  :
    anim === 'sleeping'                    ? 'tail-off'  : 'tail-slow';

  const yVariants = {
    idle:     { y: 0 },
    happy:    { y: [0, -10, 0], transition: { duration: 0.78, repeat: Infinity, ease: 'easeInOut' } },
    playing:  { y: [0, -32, -18, 0], transition: { duration: 0.62, repeat: 4, ease: [0.22,1,0.36,1] } },
    excited:  { y: [0, -52, -34, 0], transition: { duration: 0.46, repeat: 5, ease: [0.22,1,0.36,1] } },
    sleeping: { y: 0 },
  };

  const bodyAnim =
    anim === 'sleeping' ? 'sleepBrth 5s ease-in-out infinite' :
    anim === 'idle'     ? 'breathe   3.4s ease-in-out infinite' :
    anim === 'happy'    ? 'breathe   1.6s ease-in-out infinite' : 'none';

  const lidCls =
    anim === 'sleeping' ? 'lid lid-closed' :
    anim === 'idle'     ? 'lid lid-blink'  : 'lid';

  const showTongue  = anim === 'happy' || anim === 'excited' || anim === 'playing' || stage >= 3;
  const raisedBrows = anim === 'excited' || anim === 'happy';

  const maxVal  = NEXT[stage] ?? 60;
  const curVal  = Math.min(studyStreak, maxVal);
  const progPct = stage === 4 ? 100 : (curVal / maxVal) * 100;

  return (
    <div style={{ position:'relative', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', padding:'6px 0 14px' }}>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity:0, y:-28, scale:0.65 }}
            animate={{ opacity:1, y:0,   scale:1    }}
            exit={{    opacity:0, y:-28, scale:0.65 }}
            style={{
              position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
              background:'linear-gradient(135deg,#FFD700,#FF8C00)',
              color:'#fff', fontWeight:800, fontSize:13,
              padding:'7px 20px', borderRadius:50,
              boxShadow:'0 4px 22px rgba(255,165,0,0.55)',
              zIndex:20, whiteSpace:'nowrap', pointerEvents:'none',
            }}
          >
            🎉 Level Up! {LABELS[stage]}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ fontWeight:700, fontSize:14, color:'#1a1a2e', marginBottom:2, zIndex:1 }}>
        🐶 My Learning Buddy
      </div>
      <div style={{ fontSize:11, color:'#666', marginBottom:4, zIndex:1 }}>
        {studyStreak} day streak — {LABELS[stage]}
      </div>

      <div
        onClick={() => { trigger('playing', 2200); onPet?.(); }}
        style={{ cursor:'pointer', width:'100%', maxWidth:400, zIndex:1 }}
        title="Click to play!"
      >
        <svg width="100%" viewBox="0 0 400 310" style={{ display:'block', overflow:'visible' }}>
          <style>{CSS}</style>
          <Defs/>
          <Environment stage={stage}/>
          <ellipse cx="200" cy="291" rx="70" ry="9" fill="#1A5C1A" opacity="0.22"/>
          <motion.g variants={yVariants} animate={anim} initial="idle">
            <g transform={`translate(200,286) scale(${sc})`} filter="url(#shadow-soft)">
              <Dog
                stage={stage}
                anim={anim}
                hasMentor={hasMentor}
                hasStudyPlan={hasStudyPlan}
                lidCls={lidCls}
                showTongue={showTongue}
                raisedBrows={raisedBrows}
                tailClass={tailClass}
                bodyAnim={bodyAnim}
              />
            </g>
          </motion.g>
        </svg>
      </div>

      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ opacity:0, y:6 }}
            animate={{ opacity:1, y:0 }}
            exit={{    opacity:0, y:6 }}
            style={{ fontSize:12, color:'#555', fontStyle:'italic', marginTop:-2, marginBottom:4, zIndex:1 }}
          >
            {statusMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ width:'88%', maxWidth:320, zIndex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#555', marginBottom:5 }}>
          <span style={{ fontWeight:700 }}>{LABELS[stage]}</span>
          {NEXT[stage]
            ? <span>{studyStreak} / {NEXT[stage]} days</span>
            : <span style={{ color:'#F9A825', fontWeight:700 }}>🌟 Max Level!</span>
          }
        </div>
        <div style={{ height:8, background:'#E8EDF2', borderRadius:50, overflow:'hidden' }}>
          <motion.div
            style={{ height:'100%', borderRadius:50, background:'linear-gradient(90deg,#66BB6A,#26A5A5)' }}
            animate={{ width:`${progPct}%` }}
            transition={{ duration:1.1, ease:'easeOut' }}
          />
        </div>
        {stage < 4 && (
          <div style={{ fontSize:10, color:'#888', marginTop:3, textAlign:'center' }}>
            {Math.max(0, (NEXT[stage] ?? 60) - studyStreak)} more days to next stage ✨
          </div>
        )}
      </div>

      <div style={{ display:'flex', gap:8, marginTop:10, zIndex:1 }}>
        {[
          { label:'🎾 Play',  s:'playing', dur:2200 },
          { label:'😊 Happy', s:'happy',   dur:2800 },
          { label:'🎉 Yay!',  s:'excited', dur:3500 },
        ].map(({ label, s, dur }) => (
          <motion.button
            key={s}
            whileHover={{ scale:1.08 }}
            whileTap={{   scale:0.94 }}
            onClick={() => trigger(s, dur)}
            style={{
              background:  anim === s ? '#1D4ED8' : '#EEF2FF',
              color:       anim === s ? '#fff'    : '#1D4ED8',
              border:      '1.5px solid #C7D7F4',
              borderRadius:20, padding:'5px 13px',
              fontSize:11, fontWeight:600, cursor:'pointer',
              transition:'background 0.2s, color 0.2s',
              fontFamily:'inherit',
            }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
