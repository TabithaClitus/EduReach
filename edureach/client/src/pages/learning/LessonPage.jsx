import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Sparkles, BookOpen, Play, HelpCircle, X } from 'lucide-react';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// ─── Section wrapper ────────────────────────────────────────
const Section = ({ children, style, id }) => (
    <motion.section
        id={id}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '36px 32px',
            marginBottom: '28px',
            scrollMarginTop: '100px',
            ...style,
        }}
    >
        {children}
    </motion.section>
);

// ─── Sidebar nav items ──────────────────────────────────────
const sidebarItems = [
    { id: 'lesson-content', label: 'Lesson Content', icon: BookOpen },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
];

const SectionTitle = ({ emoji, children }) => (
    <h2 style={{
        fontSize: '22px',
        fontWeight: 700,
        color: '#0F172A',
        margin: '0 0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
        {emoji && <span style={{ fontSize: '24px' }}>{emoji}</span>}
        {children}
    </h2>
);

// ─── Numbers data ───────────────────────────────────────────
const numbersData = [
    { num: 1, word: 'One', color: '#EF4444' },
    { num: 2, word: 'Two', color: '#F97316' },
    { num: 3, word: 'Three', color: '#EAB308' },
    { num: 4, word: 'Four', color: '#22C55E' },
    { num: 5, word: 'Five', color: '#14B8A6' },
    { num: 6, word: 'Six', color: '#3B82F6' },
    { num: 7, word: 'Seven', color: '#6366F1' },
    { num: 8, word: 'Eight', color: '#A855F7' },
    { num: 9, word: 'Nine', color: '#EC4899' },
    { num: 10, word: 'Ten', color: '#F43F5E' },
];

const appleExamples = [
    { count: 1, text: '1 apple' },
    { count: 2, text: '2 apples' },
    { count: 3, text: '3 apples' },
    { count: 4, text: '4 apples' },
    { count: 5, text: '5 apples' },
];

const alphabetsData = [
    { letter: 'A', word: 'Apple', emoji: '🍎', color: '#EF4444' },
    { letter: 'B', word: 'Ball', emoji: '⚽', color: '#3B82F6' },
    { letter: 'C', word: 'Cat', emoji: '🐱', color: '#F97316' },
    { letter: 'D', word: 'Dog', emoji: '🐶', color: '#EAB308' },
    { letter: 'E', word: 'Elephant', emoji: '🐘', color: '#6366F1' },
    { letter: 'F', word: 'Fish', emoji: '🐟', color: '#14B8A6' },
    { letter: 'G', word: 'Goat', emoji: '🐐', color: '#22C55E' },
    { letter: 'H', word: 'Hat', emoji: '🎩', color: '#8B5CF6' },
    { letter: 'I', word: 'Ice cream', emoji: '🍦', color: '#EC4899' },
    { letter: 'J', word: 'Juice', emoji: '🧃', color: '#F43F5E' },
    { letter: 'K', word: 'Kite', emoji: '🪁', color: '#06B6D4' },
    { letter: 'L', word: 'Lion', emoji: '🦁', color: '#EAB308' },
    { letter: 'M', word: 'Monkey', emoji: '🐒', color: '#8B5CF6' },
    { letter: 'N', word: 'Nest', emoji: '🪹', color: '#10B981' },
    { letter: 'O', word: 'Orange', emoji: '🍊', color: '#F97316' },
    { letter: 'P', word: 'Parrot', emoji: '🦜', color: '#14B8A6' },
    { letter: 'Q', word: 'Queen', emoji: '👑', color: '#D946EF' },
    { letter: 'R', word: 'Rabbit', emoji: '🐇', color: '#EF4444' },
    { letter: 'S', word: 'Sun', emoji: '☀️', color: '#EAB308' },
    { letter: 'T', word: 'Tiger', emoji: '🐅', color: '#F59E0B' },
    { letter: 'U', word: 'Umbrella', emoji: '☔', color: '#6366F1' },
    { letter: 'V', word: 'Van', emoji: '🚐', color: '#3B82F6' },
    { letter: 'W', word: 'Watch', emoji: '⌚', color: '#64748B' },
    { letter: 'X', word: 'Xylophone', emoji: '🎹', color: '#8B5CF6' },
    { letter: 'Y', word: 'Yak', emoji: '🐂', color: '#78350F' },
    { letter: 'Z', word: 'Zebra', emoji: '🦓', color: '#14B8A6' }
];

const alphabetExamples = [
    { letter: 'A', word: 'Apple', emoji: '🍎' },
    { letter: 'B', word: 'Ball', emoji: '⚽' },
    { letter: 'C', word: 'Cat', emoji: '🐱' }
];

const phonicsExamples = [
    { letter: 'A', word: 'Apple', emoji: '🍎' },
    { letter: 'B', word: 'Ball', emoji: '⚽' },
    { letter: 'C', word: 'Cat', emoji: '🐱' },
    { letter: 'D', word: 'Dog', emoji: '🐶' },
    { letter: 'S', word: 'Sun', emoji: '☀️' }
];

const simpleWordsExamples = [
    { word: 'Cat', emoji: '🐱' },
    { word: 'Dog', emoji: '🐶' },
    { word: 'Sun', emoji: '☀️' },
    { word: 'Hat', emoji: '🎩' },
    { word: 'Cup', emoji: '☕' },
];

// ─── Lesson Data ──────────────────────────────────────────────
const lessonData = {
    'counting-numbers': {
        title: 'Counting Numbers (1–10)',
        subtitle: 'Learn how to count numbers from 1 to 10 using simple examples and fun activities.',
        videoSubtitle: 'Watch these fun videos to learn more about counting numbers from 1 to 10! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/Yt8GFgxlITs?si=7DaSC5QLcjIiR9h9', title: 'Counting Numbers Video 1', thumb: 'https://img.youtube.com/vi/Yt8GFgxlITs/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/9SmaA6ErWKE?si=VshrN0piMBlOCz-X', title: 'Counting Numbers Video 2', thumb: 'https://img.youtube.com/vi/9SmaA6ErWKE/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/6g_fjnW77Fs?si=s27mYRMPJaZKFz8l', title: 'Counting Numbers Video 3', thumb: 'https://img.youtube.com/vi/6g_fjnW77Fs/hqdefault.jpg' },
        ],
        quiz: [
            { question: 'How many apples are there?', visual: '🍎 🍎 🍎', options: ['2', '3', '4'], correct: 1 },
            { question: 'How many stars are there?', visual: '⭐ ⭐ ⭐ ⭐ ⭐', options: ['4', '5', '6'], correct: 1 },
            { question: 'Which number comes after 3?', visual: '1, 2, 3, ?', options: ['4', '5', '2'], correct: 0 },
            { question: 'How many bananas are there?', visual: '🍌 🍌 🍌 🍌 🍌 🍌', options: ['5', '6', '7'], correct: 1 },
            { question: 'Which number comes before 5?', visual: '?, 5', options: ['3', '4', '6'], correct: 1 },
            { question: 'How many hearts are there?', visual: '❤️ ❤️', options: ['1', '2', '3'], correct: 1 },
            { question: 'Count the flowers!', visual: '🌸 🌸 🌸 🌸 🌸 🌸 🌸', options: ['6', '7', '8'], correct: 1 },
            { question: 'What number is between 7 and 9?', visual: '7, ?, 9', options: ['6', '8', '10'], correct: 1 },
            { question: 'How many fish are there?', visual: '🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟', options: ['8', '9', '10'], correct: 1 },
            { question: 'Which is the biggest number?', visual: '3, 7, 10', options: ['3', '7', '10'], correct: 2 },
        ],
        summary: [
            'Numbers help us count objects.',
            'We use numbers from 1 to 10 to count small quantities.',
            'Counting helps us know the exact amount.'
        ],
        summaryEnd: 'Great job! You are learning how to count numbers from 1 to 10!',
        nextLesson: { id: 'counting-objects', title: 'Counting Objects' }
    },
    'counting-objects': {
        title: 'Counting Objects',
        subtitle: 'Learn how to count different objects around you.',
        videoSubtitle: 'Watch these fun videos to learn how to count objects! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/MBPhqzWw0xY?si=CBgAx8He_Pfkl8xA', title: 'Counting Objects Video 1', thumb: 'https://img.youtube.com/vi/MBPhqzWw0xY/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/n8HaVIegUpc?si=HLkU2b2DumJkyvBK', title: 'Counting Objects Video 2', thumb: 'https://img.youtube.com/vi/n8HaVIegUpc/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/mKSNQuQrsm0?si=HhH4x-F_eJaO7mxC', title: 'Counting Objects Video 3', thumb: 'https://img.youtube.com/vi/mKSNQuQrsm0/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'How many apples are there?', visual: '🍎 🍎 🍎 🍎', options: ['3', '4', '5'], correct: 1 },
            { question: 'How many stars are there?', visual: '⭐ ⭐ ⭐', options: ['2', '3', '4'], correct: 1 },
            { question: 'How many cars are there?', visual: '🚗 🚗 🚗 🚗 🚗', options: ['4', '5', '6'], correct: 1 },
            { question: 'How many balloons are there?', visual: '🎈 🎈 🎈 🎈 🎈 🎈', options: ['5', '6', '7'], correct: 1 },
            { question: 'How many dogs are there?', visual: '🐶 🐶', options: ['1', '2', '3'], correct: 1 },
            { question: 'How many trees are there?', visual: '🌲 🌲 🌲 🌲 🌲 🌲 🌲', options: ['6', '7', '8'], correct: 1 },
            { question: 'How many footballs are there?', visual: '⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽', options: ['8', '9', '10'], correct: 0 },
            { question: 'How many birds are there?', visual: '🐦 🐦 🐦 🐦 🐦 🐦 🐦 🐦 🐦', options: ['8', '9', '10'], correct: 1 },
            { question: 'How many suns are there?', visual: '☀️ ☀️ ☀️ ☀️ ☀️ ☀️ ☀️ ☀️ ☀️ ☀️', options: ['8', '9', '10'], correct: 2 },
            { question: 'How many cats are there?', visual: '🐱', options: ['1', '2', '3'], correct: 0 },
        ],
        summary: [
            'Counting helps us know how many objects there are.',
            'We can count apples, stars, cars, and other objects.',
            'Counting objects helps us understand numbers better.'
        ],
        summaryEnd: 'Great job! You are learning how to count objects!',
        nextLesson: { id: 'addition', title: 'Addition' }
    },
    'addition': {
        title: 'Addition',
        subtitle: 'Learn how to add numbers using simple examples and objects.',
        videoSubtitle: 'Watch these fun videos to learn basic addition for kids! Click to watch them in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/VScM8Z8Jls0?si=uz01rjWubMWyj9Lg', title: 'Addition Video 1', thumb: 'https://img.youtube.com/vi/VScM8Z8Jls0/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/G0Di8DP9f8w?si=PBxiuEt0rnU8JTh7', title: 'Addition Video 2', thumb: 'https://img.youtube.com/vi/G0Di8DP9f8w/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/mjlsSYLLOSE?si=WGyY0S0EamWxueUM', title: 'Addition Video 3', thumb: 'https://img.youtube.com/vi/mjlsSYLLOSE/hqdefault.jpg' }
        ],
        quiz: [
            { question: '2 + 1 = ?', visual: '2 + 1', options: ['2', '3', '4'], correct: 1 },
            { question: '🍎 🍎 + 🍎 = ?', visual: '🍎 🍎 + 🍎', options: ['2', '3', '4'], correct: 1 },
            { question: '⭐ ⭐ + ⭐ ⭐ = ?', visual: '⭐ ⭐ + ⭐ ⭐', options: ['3', '4', '5'], correct: 1 },
            { question: '3 + 2 = ?', visual: '3 + 2', options: ['4', '5', '6'], correct: 1 },
            { question: '🚗 + 🚗 🚗 = ?', visual: '🚗 + 🚗 🚗', options: ['2', '3', '4'], correct: 1 },
            { question: '4 + 0 = ?', visual: '4 + 0', options: ['3', '4', '5'], correct: 1 },
            { question: '🎈 🎈 + 🎈 🎈 = ?', visual: '🎈 🎈 + 🎈 🎈', options: ['3', '4', '5'], correct: 1 },
            { question: '1 + 4 = ?', visual: '1 + 4', options: ['4', '5', '6'], correct: 1 },
            { question: '🐶 🐶 🐶 + 🐶 = ?', visual: '🐶 🐶 🐶 + 🐶', options: ['3', '4', '5'], correct: 1 },
            { question: '5 + 5 = ?', visual: '5 + 5', options: ['8', '9', '10'], correct: 2 }
        ],
        summary: [
            'Addition means putting numbers together',
            'We can add objects like apples and stars',
            'Adding numbers helps us find the total'
        ],
        summaryEnd: 'Great job! You are learning addition!',
        nextLesson: { id: 'subtraction', title: 'Subtraction' }
    },
    'subtraction': {
        title: 'Subtraction',
        subtitle: 'Learn how to subtract numbers using simple examples and objects.',
        videoSubtitle: 'Watch these fun videos to learn basic subtraction for kids! Click to watch them in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/ZygCUtAUWJA?si=N5iRTSTNljzI-7Va', title: 'Subtraction Video 1', thumb: 'https://img.youtube.com/vi/ZygCUtAUWJA/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/YLPbduEc4sA?si=5oaig4nOGKGhu7yJ', title: 'Subtraction Video 2', thumb: 'https://img.youtube.com/vi/YLPbduEc4sA/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/lBfj-pm5kqc?si=IeoWjc99-DLWxNB1', title: 'Subtraction Video 3', thumb: 'https://img.youtube.com/vi/lBfj-pm5kqc/hqdefault.jpg' }
        ],
        quiz: [
            { question: '5 − 2 = ?', visual: '5 − 2', options: ['2', '3', '4'], correct: 1 },
            { question: '🍎 🍎 🍎 🍎 − 🍎 = ?', visual: '🍎 🍎 🍎 🍎 − 🍎', options: ['2', '3', '4'], correct: 1 },
            { question: '⭐ ⭐ ⭐ − ⭐ = ?', visual: '⭐ ⭐ ⭐ − ⭐', options: ['1', '2', '3'], correct: 1 },
            { question: '4 − 2 = ?', visual: '4 − 2', options: ['1', '2', '3'], correct: 1 },
            { question: '🚗 🚗 🚗 🚗 🚗 − 🚗 🚗 = ?', visual: '🚗 🚗 🚗 🚗 🚗 − 🚗 🚗', options: ['2', '3', '4'], correct: 1 },
            { question: '3 − 0 = ?', visual: '3 − 0', options: ['2', '3', '4'], correct: 1 },
            { question: '🎈 🎈 🎈 − 🎈 🎈 = ?', visual: '🎈 🎈 🎈 − 🎈 🎈', options: ['1', '2', '3'], correct: 0 },
            { question: '6 − 3 = ?', visual: '6 − 3', options: ['2', '3', '4'], correct: 1 },
            { question: '🐶 🐶 🐶 🐶 − 🐶 🐶 🐶 = ?', visual: '🐶 🐶 🐶 🐶 − 🐶 🐶 🐶', options: ['1', '2', '3'], correct: 0 },
            { question: '10 − 5 = ?', visual: '10 − 5', options: ['4', '5', '6'], correct: 1 }
        ],
        summary: [
            'Subtraction means taking away objects',
            'Subtracting numbers makes the total smaller',
            'We can subtract apples, stars, and other objects'
        ],
        summaryEnd: 'Great job! You are learning subtraction!',
        nextLesson: { id: 'shapes', title: 'Shapes' }
    },
    'shapes': {
        title: 'Shapes',
        subtitle: 'Learn about basic shapes like circle, square, triangle, and rectangle.',
        videoSubtitle: 'Watch these fun videos to learn about shapes for kids! Click to watch them in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/jlzX8jt0Now?si=H0iR9g89LVLGJ0v0', title: 'Shapes Video 1', thumb: 'https://img.youtube.com/vi/jlzX8jt0Now/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/o-6OKWU99Co?si=MG42fKzc7hypVNMp', title: 'Shapes Video 2', thumb: 'https://img.youtube.com/vi/o-6OKWU99Co/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/bJzZJi5z-2E?si=mssOcNVTYy2FWvO3', title: 'Shapes Video 3', thumb: 'https://img.youtube.com/vi/bJzZJi5z-2E/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which shape is round?', visual: '🔵', options: ['Circle', 'Square', 'Triangle'], correct: 0 },
            { question: 'Which shape has three sides?', visual: '🔺', options: ['Triangle', 'Circle', 'Rectangle'], correct: 0 },
            { question: 'Which shape looks like a book or TV?', visual: '📱', options: ['Rectangle', 'Circle', 'Square'], correct: 0 },
            { question: 'What shape is a pizza slice?', visual: '🍕', options: ['Square', 'Triangle', 'Circle'], correct: 1 },
            { question: 'What shape has four equal sides?', visual: '🟥', options: ['Rectangle', 'Triangle', 'Square'], correct: 2 },
            { question: 'Which shape is like a wheel?', visual: '🛞', options: ['Circle', 'Square', 'Triangle'], correct: 0 },
            { question: 'What shape is a window usually?', visual: '🪟', options: ['Circle', 'Square', 'Triangle'], correct: 1 },
            { question: 'What shape is a door?', visual: '🚪', options: ['Rectangle', 'Circle', 'Triangle'], correct: 0 },
            { question: 'Which shape has NO straight sides?', visual: '⭕', options: ['Square', 'Rectangle', 'Circle'], correct: 2 },
            { question: 'What shape is a slice of watermelon?', visual: '🍉', options: ['Circle', 'Rectangle', 'Triangle'], correct: 2 }
        ],
        summary: [
            'What shapes are',
            'Basic shapes like circle, square, triangle, and rectangle',
            'How shapes appear in objects around us'
        ],
        summaryEnd: 'Great job! You are learning shapes!',
        nextLesson: { id: 'maths-practice', title: 'Practice Maths Skills' }
    },
    'alphabets': {
        title: 'Alphabets (A–Z)',
        subtitle: 'Learn to identify and recognize all 26 letters of the English alphabet.',
        videoSubtitle: 'Watch these fun videos to learn about alphabets! Click to watch them in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/p-kAI-qOeJA?si=IhTV5yhCyadOsbmx', title: 'Alphabet Video 1', thumb: 'https://img.youtube.com/vi/p-kAI-qOeJA/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/hq3yfQnllfQ?si=vy57SByKaMEhJLW2', title: 'Alphabet Video 2', thumb: 'https://img.youtube.com/vi/hq3yfQnllfQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/RiYzD1h-YVQ?si=Ib2xq4neLejt4yvv', title: 'Alphabet Video 3', thumb: 'https://img.youtube.com/vi/RiYzD1h-YVQ/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which letter comes after A?', visual: 'A, ?', options: ['B', 'C', 'D'], correct: 0 },
            { question: 'Which letter comes before C?', visual: '?, C', options: ['A', 'B', 'D'], correct: 1 },
            { question: 'Apple starts with which letter?', visual: '🍎', options: ['A', 'B', 'C'], correct: 0 },
            { question: 'Ball starts with which letter?', visual: '⚽', options: ['A', 'B', 'C'], correct: 1 },
            { question: 'Cat starts with which letter?', visual: '🐱', options: ['A', 'C', 'D'], correct: 1 },
            { question: 'Dog starts with which letter?', visual: '🐶', options: ['B', 'C', 'D'], correct: 2 },
            { question: 'Which letter comes after E?', visual: 'E, ?', options: ['F', 'G', 'H'], correct: 0 },
            { question: 'Which letter comes before Z?', visual: '?, Z', options: ['X', 'Y', 'W'], correct: 1 },
            { question: 'Sun starts with which letter?', visual: '☀️', options: ['R', 'S', 'T'], correct: 1 },
            { question: 'Fish starts with which letter?', visual: '🐟', options: ['E', 'F', 'G'], correct: 1 }
        ],
        summary: [
            'The English alphabet has 26 letters',
            'Each letter represents different words',
            'Learning alphabets helps us read and write'
        ],
        summaryEnd: 'Great job! You are learning the English alphabet!',
        nextLesson: { id: 'phonics', title: 'Phonics' }
    },
    'phonics': {
        title: 'Phonics',
        subtitle: 'Learn the sounds of letters and how they help us read words.',
        videoSubtitle: 'Watch these fun videos to learn about phonics! Click to watch them in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/tKsIi1MH4lw?si=8KwGl-4iSHX2r01s', title: 'Phonics Video 1', thumb: 'https://img.youtube.com/vi/tKsIi1MH4lw/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/1btvnID6Z_A?si=0EUmvL9Sk1_BXuMz', title: 'Phonics Video 2', thumb: 'https://img.youtube.com/vi/1btvnID6Z_A/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/wSSlwtED2Yg?si=3GSorJl-QeEowrEF', title: 'Phonics Video 3', thumb: 'https://img.youtube.com/vi/wSSlwtED2Yg/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Apple starts with which sound?', visual: '🍎', options: ['A', 'B', 'C'], correct: 0 },
            { question: 'Ball starts with which sound?', visual: '⚽', options: ['B', 'C', 'D'], correct: 0 },
            { question: 'Cat starts with which letter sound?', visual: '🐱', options: ['C', 'D', 'E'], correct: 0 },
            { question: 'Dog starts with which sound?', visual: '🐶', options: ['D', 'B', 'C'], correct: 0 },
            { question: 'Sun starts with which sound?', visual: '☀️', options: ['S', 'T', 'U'], correct: 0 },
            { question: 'Which letter makes the /b/ sound?', visual: '/b/', options: ['A', 'B', 'C'], correct: 1 },
            { question: 'Which letter makes the /k/ sound in "Cat"?', visual: '🐱', options: ['C', 'K', 'Both'], correct: 0 },
            { question: 'Which word starts with A?', visual: 'A', options: ['Apple', 'Ball', 'Cat'], correct: 0 },
            { question: 'Which word starts with B?', visual: 'B', options: ['Ball', 'Dog', 'Sun'], correct: 0 },
            { question: 'Which word starts with S?', visual: 'S', options: ['Sun', 'Apple', 'Cat'], correct: 0 }
        ],
        summary: [
            'Phonics helps us understand letter sounds',
            'Letters make sounds that form words',
            'We practiced sounds like A, B, C, D, and S'
        ],
        summaryEnd: 'Great job! You are learning phonics!',
        nextLesson: { id: 'simple-words', title: 'Simple Words' }
    },
    'simple-words': {
        title: 'Simple Words',
        subtitle: 'Learn to read and recognize simple three-letter and four-letter words.',
        videoSubtitle: 'Watch these fun videos to learn about simple words! Click to watch them in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/QahSR-a6raQ?si=49i5GIpjkfW7_LkK', title: 'Simple Words Video 1', thumb: 'https://img.youtube.com/vi/QahSR-a6raQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/by1QAoRcc-U?si=HlTySVVEefJQFM92', title: 'Simple Words Video 2', thumb: 'https://img.youtube.com/vi/by1QAoRcc-U/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/krpkQhdkyKw?si=szUVR4aXipdQydrn', title: 'Simple Words Video 3', thumb: 'https://img.youtube.com/vi/krpkQhdkyKw/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which word matches this animal? 🐱', visual: '🐱', options: ['Cat', 'Dog', 'Sun'], correct: 0 },
            { question: 'Which word matches this animal? 🐶', visual: '🐶', options: ['Cat', 'Dog', 'Bat'], correct: 1 },
            { question: 'Which word names something in the sky?', visual: '☀️', options: ['Sun', 'Hat', 'Cup'], correct: 0 },
            { question: 'Which word names something we wear on our head?', visual: '🎩', options: ['Hat', 'Car', 'Pen'], correct: 0 },
            { question: 'Which word names something we drink from?', visual: '☕', options: ['Cup', 'Bat', 'Dog'], correct: 0 },
            { question: 'Which word names something used for writing?', visual: '🖊️', options: ['Pen', 'Sun', 'Cat'], correct: 0 },
            { question: 'Which word names a flying animal?', visual: '🦇', options: ['Bat', 'Dog', 'Cup'], correct: 0 },
            { question: 'Which word names a vehicle?', visual: '🚗', options: ['Car', 'Cat', 'Hat'], correct: 0 },
            { question: 'Which word is a three-letter animal name?', visual: '🐱', options: ['Cat', 'Car', 'Cup'], correct: 0 },
            { question: 'Which word describes something bright in the sky?', visual: '☀️', options: ['Sun', 'Pen', 'Bat'], correct: 0 }
        ],
        summary: [
            'Simple words are short and easy to read',
            'Many words describe animals and objects around us',
            'Learning simple words helps us read better'
        ],
        summaryEnd: 'Great job! You are learning new English words!',
        nextLesson: { id: 'rhymes', title: 'Rhymes & Stories' }
    },
    'rhymes': {
        title: 'Rhymes & Stories',
        subtitle: 'Enjoy fun rhymes and short stories while learning new words.',
        videoSubtitle: 'Watch these fun rhyme videos to learn and sing along! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/hcOdWqzo_qQ?si=eF7NkVegunz_6rIF', title: 'Rhymes Video 1', thumb: 'https://img.youtube.com/vi/hcOdWqzo_qQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/sSAsJ5pHQ0k?si=khdi9j2WmcmnpqUB', title: 'Rhymes Video 2', thumb: 'https://img.youtube.com/vi/sSAsJ5pHQ0k/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/YoQyyB5xvLk?si=qhhsf9AJQE1oTIel', title: 'Rhymes Video 3', thumb: 'https://img.youtube.com/vi/YoQyyB5xvLk/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What shines in the rhyme "Twinkle Twinkle Little Star"?', visual: '🌟', options: ['Star', 'Sun', 'Moon'], correct: 0 },
            { question: 'What animal appears in the rhyme "Baa Baa Black Sheep"?', visual: '🐑', options: ['Sheep', 'Cat', 'Dog'], correct: 0 },
            { question: 'What did the cat chase in the story?', visual: '🐈', options: ['Butterfly', 'Ball', 'Bird'], correct: 0 },
            { question: 'Where did the cat play?', visual: '🏡', options: ['Garden', 'House', 'School'], correct: 0 },
            { question: 'What did the cat see in the sky?', visual: '☀️', options: ['Sun', 'Ball', 'Tree'], correct: 0 },
            { question: 'Rhymes are usually:', visual: '🎵', options: ['Songs or poems', 'Math problems', 'Stories about numbers'], correct: 0 },
            { question: 'Which animal says "baa"?', visual: '🐑', options: ['Sheep', 'Cat', 'Dog'], correct: 0 },
            { question: 'The butterfly in the story did what?', visual: '🦋', options: ['Flew away', 'Stayed on the tree', 'Slept'], correct: 0 },
            { question: 'What helps children learn new words?', visual: '📚', options: ['Rhymes', 'Numbers', 'Shapes'], correct: 0 },
            { question: 'What makes rhymes easy to remember?', visual: '🎶', options: ['Repeating sounds', 'Long sentences', 'Difficult words'], correct: 0 }
        ],
        summary: [
            'Rhymes are fun songs or poems',
            'Stories help us learn new ideas',
            'Reading and listening improve our English skills'
        ],
        summaryEnd: 'Great job! Keep enjoying rhymes and stories!'
    },
    'my-body': {
        title: 'My Body',
        subtitle: 'Learn about body parts, our five senses, and how to keep our body healthy.',
        videoSubtitle: 'Watch these fun videos to learn about body parts for kids! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/SUt8q0EKbms?si=U11GPncDoqBw6hgD', title: 'Body Parts', thumb: 'https://img.youtube.com/vi/SUt8q0EKbms/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/HCkxhCD0rw0?si=_x5OyNdGkY0PhbrK', title: 'Five Senses', thumb: 'https://img.youtube.com/vi/HCkxhCD0rw0/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/RKCxrbuKNx8?si=j-EeDwhlHhv0ilTl', title: 'Healthy Habits', thumb: 'https://img.youtube.com/vi/RKCxrbuKNx8/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which body part helps us see?', visual: '👀', options: ['Eyes', 'Ears', 'Hands'], correct: 0 },
            { question: 'Which body part helps us hear?', visual: '👂', options: ['Ears', 'Nose', 'Legs'], correct: 0 },
            { question: 'Which body part helps us smell?', visual: '👃', options: ['Nose', 'Eyes', 'Mouth'], correct: 0 },
            { question: 'Which body part helps us taste food?', visual: '👅', options: ['Tongue', 'Hands', 'Ears'], correct: 0 },
            { question: 'Which body part helps us walk?', visual: '🚶', options: ['Legs', 'Eyes', 'Nose'], correct: 0 },
            { question: 'How many senses do we have?', visual: '✋', options: ['Five', 'Three', 'Two'], correct: 0 },
            { question: 'Which sense helps us hear music?', visual: '🎵', options: ['Hearing', 'Touch', 'Taste'], correct: 0 },
            { question: 'What should we do to keep our body clean?', visual: '🛁', options: ['Take a bath', 'Watch TV', 'Sleep all day'], correct: 0 },
            { question: 'What should we do before eating food?', visual: '🧼', options: ['Wash hands', 'Jump', 'Run'], correct: 0 },
            { question: 'Healthy food helps us stay:', visual: '🍎', options: ['Strong and healthy', 'Weak', 'Sleepy'], correct: 0 }
        ],
        summary: [
            'Our body has many parts',
            'Our five senses help us understand the world',
            'Healthy habits keep our body strong'
        ],
        summaryEnd: 'Great job! Take care of your body!',
        nextLesson: { id: 'plants', title: 'Plants Around Us' }
    },
    'plants': {
        title: 'Plants Around Us',
        subtitle: 'Discover different types of plants, their parts, and how they grow.',
        videoSubtitle: 'Watch these engaging videos to learn more about the amazing plants around us! Click a video to watch it full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/FQWkdpmBgIY?si=cHEwj4cHAB_4RfyH', title: 'Plants Video 1', thumb: 'https://img.youtube.com/vi/FQWkdpmBgIY/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/yTzSIXUU_ds?si=6fQ_tvce24dnv3nn', title: 'Plants Video 2', thumb: 'https://img.youtube.com/vi/yTzSIXUU_ds/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/fHuVxzFDAVU?si=Z0zoBD9H5BwpCYeK', title: 'Plants Video 3', thumb: 'https://img.youtube.com/vi/fHuVxzFDAVU/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Plants are:', visual: '🌱', options: ['Living things', 'Machines', 'Toys'], correct: 0 },
            { question: 'Which part holds the plant in the soil?', visual: '🪢', options: ['Roots', 'Leaves', 'Flowers'], correct: 0 },
            { question: 'Which part of the plant is usually green?', visual: '🌿', options: ['Leaves', 'Roots', 'Soil'], correct: 0 },
            { question: 'Plants grow from:', visual: '🥜', options: ['Seeds', 'Rocks', 'Water'], correct: 0 },
            { question: 'Which plant is very big?', visual: '🌳', options: ['Tree', 'Grass', 'Flower'], correct: 0 },
            { question: 'What do plants need to grow?', visual: '💧', options: ['Water', 'Plastic', 'Metal'], correct: 0 },
            { question: 'Which part carries water in the plant?', visual: '🎋', options: ['Stem', 'Flower', 'Leaf'], correct: 0 },
            { question: 'Which plant climbs on support?', visual: '🧗', options: ['Climber', 'Tree', 'Grass'], correct: 0 },
            { question: 'Leaves help plants:', visual: '☀️', options: ['Make food', 'Walk', 'Sleep'], correct: 0 },
            { question: 'Plants give us:', visual: '🌬️', options: ['Oxygen', 'Plastic', 'Glass'], correct: 0 }
        ],
        summary: [
            'Plants are living things',
            'Plants have roots, stems, leaves, and flowers',
            'Plants grow from seeds',
            'Plants need water and sunlight to grow'
        ],
        summaryEnd: 'Great job! Plants are very important for our Earth!',
        nextLesson: { id: 'animals', title: 'Animals' }
    },
    'animals': {
        title: 'Animals',
        subtitle: 'Explore pets, wild animals, and where animals live.',
        videoSubtitle: 'Watch these fun videos to learn about animals for kids! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/xyHagfDgvmw?si=Cuvd9xdd9J1pmi9o', title: 'Pet Animals', thumb: 'https://img.youtube.com/vi/xyHagfDgvmw/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/39G0wYrE2Vc?si=UufzCudyBdyEjhaD', title: 'Wild Animals', thumb: 'https://img.youtube.com/vi/39G0wYrE2Vc/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/lX7Yy5yK42A?si=241JFngI1i6GEWnj', title: 'Animal Homes', thumb: 'https://img.youtube.com/vi/lX7Yy5yK42A/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which animal is a pet?', visual: '🐶', options: ['Dog', 'Lion', 'Tiger'], correct: 0 },
            { question: 'Which animal lives in the forest?', visual: '🦁', options: ['Lion', 'Cat', 'Rabbit'], correct: 0 },
            { question: 'Where does a bird live?', visual: '🐦', options: ['Nest', 'Den', 'House'], correct: 0 },
            { question: 'Which animal gives us milk?', visual: '🐄', options: ['Cow', 'Lion', 'Dog'], correct: 0 },
            { question: 'Which animal is known as the king of the jungle?', visual: '🦁', options: ['Lion', 'Cat', 'Rabbit'], correct: 0 },
            { question: 'Where does a dog live?', visual: '🐕', options: ['Kennel', 'Nest', 'Den'], correct: 0 },
            { question: 'Which animal eats grass?', visual: '🐮', options: ['Cow', 'Tiger', 'Lion'], correct: 0 },
            { question: 'Which animal hops and lives in a burrow?', visual: '🐰', options: ['Rabbit', 'Dog', 'Horse'], correct: 0 },
            { question: 'Which animal lives in water?', visual: '🐟', options: ['Fish', 'Lion', 'Cow'], correct: 0 },
            { question: 'Which animal eats meat?', visual: '🦁', options: ['Lion', 'Cow', 'Rabbit'], correct: 0 }
        ],
        summary: [
            'Animals are living things',
            'There are pets, wild animals, and farm animals',
            'Animals live in different homes',
            'Animals eat different types of food'
        ],
        summaryEnd: 'Great job! Animals are an important part of nature!',
        nextLesson: { id: 'weather', title: 'Weather & Seasons' }
    },
    'weather': {
        title: 'Weather & Seasons',
        subtitle: 'Learn about different types of weather and the seasons of the year.',
        videoSubtitle: 'Watch these fun videos to learn about weather and seasons! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/LBlzDpAixEs?si=Yw_ovIQiBU5zAtOa', title: 'Weather Video 1', thumb: 'https://img.youtube.com/vi/LBlzDpAixEs/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/SxEemURG4Wk?si=7ZRfCkEIgG7IeLrq', title: 'Seasons Video', thumb: 'https://img.youtube.com/vi/SxEemURG4Wk/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/3w9lOwRi_cA?si=9-B_Kh5twB0I_Wu4', title: 'Weather Video 2', thumb: 'https://img.youtube.com/vi/3w9lOwRi_cA/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What do we call the weather when the sun is bright?', visual: '☀️', options: ['Sunny', 'Rainy', 'Windy'], correct: 0 },
            { question: 'Which season is very hot?', visual: '🌡️', options: ['Summer', 'Winter', 'Rainy'], correct: 0 },
            { question: 'Which season has a lot of rain?', visual: '🌧️', options: ['Rainy Season', 'Winter', 'Summer'], correct: 0 },
            { question: 'What do we use when it rains?', visual: '☔', options: ['Umbrella', 'Hat', 'Shoes'], correct: 0 },
            { question: 'Which season is cold?', visual: '❄️', options: ['Winter', 'Summer', 'Rainy'], correct: 0 },
            { question: 'Which weather has strong moving air?', visual: '🌬️', options: ['Windy', 'Sunny', 'Rainy'], correct: 0 },
            { question: 'What do we wear in winter?', visual: '🧥', options: ['Sweater', 'Shorts', 'Cap'], correct: 0 },
            { question: 'What appears in the sky on sunny days?', visual: '🌞', options: ['Sun', 'Rain', 'Snow'], correct: 0 },
            { question: 'Rain comes from:', visual: '☁️', options: ['Clouds', 'Trees', 'Houses'], correct: 0 },
            { question: 'Weather can change:', visual: '🌍', options: ['Every day', 'Once a year', 'Never'], correct: 0 }
        ],
        summary: [
            'Weather describes how the sky and air feel',
            'There are different types of weather like sunny and rainy',
            'Seasons change the weather during the year'
        ],
        summaryEnd: 'Great job! Now you understand weather and seasons!',
        nextLesson: { id: 'water', title: 'Water' }
    },
    'water': {
        title: 'Water',
        subtitle: 'Learn about sources of water, its uses, and why we should save water.',
        videoSubtitle: 'Watch these fun videos to learn about water and why it is important! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/X9G5HpCDRxo?si=iEwSCNVWDke6hKEZ', title: 'Importance of Water', thumb: 'https://img.youtube.com/vi/X9G5HpCDRxo/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/c-3KCzxEgek?si=Al3vvRmBN8i44Hw8', title: 'Sources of Water', thumb: 'https://img.youtube.com/vi/c-3KCzxEgek/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/7jurvguV6AM?si=ysy8lGqlSXF8T3sk', title: 'Saving Water', thumb: 'https://img.youtube.com/vi/7jurvguV6AM/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Water is important for:', visual: '💧', options: ['Living things', 'Toys', 'Books'], correct: 0 },
            { question: 'Which is a natural source of water?', visual: '🌧️', options: ['Rain', 'Car', 'Chair'], correct: 0 },
            { question: 'Which place stores a lot of water?', visual: '🌊', options: ['River', 'Road', 'School'], correct: 0 },
            { question: 'We use water for:', visual: '🥤', options: ['Drinking', 'Flying', 'Driving'], correct: 0 },
            { question: 'Plants need water to:', visual: '🌱', options: ['Grow', 'Sleep', 'Walk'], correct: 0 },
            { question: 'Which is a source of water?', visual: '🏞️', options: ['Lake', 'Table', 'Wall'], correct: 0 },
            { question: 'Which activity uses water?', visual: '🛁', options: ['Bathing', 'Running', 'Jumping'], correct: 0 },
            { question: 'What should we do after using water?', visual: '🚰', options: ['Turn off the tap', 'Leave it open', 'Break the tap'], correct: 0 },
            { question: 'Water helps us stay:', visual: '✨', options: ['Clean', 'Dirty', 'Slow'], correct: 0 },
            { question: 'Saving water helps:', visual: '🌍', options: ['Protect nature', 'Waste water', 'Pollute water'], correct: 0 }
        ],
        summary: [
            'Water is important for all living things',
            'Water comes from sources like rain, rivers, and lakes',
            'We use water for drinking, cooking, and cleaning',
            'Saving water helps protect the environment'
        ],
        summaryEnd: 'Great job! Remember to save water every day!'
    },
    'numbers-up-to-100': {
        title: 'Numbers up to 100',
        subtitle: 'Learn how to count, read, and compare numbers from 1 to 100.',
        videoSubtitle: 'Watch these fun videos to learn about counting numbers up to 100! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/bGetqbqDVaA?si=lHPPdrNnxMBsaLeV', title: 'Counting to 100', thumb: 'https://img.youtube.com/vi/bGetqbqDVaA/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/jQMUa2zIchs?si=5-LX3QLnsgh1TD4H', title: 'Tens and Ones', thumb: 'https://img.youtube.com/vi/jQMUa2zIchs/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/jMmATUvMEsA?si=ssi70HDwcwFY8b_d', title: 'Comparing Numbers', thumb: 'https://img.youtube.com/vi/jMmATUvMEsA/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What number comes after 49?', visual: '🔢', options: ['50', '51', '48'], correct: 0 },
            { question: 'What number comes before 30?', visual: '⬅️', options: ['29', '31', '28'], correct: 0 },
            { question: 'Which number is bigger?', visual: '📈', options: ['45', '32', '28'], correct: 0 },
            { question: 'How many tens are in 40?', visual: '🧱', options: ['4', '5', '3'], correct: 0 },
            { question: 'Which number is smaller?', visual: '📉', options: ['25', '40', '50'], correct: 0 },
            { question: 'Which symbol means greater than?', visual: '⚖️', options: ['>', '<', '='], correct: 0 },
            { question: 'Which number comes after 99?', visual: '💯', options: ['100', '98', '101'], correct: 0 },
            { question: 'What is 3 tens and 2 ones?', visual: '🧩', options: ['32', '23', '35'], correct: 0 },
            { question: 'Arrange in ascending order:', visual: '⬆️', options: ['12, 18, 25', '25, 18, 12', '18, 12, 25'], correct: 0 },
            { question: 'Arrange in descending order:', visual: '⬇️', options: ['50, 40, 30', '30, 40, 50', '40, 30, 50'], correct: 0 }
        ],
        summary: [
            'Counting numbers up to 100',
            'Understanding tens and ones',
            'Comparing numbers',
            'Arranging numbers in order'
        ],
        summaryEnd: 'Great job! You are learning bigger numbers!',
        nextLesson: { id: 'addition', title: 'Addition' }
    },
    '2-addition': {
        title: 'Addition',
        subtitle: 'Learn how to add numbers and find the total.',
        videoSubtitle: 'Watch these fun videos to learn about addition! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/prdsWo7Za5M?si=ILrJYmPAUnPKU3wE', title: 'Basic Addition', thumb: 'https://img.youtube.com/vi/prdsWo7Za5M/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/inwX-IHaXq0?si=-qFqYKzOvFZv6zku', title: 'Two-Digit Addition', thumb: 'https://img.youtube.com/vi/inwX-IHaXq0/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/Q9sLfMrH8_w?si=9Qb-fA2ibCVGal2H', title: 'Addition with Carry', thumb: 'https://img.youtube.com/vi/Q9sLfMrH8_w/hqdefault.jpg' }
        ],
        quiz: [
            { question: '5 + 4 = ?', visual: '➕', options: ['9', '8', '10'], correct: 0 },
            { question: '12 + 6 = ?', visual: '🔢', options: ['18', '16', '20'], correct: 0 },
            { question: '23 + 14 = ?', visual: '🧩', options: ['37', '36', '35'], correct: 0 },
            { question: '15 + 10 = ?', visual: '💯', options: ['25', '20', '24'], correct: 0 },
            { question: '9 + 8 = ?', visual: '✨', options: ['17', '16', '18'], correct: 0 },
            { question: '27 + 15 = ?', visual: '🧱', options: ['42', '41', '43'], correct: 0 },
            { question: '30 + 20 = ?', visual: '📊', options: ['50', '40', '60'], correct: 0 },
            { question: 'Which symbol is used for addition?', visual: '❓', options: ['+', '−', '×'], correct: 0 },
            { question: '40 + 12 = ?', visual: '🎯', options: ['52', '50', '54'], correct: 0 },
            { question: 'If you add numbers, the total becomes:', visual: '📈', options: ['Bigger', 'Smaller', 'Zero'], correct: 0 }
        ],
        summary: [
            'Addition means combining numbers',
            'We can add two-digit numbers',
            'Carrying helps when numbers are greater than 9',
            'Addition helps us solve real-life problems'
        ],
        summaryEnd: 'Great job! You are learning addition!',
        nextLesson: { id: 'subtraction', title: 'Subtraction' }
    },
    '2-subtraction': {
        title: 'Subtraction',
        subtitle: 'Learn how to subtract two-digit numbers and find the difference.',
        videoSubtitle: 'Watch these fun videos to learn about subtraction! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/qKxQ33KcRWQ?si=-q0mq3bZEDa1_lhu', title: 'Two-Digit Subtraction', thumb: 'https://img.youtube.com/vi/qKxQ33KcRWQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/489srqkdgMQ?si=32RG6pUHgvD7BOsd', title: 'Subtraction with Borrowing', thumb: 'https://img.youtube.com/vi/489srqkdgMQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/NgXm1kaxnlI?si=u7SB_g-n1swaDglU', title: 'Subtraction Examples', thumb: 'https://img.youtube.com/vi/NgXm1kaxnlI/hqdefault.jpg' }
        ],
        quiz: [
            { question: '15 − 5 = ?', visual: '➖', options: ['10', '9', '11'], correct: 0 },
            { question: '34 − 12 = ?', visual: '🔢', options: ['22', '21', '20'], correct: 0 },
            { question: '50 − 20 = ?', visual: '🧩', options: ['30', '40', '25'], correct: 0 },
            { question: '45 − 23 = ?', visual: '🎯', options: ['22', '21', '20'], correct: 0 },
            { question: '60 − 25 = ?', visual: '📊', options: ['35', '30', '25'], correct: 0 },
            { question: '52 − 27 = ?', visual: '🧱', options: ['25', '26', '24'], correct: 0 },
            { question: '70 − 40 = ?', visual: '💯', options: ['30', '20', '40'], correct: 0 },
            { question: '81 − 30 = ?', visual: '✨', options: ['51', '50', '41'], correct: 0 },
            { question: 'Which symbol is used for subtraction?', visual: '❓', options: ['−', '+', '×'], correct: 0 },
            { question: 'If we subtract numbers, the result becomes:', visual: '📉', options: ['Smaller', 'Bigger', 'Equal'], correct: 0 }
        ],
        summary: [
            'Subtraction means taking away numbers',
            'We can subtract two-digit numbers',
            'Borrowing helps when the top number is smaller',
            'Subtraction helps solve real-life problems'
        ],
        summaryEnd: 'Great job! You are learning subtraction!',
        nextLesson: { id: 'multiplication', title: 'Multiplication' }
    },
    '2-multiplication': {
        title: 'Multiplication',
        subtitle: 'Learn how multiplication helps us add equal groups quickly.',
        videoSubtitle: 'Watch these fun videos to learn about multiplication! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/IIpy29sAoxA?si=GgrtcPorg5mWVZRA', title: 'Multiplication Using Groups', thumb: 'https://img.youtube.com/vi/IIpy29sAoxA/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/Lv6TpK-3BFI?si=V8bpnaIOiPVubPLJ', title: 'Repeated Addition', thumb: 'https://img.youtube.com/vi/Lv6TpK-3BFI/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/fZFwHpiAVE0?si=fNnXoH9h5ZnDOAdC', title: 'Basic Multiplication Tables', thumb: 'https://img.youtube.com/vi/fZFwHpiAVE0/hqdefault.jpg' }
        ],
        quiz: [
            { question: '2 × 3 = ?', visual: '✖️', options: ['6', '5', '7'], correct: 0 },
            { question: '3 × 2 = ?', visual: '🔢', options: ['6', '4', '5'], correct: 0 },
            { question: '4 × 2 = ?', visual: '🍎', options: ['8', '6', '10'], correct: 0 },
            { question: '5 × 2 = ?', visual: '🧩', options: ['10', '12', '8'], correct: 0 },
            { question: '2 × 4 = ?', visual: '🎯', options: ['8', '6', '10'], correct: 0 },
            { question: '3 groups of 2 equals:', visual: '📦', options: ['6', '5', '7'], correct: 0 },
            { question: 'Which symbol is used for multiplication?', visual: '❓', options: ['×', '+', '−'], correct: 0 },
            { question: '2 + 2 + 2 equals:', visual: '➕', options: ['6', '4', '5'], correct: 0 },
            { question: '4 baskets with 3 apples each equals:', visual: '🧺', options: ['12', '10', '8'], correct: 0 },
            { question: 'Multiplication helps us:', visual: '💡', options: ['Add equal groups', 'Subtract numbers', 'Divide numbers'], correct: 0 }
        ],
        summary: [
            'Multiplication means repeated addition',
            'Multiplication helps count equal groups',
            'The symbol × means multiply',
            'Multiplication helps solve real-life problems'
        ],
        summaryEnd: 'Great job! You are learning multiplication!',
        nextLesson: { id: 'time', title: 'Time' }
    },
    '2-time': {
        title: 'Time',
        subtitle: 'Learn how to read time using a clock.',
        videoSubtitle: 'Watch these fun videos to learn about reading time! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/xS_T7Uoyeb8?si=FGnIDesmasJ0vMpV', title: 'Parts of a Clock', thumb: 'https://img.youtube.com/vi/xS_T7Uoyeb8/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/Dcw0YPCCXbo?si=nHF-aESBU1FGStIC', title: 'How to Read a Clock', thumb: 'https://img.youtube.com/vi/Dcw0YPCCXbo/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/2MrBeudavKc?si=xotCMPQ5s1FjtmGN', title: 'Understanding Hours', thumb: 'https://img.youtube.com/vi/2MrBeudavKc/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'How many numbers are on a clock?', visual: '⏱️', options: ['12', '10', '8'], correct: 0 },
            { question: 'Which hand shows the hour?', visual: '⏲️', options: ['Hour hand', 'Minute hand', 'Second hand'], correct: 0 },
            { question: 'Which hand shows the minutes?', visual: '⏳', options: ['Minute hand', 'Hour hand', 'Clock face'], correct: 0 },
            { question: 'When the minute hand points to 12, we say:', visual: '🕛', options: ['O’clock', 'Half past', 'Quarter'], correct: 0 },
            { question: '3:00 means:', visual: '🕒', options: ['Three o’clock', 'Five o’clock', 'Two o’clock'], correct: 0 },
            { question: 'Which activity happens in the morning?', visual: '🌅', options: ['Going to school', 'Sleeping', 'Watching stars'], correct: 0 },
            { question: 'Which time is lunch time?', visual: '🍱', options: ['1:00', '6:00', '10:00'], correct: 0 },
            { question: 'Which hand is shorter?', visual: '📐', options: ['Hour hand', 'Minute hand', 'Both same'], correct: 0 },
            { question: 'Which hand is longer?', visual: '📏', options: ['Minute hand', 'Hour hand', 'None'], correct: 0 },
            { question: 'What do we use to measure time?', visual: '⏰', options: ['Clock', 'Book', 'Chair'], correct: 0 }
        ],
        summary: [
            'Time helps us plan our day',
            'A clock shows time',
            'A clock has hour and minute hands',
            'We read time using hours and minutes'
        ],
        summaryEnd: 'Great job! You are learning to tell time!',
        nextLesson: { id: 'money', title: 'Money' }
    },
    '2-money': {
        title: 'Money',
        subtitle: 'Learn about coins, notes, and how we use money.',
        videoSubtitle: 'Watch these fun videos to learn about money! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/usXUZKPCLA8?si=ZD8aYI_K7vMn2rL_', title: 'Coins and Notes', thumb: 'https://img.youtube.com/vi/usXUZKPCLA8/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/j5lgIJZhMDc?si=e_s6VlPhsvbLEc65', title: 'Adding Money', thumb: 'https://img.youtube.com/vi/j5lgIJZhMDc/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/4qP2bhXn2Ok?si=35j3idfw_Hx1PSGt', title: 'Using Money in Daily Life', thumb: 'https://img.youtube.com/vi/4qP2bhXn2Ok/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What do we use to buy things?', visual: '🛒', options: ['Money', 'Paper', 'Books'], correct: 0 },
            { question: 'What is the currency used in India?', visual: '🇮🇳', options: ['Rupee', 'Dollar', 'Euro'], correct: 0 },
            { question: 'Which is a coin?', visual: '🪙', options: ['₹5', '₹50 note', '₹100 note'], correct: 0 },
            { question: 'Which is a note?', visual: '💵', options: ['₹10 note', '₹1 coin', '₹2 coin'], correct: 0 },
            { question: '₹5 + ₹2 = ?', visual: '➕', options: ['₹7', '₹6', '₹8'], correct: 0 },
            { question: '₹10 + ₹10 = ?', visual: '🧮', options: ['₹20', '₹15', '₹30'], correct: 0 },
            { question: 'A pencil costs ₹5. Two pencils cost:', visual: '✏️', options: ['₹10', '₹15', '₹5'], correct: 0 },
            { question: 'Coins are made of:', visual: '🛠️', options: ['Metal', 'Paper', 'Plastic'], correct: 0 },
            { question: 'Notes are made of:', visual: '📄', options: ['Paper', 'Metal', 'Glass'], correct: 0 },
            { question: 'Money helps us:', visual: '🛍️', options: ['Buy things', 'Read books', 'Play games'], correct: 0 }
        ],
        summary: [
            'Money is used to buy things',
            'Money comes as coins and notes',
            'We can add money to find the total',
            'Money helps us in daily life'
        ],
        summaryEnd: 'Great job! You are learning about money!',
        nextLesson: { id: 'shapes', title: 'Shapes' }
    },
    '2-shapes': {
        title: 'Shapes',
        subtitle: 'Explore 2D and 3D shapes, their properties, and patterns.',
        videoSubtitle: 'Watch these fun videos to learn about shapes! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/gk_u1xr7jQg?si=tr_zL7tqh8h2krFF', title: '2D Shapes', thumb: 'https://img.youtube.com/vi/gk_u1xr7jQg/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/tRC_4IMOTSQ?si=0PiKzQlyiX5VzBl0', title: '3D Shapes', thumb: 'https://img.youtube.com/vi/tRC_4IMOTSQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/CYVmmTaqIPU?si=-at-fbSgWoyIaJTi', title: 'Shape Recognition', thumb: 'https://img.youtube.com/vi/CYVmmTaqIPU/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which shape is round?', visual: '🔴', options: ['Circle', 'Square', 'Triangle'], correct: 0 },
            { question: 'Which shape has three sides?', visual: '🔺', options: ['Triangle', 'Square', 'Rectangle'], correct: 0 },
            { question: 'Which shape has four equal sides?', visual: '🟦', options: ['Square', 'Circle', 'Triangle'], correct: 0 },
            { question: 'Which shape looks like a ball?', visual: '⚾', options: ['Sphere', 'Cube', 'Cone'], correct: 0 },
            { question: 'Which shape looks like a dice?', visual: '🎲', options: ['Cube', 'Sphere', 'Cylinder'], correct: 0 },
            { question: 'Which shape is like an ice cream cone?', visual: '🍦', options: ['Cone', 'Cube', 'Sphere'], correct: 0 },
            { question: 'Which shape has four sides but opposite sides are equal?', visual: '🛤️', options: ['Rectangle', 'Triangle', 'Circle'], correct: 0 },
            { question: 'Which of these is a 2D shape?', visual: '📐', options: ['Triangle', 'Cube', 'Sphere'], correct: 0 },
            { question: 'Which of these is a 3D shape?', visual: '🧊', options: ['Cube', 'Circle', 'Square'], correct: 0 },
            { question: 'Which activity uses patterns?', visual: '🧩', options: ['Repeating shapes', 'Writing numbers', 'Reading books'], correct: 0 }
        ],
        summary: [
            'Shapes are forms of objects around us',
            '2D shapes are flat shapes',
            '3D shapes are solid shapes',
            'Shapes can form patterns'
        ],
        summaryEnd: 'Great job! You are learning about shapes!',
        nextLesson: null
    },
    '2-reading-sentences': {
        title: 'Reading Sentences',
        subtitle: 'Learn how to read and understand simple English sentences.',
        videoSubtitle: 'Watch these fun videos to practice reading sentences! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/OHuJWfpsRrM?si=eaFnTjfECDhOYqcD', title: 'Reading Simple Sentences', thumb: 'https://img.youtube.com/vi/OHuJWfpsRrM/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/8r8xRGxAZEY?si=h9PY8UHSxFC1lPjB', title: 'Pronouncing Words', thumb: 'https://img.youtube.com/vi/8r8xRGxAZEY/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/ajwZTNOy_cE?si=qDPOVE0WcNoh_6tr', title: 'Understanding Sentence Meaning', thumb: 'https://img.youtube.com/vi/ajwZTNOy_cE/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which is a sentence?', visual: '📖', options: ['The cat is sleeping.', 'Cat sleeping', 'Sleeping cat'], correct: 0 },
            { question: 'Which word starts this sentence? "The dog runs fast."', visual: '🐕', options: ['The', 'Runs', 'Fast'], correct: 0 },
            { question: 'A sentence begins with:', visual: '🔠', options: ['Capital letter', 'Small letter', 'Number'], correct: 0 },
            { question: 'A sentence ends with:', visual: '⏺️', options: ['Full stop', 'Comma', 'Question mark'], correct: 0 },
            { question: 'Which sentence is correct?', visual: '✅', options: ['The sun is bright.', 'sun bright', 'Bright sun'], correct: 0 },
            { question: 'Which animal is mentioned? "The dog is barking."', visual: '🐾', options: ['Dog', 'Cat', 'Cow'], correct: 0 },
            { question: 'Which object is red? "The apple is red."', visual: '🍎', options: ['Apple', 'Book', 'Ball'], correct: 0 },
            { question: 'What is the boy doing? "The boy is playing."', visual: '👦', options: ['Playing', 'Sleeping', 'Eating'], correct: 0 },
            { question: 'What helps us understand sentences better?', visual: '🖼️', options: ['Pictures', 'Numbers', 'Shapes'], correct: 0 },
            { question: 'Reading sentences helps us:', visual: '🗣️', options: ['Improve language skills', 'Solve math problems', 'Draw pictures'], correct: 0 }
        ],
        summary: [
            'A sentence is a group of words with complete meaning',
            'Sentences begin with a capital letter',
            'Sentences end with a full stop',
            'Reading sentences improves language skills'
        ],
        summaryEnd: 'Great job! Keep practicing reading sentences!',
        nextLesson: { id: 'phonics-practice', title: 'Phonics Practice' }
    },
    '2-phonics-practice': {
        title: 'Phonics Practice',
        subtitle: 'Learn letter sounds and how they combine to form words.',
        videoSubtitle: 'Watch these fun videos to learn about phonics! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/o84ndBQU6vQ?si=dgXQ8D9mF9KHLGuO', title: 'Letter Sounds', thumb: 'https://img.youtube.com/vi/o84ndBQU6vQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/Qz0LWrJDfx0?si=i6OfO1kOejDhh2Vw', title: 'Sound Combinations', thumb: 'https://img.youtube.com/vi/Qz0LWrJDfx0/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/VQqWs9qIyYU?si=3U8MVo3qVcweQw4X', title: 'Pronunciation Practice', thumb: 'https://img.youtube.com/vi/VQqWs9qIyYU/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which word begins with the "ch" sound?', visual: '🪑', options: ['Chair', 'Ship', 'Thumb'], correct: 0 },
            { question: 'Which word begins with the "sh" sound?', visual: '🚢', options: ['Ship', 'Phone', 'Chair'], correct: 0 },
            { question: 'Which word begins with the "th" sound?', visual: '👍', options: ['Thumb', 'Chair', 'Ship'], correct: 0 },
            { question: 'Which word begins with the "ph" sound?', visual: '📱', options: ['Phone', 'Ship', 'Chair'], correct: 0 },
            { question: 'Which sound begins the word "shoe"?', visual: '👞', options: ['sh', 'ch', 'ph'], correct: 0 },
            { question: 'Which word contains the "ch" sound?', visual: '🧀', options: ['Cheese', 'Phone', 'Ship'], correct: 0 },
            { question: 'Which word contains the "th" sound?', visual: '3️⃣', options: ['Three', 'Chair', 'Shoe'], correct: 0 },
            { question: 'Which word starts with the "ph" sound?', visual: '🐘', options: ['Phone', 'Thumb', 'Chair'], correct: 0 },
            { question: 'Phonics helps us:', visual: '🗣️', options: ['Read words', 'Solve math problems', 'Draw pictures'], correct: 0 },
            { question: 'Which word begins with the "sh" sound?', visual: '🚢', options: ['Ship', 'Chair', 'Phone'], correct: 0 }
        ],
        summary: [
            'Phonics helps us understand letter sounds',
            'Some letters combine to make new sounds',
            'Practicing phonics helps improve reading and pronunciation'
        ],
        summaryEnd: 'Great job! Keep practicing phonics!',
        nextLesson: { id: 'simple-words', title: 'Simple Words' }
    },
    '2-simple-words': {
        title: 'Simple Words',
        subtitle: 'Build vocabulary with new everyday words.',
        videoSubtitle: 'Watch these fun videos to learn new words! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/MCQoWGAmj7w?si=fdRk5VEZuwSZ2j-j', title: 'Common English Vocabulary', thumb: 'https://img.youtube.com/vi/MCQoWGAmj7w/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/QahSR-a6raQ?si=ZsHscUYH4QmzJ3pZ', title: 'Everyday Words', thumb: 'https://img.youtube.com/vi/QahSR-a6raQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/QXYW-NgP8EA?si=aFy7DSitabb0uu0v', title: 'Learning New Words', thumb: 'https://img.youtube.com/vi/QXYW-NgP8EA/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Which word means feeling joyful?', visual: '😊', options: ['Happy', 'Garden', 'School'], correct: 0 },
            { question: 'Where do children go to learn?', visual: '🏫', options: ['School', 'Garden', 'Market'], correct: 0 },
            { question: 'Which word means a place with plants and flowers?', visual: '🌻', options: ['Garden', 'Market', 'House'], correct: 0 },
            { question: 'Who helps students learn?', visual: '👩‍🏫', options: ['Teacher', 'Friend', 'Farmer'], correct: 0 },
            { question: 'Which word means someone you like and play with?', visual: '🤝', options: ['Friend', 'Teacher', 'Animal'], correct: 0 },
            { question: 'Which word names a living creature?', visual: '🐶', options: ['Animal', 'School', 'Garden'], correct: 0 },
            { question: 'Which word is used for writing?', visual: '✏️', options: ['Pencil', 'Flower', 'Basket'], correct: 0 },
            { question: 'Which word is a place to buy things?', visual: '🛒', options: ['Market', 'Garden', 'School'], correct: 0 },
            { question: 'Which word names a beautiful plant?', visual: '🌺', options: ['Flower', 'Window', 'Pencil'], correct: 0 },
            { question: 'Learning new words helps us:', visual: '🧠', options: ['Understand language better', 'Solve math problems', 'Draw pictures'], correct: 0 }
        ],
        summary: [
            'New everyday English words',
            'Meanings of common words',
            'How to use words in sentences',
            'Practicing vocabulary improves language skills'
        ],
        summaryEnd: 'Great job! Keep learning new words every day!',
        nextLesson: { id: 'opposite-words', title: 'Opposite Words' }
    },
    '2-opposite-words': {
        title: 'Opposite Words',
        subtitle: 'Learn words that have opposite meanings.',
        videoSubtitle: 'Watch these fun videos to learn about opposite words! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/Qt1WyNpWhJA?si=7kajCK2m6aK3RehH', title: 'What Are Opposite Words?', thumb: 'https://img.youtube.com/vi/Qt1WyNpWhJA/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/Fte2_TxMHxM?si=c-EX6dJ6LH0Hlu9L', title: 'Examples of Antonyms', thumb: 'https://img.youtube.com/vi/Fte2_TxMHxM/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/3JDWR6SXSNk?si=nPnOViI5tWMN5Enh', title: 'Learning with Pictures', thumb: 'https://img.youtube.com/vi/3JDWR6SXSNk/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What is the opposite of "Big"?', visual: '🐘', options: ['Small', 'Tall', 'Fast'], correct: 0 },
            { question: 'What is the opposite of "Hot"?', visual: '☕', options: ['Cold', 'Warm', 'Dry'], correct: 0 },
            { question: 'What is the opposite of "Happy"?', visual: '😃', options: ['Sad', 'Angry', 'Excited'], correct: 0 },
            { question: 'What is the opposite of "Fast"?', visual: '🐇', options: ['Slow', 'Run', 'Jump'], correct: 0 },
            { question: 'What is the opposite of "Open"?', visual: '📖', options: ['Close', 'Door', 'Window'], correct: 0 },
            { question: 'What is the opposite of "Tall"?', visual: '🦒', options: ['Short', 'Long', 'Wide'], correct: 0 },
            { question: 'What is the opposite of "Up"?', visual: '⬆️', options: ['Down', 'Over', 'Inside'], correct: 0 },
            { question: 'What is the opposite of "Day"?', visual: '☀️', options: ['Night', 'Morning', 'Evening'], correct: 0 },
            { question: 'What is the opposite of "Clean"?', visual: '✨', options: ['Dirty', 'Wet', 'Soft'], correct: 0 },
            { question: 'Opposite words help us:', visual: '↔️', options: ['Describe differences', 'Solve math problems', 'Draw pictures'], correct: 0 }
        ],
        summary: [
            'Opposite words have different meanings',
            'Opposite words are also called antonyms',
            'Learning opposite words improves vocabulary',
            'Opposite words help us describe things clearly'
        ],
        summaryEnd: 'Great job! Keep learning new words!',
        nextLesson: { id: 'simple-grammar', title: 'Simple Grammar' }
    },
    '2-simple-grammar': {
        title: 'Simple Grammar',
        subtitle: 'Learn basic grammar rules used in simple sentences.',
        videoSubtitle: 'Watch these fun videos to learn about grammar rules! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/4DLxGFDwFAY?si=38d2vKDRjv-NydCS', title: 'Basic Grammar Rules', thumb: 'https://img.youtube.com/vi/4DLxGFDwFAY/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/BI1Syz9I2n0?si=FG2dWLUpTd5oER6e', title: 'Nouns and Pronouns', thumb: 'https://img.youtube.com/vi/BI1Syz9I2n0/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/vLL7FGd3f9w?si=BcSXU1tVYNMgFLwK', title: 'Using is, am, are', thumb: 'https://img.youtube.com/vi/vLL7FGd3f9w/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/5ZkMbLkGims?si=zH0N9oAMzQkn3W-T', title: 'Grammar in Sentences', thumb: 'https://img.youtube.com/vi/5ZkMbLkGims/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What is a noun?', visual: '🏷️', options: ['Name of a person, place, animal, or thing', 'Action word', 'Describing word'], correct: 0 },
            { question: 'Which of these is a noun?', visual: '🏫', options: ['School', 'Run', 'Happy'], correct: 0 },
            { question: 'Which word is a pronoun?', visual: '👤', options: ['He', 'Teacher', 'Dog'], correct: 0 },
            { question: 'Choose the correct sentence:', visual: '✅', options: ['I am happy.', 'I is happy.', 'I are happy.'], correct: 0 },
            { question: 'Which word replaces a noun?', visual: '🔄', options: ['Pronoun', 'Noun', 'Verb'], correct: 0 },
            { question: 'Fill in the blank:\nShe ___ reading a book.', visual: '📖', options: ['is', 'am', 'are'], correct: 0 },
            { question: 'Fill in the blank:\nThey ___ playing football.', visual: '⚽', options: ['are', 'is', 'am'], correct: 0 },
            { question: 'Fill in the blank:\nI ___ a student.', visual: '🎒', options: ['am', 'is', 'are'], correct: 0 },
            { question: 'Which of these is a noun?', visual: '🐶', options: ['Dog', 'Run', 'Jump'], correct: 0 },
            { question: 'Grammar helps us:', visual: '✍️', options: ['Make correct sentences', 'Solve math problems', 'Draw pictures'], correct: 0 }
        ],
        summary: [
            'Grammar helps us form correct sentences',
            'Nouns name people, places, animals, and things',
            'Pronouns replace nouns',
            'Words like "is", "am", and "are" help form sentences'
        ],
        summaryEnd: 'Great job! You are learning grammar!',
        nextLesson: { id: 'rhymes-stories', title: 'Rhymes & Stories' }
    },
    '2-rhymes-stories': {
        title: 'Rhymes & Stories',
        subtitle: 'Enjoy fun rhymes and short stories to improve reading and imagination.',
        videoSubtitle: 'Watch these fun videos of rhymes and stories! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/NyN_94bSsew?si=z7dPmQEOanPS8nSe', title: 'Children\'s Rhymes', thumb: 'https://img.youtube.com/vi/NyN_94bSsew/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/pEoSYt1HXdQ?si=zu0v0uz1KvD266Fx', title: 'Short Moral Stories', thumb: 'https://img.youtube.com/vi/pEoSYt1HXdQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/Ym0axmhPT-A?si=GmqX3bdBl7vR4mYY', title: 'Story Reading for Kids 1', thumb: 'https://img.youtube.com/vi/Ym0axmhPT-A/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/bb7LofNTjOQ?si=jMHbb8zHjqeNgk7f', title: 'Story Reading for Kids 2', thumb: 'https://img.youtube.com/vi/bb7LofNTjOQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/KvtmX1cVLp4?si=5gdJ2O-4F-rb3Bre', title: 'Story Reading for Kids 3', thumb: 'https://img.youtube.com/vi/KvtmX1cVLp4/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/QUTYxwTsbiM?si=cBbAPMBPVtny4xhE', title: 'Story Reading for Kids 4', thumb: 'https://img.youtube.com/vi/QUTYxwTsbiM/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What is a rhyme?', visual: '🎶', options: ['A poem with repeating sounds', 'A math problem', 'A picture'], correct: 0 },
            { question: 'What did Arun find on the road?', visual: '👛', options: ['Wallet', 'Book', 'Toy'], correct: 0 },
            { question: 'Where did Arun take the wallet?', visual: '👮', options: ['Police station', 'School', 'Market'], correct: 0 },
            { question: 'Why did the owner thank Arun?', visual: '🙏', options: ['He returned the wallet', 'He bought something', 'He kept the wallet'], correct: 0 },
            { question: 'What is the moral of the story?', visual: '🌟', options: ['Honesty is good', 'Running is good', 'Playing is good'], correct: 0 },
            { question: 'What do birds do in the rhyme?', visual: '🐦', options: ['Fly', 'Swim', 'Sleep'], correct: 0 },
            { question: 'Why do children read stories?', visual: '📖', options: ['To learn and enjoy', 'To sleep', 'To run'], correct: 0 },
            { question: 'Which word means shining strongly?', visual: '☀️', options: ['Bright', 'Dark', 'Cold'], correct: 0 },
            { question: 'Stories help improve:', visual: '🧠', options: ['Reading and imagination', 'Math skills', 'Drawing'], correct: 0 },
            { question: 'Honesty means:', visual: '🗣️', options: ['Telling the truth', 'Running fast', 'Jumping high'], correct: 0 }
        ],
        summary: [
            'Rhymes are poems with rhythm and repeating sounds',
            'Stories teach us important lessons',
            'Reading stories improves vocabulary and imagination',
            'Honesty is an important value'
        ],
        summaryEnd: 'Great job! Keep reading and enjoying stories!',
        nextLesson: null
    },
    '2-my-family': {
        title: 'My Family',
        subtitle: 'Learn about family members, their roles, and why family is important.',
        videoSubtitle: 'Watch these fun videos to learn about types of families! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/Pxjv1nZImsI?si=LZHtnpFLBcu2qT4F', title: 'What is a Family?', thumb: 'https://img.youtube.com/vi/Pxjv1nZImsI/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/s0t1cBEOK_Y?si=zLHDEO5d8ipHV7TK', title: 'Types of Families', thumb: 'https://img.youtube.com/vi/s0t1cBEOK_Y/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/8wvRiasm0j0?si=hXngrI9lVhbEni15', title: 'Helping at Home', thumb: 'https://img.youtube.com/vi/8wvRiasm0j0/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What is a family?', visual: '👨‍👩‍👧‍👦', options: ['People who live together and care for each other', 'A building', 'A classroom'], correct: 0 },
            { question: 'Which of these is a family member?', visual: '👩', options: ['Mother', 'Teacher', 'Driver'], correct: 0 },
            { question: 'Who are the elders in the family?', visual: '👴👵', options: ['Grandparents', 'Friends', 'Neighbors'], correct: 0 },
            { question: 'A family with parents and children is called:', visual: '🏠', options: ['Small family', 'Big school', 'Market'], correct: 0 },
            { question: 'A family with grandparents, parents, and children is called:', visual: '🏡', options: ['Joint family', 'Single person', 'Friend group'], correct: 0 },
            { question: 'Children should:', visual: '🙏', options: ['Respect elders', 'Fight', 'Ignore family'], correct: 0 },
            { question: 'Helping family members makes:', visual: '😊', options: ['Home happy', 'People sad', 'Things messy'], correct: 0 },
            { question: 'Which activity helps the family?', visual: '🧹', options: ['Cleaning the room', 'Breaking toys', 'Shouting'], correct: 0 },
            { question: 'Family members should:', visual: '🤝', options: ['Help each other', 'Fight', 'Ignore each other'], correct: 0 },
            { question: 'Family gives us:', visual: '❤️', options: ['Love and care', 'Homework', 'Exams'], correct: 0 }
        ],
        summary: [
            'A family is a group of people who care for each other',
            'Families can be small or joint families',
            'Family members have different roles',
            'Helping family members keeps the home happy'
        ],
        summaryEnd: 'Great job! Love and respect your family!',
        nextLesson: { id: 'food-we-eat', title: 'Food We Eat' }
    },
    '2-food-we-eat': {
        title: 'Food We Eat',
        subtitle: 'Learn about different types of food and why we need healthy food.',
        videoSubtitle: 'Watch these fun videos to learn about healthy food! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/ou7Ms8_LUrs?si=T2UOhF5VL3cvblit', title: 'Healthy Food for Kids', thumb: 'https://img.youtube.com/vi/ou7Ms8_LUrs/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/DTSa1Lv6dWQ?si=AJOG-suBpF8a1WcK', title: 'Food from Plants & Animals', thumb: 'https://img.youtube.com/vi/DTSa1Lv6dWQ/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/5WtHbXEER38?si=8AwZTVIXbdyBqwvW', title: 'Balanced Diet', thumb: 'https://img.youtube.com/vi/5WtHbXEER38/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Why do we need food?', visual: '🍽️', options: ['To get energy', 'To sleep', 'To run faster'], correct: 0 },
            { question: 'Which of these is a fruit?', visual: '🍎', options: ['Apple', 'Carrot', 'Rice'], correct: 0 },
            { question: 'Which food comes from plants?', visual: '🌾', options: ['Rice', 'Milk', 'Eggs'], correct: 0 },
            { question: 'Milk comes from:', visual: '🥛', options: ['Cow', 'Tree', 'River'], correct: 0 },
            { question: 'Eggs come from:', visual: '🥚', options: ['Hen', 'Fish', 'Cow'], correct: 0 },
            { question: 'Which of these is a vegetable?', visual: '🥕', options: ['Carrot', 'Mango', 'Apple'], correct: 0 },
            { question: 'Healthy food helps us:', visual: '💪', options: ['Grow strong', 'Sleep more', 'Run slower'], correct: 0 },
            { question: 'Which food comes from animals?', visual: '🐄', options: ['Milk', 'Rice', 'Wheat'], correct: 0 },
            { question: 'Which is a healthy habit?', visual: '🥗', options: ['Eating fruits and vegetables', 'Eating only junk food', 'Skipping meals'], correct: 0 },
            { question: 'Food helps our body:', visual: '❤️', options: ['Stay healthy', 'Become weak', 'Stop growing'], correct: 0 }
        ],
        summary: [
            'Food gives us energy',
            'Food comes from plants and animals',
            'Healthy food helps our body grow strong',
            'Eating balanced meals keeps us healthy'
        ],
        summaryEnd: 'Great job! Eat healthy food and stay strong!',
        nextLesson: { id: 'our-school', title: 'Our School' }
    },
    '2-our-school': {
        title: 'Our School',
        subtitle: 'Learn about school, teachers, classrooms, and school rules.',
        videoSubtitle: 'Watch these fun videos to learn about school life! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/bLJNHOd9M78?si=yxuLI5kWx2dfFDa-', title: 'Life at School', thumb: 'https://img.youtube.com/vi/bLJNHOd9M78/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/d1myYD1cWAw?si=6Utus4qP6gW86hf7', title: 'Classroom Activities', thumb: 'https://img.youtube.com/vi/d1myYD1cWAw/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/2c0lt_mgIcM?si=W38HkTd6mVDQL-Sj', title: 'School Rules', thumb: 'https://img.youtube.com/vi/2c0lt_mgIcM/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What is a school?', visual: '🏫', options: ['A place to learn', 'A market', 'A playground only'], correct: 0 },
            { question: 'Who teaches students in school?', visual: '👩‍🏫', options: ['Teacher', 'Doctor', 'Driver'], correct: 0 },
            { question: 'Who is the head of the school?', visual: '👨‍💼', options: ['Principal', 'Student', 'Farmer'], correct: 0 },
            { question: 'Where do students study in school?', visual: '📚', options: ['Classroom', 'Kitchen', 'Market'], correct: 0 },
            { question: 'Where do students read books?', visual: '📖', options: ['Library', 'Garden', 'Office'], correct: 0 },
            { question: 'Where do students play games?', visual: '⚽', options: ['Playground', 'Classroom', 'Library'], correct: 0 },
            { question: 'Students should:', visual: '🙏', options: ['Respect teachers', 'Fight', 'Ignore rules'], correct: 0 },
            { question: 'Keeping the classroom clean is:', visual: '🧹', options: ['A good habit', 'A bad habit', 'Not important'], correct: 0 },
            { question: 'Which activity happens in school?', visual: '✏️', options: ['Learning lessons', 'Selling food', 'Driving cars'], correct: 0 },
            { question: 'School helps children:', visual: '🎓', options: ['Learn new things', 'Sleep all day', 'Do nothing'], correct: 0 }
        ],
        summary: [
            'A school is a place where children learn',
            'Teachers help students learn new subjects',
            'Schools have different places like classrooms and playgrounds',
            'Following school rules helps everyone learn safely'
        ],
        summaryEnd: 'Great job! Respect your school and enjoy learning!',
        nextLesson: { id: 'our-neighbourhood', title: 'Our Neighbourhood' }
    },
    '2-our-neighbourhood': {
        title: 'Our Neighbourhood',
        subtitle: 'Learn about the places and people around your home.',
        videoSubtitle: 'Watch these fun videos to learn about neighbourhood! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/1vOCIv0MQEc?si=J502V1LnQqLS-ij-', title: 'Neighbourhood Places', thumb: 'https://img.youtube.com/vi/1vOCIv0MQEc/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/iwxkwPA8c68?si=Mtl_VWUyYuPH4zoB', title: 'Community Helpers', thumb: 'https://img.youtube.com/vi/iwxkwPA8c68/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/oc72HNAtDHs?si=JuczqB71yOBaXnXb', title: 'Clean Neighbourhood', thumb: 'https://img.youtube.com/vi/oc72HNAtDHs/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What is a neighbourhood?', visual: '🏠', options: ['Area around our home', 'A market', 'A playground'], correct: 0 },
            { question: 'People living near our house are called:', visual: '👫', options: ['Neighbours', 'Teachers', 'Drivers'], correct: 0 },
            { question: 'Where do we go when we are sick?', visual: '🏥', options: ['Hospital', 'School', 'Market'], correct: 0 },
            { question: 'Where do we buy food?', visual: '🛒', options: ['Market', 'Park', 'Police station'], correct: 0 },
            { question: 'Who treats sick people?', visual: '👨‍⚕️', options: ['Doctor', 'Teacher', 'Driver'], correct: 0 },
            { question: 'Who protects people?', visual: '👮', options: ['Police officer', 'Postman', 'Shopkeeper'], correct: 0 },
            { question: 'Where do children play?', visual: '🏡', options: ['Park', 'Hospital', 'Office'], correct: 0 },
            { question: 'What should we do to keep our neighbourhood clean?', visual: '🗑️', options: ['Throw waste in dustbins', 'Throw waste on roads', 'Ignore cleanliness'], correct: 0 },
            { question: 'Planting trees helps to:', visual: '🌳', options: ['Keep the environment healthy', 'Make the area dirty', 'Stop people'], correct: 0 },
            { question: 'A clean neighbourhood keeps us:', visual: '✨', options: ['Healthy', 'Sick', 'Lazy'], correct: 0 }
        ],
        summary: [
            'A neighbourhood is the area around our home',
            'Important places in the neighbourhood help our daily life',
            'Community helpers serve people in different ways',
            'Keeping the neighbourhood clean keeps everyone healthy'
        ],
        summaryEnd: 'Great job! Help keep your neighbourhood clean and friendly!',
        nextLesson: { id: 'transport', title: 'Transport' }
    },
    '2-transport': {
        title: 'Transport',
        subtitle: 'Learn about different types of transport and how people travel.',
        videoSubtitle: 'Watch these fun videos to learn about transport! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/i7BERtZ_r60?si=YXglPbOVIvokDFwg', title: 'Types of Transport', thumb: 'https://img.youtube.com/vi/i7BERtZ_r60/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/jK6pn9eLYxU?si=7PteQcxuyT1akOv7', title: 'Land Water Air Transport', thumb: 'https://img.youtube.com/vi/jK6pn9eLYxU/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/IgM0smVoPHs?si=f3-1nTJZrx8A9EFa', title: 'Transport Safety', thumb: 'https://img.youtube.com/vi/IgM0smVoPHs/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What is transport?', visual: '🚗', options: ['Moving people or goods from one place to another', 'Playing games', 'Reading books'], correct: 0 },
            { question: 'Which vehicle moves on land?', visual: '🚌', options: ['Car', 'Boat', 'Aeroplane'], correct: 0 },
            { question: 'Which vehicle moves on water?', visual: '🚤', options: ['Boat', 'Bus', 'Train'], correct: 0 },
            { question: 'Which vehicle flies in the sky?', visual: '✈️', options: ['Aeroplane', 'Bus', 'Bicycle'], correct: 0 },
            { question: 'Which is a land transport?', visual: '🚍', options: ['Bus', 'Ship', 'Helicopter'], correct: 0 },
            { question: 'Which is a water transport?', visual: '🚢', options: ['Ship', 'Car', 'Train'], correct: 0 },
            { question: 'Which is an air transport?', visual: '🚁', options: ['Helicopter', 'Boat', 'Bus'], correct: 0 },
            { question: 'Why do we use transport?', visual: '🛣️', options: ['To travel from one place to another', 'To sleep', 'To read'], correct: 0 },
            { question: 'What should we wear in a car for safety?', visual: '🚗', options: ['Seat belt', 'Hat', 'Shoes'], correct: 0 },
            { question: 'Following transport rules keeps us:', visual: '✅', options: ['Safe', 'Slow', 'Tired'], correct: 0 }
        ],
        summary: [
            'Transport helps us move from one place to another',
            'There are three types of transport: land, water, and air',
            'Different vehicles are used for different types of travel',
            'Following transport safety rules keeps us safe'
        ],
        summaryEnd: 'Great job! Travel safely and follow traffic rules!',
        nextLesson: { id: 'clothes-we-wear', title: 'Clothes We Wear' }
    },
    '2-clothes-we-wear': {
        title: 'Clothes We Wear',
        subtitle: 'Learn why we wear clothes and the different types of clothes for different seasons.',
        videoSubtitle: 'Watch these fun videos to learn about clothes! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/k63rNMqtj_8?si=gRgUuZM0fyUnD577', title: 'Why We Wear Clothes', thumb: 'https://img.youtube.com/vi/k63rNMqtj_8/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/QAQH3Ajjsyo?si=77IvodN9FEDPW7vl', title: 'Clothes for Seasons', thumb: 'https://img.youtube.com/vi/QAQH3Ajjsyo/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/GKWPnhflRGA?si=NffaBNfQIk4hSdcX', title: 'Keeping Clothes Clean', thumb: 'https://img.youtube.com/vi/GKWPnhflRGA/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'Why do we wear clothes?', visual: '👕', options: ['To protect our body', 'To play games', 'To read books'], correct: 0 },
            { question: 'Which clothes are worn in summer?', visual: '☀️', options: ['Cotton clothes', 'Sweaters', 'Jackets'], correct: 0 },
            { question: 'Which clothes keep us warm in winter?', visual: '❄️', options: ['Sweaters', 'T-shirts', 'Shorts'], correct: 0 },
            { question: 'What protects us from rain?', visual: '🌧️', options: ['Raincoat', 'Sweater', 'Cap'], correct: 0 },
            { question: 'What do students wear in school?', visual: '🏫', options: ['School uniform', 'Party dress', 'Sports shoes only'], correct: 0 },
            { question: 'Which clothes are worn during sports?', visual: '⚽', options: ['Sports clothes', 'Winter clothes', 'Raincoat'], correct: 0 },
            { question: 'Why should we wear clean clothes?', visual: '✨', options: ['To stay healthy', 'To run faster', 'To sleep better'], correct: 0 },
            { question: 'Which season needs warm clothes?', visual: '🧥', options: ['Winter', 'Summer', 'Rainy'], correct: 0 },
            { question: 'Umbrella is used in:', visual: '☂️', options: ['Rainy season', 'Summer', 'Winter'], correct: 0 },
            { question: 'Clean clothes help us:', visual: '👗', options: ['Stay neat and healthy', 'Become tired', 'Run slower'], correct: 0 }
        ],
        summary: [
            'Clothes protect our body',
            'Different clothes are worn in different seasons',
            'Special clothes are worn for special occasions',
            'Wearing clean clothes keeps us healthy'
        ],
        summaryEnd: 'Great job! Wear clean clothes and stay healthy!',
        nextLesson: { id: 'cleanliness-good-habits', title: 'Cleanliness & Good Habits' }
    },
    '2-cleanliness-good-habits': {
        title: 'Cleanliness & Good Habits',
        subtitle: 'Learn how to stay clean and develop good daily habits.',
        videoSubtitle: 'Watch these fun videos to learn about cleanliness and good habits! Click a video to watch it in full screen.',
        videos: [
            { src: 'https://www.youtube.com/embed/-CIYTf7Oky4?si=9YQepgYpB6jqBHmA', title: 'Personal Hygiene', thumb: 'https://img.youtube.com/vi/-CIYTf7Oky4/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/_7NdBZahngU?si=Aiav1ctjBjuyCeBO', title: 'Healthy Habits for Kids', thumb: 'https://img.youtube.com/vi/_7NdBZahngU/hqdefault.jpg' },
            { src: 'https://www.youtube.com/embed/povZemM9bQU?si=HrWd2DEmn-r5nehX', title: 'Clean Surroundings', thumb: 'https://img.youtube.com/vi/povZemM9bQU/hqdefault.jpg' }
        ],
        quiz: [
            { question: 'What does cleanliness mean?', visual: '✨', options: ['Keeping body and surroundings clean', 'Playing games', 'Sleeping all day'], correct: 0 },
            { question: 'How many times should we brush our teeth daily?', visual: '🪷', options: ['Two times', 'One time', 'Five times'], correct: 0 },
            { question: 'When should we wash our hands?', visual: '👐', options: ['Before eating', 'After sleeping', 'Before playing only'], correct: 0 },
            { question: 'Which habit keeps us healthy?', visual: '🚿', options: ['Taking a bath daily', 'Skipping meals', 'Not washing hands'], correct: 0 },
            { question: 'Where should we throw waste?', visual: '🗑️', options: ['Dustbin', 'Road', 'Garden'], correct: 0 },
            { question: 'What should we do with our nails?', visual: '💅', options: ['Cut them regularly', 'Ignore them', 'Paint them only'], correct: 0 },
            { question: 'Helping parents at home is:', visual: '🏠', options: ['A good habit', 'A bad habit', 'Not important'], correct: 0 },
            { question: 'Respecting elders is:', visual: '🙏', options: ['A good habit', 'A bad habit', 'Not needed'], correct: 0 },
            { question: 'Planting trees helps to:', visual: '🌳', options: ['Keep the environment clean', 'Make the place dirty', 'Stop people'], correct: 0 },
            { question: 'Clean surroundings help us stay:', visual: '🌟', options: ['Healthy', 'Lazy', 'Tired'], correct: 0 }
        ],
        summary: [
            'Cleanliness keeps us healthy',
            'Personal hygiene protects us from germs',
            'Good habits make us responsible people',
            'Keeping surroundings clean helps everyone'
        ],
        summaryEnd: 'Great job! Practice cleanliness and good habits every day!',
        nextLesson: null
    }
};


const LessonPage = () => {
    const { classId, subjectId, chapterId } = useParams();
    const navigate = useNavigate();

    // Quiz state
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Active section tracking for sidebar
    const [activeSection, setActiveSection] = useState('lesson-content');

    useEffect(() => {
        const sectionIds = ['lesson-content', 'videos', 'quiz'];
        const observers = [];

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach(o => o.disconnect());
    }, []);

    const handleAnswer = (qIndex, oIndex) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
    };

    const handleSubmitQuiz = () => {
        setShowResults(true);
    };

    const score = Object.keys(answers).reduce((acc, key) => {
        const lesson = lessonData[`${classId}-${chapterId}`] || lessonData[chapterId];
        if (!lesson) return 0;
        return acc + (answers[key] === lesson.quiz[key].correct ? 1 : 0);
    }, 0);

    const currentLesson = lessonData[`${classId}-${chapterId}`] || lessonData[chapterId];

    if (!currentLesson) {
        // Fallback for other chapters
        return (
            <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: '68px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
                    <button
                        onClick={() => navigate(`/learning/class/${classId}/subject/${subjectId}`)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
                            padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#475569',
                            cursor: 'pointer', marginBottom: '32px',
                        }}
                    >
                        <ArrowLeft size={16} /> Back to Chapters
                    </button>
                    <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '48px 32px', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                            {chapterId?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </h1>
                        <p style={{ fontSize: '16px', color: '#64748B' }}>
                            Lesson content for this chapter is coming soon!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F8FAFC',
            paddingTop: '68px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Back Button — above the flex row */}
            <div style={{ maxWidth: '1160px', width: '100%', margin: '0 auto', padding: '24px 24px 0' }}>
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(`/learning/class/${classId}/subject/${subjectId}`)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
                        padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#475569',
                        cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
                >
                    <ArrowLeft size={16} />
                    Back to {subjectId ? subjectId.charAt(0).toUpperCase() + subjectId.slice(1) : ''} Skills
                </motion.button>
            </div>

            {/* Flex row: Sidebar + Main Content */}
            <div style={{
                flex: 1,
                maxWidth: '1160px',
                width: '100%',
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                gap: '32px',
                alignItems: 'flex-start',
            }}>
                {/* ─── STICKY SIDEBAR ─── */}
                <motion.nav
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: 'sticky',
                        top: '100px',
                        width: '220px',
                        minWidth: '220px',
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        padding: '20px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    }}
                >
                    <div style={{
                        fontSize: '11px', fontWeight: 700, color: '#94A3B8',
                        textTransform: 'uppercase', letterSpacing: '1.5px',
                        padding: '0 12px 10px', borderBottom: '1px solid #F1F5F9',
                        marginBottom: '6px',
                    }}>
                        Navigation
                    </div>
                    {sidebarItems.map((item) => {
                        const isActive = activeSection === item.id;
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 14px', borderRadius: '12px',
                                    fontSize: '14px', fontWeight: isActive ? 700 : 500,
                                    color: isActive ? '#2563EB' : '#64748B',
                                    background: isActive ? '#EFF6FF' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = '#F8FAFC';
                                        e.currentTarget.style.color = '#334155';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#64748B';
                                    }
                                }}
                            >
                                <Icon size={16} />
                                {item.label}
                            </a>
                        );
                    })}
                </motion.nav>

                {/* ─── MAIN CONTENT ─── */}
                <div style={{ flex: 1, minWidth: 0, paddingBottom: '24px' }}>

                    {/* ──────────── 1. HEADER ──────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            textAlign: 'center',
                            marginBottom: '40px',
                        }}
                    >
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: '#FEF3C7', color: '#B45309', fontSize: '13px', fontWeight: 700,
                            letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 20px',
                            borderRadius: '50px', marginBottom: '18px',
                        }}>
                            📐 Class {classId} • {subjectId ? subjectId.charAt(0).toUpperCase() + subjectId.slice(1) : 'Maths'}
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(28px, 5vw, 42px)',
                            fontWeight: 800, color: '#0F172A', margin: '0 0 14px',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>
                            {currentLesson.title}
                        </h1>
                        <p style={{
                            fontSize: '17px', color: '#64748B', maxWidth: '560px',
                            margin: '0 auto', lineHeight: 1.7,
                        }}>
                            {currentLesson.subtitle}
                        </p>
                    </motion.div>

                    {/* ──────────── LESSON CONTENT SECTION ──────────── */}
                    <div id="lesson-content" style={{ scrollMarginTop: '100px' }} />

                    {/* ──────────── LESSON CONTENT MODULES ──────────── */}
                    {chapterId === 'counting-numbers' && (
                        <>
                            {/* ──────────── 2. EXPLANATION ──────────── */}
                            <Section>
                                <SectionTitle emoji="📖">What Are Numbers?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Numbers help us <strong>count objects</strong>. We use numbers to know <strong>how many things</strong> are there.
                                </p>
                                <div style={{
                                    background: '#FFF7ED', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #FB923C',
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#9A3412', margin: '0 0 10px' }}>Example:</p>
                                    <div style={{ fontSize: '20px', lineHeight: 2 }}>
                                        <div>🍎 = <strong>1</strong> apple</div>
                                        <div>🍎 🍎 = <strong>2</strong> apples</div>
                                        <div>🍎 🍎 🍎 = <strong>3</strong> apples</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── 3. NUMBERS LIST ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔢">Numbers from 1 to 10</SectionTitle>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: '14px',
                                }}>
                                    {numbersData.map(({ num, word, color }) => (
                                        <motion.div
                                            key={num}
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            style={{
                                                background: `${color}10`,
                                                border: `2px solid ${color}30`,
                                                borderRadius: '16px',
                                                padding: '18px 12px',
                                                textAlign: 'center',
                                                cursor: 'default',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <div style={{
                                                fontSize: '36px', fontWeight: 800, color: color,
                                                fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1,
                                            }}>
                                                {num}
                                            </div>
                                            <div style={{
                                                fontSize: '13px', fontWeight: 600, color: '#64748B',
                                                marginTop: '6px',
                                            }}>
                                                {word}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── 4. VISUAL EXAMPLE ──────────── */}
                            <Section>
                                <SectionTitle emoji="🍎">Counting Example</SectionTitle>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {appleExamples.map(({ count, text }) => (
                                        <div key={count} style={{
                                            display: 'flex', alignItems: 'center', gap: '16px',
                                            background: '#FEF2F2', borderRadius: '12px', padding: '14px 20px',
                                        }}>
                                            <span style={{ fontSize: '28px', letterSpacing: '4px' }}>
                                                {'🍎 '.repeat(count).trim()}
                                            </span>
                                            <span style={{
                                                fontSize: '16px', fontWeight: 600, color: '#991B1B',
                                            }}>
                                                = {text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{
                                    marginTop: '16px', background: '#ECFDF5', borderRadius: '12px',
                                    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px',
                                }}>
                                    <span style={{ fontSize: '20px' }}>💡</span>
                                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#065F46' }}>
                                        There are 5 apples! Can you count them?
                                    </span>
                                </div>
                            </Section>

                            {/* ──────────── 5. PRACTICE ──────────── */}
                            <Section style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                                <SectionTitle emoji="✏️">Let's Practice Counting</SectionTitle>
                                <div style={{
                                    background: '#FFFFFF', borderRadius: '16px', padding: '28px 24px',
                                    textAlign: 'center', border: '1px solid #FDE68A',
                                }}>
                                    <div style={{ fontSize: '48px', letterSpacing: '12px', marginBottom: '16px' }}>
                                        ⭐ ⭐ ⭐ ⭐
                                    </div>
                                    <p style={{ fontSize: '18px', fontWeight: 600, color: '#92400E', marginBottom: '12px' }}>
                                        How many stars are there?
                                    </p>
                                    <div style={{
                                        display: 'inline-block', background: '#D1FAE5', borderRadius: '12px',
                                        padding: '12px 24px',
                                    }}>
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#065F46' }}>
                                            ✅ Answer: There are <strong>4</strong> stars!
                                        </span>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'counting-objects' && (
                        <>
                            {/* ──────────── WHAT IS COUNTING ──────────── */}
                            <Section>
                                <SectionTitle emoji="🤔">What is Counting?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Counting means finding <strong>how many objects</strong> are there.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    We count things around us every day such as apples, toys, stars, and books. Explanation below shows how counting helps us know the exact number of objects.
                                </p>
                                <div style={{
                                    background: '#F8FAFC', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #3B82F6',
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#1E40AF', margin: '0 0 10px' }}>Example:</p>
                                    <div style={{ fontSize: '20px', lineHeight: 2 }}>
                                        <div>🍎 = <strong>1</strong> apple</div>
                                        <div>🍎 🍎 = <strong>2</strong> apples</div>
                                        <div>🍎 🍎 🍎 = <strong>3</strong> apples</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── OBJECT COUNTING EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Let's Count Objects</SectionTitle>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FEF2F2', borderRadius: '12px', padding: '16px 24px',
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B', marginBottom: '8px' }}>Example 1</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '6px' }}>🍎 🍎 🍎 🍎</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#7F1D1D' }}>There are 4 apples.</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FFFBEB', borderRadius: '12px', padding: '16px 24px',
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '8px' }}>Example 2</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '6px' }}>⭐ ⭐ ⭐</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#78350F' }}>There are 3 stars.</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#EFF6FF', borderRadius: '12px', padding: '16px 24px',
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>Example 3</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '6px' }}>🚗 🚗 🚗 🚗 🚗</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1E3A8A' }}>There are 5 cars.</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                                <SectionTitle emoji="✋">Practice Counting</SectionTitle>
                                <div style={{
                                    background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                    textAlign: 'center', border: '1px solid #BBF7D0',
                                }}>
                                    <div style={{ fontSize: '48px', letterSpacing: '12px', marginBottom: '16px' }}>
                                        🐶 🐶 🐶 🐶
                                    </div>
                                    <p style={{ fontSize: '20px', fontWeight: 600, color: '#166534', marginBottom: '16px' }}>
                                        How many dogs are there?
                                    </p>
                                    <div style={{
                                        display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                        padding: '14px 28px',
                                    }}>
                                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                            ✅ Answer: There are <strong>4</strong> dogs.
                                        </span>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'addition' && (
                        <>
                            {/* ──────────── WHAT IS ADDITION ──────────── */}
                            <Section>
                                <SectionTitle emoji="➕">What is Addition?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Addition</strong> means putting numbers together to find the total.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    When we add numbers, the result becomes bigger. Addition helps us count things when we combine them.
                                </p>
                                <div style={{
                                    background: '#F0FDF4', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #22C55E', textAlign: 'center'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#166534', margin: '0 0 10px' }}>Example:</p>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#14532D', letterSpacing: '4px' }}>
                                        2 + 1 = 3
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── ADDITION EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Addition Examples</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Adding objects together increases the total count. Let's see how!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FEF2F2', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B', marginBottom: '8px' }}>Example 1</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>🍎 🍎 + 🍎</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#7F1D1D' }}>2 apples + 1 apple = 3 apples</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FFFBEB', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '8px' }}>Example 2</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>⭐ ⭐ ⭐ + ⭐</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#78350F' }}>3 stars + 1 star = 4 stars</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#EFF6FF', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>Example 3</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>🚗 🚗 + 🚗 🚗</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1E3A8A' }}>2 cars + 2 cars = 4 cars</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="✏️">Let's Practice Addition</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '48px', letterSpacing: '12px', marginBottom: '16px' }}>
                                            🍎 🍎 + 🍎
                                        </div>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            How many apples are there in total?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>3</strong> apples
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '48px', letterSpacing: '12px', marginBottom: '16px' }}>
                                            ⭐ ⭐ + ⭐ ⭐
                                        </div>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            How many stars are there in total?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>4</strong> stars
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'subtraction' && (
                        <>
                            {/* ──────────── WHAT IS SUBTRACTION ──────────── */}
                            <Section>
                                <SectionTitle emoji="➖">What is Subtraction?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Subtraction</strong> means taking away some objects from a group.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    When we subtract numbers, the total becomes smaller. Subtraction helps us know how many objects remain after taking some away.
                                </p>
                                <div style={{
                                    background: '#FEF2F2', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #EF4444', textAlign: 'center'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#991B1B', margin: '0 0 10px' }}>Example:</p>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#7F1D1D', letterSpacing: '4px' }}>
                                        5 − 2 = 3
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── SUBTRACTION EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Subtraction Examples</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Subtraction helps us find how many objects are left. Let's see some examples!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FEF2F2', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B', marginBottom: '8px' }}>Example 1</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>
                                                <span>🍎 🍎 🍎</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#EF4444', textDecorationThickness: '3px' }}>🍎 🍎</span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#7F1D1D', margin: '8px 0 0' }}>Take away 2 apples. Remaining: 🍎 🍎 🍎</p>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#7F1D1D' }}>5 apples − 2 apples = 3 apples</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#FFFBEB', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '8px' }}>Example 2</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>
                                                <span>⭐ ⭐ ⭐</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#F59E0B', textDecorationThickness: '3px' }}>⭐</span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#78350F', margin: '8px 0 0' }}>Take away 1 star. Remaining: ⭐ ⭐ ⭐</p>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#78350F' }}>4 stars − 1 star = 3 stars</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#EFF6FF', borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: '1 1 auto' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>Example 3</p>
                                            <div style={{ fontSize: '32px', letterSpacing: '4px' }}>
                                                <span>🚗 🚗</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#3B82F6', textDecorationThickness: '3px' }}>🚗</span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#1E3A8A', margin: '8px 0 0' }}>Take away 1 car. Remaining: 🚗 🚗</p>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1E3A8A' }}>3 cars − 1 car = 2 cars</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="✏️">Let's Practice Subtraction</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '48px', letterSpacing: '8px', marginBottom: '16px' }}>
                                            <span>🍎 🍎 🍎</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#EF4444', textDecorationThickness: '4px' }}>🍎</span>
                                        </div>
                                        <p style={{ fontSize: '16px', color: '#475569', marginBottom: '8px' }}>Take away 1 apple.</p>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            How many apples remain?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>3</strong> apples
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '48px', letterSpacing: '8px', marginBottom: '16px' }}>
                                            <span>⭐ ⭐ ⭐</span> <span style={{ textDecoration: 'line-through', textDecorationColor: '#F59E0B', textDecorationThickness: '4px' }}>⭐ ⭐</span>
                                        </div>
                                        <p style={{ fontSize: '16px', color: '#475569', marginBottom: '8px' }}>Take away 2 stars.</p>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            How many stars remain?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>3</strong> stars
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'shapes' && (
                        <>
                            {/* ──────────── WHAT ARE SHAPES ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔵">What Are Shapes?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Shapes</strong> are the forms of objects we see around us.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Everything around us has a shape. For example, a ball is round, a book is rectangular, and a slice of pizza can look like a triangle. Learning shapes helps us understand the objects around us.
                                </p>
                            </Section>

                            {/* ──────────── COMMON SHAPES ──────────── */}
                            <Section>
                                <SectionTitle emoji="✨">Common Shapes</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                    {/* Circle */}
                                    <div style={{
                                        background: '#EFF6FF', borderRadius: '16px', padding: '24px',
                                        border: '1px solid #BFDBFE', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔵</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1E3A8A', margin: '0 0 8px' }}>Circle</h3>
                                        <p style={{ fontSize: '15px', color: '#1E40AF', margin: 0 }}>Circle looks round like a ball. It has no straight sides.</p>
                                    </div>

                                    {/* Square */}
                                    <div style={{
                                        background: '#FEF2F2', borderRadius: '16px', padding: '24px',
                                        border: '1px solid #FECACA', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🟥</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#991B1B', margin: '0 0 8px' }}>Square</h3>
                                        <p style={{ fontSize: '15px', color: '#B91C1C', margin: 0 }}>Square has four equal sides and four corners.</p>
                                    </div>

                                    {/* Triangle */}
                                    <div style={{
                                        background: '#FFFBEB', borderRadius: '16px', padding: '24px',
                                        border: '1px solid #FDE68A', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔺</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#92400E', margin: '0 0 8px' }}>Triangle</h3>
                                        <p style={{ fontSize: '15px', color: '#B45309', margin: 0 }}>Triangle has three sides and three corners.</p>
                                    </div>

                                    {/* Rectangle */}
                                    <div style={{
                                        background: '#F0FDFA', borderRadius: '16px', padding: '24px',
                                        border: '1px solid #A7F3D0', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>▭</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#065F46', margin: '0 0 8px' }}>Rectangle</h3>
                                        <p style={{ fontSize: '15px', color: '#047857', margin: 0 }}>Rectangle has four sides, with opposite sides being equal.</p>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── SHAPES IN REAL LIFE ──────────── */}
                            <Section>
                                <SectionTitle emoji="🌍">Shapes in Real Life</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Many objects around us have these shapes. Let's see some examples!
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#F8FAFC', borderRadius: '12px', padding: '16px 24px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ fontSize: '40px' }}>⚽</div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>Ball → Circle</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#F8FAFC', borderRadius: '12px', padding: '16px 24px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ fontSize: '40px' }}>📺</div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>TV → Rectangle</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#F8FAFC', borderRadius: '12px', padding: '16px 24px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ fontSize: '40px' }}>🪟</div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>Window → Square</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                        background: '#F8FAFC', borderRadius: '12px', padding: '16px 24px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ fontSize: '40px' }}>🍕</div>
                                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>Pizza → Triangle</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="✏️">Let's Practice Identifying Shapes</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔵</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>What shape is this?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>Circle</strong></span>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔺</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>What shape is this?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>Triangle</strong></span>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>▭</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>What shape is this?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>Rectangle</strong></span>
                                        </div>
                                    </div>

                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'alphabets' && (
                        <>
                            {/* ──────────── WHAT ARE ALPHABETS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔤">What Are Alphabets?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Alphabets</strong> are the letters used to read and write English.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    The English alphabet has <strong>26 letters</strong>. These letters help us form words and sentences. Learning alphabets is the first step to learning English!
                                </p>
                                <div style={{
                                    background: '#EFF6FF', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #3B82F6', textAlign: 'left'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#1E40AF', margin: '0 0 10px' }}>For example:</p>
                                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#1E3A8A', letterSpacing: '1px', lineHeight: 1.8 }}>
                                        <div>A → Apple</div>
                                        <div>B → Ball</div>
                                        <div>C → Cat</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── ALPHABET LIST ──────────── */}
                            <Section>
                                <SectionTitle emoji="✨">English Alphabet (A–Z)</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Here are all the letters from A to Z!
                                </p>
                                <div style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px'
                                }}>
                                    {alphabetsData.map(({ letter, word, emoji, color }) => (
                                        <motion.div
                                            key={letter}
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            style={{
                                                background: `${color}10`,
                                                border: `2px solid ${color}30`,
                                                borderRadius: '16px',
                                                padding: '16px 12px',
                                                textAlign: 'center',
                                                cursor: 'default',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <div style={{
                                                fontSize: '36px', fontWeight: 800, color: color,
                                                fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1,
                                                marginBottom: '8px'
                                            }}>
                                                {letter}
                                            </div>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                                                {emoji}
                                            </div>
                                            <div style={{
                                                fontSize: '14px', fontWeight: 600, color: '#334155',
                                            }}>
                                                {word}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── ALPHABETS EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Let's Look at Some Examples</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Each letter can represent many words. Let's start with a few!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {alphabetExamples.map((item, i) => (
                                        <div key={item.letter} style={{
                                            display: 'flex', alignItems: 'center', gap: '20px',
                                            background: i === 0 ? '#FEF2F2' : i === 1 ? '#EFF6FF' : '#FFFBEB',
                                            borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                        }}>
                                            <div style={{ flex: '1 1 auto' }}>
                                                <p style={{ fontSize: '14px', fontWeight: 700, color: i === 0 ? '#991B1B' : i === 1 ? '#1E40AF' : '#92400E', marginBottom: '8px' }}>Example {i + 1}</p>
                                                <div style={{ fontSize: '32px', fontWeight: 800, color: i === 0 ? '#EF4444' : i === 1 ? '#3B82F6' : '#F59E0B' }}>
                                                    {item.letter} → {item.word} {item.emoji}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="✏️">Practice Recognizing Letters</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                                            🍎
                                        </div>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            Apple starts with which letter?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>A</strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px',
                                        textAlign: 'center', border: '1px solid #E2E8F0',
                                    }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                                            🐱
                                        </div>
                                        <p style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                                            Cat starts with which letter?
                                        </p>
                                        <div style={{
                                            display: 'inline-block', background: '#DCFCE7', borderRadius: '12px',
                                            padding: '14px 28px',
                                        }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#14532D' }}>
                                                ✅ Answer: <strong>C</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'phonics' && (
                        <>
                            {/* ──────────── WHAT IS PHONICS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔊">What is Phonics?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Phonics</strong> helps us learn the sounds of letters.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Each letter makes a sound. These sounds help us read words. Learning phonics helps children read and pronounce words correctly.
                                </p>
                                <div style={{
                                    background: '#F3E5F5', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #AB47BC', textAlign: 'left'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#6A1B9A', margin: '0 0 10px' }}>For example:</p>
                                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#4A148C', letterSpacing: '1px', lineHeight: 1.8 }}>
                                        <div>A → /a/ sound → Apple</div>
                                        <div>B → /b/ sound → Ball</div>
                                        <div>C → /k/ sound → Cat</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PHONICS EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Letter Sounds Examples</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Each letter has a sound that helps form words. Let's practice some!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {phonicsExamples.map((item, i) => {
                                        const bgColors = ['#FEF2F2', '#EFF6FF', '#FFFBEB', '#ECFDF5', '#F5F3FF'];
                                        const textColors = ['#991B1B', '#1E40AF', '#92400E', '#065F46', '#5B21B6'];
                                        const heavyColors = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'];

                                        return (
                                            <div key={item.letter} style={{
                                                display: 'flex', alignItems: 'center', gap: '20px',
                                                background: bgColors[i % bgColors.length],
                                                borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                            }}>
                                                <div style={{ flex: '1 1 auto' }}>
                                                    <p style={{ fontSize: '14px', fontWeight: 700, color: textColors[i % textColors.length], marginBottom: '8px' }}>Example {i + 1}</p>
                                                    <div style={{ fontSize: '32px', fontWeight: 800, color: heavyColors[i % heavyColors.length] }}>
                                                        {item.letter} → {item.word} {item.emoji}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="✏️">Let's Practice Phonics</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚽</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Which sound does the word "Ball" start with?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>B</strong></span>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐱</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Which sound does the word "Cat" start with?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>C</strong></span>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍎</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>Which sound does the word "Apple" start with?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>A</strong></span>
                                        </div>
                                    </div>

                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'simple-words' && (
                        <>
                            {/* ──────────── WHAT ARE SIMPLE WORDS ──────────── */}
                            <Section>
                                <SectionTitle emoji="📖">What Are Simple Words?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Simple words</strong> are short words that are easy to read and pronounce.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Most beginner words contain three or four letters. Learning simple words helps children begin reading English.
                                </p>
                                <div style={{
                                    background: '#FFF7ED', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #F97316', textAlign: 'left',
                                    display: 'flex', gap: '30px', flexWrap: 'wrap'
                                }}>
                                    <div style={{ flex: '1 1 auto' }}>
                                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#C2410C', margin: '0 0 10px' }}>Example words:</p>
                                        <div style={{
                                            fontSize: '20px', fontWeight: 600, color: '#9A3412',
                                            letterSpacing: '1px', lineHeight: 1.8,
                                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px'
                                        }}>
                                            <div>Cat</div>
                                            <div>Dog</div>
                                            <div>Sun</div>
                                            <div>Hat</div>
                                            <div>Cup</div>
                                            <div>Pen</div>
                                            <div>Bat</div>
                                            <div>Car</div>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── SIMPLE WORDS EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Examples of Simple Words</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Explain that these small words are the building blocks of reading. Here are some examples:
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {simpleWordsExamples.map((item, i) => {
                                        const bgColors = ['#FEF2F2', '#EFF6FF', '#FFFBEB', '#ECFDF5', '#F5F3FF'];
                                        const textColors = ['#991B1B', '#1E40AF', '#92400E', '#065F46', '#5B21B6'];
                                        const heavyColors = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'];

                                        return (
                                            <div key={item.word} style={{
                                                display: 'flex', alignItems: 'center', gap: '20px',
                                                background: bgColors[i % bgColors.length],
                                                borderRadius: '12px', padding: '16px 24px', flexWrap: 'wrap'
                                            }}>
                                                <div style={{ flex: '1 1 auto' }}>
                                                    <p style={{ fontSize: '14px', fontWeight: 700, color: textColors[i % textColors.length], marginBottom: '8px' }}>Example {i + 1}</p>
                                                    <div style={{ fontSize: '32px', fontWeight: 800, color: heavyColors[i % heavyColors.length] }}>
                                                        {item.word} {item.emoji}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="✏️">Let's Practice Reading Words</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐱</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>What word is this?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>Cat</strong></span>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>☀️</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>What word is this?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>Sun</strong></span>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐶</div>
                                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>What word is this?</p>
                                        <div style={{ display: 'inline-block', background: '#DCFCE7', borderRadius: '12px', padding: '10px 24px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>✅ Answer: <strong>Dog</strong></span>
                                        </div>
                                    </div>

                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'rhymes' && (
                        <>
                            {/* ──────────── WHAT ARE RHYMES ──────────── */}
                            <Section>
                                <SectionTitle emoji="🎶">What Are Rhymes?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Rhymes</strong> are short poems or songs that have repeating sounds.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    They are fun to listen to and easy to remember! Rhymes help children learn new words, improve pronunciation, and develop listening skills.
                                </p>

                                {/* Twinkle Twinkle Example */}
                                <div style={{
                                    background: '#F0FDF4', borderRadius: '16px', padding: '24px',
                                    marginTop: '24px', border: '1px solid #BBF7D0'
                                }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#166534', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>🌟</span> Example Rhyme: Twinkle Twinkle Little Star
                                    </h3>
                                    <p style={{
                                        fontSize: '18px', color: '#15803D', lineHeight: 1.8,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontWeight: 600,
                                        background: '#DCFCE7', padding: '16px', borderRadius: '12px', textAlign: 'center'
                                    }}>
                                        Twinkle twinkle little star<br />
                                        How I wonder what you are<br />
                                        Up above the world so high<br />
                                        Like a diamond in the sky
                                    </p>
                                    <p style={{ fontSize: '15px', color: '#166534', margin: '16px 0 0', textAlign: 'center' }}>
                                        <em>💡 Can you sing this rhyme like a song?</em>
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── SHORT STORY ──────────── */}
                            <Section>
                                <SectionTitle emoji="📖">Short Story – The Happy Cat</SectionTitle>
                                <div style={{
                                    background: '#FFFBEB', borderRadius: '16px', padding: '32px 24px',
                                    border: '1px solid #FDE68A', display: 'flex', flexDirection: 'column', gap: '20px'
                                }}>
                                    <p style={{ fontSize: '18px', color: '#92400E', lineHeight: 1.8, fontWeight: 500 }}>
                                        Once there was a small cat. 🐱<br />
                                        The cat loved to play in the garden. 🏡
                                    </p>
                                    <p style={{ fontSize: '18px', color: '#92400E', lineHeight: 1.8, fontWeight: 500 }}>
                                        One day the cat saw a butterfly. 🦋<br />
                                        The cat ran after the butterfly happily.
                                    </p>
                                    <p style={{ fontSize: '18px', color: '#92400E', lineHeight: 1.8, fontWeight: 500 }}>
                                        The butterfly flew away, and the cat sat under a tree. 🌳<br />
                                        The cat looked at the bright sun and felt very happy. ☀️
                                    </p>

                                    <div style={{
                                        background: '#FEF3C7', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #F59E0B'
                                    }}>
                                        <p style={{ fontSize: '16px', fontWeight: 700, color: '#B45309', margin: 0 }}>
                                            💡 Lesson: Playing outside and enjoying nature can make us happy.
                                        </p>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── ANOTHER RHYME EXAMPLE ──────────── */}
                            <Section>
                                <SectionTitle emoji="🐑">Another Rhyme Example</SectionTitle>
                                <div style={{
                                    background: '#EFF6FF', borderRadius: '16px', padding: '24px',
                                    border: '1px solid #BFDBFE'
                                }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E40AF', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>🎶</span> Baa Baa Black Sheep
                                    </h3>
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
                                        background: '#DBEAFE', padding: '20px', borderRadius: '12px'
                                    }}>
                                        <p style={{ fontSize: '16px', color: '#1E3A8A', lineHeight: 1.8, fontWeight: 600, margin: 0, textAlign: 'center' }}>
                                            Baa baa black sheep<br />
                                            Have you any wool?<br />
                                            Yes sir, yes sir<br />
                                            Three bags full.
                                        </p>
                                        <p style={{ fontSize: '16px', color: '#1E3A8A', lineHeight: 1.8, fontWeight: 600, margin: 0, textAlign: 'center' }}>
                                            One for the master<br />
                                            One for the dame<br />
                                            And one for the little boy<br />
                                            Who lives down the lane.
                                        </p>
                                    </div>
                                    <p style={{ fontSize: '15px', color: '#1E40AF', margin: '16px 0 0', textAlign: 'center' }}>
                                        <em>💡 Notice how rhyming words like "wool" and "full" help us remember the song!</em>
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── READING PRACTICE ──────────── */}
                            <Section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <SectionTitle emoji="🗣️">Let's Read Together</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Try reading these sentences aloud!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ fontSize: '48px' }}>🐱</div>
                                        <div>
                                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', margin: '0 0 4px' }}>Sentence 1</p>
                                            <p style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', margin: 0 }}>The cat is small.</p>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ fontSize: '48px' }}>☀️</div>
                                        <div>
                                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', margin: '0 0 4px' }}>Sentence 2</p>
                                            <p style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', margin: 0 }}>The sun is bright.</p>
                                        </div>
                                    </div>

                                    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ fontSize: '48px' }}>⚽</div>
                                        <div>
                                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', margin: '0 0 4px' }}>Sentence 3</p>
                                            <p style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', margin: 0 }}>The boy plays with a ball.</p>
                                        </div>
                                    </div>

                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'my-body' && (
                        <>
                            {/* ──────────── WHAT IS OUR BODY ──────────── */}
                            <Section>
                                <SectionTitle emoji="🧍">What Is Our Body?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Our body helps us move, see, hear, speak, and play.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    We use different parts of our body every day to do many activities.
                                </p>
                                <div style={{
                                    background: '#F0FDF4', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #22C55E'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#166534', margin: '0 0 10px' }}>For example:</p>
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#15803D', fontSize: '16px', lineHeight: 1.8, fontWeight: 500 }}>
                                        <li><strong>Eyes</strong> help us see</li>
                                        <li><strong>Ears</strong> help us hear</li>
                                        <li><strong>Hands</strong> help us hold things</li>
                                        <li><strong>Legs</strong> help us walk and run</li>
                                    </ul>
                                </div>
                            </Section>

                            {/* ──────────── IMPORTANT BODY PARTS ──────────── */}
                            <Section>
                                <SectionTitle emoji="👀">Important Body Parts</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                    {[
                                        { name: 'Head', emoji: '👦' },
                                        { name: 'Eyes', emoji: '👀' },
                                        { name: 'Ears', emoji: '👂' },
                                        { name: 'Nose', emoji: '👃' },
                                        { name: 'Mouth', emoji: '👄' },
                                        { name: 'Hands', emoji: '✋' },
                                        { name: 'Legs', emoji: '🦵' }
                                    ].map(part => (
                                        <div key={part.name} style={{
                                            background: '#F8FAFC', borderRadius: '12px', padding: '20px',
                                            textAlign: 'center', border: '1px solid #E2E8F0',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                                        }}>
                                            <span style={{ fontSize: '32px' }}>{part.emoji}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#334155' }}>{part.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#EFF6FF', borderRadius: '14px', padding: '20px', border: '1px solid #BFDBFE' }}>
                                    <p style={{ fontSize: '16px', color: '#1E40AF', margin: '0 0 12px', fontWeight: 600 }}>How they help us:</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '15px', color: '#1E3A8A' }}>
                                        <div><strong>Eyes</strong> → help us see</div>
                                        <div><strong>Ears</strong> → help us hear</div>
                                        <div><strong>Nose</strong> → helps us smell</div>
                                        <div><strong>Mouth</strong> → helps us speak and eat</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── OUR FIVE SENSES ──────────── */}
                            <Section>
                                <SectionTitle emoji="🖐️">Our Five Senses</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Explain how our senses help us understand the world. We have five main senses:
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ background: '#FEF2F2', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #EF4444' }}>
                                        <strong style={{ color: '#991B1B', fontSize: '16px' }}>Sight</strong>
                                        <p style={{ margin: '4px 0 0', color: '#B91C1C', fontSize: '15px' }}>We see with our eyes. 👀</p>
                                    </div>
                                    <div style={{ background: '#FFFBEB', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #F59E0B' }}>
                                        <strong style={{ color: '#92400E', fontSize: '16px' }}>Hearing</strong>
                                        <p style={{ margin: '4px 0 0', color: '#B45309', fontSize: '15px' }}>We hear with our ears. 👂</p>
                                    </div>
                                    <div style={{ background: '#F0FDF4', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #10B981' }}>
                                        <strong style={{ color: '#065F46', fontSize: '16px' }}>Smell</strong>
                                        <p style={{ margin: '4px 0 0', color: '#047857', fontSize: '15px' }}>We smell with our nose. 👃</p>
                                    </div>
                                    <div style={{ background: '#EFF6FF', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
                                        <strong style={{ color: '#1E40AF', fontSize: '16px' }}>Taste</strong>
                                        <p style={{ margin: '4px 0 0', color: '#1D4ED8', fontSize: '15px' }}>We taste with our tongue. 👅</p>
                                    </div>
                                    <div style={{ background: '#F5F3FF', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #8B5CF6' }}>
                                        <strong style={{ color: '#5B21B6', fontSize: '16px' }}>Touch</strong>
                                        <p style={{ margin: '4px 0 0', color: '#6D28D9', fontSize: '15px' }}>We feel with our skin. ✋</p>
                                    </div>
                                </div>

                                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 16px' }}>Examples in real life:</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', color: '#0F172A', fontWeight: 500 }}>
                                            <span style={{ fontSize: '24px' }}>🍎</span> Apple → we taste it
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', color: '#0F172A', fontWeight: 500 }}>
                                            <span style={{ fontSize: '24px' }}>🌸</span> Flower → we smell it
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', color: '#0F172A', fontWeight: 500 }}>
                                            <span style={{ fontSize: '24px' }}>🔔</span> Bell → we hear it
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── HEALTHY HABITS ──────────── */}
                            <Section>
                                <SectionTitle emoji="💪">Taking Care of Our Body</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    We must take care of our body to stay healthy. These habits help us stay strong and healthy!
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                    {[
                                        { text: 'Brushing our teeth daily', emoji: '🪥' },
                                        { text: 'Eating healthy food', emoji: '🥗' },
                                        { text: 'Taking a bath every day', emoji: '🛁' },
                                        { text: 'Washing hands before eating', emoji: '🧼' },
                                        { text: 'Exercising and playing outside', emoji: '🏃‍♂️' }
                                    ].map((habit, idx) => (
                                        <div key={idx} style={{
                                            background: '#FFFFFF', borderRadius: '16px', padding: '20px',
                                            border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                        }}>
                                            <div style={{ fontSize: '32px', background: '#F1F5F9', padding: '12px', borderRadius: '12px' }}>{habit.emoji}</div>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>{habit.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'plants' && (
                        <>
                            {/* ──────────── WHAT ARE PLANTS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🌱">What Are Plants?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Plants are living things that grow in soil and need water and sunlight to live.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Plants are very important because they give us oxygen, food, and shade.
                                </p>
                                <div style={{
                                    background: '#F0FDF4', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #22C55E'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#166534', margin: '0 0 10px' }}>Examples of plants include:</p>
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#15803D', fontSize: '16px', lineHeight: 1.8, fontWeight: 500 }}>
                                        <li>Trees</li>
                                        <li>Flowers</li>
                                        <li>Grass</li>
                                        <li>Vegetables</li>
                                    </ul>
                                </div>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '16px 0 0' }}>
                                    Plants are found everywhere around us!
                                </p>
                            </Section>

                            {/* ──────────── TYPES OF PLANTS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🌲">Types of Plants</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Plants come in different shapes and sizes. Here are some types of plants:
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                    {[
                                        { name: 'Trees', desc: 'Big plants like mango tree, neem tree', emoji: '🌳', color: '#15803D', bg: '#F0FDF4', border: '#22C55E' },
                                        { name: 'Shrubs', desc: 'Small bushy plants like rose plant', emoji: '🪴', color: '#B45309', bg: '#FFFBEB', border: '#F59E0B' },
                                        { name: 'Herbs', desc: 'Small plants like mint and coriander', emoji: '🌿', color: '#4D7C0F', bg: '#ECFCCB', border: '#84CC16' },
                                        { name: 'Climbers', desc: 'Plants that climb like money plant', emoji: '🧗', color: '#1D4ED8', bg: '#EFF6FF', border: '#3B82F6' },
                                        { name: 'Creepers', desc: 'Plants that spread on the ground like pumpkin', emoji: '🎃', color: '#6D28D9', bg: '#F5F3FF', border: '#8B5CF6' }
                                    ].map(type => (
                                        <div key={type.name} style={{
                                            background: type.bg, padding: '20px', borderRadius: '12px',
                                            borderLeft: `4px solid ${type.border}`
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '24px' }}>{type.emoji}</span>
                                                <strong style={{ color: type.color, fontSize: '18px' }}>{type.name}</strong>
                                            </div>
                                            <p style={{ margin: 0, color: '#475569', fontSize: '15px' }}>{type.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── PARTS OF A PLANT ──────────── */}
                            <Section>
                                <SectionTitle emoji="🌻">Parts of a Plant</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Just like we have body parts, plants also have different parts!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                    {[
                                        { name: 'Roots', desc: 'Hold the plant in the soil', emoji: '🪢', color: '#92400E', bg: '#FFFBEB' },
                                        { name: 'Stem', desc: 'Supports the plant and carries water', emoji: '🎋', color: '#15803D', bg: '#F0FDF4' },
                                        { name: 'Leaves', desc: 'Help plants make food', emoji: '🍃', color: '#4D7C0F', bg: '#ECFCCB' },
                                        { name: 'Flowers', desc: 'Help plants produce seeds', emoji: '🌸', color: '#BE185D', bg: '#FDF2F8' }
                                    ].map(part => (
                                        <div key={part.name} style={{
                                            background: part.bg, borderRadius: '14px', padding: '16px 20px',
                                            display: 'flex', alignItems: 'center', gap: '16px'
                                        }}>
                                            <div style={{ fontSize: '32px', background: '#FFFFFF', padding: '10px', borderRadius: '12px' }}>{part.emoji}</div>
                                            <div>
                                                <strong style={{ color: part.color, fontSize: '18px', display: 'block', marginBottom: '4px' }}>{part.name}</strong>
                                                <span style={{ color: '#475569', fontSize: '15px' }}>{part.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '32px' }}>☀️</span>
                                    <p style={{ fontSize: '16px', color: '#0F172A', fontWeight: 500, margin: 0 }}>
                                        <strong>Example:</strong> Leaves are green and help plants make food using sunlight.
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── HOW PLANTS GROW ──────────── */}
                            <Section>
                                <SectionTitle emoji="📈">How Plants Grow</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Plants grow from tiny seeds.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    For a plant to grow, it needs:
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                    {[
                                        { name: 'Water', emoji: '💧' },
                                        { name: 'Sunlight', emoji: '☀️' },
                                        { name: 'Air', emoji: '🌬️' },
                                        { name: 'Soil', emoji: '🪴' }
                                    ].map(need => (
                                        <div key={need.name} style={{
                                            background: '#FFFFFF', borderRadius: '12px', padding: '20px',
                                            textAlign: 'center', border: '1px solid #E2E8F0',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                        }}>
                                            <span style={{ fontSize: '32px' }}>{need.emoji}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#334155' }}>{need.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#EFF6FF', borderRadius: '16px', padding: '24px', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '32px' }}>🥜</span>
                                    <p style={{ fontSize: '16px', color: '#1E40AF', fontWeight: 500, margin: 0 }}>
                                        A seed planted in soil grows into a small plant and later becomes a big plant.
                                    </p>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'animals' && (
                        <>
                            {/* ──────────── WHAT ARE ANIMALS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🐾">What Are Animals?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Animals are living things that can move, eat food, and grow.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Animals live in different places such as forests, farms, and homes.
                                </p>
                                <div style={{
                                    background: '#FEF3C7', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #F59E0B'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#92400E', margin: '0 0 10px' }}>Examples of animals:</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {[
                                            { name: 'Dog', emoji: '🐶' },
                                            { name: 'Cat', emoji: '🐱' },
                                            { name: 'Lion', emoji: '🦁' },
                                            { name: 'Elephant', emoji: '🐘' },
                                            { name: 'Bird', emoji: '🐦' },
                                            { name: 'Fish', emoji: '🐟' }
                                        ].map(a => (
                                            <span key={a.name} style={{
                                                background: '#FFFFFF', padding: '8px 16px', borderRadius: '20px',
                                                fontSize: '15px', fontWeight: 600, color: '#92400E',
                                                border: '1px solid #FDE68A'
                                            }}>{a.emoji} {a.name}</span>
                                        ))}
                                    </div>
                                </div>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '16px 0 0' }}>
                                    Animals are part of nature and many animals help humans.
                                </p>
                            </Section>

                            {/* ──────────── TYPES OF ANIMALS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🧮">Types of Animals</SectionTitle>

                                {/* Pets */}
                                <div style={{ background: '#EFF6FF', borderRadius: '14px', padding: '20px', border: '1px solid #BFDBFE', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1D4ED8', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🐶 Pets
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#1E40AF', margin: '0 0 12px' }}>Pets are animals that live with people in their homes.</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {['Dog', 'Cat', 'Rabbit', 'Fish'].map(a => (
                                            <span key={a} style={{ background: '#FFFFFF', padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#1D4ED8', border: '1px solid #93C5FD' }}>{a}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Wild */}
                                <div style={{ background: '#FEF2F2', borderRadius: '14px', padding: '20px', border: '1px solid #FECACA', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#991B1B', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🦁 Wild Animals
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#B91C1C', margin: '0 0 12px' }}>Wild animals live in forests and jungles.</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {['Lion', 'Tiger', 'Elephant', 'Bear'].map(a => (
                                            <span key={a} style={{ background: '#FFFFFF', padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#991B1B', border: '1px solid #FCA5A5' }}>{a}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Farm */}
                                <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '20px', border: '1px solid #BBF7D0' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#15803D', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🐄 Farm Animals
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#166534', margin: '0 0 12px' }}>Farm animals live on farms and help people.</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {['Cow', 'Goat', 'Horse', 'Sheep'].map(a => (
                                            <span key={a} style={{ background: '#FFFFFF', padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#15803D', border: '1px solid #86EFAC' }}>{a}</span>
                                        ))}
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── WHERE ANIMALS LIVE ──────────── */}
                            <Section>
                                <SectionTitle emoji="🏡">Where Animals Live</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Every animal has a place to live. Let's learn about animal homes!
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { animal: 'Dog', home: 'Kennel', emoji: '🐕' },
                                        { animal: 'Bird', home: 'Nest', emoji: '🐦' },
                                        { animal: 'Lion', home: 'Den', emoji: '🦁' },
                                        { animal: 'Cow', home: 'Shed', emoji: '🐄' },
                                        { animal: 'Rabbit', home: 'Burrow', emoji: '🐰' }
                                    ].map(item => (
                                        <div key={item.animal} style={{
                                            background: '#FFFFFF', borderRadius: '14px', padding: '20px',
                                            border: '1px solid #E2E8F0', textAlign: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                        }}>
                                            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{item.emoji}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{item.animal}</div>
                                            <div style={{ fontSize: '14px', color: '#64748B' }}>→ <strong style={{ color: '#2563EB' }}>{item.home}</strong></div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── WHAT ANIMALS EAT ──────────── */}
                            <Section>
                                <SectionTitle emoji="🍽️">What Animals Eat</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Animals eat different types of food. Let's see what some animals like to eat!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { animal: 'Cow', food: 'Grass', animalEmoji: '🐮', foodEmoji: '🌾', bg: '#F0FDF4', color: '#15803D' },
                                        { animal: 'Lion', food: 'Meat', animalEmoji: '🦁', foodEmoji: '🍖', bg: '#FEF2F2', color: '#991B1B' },
                                        { animal: 'Monkey', food: 'Fruits', animalEmoji: '🐒', foodEmoji: '🍌', bg: '#FFFBEB', color: '#92400E' },
                                        { animal: 'Rabbit', food: 'Carrots', animalEmoji: '🐰', foodEmoji: '🥕', bg: '#FFF7ED', color: '#9A3412' }
                                    ].map(item => (
                                        <div key={item.animal} style={{
                                            background: item.bg, borderRadius: '14px', padding: '16px 20px',
                                            display: 'flex', alignItems: 'center', gap: '16px'
                                        }}>
                                            <span style={{ fontSize: '32px' }}>{item.animalEmoji}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: item.color }}>{item.animal}</span>
                                            <span style={{ fontSize: '18px', color: '#94A3B8' }}>→</span>
                                            <span style={{ fontSize: '32px' }}>{item.foodEmoji}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: item.color }}>{item.food}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'weather' && (
                        <>
                            {/* ──────────── WHAT IS WEATHER ──────────── */}
                            <Section>
                                <SectionTitle emoji="☀️">What is Weather?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Weather tells us how the air and sky feel outside.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Sometimes the weather is sunny, sometimes rainy, and sometimes cold. Weather can change every day.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                    {[
                                        { name: 'Sunny', emoji: '☀️', bg: '#FFFBEB', color: '#92400E' },
                                        { name: 'Rainy', emoji: '🌧️', bg: '#EFF6FF', color: '#1D4ED8' },
                                        { name: 'Windy', emoji: '🌬️', bg: '#F0FDF4', color: '#15803D' },
                                        { name: 'Cloudy', emoji: '☁️', bg: '#F8FAFC', color: '#64748B' }
                                    ].map(w => (
                                        <div key={w.name} style={{
                                            background: w.bg, borderRadius: '14px', padding: '20px',
                                            textAlign: 'center', border: '1px solid #E2E8F0'
                                        }}>
                                            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{w.emoji}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: w.color }}>{w.name}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#FEF3C7', borderRadius: '14px', padding: '20px 24px', borderLeft: '4px solid #F59E0B' }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#92400E', margin: '0 0 10px' }}>Weather affects what we wear and do:</p>
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#B45309', fontSize: '15px', lineHeight: 1.8, fontWeight: 500 }}>
                                        <li>☀️ On <strong>sunny days</strong> we wear light clothes.</li>
                                        <li>🌧️ On <strong>rainy days</strong> we use umbrellas.</li>
                                        <li>❄️ On <strong>cold days</strong> we wear warm clothes.</li>
                                    </ul>
                                </div>
                            </Section>

                            {/* ──────────── SEASONS OF THE YEAR ──────────── */}
                            <Section>
                                <SectionTitle emoji="🌟">Seasons of the Year</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    A season is a part of the year when the weather stays mostly the same. The main seasons children learn about are:
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                    <div style={{ background: '#FEF2F2', padding: '20px', borderRadius: '14px', borderLeft: '4px solid #EF4444' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '28px' }}>☀️</span>
                                            <strong style={{ color: '#991B1B', fontSize: '18px' }}>Summer</strong>
                                        </div>
                                        <p style={{ margin: 0, color: '#B91C1C', fontSize: '15px' }}>Very hot weather. The sun shines brightly.</p>
                                    </div>
                                    <div style={{ background: '#EFF6FF', padding: '20px', borderRadius: '14px', borderLeft: '4px solid #3B82F6' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '28px' }}>❄️</span>
                                            <strong style={{ color: '#1D4ED8', fontSize: '18px' }}>Winter</strong>
                                        </div>
                                        <p style={{ margin: 0, color: '#1E40AF', fontSize: '15px' }}>Cold weather. People wear sweaters and jackets.</p>
                                    </div>
                                    <div style={{ background: '#F0FDF4', padding: '20px', borderRadius: '14px', borderLeft: '4px solid #22C55E' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '28px' }}>🌧️</span>
                                            <strong style={{ color: '#15803D', fontSize: '18px' }}>Rainy Season</strong>
                                        </div>
                                        <p style={{ margin: 0, color: '#166534', fontSize: '15px' }}>Lots of rain. Clouds bring rain.</p>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── WHAT HAPPENS IN EACH SEASON ──────────── */}
                            <Section>
                                <SectionTitle emoji="🌈">What Happens in Each Season</SectionTitle>

                                {/* Summer */}
                                <div style={{ background: '#FFFBEB', borderRadius: '14px', padding: '20px', border: '1px solid #FDE68A', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#92400E', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        ☀️ Summer
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#B45309', margin: '0 0 12px' }}>The sun is bright and the weather is hot.</p>
                                    <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '14px 18px', border: '1px solid #FDE68A' }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#92400E', margin: '0 0 6px' }}>Example activities:</p>
                                        <ul style={{ margin: 0, paddingLeft: '18px', color: '#B45309', fontSize: '14px', lineHeight: 1.8 }}>
                                            <li>🍦 Eating ice cream</li>
                                            <li>⚽ Playing outside in the evening</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Winter */}
                                <div style={{ background: '#EFF6FF', borderRadius: '14px', padding: '20px', border: '1px solid #BFDBFE', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1D4ED8', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        ❄️ Winter
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#1E40AF', margin: '0 0 12px' }}>The weather becomes cold.</p>
                                    <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '14px 18px', border: '1px solid #BFDBFE' }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1D4ED8', margin: '0 0 6px' }}>Example:</p>
                                        <p style={{ margin: 0, color: '#1E40AF', fontSize: '14px' }}>🧥 People wear sweaters and jackets.</p>
                                    </div>
                                </div>

                                {/* Rainy */}
                                <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '20px', border: '1px solid #BBF7D0' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#15803D', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🌧️ Rainy Season
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#166534', margin: '0 0 12px' }}>Clouds bring rain.</p>
                                    <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '14px 18px', border: '1px solid #BBF7D0' }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#15803D', margin: '0 0 6px' }}>Example:</p>
                                        <p style={{ margin: 0, color: '#166534', fontSize: '14px' }}>☔ Children use umbrellas and raincoats.</p>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'water' && (
                        <>
                            {/* ──────────── WHAT IS WATER ──────────── */}
                            <Section>
                                <SectionTitle emoji="💧">What Is Water?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Water is a very important natural resource. All living things need water to live.
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Humans, animals, and plants cannot survive without water.
                                </p>
                                <div style={{
                                    background: '#EFF6FF', borderRadius: '14px', padding: '20px 24px',
                                    borderLeft: '4px solid #3B82F6'
                                }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#1D4ED8', margin: 0 }}>
                                        💧 Water is clear, colorless, and has no smell. It is necessary for life!
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── SOURCES OF WATER ──────────── */}
                            <Section>
                                <SectionTitle emoji="🌊">Sources of Water</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Water comes from many natural and man-made sources. Rain is the main natural source of water — it fills rivers, lakes, and ponds.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                                    {[
                                        { name: 'Rain', emoji: '🌧️' },
                                        { name: 'Rivers', emoji: '🏞️' },
                                        { name: 'Lakes', emoji: '💧' },
                                        { name: 'Ponds', emoji: '🐸' },
                                        { name: 'Wells', emoji: '🪣' },
                                        { name: 'Taps', emoji: '🚰' }
                                    ].map(s => (
                                        <div key={s.name} style={{
                                            background: '#F0F9FF', borderRadius: '14px', padding: '20px',
                                            textAlign: 'center', border: '1px solid #BAE6FD'
                                        }}>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.emoji}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0369A1' }}>{s.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── USES OF WATER ──────────── */}
                            <Section>
                                <SectionTitle emoji="🥤">Uses of Water</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    We use water every day for many activities. Water helps us stay clean and healthy.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { use: 'Drinking', emoji: '🥤', bg: '#EFF6FF', color: '#1D4ED8' },
                                        { use: 'Cooking', emoji: '🍳', bg: '#FEF3C7', color: '#92400E' },
                                        { use: 'Bathing', emoji: '🛁', bg: '#F0FDF4', color: '#15803D' },
                                        { use: 'Washing Clothes', emoji: '🧻', bg: '#F5F3FF', color: '#6D28D9' },
                                        { use: 'Watering Plants', emoji: '🌱', bg: '#ECFCCB', color: '#4D7C0F' },
                                        { use: 'Cleaning', emoji: '✨', bg: '#FFF7ED', color: '#9A3412' }
                                    ].map(item => (
                                        <div key={item.use} style={{
                                            background: item.bg, borderRadius: '14px', padding: '20px',
                                            textAlign: 'center', border: '1px solid #E2E8F0'
                                        }}>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.emoji}</div>
                                            <div style={{ fontSize: '15px', fontWeight: 700, color: item.color }}>{item.use}</div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── SAVING WATER ──────────── */}
                            <Section>
                                <SectionTitle emoji="🌍">Why We Should Save Water</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Water is precious and we should not waste it. Saving water helps protect nature.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { tip: 'Turn off the tap after use', emoji: '🚰' },
                                        { tip: 'Do not waste water while brushing', emoji: '🪥' },
                                        { tip: 'Use only the water you need', emoji: '💧' },
                                        { tip: 'Water plants carefully', emoji: '🌿' }
                                    ].map((item, idx) => (
                                        <div key={idx} style={{
                                            background: '#F0FDF4', borderRadius: '14px', padding: '16px 20px',
                                            display: 'flex', alignItems: 'center', gap: '16px',
                                            borderLeft: '4px solid #22C55E'
                                        }}>
                                            <div style={{ fontSize: '28px', background: '#DCFCE7', padding: '10px', borderRadius: '12px' }}>{item.emoji}</div>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#15803D' }}>{item.tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </>
                    )}

                    {chapterId === 'numbers-up-to-100' && (
                        <>
                            {/* ──────────── COUNTING NUMBERS TO 100 ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔢">Counting Numbers to 100</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Numbers help us count objects and measure quantities. In Class 1 we learned numbers up to 10. Now we will learn numbers up to 100!
                                </p>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Counting from 1 to 100 helps us understand bigger numbers. Numbers increase step by step.
                                </p>
                                <div style={{ background: '#F0F9FF', borderRadius: '14px', padding: '24px', border: '1px solid #BAE6FD' }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#0369A1', margin: '0 0 12px' }}>Counting sequence:</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {[
                                            '1, 2, 3, 4, 5 ... 10',
                                            '11, 12, 13 ... 20',
                                            '21, 22, 23 ... 30',
                                            '...',
                                            '91, 92, 93 ... 100'
                                        ].map((line, i) => (
                                            <div key={i} style={{
                                                background: '#FFFFFF', padding: '10px 16px', borderRadius: '10px',
                                                fontSize: '16px', fontWeight: 600, color: '#0284C7',
                                                fontFamily: 'monospace', border: '1px solid #E0F2FE'
                                            }}>{line}</div>
                                        ))}
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── TENS AND ONES ──────────── */}
                            <Section>
                                <SectionTitle emoji="🧱">Understanding Tens and Ones</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Two-digit numbers are made of tens and ones. Tens help us understand larger numbers.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { num: '23', tens: '2', ones: '3', color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
                                        { num: '45', tens: '4', ones: '5', color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0' },
                                        { num: '67', tens: '6', ones: '7', color: '#9333EA', bg: '#F5F3FF', border: '#DDD6FE' }
                                    ].map(item => (
                                        <div key={item.num} style={{
                                            background: item.bg, borderRadius: '14px', padding: '20px',
                                            textAlign: 'center', border: `1px solid ${item.border}`
                                        }}>
                                            <div style={{ fontSize: '36px', fontWeight: 800, color: item.color, marginBottom: '8px' }}>{item.num}</div>
                                            <div style={{ fontSize: '15px', color: item.color, fontWeight: 600 }}>
                                                = {item.tens} tens and {item.ones} ones
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── COMPARING NUMBERS ──────────── */}
                            <Section>
                                <SectionTitle emoji="⚖️">Comparing Numbers</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    We can compare numbers to know which is bigger or smaller.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                    {[
                                        { left: '45', symbol: '>', right: '32', label: 'Greater than', color: '#15803D', bg: '#F0FDF4' },
                                        { left: '28', symbol: '<', right: '40', label: 'Less than', color: '#DC2626', bg: '#FEF2F2' },
                                        { left: '50', symbol: '=', right: '50', label: 'Equal to', color: '#1D4ED8', bg: '#EFF6FF' }
                                    ].map((item, i) => (
                                        <div key={i} style={{
                                            background: item.bg, borderRadius: '14px', padding: '20px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '28px', fontWeight: 800, color: item.color, marginBottom: '8px' }}>
                                                {item.left} <span style={{ fontSize: '32px' }}>{item.symbol}</span> {item.right}
                                            </div>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: item.color }}>{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#FEF3C7', borderRadius: '14px', padding: '20px 24px', borderLeft: '4px solid #F59E0B' }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#92400E', margin: '0 0 8px' }}>Remember the symbols:</p>
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#B45309', fontSize: '15px', lineHeight: 1.8, fontWeight: 500 }}>
                                        <li><strong>&gt;</strong> means greater than</li>
                                        <li><strong>&lt;</strong> means less than</li>
                                        <li><strong>=</strong> means equal to</li>
                                    </ul>
                                </div>
                            </Section>

                            {/* ──────────── NUMBER ORDER ──────────── */}
                            <Section>
                                <SectionTitle emoji="📋">Number Order</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Numbers can be arranged in order. Ordering numbers helps us understand their value.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '20px', borderLeft: '4px solid #22C55E' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#15803D', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            ⬆️ Ascending Order (small to big)
                                        </h3>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {['12', '18', '25', '30'].map(n => (
                                                <span key={n} style={{
                                                    background: '#FFFFFF', padding: '8px 16px', borderRadius: '10px',
                                                    fontSize: '18px', fontWeight: 700, color: '#15803D',
                                                    border: '1px solid #86EFAC'
                                                }}>{n}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ background: '#FEF2F2', borderRadius: '14px', padding: '20px', borderLeft: '4px solid #EF4444' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#991B1B', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            ⬇️ Descending Order (big to small)
                                        </h3>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {['45', '40', '32', '20'].map(n => (
                                                <span key={n} style={{
                                                    background: '#FFFFFF', padding: '8px 16px', borderRadius: '10px',
                                                    fontSize: '18px', fontWeight: 700, color: '#991B1B',
                                                    border: '1px solid #FCA5A5'
                                                }}>{n}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'addition' && (
                        <>
                            {/* ──────────── WHAT IS ADDITION ──────────── */}
                            <Section>
                                <SectionTitle emoji="➕">What is Addition?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Addition means putting numbers together to find the total. When we add numbers, the result becomes bigger.
                                </p>
                                <div style={{
                                    background: '#F0FDF4', borderRadius: '16px', padding: '24px',
                                    border: '1px solid #BBF7D0', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#15803D', marginBottom: '8px' }}>
                                        2 + 3 = 5
                                    </div>
                                    <p style={{ fontSize: '15px', color: '#166534', fontWeight: 500, margin: 0 }}>
                                        If we combine 2 objects with 3 objects, we get 5 objects in total.
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── TWO-DIGIT ADDITION ──────────── */}
                            <Section>
                                <SectionTitle emoji="🧩">Adding Two-Digit Numbers</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    In Class 2 we learn how to add bigger numbers.
                                </p>
                                <div style={{ background: '#EFF6FF', borderRadius: '16px', padding: '24px', border: '1px solid #BFDBFE' }}>
                                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D4ED8', textAlign: 'center', marginBottom: '16px' }}>
                                        23 + 14 = 37
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #93C5FD' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1D4ED8', margin: '0 0 4px' }}>Step 1: Add the ones</p>
                                            <p style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB', margin: 0 }}>3 + 4 = 7</p>
                                        </div>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #93C5FD' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1D4ED8', margin: '0 0 4px' }}>Step 2: Add the tens</p>
                                            <p style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB', margin: 0 }}>2 + 1 = 3</p>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#1E40AF', textAlign: 'center', margin: '12px 0 0' }}>
                                        So the answer is <strong>37</strong>!
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── ADDITION WITH CARRY ──────────── */}
                            <Section>
                                <SectionTitle emoji="📝">Addition with Carry</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Sometimes the sum of the ones is greater than 10. We need to carry!
                                </p>
                                <div style={{ background: '#FEF3C7', borderRadius: '16px', padding: '24px', border: '1px solid #FDE68A' }}>
                                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#92400E', textAlign: 'center', marginBottom: '16px' }}>
                                        27 + 15 = ?
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #FDE68A' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', margin: '0 0 4px' }}>Step 1: Add the ones</p>
                                            <p style={{ fontSize: '18px', fontWeight: 700, color: '#B45309', margin: 0 }}>
                                                7 + 5 = 12 → Write <strong>2</strong>, carry <strong>1</strong>
                                            </p>
                                        </div>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #FDE68A' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', margin: '0 0 4px' }}>Step 2: Add the tens (with carry)</p>
                                            <p style={{ fontSize: '18px', fontWeight: 700, color: '#B45309', margin: 0 }}>
                                                2 + 1 + 1 = 4
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '2px solid #F59E0B' }}>
                                        <p style={{ fontSize: '22px', fontWeight: 800, color: '#92400E', margin: 0 }}>
                                            27 + 15 = <span style={{ color: '#D97706', fontSize: '28px' }}>42</span>
                                        </p>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── WORD PROBLEM ──────────── */}
                            <Section>
                                <SectionTitle emoji="🍎">Addition in Daily Life</SectionTitle>
                                <div style={{ background: '#F5F3FF', borderRadius: '16px', padding: '24px', border: '1px solid #DDD6FE' }}>
                                    <p style={{ fontSize: '16px', color: '#5B21B6', lineHeight: 1.8, margin: '0 0 8px' }}>
                                        🧑 Ravi has <strong>12 apples</strong>.
                                    </p>
                                    <p style={{ fontSize: '16px', color: '#5B21B6', lineHeight: 1.8, margin: '0 0 16px' }}>
                                        🤝 His friend gives him <strong>8 more apples</strong>.
                                    </p>
                                    <p style={{ fontSize: '16px', color: '#5B21B6', lineHeight: 1.8, margin: '0 0 16px', fontWeight: 600 }}>
                                        How many apples does Ravi have now?
                                    </p>
                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '12px', padding: '16px',
                                        border: '2px solid #8B5CF6', textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#7C3AED', margin: '0 0 4px' }}>Solution:</p>
                                        <p style={{ fontSize: '22px', fontWeight: 800, color: '#6D28D9', margin: '0 0 4px' }}>12 + 8 = 20</p>
                                        <p style={{ fontSize: '15px', color: '#7C3AED', fontWeight: 500, margin: 0 }}>
                                            🍎 Ravi now has <strong>20 apples</strong>!
                                        </p>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'subtraction' && (
                        <>
                            {/* ──────────── WHAT IS SUBTRACTION ──────────── */}
                            <Section>
                                <SectionTitle emoji="➖">What is Subtraction?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Subtraction means taking away one number from another number. When we subtract, the result becomes smaller.
                                </p>
                                <div style={{
                                    background: '#FEF2F2', borderRadius: '16px', padding: '24px',
                                    border: '1px solid #FECACA', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#DC2626', marginBottom: '8px' }}>
                                        9 − 4 = 5
                                    </div>
                                    <p style={{ fontSize: '15px', color: '#991B1B', fontWeight: 500, margin: 0 }}>
                                        If we take 4 objects away from 9 objects, 5 objects remain.
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── TWO-DIGIT SUBTRACTION ──────────── */}
                            <Section>
                                <SectionTitle emoji="🧩">Subtracting Larger Numbers</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    In Class 2 we learn to subtract two-digit numbers.
                                </p>
                                <div style={{ background: '#EFF6FF', borderRadius: '16px', padding: '24px', border: '1px solid #BFDBFE' }}>
                                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D4ED8', textAlign: 'center', marginBottom: '16px' }}>
                                        45 − 23 = 22
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #93C5FD' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1D4ED8', margin: '0 0 4px' }}>Step 1: Subtract the ones</p>
                                            <p style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB', margin: 0 }}>5 − 3 = 2</p>
                                        </div>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #93C5FD' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1D4ED8', margin: '0 0 4px' }}>Step 2: Subtract the tens</p>
                                            <p style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB', margin: 0 }}>4 − 2 = 2</p>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#1E40AF', textAlign: 'center', margin: '12px 0 0' }}>
                                        So the answer is <strong>22</strong>!
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── SUBTRACTION WITH BORROWING ──────────── */}
                            <Section>
                                <SectionTitle emoji="📝">Subtraction with Borrowing</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Sometimes the top number is smaller than the bottom in the ones place. We need to borrow!
                                </p>
                                <div style={{ background: '#FEF3C7', borderRadius: '16px', padding: '24px', border: '1px solid #FDE68A' }}>
                                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#92400E', textAlign: 'center', marginBottom: '16px' }}>
                                        52 − 27 = ?
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #FDE68A' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', margin: '0 0 4px' }}>Step 1: Can we do 2 − 7?</p>
                                            <p style={{ fontSize: '18px', fontWeight: 700, color: '#B45309', margin: 0 }}>
                                                ❌ No! Borrow 1 ten from the tens place.
                                            </p>
                                        </div>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #FDE68A' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', margin: '0 0 4px' }}>Step 2: Subtract the ones (with borrow)</p>
                                            <p style={{ fontSize: '18px', fontWeight: 700, color: '#B45309', margin: 0 }}>
                                                12 − 7 = 5
                                            </p>
                                        </div>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #FDE68A' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', margin: '0 0 4px' }}>Step 3: Subtract the tens</p>
                                            <p style={{ fontSize: '18px', fontWeight: 700, color: '#B45309', margin: 0 }}>
                                                4 − 2 = 2
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '2px solid #F59E0B' }}>
                                        <p style={{ fontSize: '22px', fontWeight: 800, color: '#92400E', margin: 0 }}>
                                            52 − 27 = <span style={{ color: '#D97706', fontSize: '28px' }}>25</span>
                                        </p>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── WORD PROBLEM ──────────── */}
                            <Section>
                                <SectionTitle emoji="🍬">Subtraction in Daily Life</SectionTitle>
                                <div style={{ background: '#F5F3FF', borderRadius: '16px', padding: '24px', border: '1px solid #DDD6FE' }}>
                                    <p style={{ fontSize: '16px', color: '#5B21B6', lineHeight: 1.8, margin: '0 0 8px' }}>
                                        🏪 A shop has <strong>60 candies</strong>.
                                    </p>
                                    <p style={{ fontSize: '16px', color: '#5B21B6', lineHeight: 1.8, margin: '0 0 16px' }}>
                                        👧👦 Children bought <strong>25 candies</strong>.
                                    </p>
                                    <p style={{ fontSize: '16px', color: '#5B21B6', lineHeight: 1.8, margin: '0 0 16px', fontWeight: 600 }}>
                                        How many candies are left?
                                    </p>
                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '12px', padding: '16px',
                                        border: '2px solid #8B5CF6', textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#7C3AED', margin: '0 0 4px' }}>Solution:</p>
                                        <p style={{ fontSize: '22px', fontWeight: 800, color: '#6D28D9', margin: '0 0 4px' }}>60 − 25 = 35</p>
                                        <p style={{ fontSize: '15px', color: '#7C3AED', fontWeight: 500, margin: 0 }}>
                                            🍬 There are <strong>35 candies</strong> left!
                                        </p>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'multiplication' && (
                        <>
                            {/* ──────────── WHAT IS MULTIPLICATION ──────────── */}
                            <Section>
                                <SectionTitle emoji="✖️">What is Multiplication?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Multiplication is a way of adding the same number many times. Instead of adding numbers again and again, we can use multiplication!
                                </p>
                                <div style={{
                                    background: '#F0FDF4', borderRadius: '16px', padding: '24px',
                                    border: '1px solid #BBF7D0', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#15803D', marginBottom: '8px' }}>
                                        2 + 2 + 2 = 6
                                    </div>
                                    <p style={{ fontSize: '18px', color: '#166534', fontWeight: 600, margin: '16px 0' }}>
                                        This can also be written as:
                                    </p>
                                    <div style={{ fontSize: '40px', fontWeight: 900, color: '#047857', margin: '0 0 8px' }}>
                                        3 × 2 = 6
                                    </div>
                                    <p style={{ fontSize: '15px', color: '#065F46', fontWeight: 500, margin: 0 }}>
                                        This means <strong>3 groups of 2</strong>.
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── GROUPS ──────────── */}
                            <Section>
                                <SectionTitle emoji="📦">Understanding Groups</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Multiplication shows equal groups. It helps us count objects much faster!
                                </p>
                                <div style={{ background: '#FEF2F2', borderRadius: '16px', padding: '24px', border: '1px solid #FECACA', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                        {[1, 2, 3].map(group => (
                                            <div key={group} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '2px solid #FCA5A5' }}>
                                                <div style={{ fontSize: '32px', letterSpacing: '8px' }}>🍎🍎</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#991B1B', margin: '0 0 12px' }}>
                                        There are 3 groups of 2 apples.
                                    </p>
                                    <div style={{ display: 'inline-block', background: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', border: '2px dashed #EF4444' }}>
                                        <p style={{ fontSize: '16px', color: '#B91C1C', fontWeight: 600, margin: '0 0 4px' }}>So we write:</p>
                                        <p style={{ fontSize: '28px', fontWeight: 900, color: '#DC2626', margin: 0 }}>3 × 2 = 6</p>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── SIMPLE EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="✨">Simple Multiplication Examples</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { title: 'Example 1', eq: '2 × 3 = 6', color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
                                        { title: 'Example 2', eq: '4 × 2 = 8', color: '#047857', bg: '#ECFDF5', border: '#A7F3D0' },
                                        { title: 'Example 3', eq: '5 × 2 = 10', color: '#9333EA', bg: '#F5F3FF', border: '#DDD6FE' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: item.bg, borderRadius: '12px', padding: '20px', textAlign: 'center', border: `1px solid ${item.border}` }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: item.color, margin: '0 0 8px' }}>{item.title}</p>
                                            <p style={{ fontSize: '28px', fontWeight: 800, color: item.color, margin: 0 }}>{item.eq}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '16px', background: '#FEF3C7', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #F59E0B' }}>
                                    <p style={{ fontSize: '16px', color: '#92400E', fontWeight: 600, margin: 0 }}>
                                        Remember: The symbol <strong>×</strong> means multiply!
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── WORD PROBLEM ──────────── */}
                            <Section>
                                <SectionTitle emoji="🧺">Multiplication in Daily Life</SectionTitle>
                                <div style={{ background: '#FFF7ED', borderRadius: '16px', padding: '24px', border: '1px solid #FFEDD5' }}>
                                    <p style={{ fontSize: '16px', color: '#C2410C', lineHeight: 1.8, margin: '0 0 8px' }}>
                                        🧺 There are <strong>4 baskets</strong>.
                                    </p>
                                    <p style={{ fontSize: '16px', color: '#C2410C', lineHeight: 1.8, margin: '0 0 16px' }}>
                                        🍎 Each basket has <strong>3 apples</strong>.
                                    </p>
                                    <p style={{ fontSize: '16px', color: '#C2410C', lineHeight: 1.8, margin: '0 0 16px', fontWeight: 600 }}>
                                        How many apples are there in total?
                                    </p>
                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '12px', padding: '16px',
                                        border: '2px solid #F97316', textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#C2410C', margin: '0 0 4px' }}>Solution:</p>
                                        <p style={{ fontSize: '28px', fontWeight: 900, color: '#EA580C', margin: '0 0 4px' }}>4 × 3 = 12</p>
                                        <p style={{ fontSize: '15px', color: '#C2410C', fontWeight: 500, margin: 0 }}>
                                            🧺 So there are <strong>12 apples</strong>!
                                        </p>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'time' && (
                        <>
                            {/* ──────────── WHAT IS TIME ──────────── */}
                            <Section>
                                <SectionTitle emoji="⏰">What is Time?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Time helps us know when things happen. We use time to plan our daily activities! Time is measured using a clock.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { time: 'Morning', activity: 'Wake up and go to school', emoji: '🌅', bg: '#FEF3C7', border: '#FDE68A', color: '#B45309' },
                                        { time: 'Afternoon', activity: 'Eat lunch and study', emoji: '☀️', bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
                                        { time: 'Evening', activity: 'Play and relax', emoji: '🌇', bg: '#FCE7F3', border: '#FBCFE8', color: '#BE185D' },
                                        { time: 'Night', activity: 'Sleep', emoji: '🌙', bg: '#F1F5F9', border: '#E2E8F0', color: '#334155' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: item.bg, borderRadius: '14px', padding: '16px', border: `1px solid ${item.border}`, textAlign: 'center' }}>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.emoji}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 800, color: item.color, marginBottom: '4px' }}>{item.time}</div>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: item.color, opacity: 0.8 }}>{item.activity}</div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── PARTS OF A CLOCK ──────────── */}
                            <Section>
                                <SectionTitle emoji="⏱️">Parts of a Clock</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    A clock has numbers from 1 to 12 and two main hands that go around it.
                                </p>
                                <div style={{ background: '#F0F9FF', borderRadius: '16px', padding: '24px', border: '1px solid #BAE6FD' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '2px solid #38BDF8', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '8px', background: '#0284C7', borderRadius: '4px' }}></div>
                                            <div>
                                                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0284C7', margin: '0 0 4px' }}>Hour Hand (Shorter)</div>
                                                <div style={{ fontSize: '14px', color: '#0369A1', fontWeight: 500 }}>Points to the hour.</div>
                                            </div>
                                        </div>
                                        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '2px solid #818CF8', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '60px', height: '6px', background: '#4F46E5', borderRadius: '4px' }}></div>
                                            <div>
                                                <div style={{ fontSize: '18px', fontWeight: 800, color: '#4F46E5', margin: '0 0 4px' }}>Minute Hand (Longer)</div>
                                                <div style={{ fontSize: '14px', color: '#4338CA', fontWeight: 500 }}>Points to the minutes.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── READING TIME ──────────── */}
                            <Section>
                                <SectionTitle emoji="🕛">Reading the Clock</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    When the long minute hand points exactly to <strong>12</strong>, we say <strong>o'clock</strong>!
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { face: '🕒', digital: '3:00', text: 'Three o’clock', color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
                                        { face: '🕕', digital: '6:00', text: 'Six o’clock', color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0' },
                                        { face: '🕘', digital: '9:00', text: 'Nine o’clock', color: '#9333EA', bg: '#F5F3FF', border: '#DDD6FE' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: item.bg, borderRadius: '14px', padding: '24px', textAlign: 'center', border: `1px solid ${item.border}` }}>
                                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.face}</div>
                                            <div style={{ fontSize: '24px', fontWeight: 900, color: item.color, margin: '0 0 4px' }}>{item.digital}</div>
                                            <div style={{ fontSize: '15px', fontWeight: 600, color: item.color, opacity: 0.8 }}>{item.text}</div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── DAILY ROUTINE ──────────── */}
                            <Section>
                                <SectionTitle emoji="📅">Time in Our Daily Routine</SectionTitle>
                                <div style={{ background: '#F5F3FF', borderRadius: '16px', padding: '24px', border: '1px solid #DDD6FE' }}>
                                    <p style={{ fontSize: '16px', color: '#5B21B6', lineHeight: 1.8, margin: '0 0 16px' }}>
                                        Time helps us organize our day. Here is an example of a busy day!
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            { time: '7:00 a.m.', activity: 'Wake up! ☀️' },
                                            { time: '9:00 a.m.', activity: 'Go to school 🏫' },
                                            { time: '1:00 p.m.', activity: 'Lunch time 🍱' },
                                            { time: '8:00 p.m.', activity: 'Dinner time 🍽️' }
                                        ].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', borderRadius: '10px', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #C4B5FD' }}>
                                                <span style={{ fontSize: '18px', fontWeight: 800, color: '#7C3AED' }}>{item.time}</span>
                                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#5B21B6' }}>{item.activity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'money' && (
                        <>
                            {/* ──────────── WHAT IS MONEY ──────────── */}
                            <Section>
                                <SectionTitle emoji="💰">What is Money?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Money is used to buy things! We use money to buy food, clothes, toys, books, and many other things.
                                </p>
                                <div style={{
                                    background: '#F0FDF4', borderRadius: '16px', padding: '24px',
                                    border: '1px solid #BBF7D0', textAlign: 'center'
                                }}>
                                    <p style={{ fontSize: '16px', color: '#166534', fontWeight: 600, margin: '0 0 12px' }}>
                                        Every country has its own type of money.
                                    </p>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#15803D', marginBottom: '8px' }}>
                                        🇮🇳 In India, we use Rupees (₹)
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── TYPES OF MONEY ──────────── */}
                            <Section>
                                <SectionTitle emoji="🪙">Types of Money</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Money comes in the form of <strong>coins</strong> (made of metal) and <strong>notes</strong> (made of paper).
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
                                    <div style={{ background: '#FEF3C7', borderRadius: '16px', padding: '24px', border: '1px solid #FDE68A' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#B45309', margin: '0 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            🏅 Coins
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                                            {['₹1', '₹2', '₹5', '₹10'].map(coin => (
                                                <div key={coin} style={{
                                                    width: '60px', height: '60px', borderRadius: '50%', background: '#FCD34D',
                                                    border: '4px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '18px', fontWeight: 800, color: '#92400E', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                }}>
                                                    {coin}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ background: '#ECFCCB', borderRadius: '16px', padding: '24px', border: '1px solid #D9F99D' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#4D7C0F', margin: '0 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            💵 Notes
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                                            {[
                                                { val: '₹10', bg: '#D9F99D', border: '#84CC16' },
                                                { val: '₹20', bg: '#FECACA', border: '#EF4444' },
                                                { val: '₹50', bg: '#A7F3D0', border: '#10B981' },
                                                { val: '₹100', bg: '#DDD6FE', border: '#8B5CF6' }
                                            ].map(note => (
                                                <div key={note.val} style={{
                                                    padding: '12px 20px', borderRadius: '4px', background: note.bg,
                                                    border: `2px solid ${note.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '16px', fontWeight: 800, color: note.border, boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                }}>
                                                    {note.val}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── ADDING MONEY ──────────── */}
                            <Section>
                                <SectionTitle emoji="➕">Adding Money</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    We can add money just like regular numbers to find the total amount!
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    <div style={{ background: '#EFF6FF', borderRadius: '14px', padding: '20px', border: '1px solid #BFDBFE', textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '32px' }}>🪙</span> ₹5 + <span style={{ fontSize: '32px' }}>🪙</span> ₹2
                                        </div>
                                        <div style={{ fontSize: '32px', fontWeight: 900, color: '#2563EB', marginTop: '12px' }}>= ₹7</div>
                                    </div>
                                    <div style={{ background: '#F5F3FF', borderRadius: '14px', padding: '20px', border: '1px solid #DDD6FE', textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '32px' }}>💵</span> ₹10 + <span style={{ fontSize: '32px' }}>💵</span> ₹10
                                        </div>
                                        <div style={{ fontSize: '32px', fontWeight: 900, color: '#7C3AED', marginTop: '12px' }}>= ₹20</div>
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── WORD PROBLEM ──────────── */}
                            <Section>
                                <SectionTitle emoji="🛍️">Using Money in Daily Life</SectionTitle>
                                <div style={{ background: '#FFF7ED', borderRadius: '16px', padding: '24px', border: '1px solid #FFEDD5' }}>
                                    <p style={{ fontSize: '16px', color: '#C2410C', lineHeight: 1.8, margin: '0 0 8px' }}>
                                        ✏️ A pencil costs <strong>₹5</strong>.
                                    </p>
                                    <p style={{ fontSize: '16px', color: '#C2410C', lineHeight: 1.8, margin: '0 0 16px' }}>
                                        👧 A student buys <strong>two pencils</strong>.
                                    </p>
                                    <p style={{ fontSize: '16px', color: '#C2410C', lineHeight: 1.8, margin: '0 0 16px', fontWeight: 600 }}>
                                        How much money does the student need?
                                    </p>
                                    <div style={{
                                        background: '#FFFFFF', borderRadius: '12px', padding: '16px',
                                        border: '2px solid #F97316', textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#C2410C', margin: '0 0 4px' }}>Solution:</p>
                                        <p style={{ fontSize: '28px', fontWeight: 900, color: '#EA580C', margin: '0 0 4px' }}>₹5 + ₹5 = ₹10</p>
                                        <p style={{ fontSize: '15px', color: '#C2410C', fontWeight: 500, margin: 0 }}>
                                            🛍️ So the student needs <strong>₹10</strong>!
                                        </p>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'shapes' && (
                        <>
                            {/* ──────────── WHAT ARE SHAPES ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔵">What Are Shapes?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Shapes are the form or outline of objects around us. We see shapes everywhere—in buildings, toys, books, and signs! Learning shapes helps us understand objects better.
                                </p>
                            </Section>

                            {/* ──────────── 2D SHAPES ──────────── */}
                            <Section>
                                <SectionTitle emoji="📐">Two-Dimensional (2D) Shapes</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    2D shapes are <strong>flat</strong> shapes. They only have length and width, and are usually drawn on paper.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { name: 'Circle', desc: 'Round shape', icon: '🔴', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
                                        { name: 'Square', desc: '4 equal sides', icon: '🟦', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                                        { name: 'Triangle', desc: '3 sides', icon: '🔺', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
                                        { name: 'Rectangle', desc: '4 sides, opposite sides equal', icon: '🟩', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: item.bg, borderRadius: '14px', padding: '24px', textAlign: 'center', border: `1px solid ${item.border}` }}>
                                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.icon}</div>
                                            <h3 style={{ fontSize: '20px', fontWeight: 800, color: item.color, margin: '0 0 8px' }}>{item.name}</h3>
                                            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── 3D SHAPES ──────────── */}
                            <Section>
                                <SectionTitle emoji="🧊">Three-Dimensional (3D) Shapes</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    3D shapes are <strong>solid</strong> shapes. They have length, width, and height. 3D shapes can be held and touched!
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { name: 'Cube', desc: 'Like a dice', icon: '🎲', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
                                        { name: 'Sphere', desc: 'Like a ball', icon: '⚾', color: '#EA580C', bg: '#FFF7ED', border: '#FFEDD5' },
                                        { name: 'Cylinder', desc: 'Like a can', icon: '🛢️', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
                                        { name: 'Cone', desc: 'Like an ice cream cone', icon: '🍦', color: '#DB2777', bg: '#FDF2F8', border: '#FBCFE8' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: item.bg, borderRadius: '14px', padding: '24px', textAlign: 'center', border: `1px solid ${item.border}` }}>
                                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.icon}</div>
                                            <h3 style={{ fontSize: '20px', fontWeight: 800, color: item.color, margin: '0 0 8px' }}>{item.name}</h3>
                                            <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── SHAPES AROUND US ──────────── */}
                            <Section>
                                <SectionTitle emoji="🏡">Shapes in Daily Life</SectionTitle>
                                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                                    <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                        Many objects around us have different shapes. Can you spot them?
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                        {[
                                            { obj: 'Ball', shape: 'Sphere' },
                                            { obj: 'Dice', shape: 'Cube' },
                                            { obj: 'Pizza slice', shape: 'Triangle' },
                                            { obj: 'Window', shape: 'Rectangle' }
                                        ].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #CBD5E1' }}>
                                                <span style={{ fontSize: '16px', fontWeight: 700, color: '#334155' }}>{item.obj}</span>
                                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0EA5E9', background: '#F0F9FF', padding: '4px 12px', borderRadius: '99px' }}>{item.shape}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── PATTERNS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🧩">Shape Patterns</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Shapes can form <strong>patterns</strong> when they repeat in order. Patterns help us recognize order!
                                </p>
                                <div style={{ background: '#FEF2F2', borderRadius: '16px', padding: '24px', border: '1px solid #FECACA', textAlign: 'center' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#991B1B', margin: '0 0 16px' }}>Example Pattern:</h4>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', fontSize: '40px' }}>
                                        🔴 🟦 🔴 🟦
                                    </div>
                                    <div style={{ marginTop: '16px', fontSize: '16px', fontWeight: 600, color: '#B91C1C' }}>
                                        Circle → Square → Circle → Square
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'reading-sentences' && (
                        <>
                            {/* ──────────── WHAT IS A SENTENCE ──────────── */}
                            <Section>
                                <SectionTitle emoji="📝">What is a Sentence?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    A sentence is a group of words that makes a <strong>complete meaning</strong>. Sentences help us express ideas and thoughts.
                                </p>
                                <div style={{ background: '#FEF3C7', borderRadius: '16px', padding: '24px', border: '1px solid #FDE68A' }}>
                                    <p style={{ fontSize: '16px', color: '#92400E', fontWeight: 600, margin: '0 0 16px' }}>
                                        A sentence usually begins with a <strong>capital letter</strong> and ends with a <strong>full stop</strong>.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            'The cat is sleeping.',
                                            'The sun is bright.',
                                            'I like apples.'
                                        ].map((sentence, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', border: '1px solid #FCD34D', fontSize: '18px', fontWeight: 700, color: '#B45309' }}>
                                                {sentence}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── EXAMPLES OF SIMPLE SENTENCES ──────────── */}
                            <Section>
                                <SectionTitle emoji="✨">Examples of Simple Sentences</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Reading simple sentences helps improve language skills! Let's read these together:
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { title: 'Example 1', text: 'The dog runs fast.', color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
                                        { title: 'Example 2', text: 'The boy is playing.', color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0' },
                                        { title: 'Example 3', text: 'The bird is flying.', color: '#9333EA', bg: '#F5F3FF', border: '#DDD6FE' },
                                        { title: 'Example 4', text: 'The sun is shining.', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
                                        { title: 'Example 5', text: 'I like ice cream.', color: '#BE185D', bg: '#FDF2F8', border: '#FBCFE8' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: item.bg, borderRadius: '14px', padding: '20px', textAlign: 'center', border: `1px solid ${item.border}` }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: item.color, margin: '0 0 8px', opacity: 0.8 }}>{item.title}</p>
                                            <p style={{ fontSize: '18px', fontWeight: 800, color: item.color, margin: 0 }}>"{item.text}"</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── SENTENCE WITH PICTURES ──────────── */}
                            <Section>
                                <SectionTitle emoji="🖼️">Reading with Pictures</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Pictures help us understand sentences better. Look at the picture and read the sentence!
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    {[
                                        { emoji: '🐱', text: 'The cat is sleeping.' },
                                        { emoji: '🐶', text: 'The dog is barking.' },
                                        { emoji: '🌞', text: 'The sun is shining.' },
                                        { emoji: '🍎', text: 'The apple is red.' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                                            <div style={{ fontSize: '40px', background: '#FFFFFF', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                                {item.emoji}
                                            </div>
                                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#334155' }}>
                                                {item.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE READING ──────────── */}
                            <Section>
                                <SectionTitle emoji="🗣️">Practice Reading Sentences</SectionTitle>
                                <div style={{ background: '#EEF2FF', borderRadius: '16px', padding: '24px', border: '1px solid #C7D2FE' }}>
                                    <p style={{ fontSize: '16px', color: '#4338CA', fontWeight: 600, margin: '0 0 20px' }}>
                                        Read these sentences aloud loud and clear! 📣
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {[
                                            { title: 'Example 1', text: 'The girl is reading a book. 📖' },
                                            { title: 'Example 2', text: 'The boy is playing football. ⚽' },
                                            { title: 'Example 3', text: 'The flowers are beautiful. 🌸' }
                                        ].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '20px', borderLeft: '6px solid #6366F1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#818CF8', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.title}</p>
                                                <p style={{ fontSize: '20px', fontWeight: 800, color: '#4F46E5', margin: 0 }}>"{item.text}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'phonics-practice' && (
                        <>
                            {/* ──────────── WHAT IS PHONICS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🗣️">What is Phonics?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Phonics helps us learn how letters <strong>sound</strong> and how these sounds form words. When we know the sounds of letters, it becomes easier to read and pronounce words!
                                </p>
                                <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '24px', border: '1px solid #BBF7D0' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                                        {[
                                            { letter: 'A', sound: '/a/', word: 'Apple', emoji: '🍎', color: '#DC2626' },
                                            { letter: 'B', sound: '/b/', word: 'Ball', emoji: '⚽', color: '#2563EB' },
                                            { letter: 'C', sound: '/k/', word: 'Cat', emoji: '🐱', color: '#D97706' }
                                        ].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #86EFAC', textAlign: 'center' }}>
                                                <div style={{ fontSize: '32px', fontWeight: 900, color: item.color, marginBottom: '8px' }}>{item.letter}</div>
                                                <div style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A', marginBottom: '8px' }}>{item.sound}</div>
                                                <div style={{ fontSize: '24px' }}>{item.emoji}</div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569', marginTop: '4px' }}>{item.word}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#16A34A', fontWeight: 600, textAlign: 'center', margin: '16px 0 0 0' }}>
                                        Phonics connects letters with sounds! 🎶
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── COMMON PHONICS SOUNDS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🧩">Common Phonics Sounds</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Some letters combine to make <strong>new sounds</strong>. Learning these combinations helps us read longer words.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    {[
                                        { sound: 'ch', word: 'chair', emoji: '🪑', bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
                                        { sound: 'sh', word: 'ship', emoji: '🚢', bg: '#FDF2F8', border: '#FBCFE8', color: '#BE185D' },
                                        { sound: 'th', word: 'thumb', emoji: '👍', bg: '#FFFBEB', border: '#FDE68A', color: '#D97706' },
                                        { sound: 'ph', word: 'phone', emoji: '📱', bg: '#F5F3FF', border: '#DDD6FE', color: '#7C3AED' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '12px', background: item.bg, border: `1px solid ${item.border}` }}>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontSize: '28px', fontWeight: 900, color: item.color }}>{item.sound}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '18px', fontWeight: 700, color: '#475569' }}>→</span>
                                                <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#334155' }}>{item.word}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── MORE EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="✨">Examples of Phonics Words</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Practicing phonics helps us read correctly!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { sound: 'ch', words: 'chair, cheese', color: '#0369A1', bg: '#E0F2FE' },
                                        { sound: 'sh', words: 'ship, shoe', color: '#B91C1C', bg: '#FEE2E2' },
                                        { sound: 'th', words: 'thumb, three', color: '#4D7C0F', bg: '#ECFCCB' },
                                        { sound: 'ph', words: 'phone, elephant', color: '#6D28D9', bg: '#EDE9FE' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderRadius: '12px', background: item.bg }}>
                                            <div style={{ width: '60px', fontSize: '24px', fontWeight: 900, color: item.color }}>{item.sound}</div>
                                            <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>→ {item.words}</div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE READING ──────────── */}
                            <Section>
                                <SectionTitle emoji="📖">Practice Reading Words</SectionTitle>
                                <div style={{ background: '#FFF7ED', borderRadius: '16px', padding: '24px', border: '1px solid #FFEDD5', textAlign: 'center' }}>
                                    <p style={{ fontSize: '16px', color: '#C2410C', fontWeight: 600, margin: '0 0 20px' }}>
                                        Can you read these words aloud?
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                                        {['ship', 'chair', 'thumb', 'phone', 'shoe'].map((word, i) => (
                                            <span key={i} style={{ display: 'inline-block', background: '#FFFFFF', padding: '12px 24px', borderRadius: '99px', fontSize: '20px', fontWeight: 800, color: '#EA580C', border: '2px solid #FDBA74', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'simple-words' && (
                        <>
                            {/* ──────────── WHAT ARE SIMPLE WORDS ──────────── */}
                            <Section>
                                <SectionTitle emoji="📝">What Are Simple Words?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Simple words are everyday words that we use while speaking and writing. Learning new words helps us communicate better and understand sentences easily!
                                </p>
                                <div style={{ background: '#F0F9FF', borderRadius: '16px', padding: '24px', border: '1px solid #BAE6FD' }}>
                                    <p style={{ fontSize: '16px', color: '#0369A1', fontWeight: 600, margin: '0 0 16px' }}>
                                        Examples of simple words we use to describe people, places, and things:
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {['happy 😊', 'school 🏫', 'garden 🌻', 'friend 🤝', 'teacher 👩‍🏫', 'animal 🐶'].map((word, i) => (
                                            <span key={i} style={{ display: 'inline-block', background: '#FFFFFF', padding: '10px 20px', borderRadius: '99px', fontSize: '16px', fontWeight: 700, color: '#0284C7', border: '1px solid #7DD3FC', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── VOCABULARY EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="💡">Common Everyday Words</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                    {[
                                        { word: 'Happy', meaning: 'Feeling good or joyful.', icon: '😊', bg: '#FEF9C3', color: '#A16207' },
                                        { word: 'School', meaning: 'A place where children go to learn.', icon: '🏫', bg: '#E0E7FF', color: '#4338CA' },
                                        { word: 'Garden', meaning: 'A place where plants and flowers grow.', icon: '🌻', bg: '#DCFCE7', color: '#15803D' },
                                        { word: 'Friend', meaning: 'A person you like and spend time with.', icon: '🤝', bg: '#FFE4E6', color: '#BE123C' },
                                        { word: 'Teacher', meaning: 'A person who helps students learn.', icon: '👩‍🏫', bg: '#F3E8FF', color: '#7E22CE' },
                                        { word: 'Animal', meaning: 'A living creature like a dog, cat, or lion.', icon: '🐶', bg: '#FFEDD5', color: '#C2410C' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: item.bg, padding: '20px', borderRadius: '16px' }}>
                                            <div style={{ fontSize: '32px' }}>{item.icon}</div>
                                            <div>
                                                <h3 style={{ fontSize: '20px', fontWeight: 800, color: item.color, margin: '0 0 4px' }}>{item.word}</h3>
                                                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: 1.5 }}>"{item.meaning}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── WORDS IN SENTENCES ──────────── */}
                            <Section>
                                <SectionTitle emoji="✨">Using Words in Sentences</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Words become meaningful when used in sentences. Let's practice!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { sentence: 'I am happy today.', word: 'happy' },
                                        { sentence: 'My school is big.', word: 'school' },
                                        { sentence: 'We play in the garden.', word: 'garden' },
                                        { sentence: 'She is my best friend.', word: 'friend' },
                                        { sentence: 'Our teacher is kind.', word: 'teacher' }
                                    ].map((item, i) => {
                                        // Highlight the target word inside the sentence
                                        const parts = item.sentence.split(new RegExp(`(${item.word})`, 'i'));
                                        return (
                                            <div key={i} style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '18px', color: '#334155' }}>
                                                {parts.map((part, index) =>
                                                    part.toLowerCase() === item.word.toLowerCase()
                                                        ? <strong key={index} style={{ color: '#0EA5E9', background: '#E0F2FE', padding: '2px 8px', borderRadius: '6px' }}>{part}</strong>
                                                        : <span key={index}>{part}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE READING WORDS ──────────── */}
                            <Section>
                                <SectionTitle emoji="📖">Practice Reading</SectionTitle>
                                <div style={{ background: '#FAF5FF', borderRadius: '16px', padding: '24px', border: '1px solid #E9D5FF', textAlign: 'center' }}>
                                    <p style={{ fontSize: '16px', color: '#7E22CE', fontWeight: 600, margin: '0 0 20px' }}>
                                        Can you read these words aloud?
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                                        {['window', 'pencil', 'basket', 'market', 'flower', 'school', 'teacher'].map((word, i) => (
                                            <span key={i} style={{ display: 'inline-block', background: '#FFFFFF', padding: '12px 24px', borderRadius: '99px', fontSize: '20px', fontWeight: 800, color: '#9333EA', border: '2px solid #D8B4FE', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'opposite-words' && (
                        <>
                            {/* ──────────── WHAT ARE OPPOSITE WORDS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔄">What Are Opposite Words?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Opposite words are words that have <strong>completely different meanings</strong>. They help us describe things clearly and improve our vocabulary!
                                </p>
                                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                                    <p style={{ fontSize: '15px', color: '#64748B', fontStyle: 'italic', margin: '0 0 16px', textAlign: 'center' }}>
                                        (Opposite words are also called <strong>antonyms</strong>)
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                                        {[
                                            { left: 'Big', right: 'Small', emojis: '🐘 ↔️ 🐁', color: '#EAB308', bg: '#FEFCE8' },
                                            { left: 'Hot', right: 'Cold', emojis: '☕ ↔️ 🧊', color: '#EF4444', bg: '#FEF2F2' },
                                            { left: 'Day', right: 'Night', emojis: '☀️ ↔️ 🌙', color: '#3B82F6', bg: '#EFF6FF' }
                                        ].map((pair, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: pair.bg, padding: '16px 32px', borderRadius: '99px', border: `2px dashed ${pair.color}40`, width: '100%', maxWidth: '400px', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '20px', fontWeight: 800, color: pair.color }}>{pair.left}</span>
                                                <span style={{ fontSize: '24px' }}>{pair.emojis}</span>
                                                <span style={{ fontSize: '20px', fontWeight: 800, color: pair.color }}>{pair.right}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Section>

                            {/* ──────────── COMMON OPPOSITE WORDS ──────────── */}
                            <Section>
                                <SectionTitle emoji="📚">Examples of Opposite Words</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Each word has another word with the exact opposite meaning!
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { left: 'Big', right: 'Small', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
                                        { left: 'Hot', right: 'Cold', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
                                        { left: 'Fast', right: 'Slow', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
                                        { left: 'Happy', right: 'Sad', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
                                        { left: 'Open', right: 'Close', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
                                        { left: 'Tall', right: 'Short', color: '#14B8A6', bg: '#F0FDFA', border: '#99F6E4' },
                                        { left: 'Up', right: 'Down', color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE' },
                                        { left: 'Day', right: 'Night', color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8' }
                                    ].map((pair, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: pair.bg, padding: '20px', borderRadius: '14px', border: `1px solid ${pair.border}` }}>
                                            <span style={{ fontSize: '18px', fontWeight: 800, color: pair.color }}>{pair.left}</span>
                                            <span style={{ fontSize: '20px', color: '#94A3B8' }}>↔️</span>
                                            <span style={{ fontSize: '18px', fontWeight: 800, color: pair.color }}>{pair.right}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── OPPOSITE WORDS IN SENTENCES ──────────── */}
                            <Section>
                                <SectionTitle emoji="✏️">Using Opposite Words in Sentences</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Opposite words help us describe differences. Look at these examples:
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                                        { text: 'The elephant is big, but the mouse is small.', words: ['big', 'small'] },
                                        { text: 'The soup is hot, but the ice cream is cold.', words: ['hot', 'cold'] },
                                        { text: 'The rabbit runs fast, but the turtle moves slow.', words: ['fast', 'slow'] },
                                        { text: 'The boy is happy, but the girl is sad.', words: ['happy', 'sad'] }
                                    ].map((item, i) => {
                                        // Build highlighted sentence
                                        let highlightedText = item.text;
                                        item.words.forEach(word => {
                                            highlightedText = highlightedText.replace(
                                                new RegExp(`\\b${word}\\b`, 'gi'),
                                                `<strong style="color: #6366F1; background: #EEF2FF; padding: 2px 6px; border-radius: 6px;">$&</strong>`
                                            );
                                        });

                                        return (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '16px 24px', borderRadius: '12px', borderLeft: '6px solid #8B5CF6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '18px', color: '#334155' }} dangerouslySetInnerHTML={{ __html: highlightedText }} />
                                        );
                                    })}
                                </div>
                            </Section>

                            {/* ──────────── PRACTICE READING OPPOSITE WORDS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🗣️">Practice Opposite Words</SectionTitle>
                                <div style={{ background: '#FFF7ED', borderRadius: '16px', padding: '24px', border: '1px solid #FFEDD5', textAlign: 'center' }}>
                                    <p style={{ fontSize: '16px', color: '#C2410C', fontWeight: 600, margin: '0 0 20px' }}>
                                        Read these opposite pairs aloud!
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                                        {[
                                            'Light ↔ Dark',
                                            'Full ↔ Empty',
                                            'Near ↔ Far',
                                            'Clean ↔ Dirty',
                                            'Early ↔ Late'
                                        ].map((pair, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', fontSize: '20px', fontWeight: 800, color: '#EA580C', border: '2px dashed #FDBA74', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                {pair}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'simple-grammar' && (
                        <>
                            {/* ──────────── WHAT IS GRAMMAR ──────────── */}
                            <Section>
                                <SectionTitle emoji="✍️">What is Grammar?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    Grammar helps us form <strong>correct sentences</strong> in a language. It tells us how words should be used together!
                                </p>
                                <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '24px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                                    <p style={{ fontSize: '18px', color: '#16A34A', fontWeight: 700, margin: 0 }}>
                                        Learning grammar helps us speak and write clearly. 🌟
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── NOUNS ──────────── */}
                            <Section>
                                <SectionTitle emoji="🏷️">Nouns – Names of People, Places, and Things</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    A noun is the <strong>name</strong> of a person, place, animal, or thing.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                                    {[
                                        { category: 'Person', examples: 'teacher, doctor', icon: '👩‍🏫', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                                        { category: 'Place', examples: 'school, park', icon: '🏫', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
                                        { category: 'Animal', examples: 'dog, cat', icon: '🐶', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
                                        { category: 'Thing', examples: 'book, pencil', icon: '✏️', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' }
                                    ].map((cat, i) => (
                                        <div key={i} style={{ background: cat.bg, padding: '16px', borderRadius: '12px', border: `1px solid ${cat.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ fontSize: '32px' }}>{cat.icon}</div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 700, color: cat.color, textTransform: 'uppercase' }}>{cat.category}</div>
                                                <div style={{ fontSize: '16px', fontWeight: 600, color: '#334155' }}>{cat.examples}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '6px solid #3B82F6' }}>
                                    <p style={{ fontSize: '14px', color: '#64748B', fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase' }}>Example Sentence:</p>
                                    <p style={{ fontSize: '18px', color: '#334155', margin: 0 }}>
                                        The <strong style={{ color: '#2563EB', textDecoration: 'underline' }}>dog</strong> is playing.
                                        <span style={{ fontSize: '14px', color: '#64748B', marginLeft: '8px' }}>(Dog is an animal noun)</span>
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── PRONOUNS ──────────── */}
                            <Section>
                                <SectionTitle emoji="👤">Pronouns – Words that Replace Nouns</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Pronouns are words that <strong>take the place of nouns</strong> so we don't have to repeat the same name over and over.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                                    {['I', 'You', 'He', 'She', 'It', 'We', 'They'].map((pronoun, i) => (
                                        <span key={i} style={{ background: '#FEF2F2', padding: '10px 24px', borderRadius: '99px', border: '1px solid #FECACA', color: '#DC2626', fontSize: '18px', fontWeight: 800 }}>
                                            {pronoun}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ background: '#FFF7ED', padding: '20px', borderRadius: '16px', border: '1px solid #FFEDD5' }}>
                                    <p style={{ fontSize: '16px', color: '#C2410C', fontWeight: 700, margin: '0 0 16px' }}>See how it works:</p>
                                    <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #FDBA74' }}>
                                        <p style={{ fontSize: '18px', margin: '0 0 8px', color: '#334155' }}><strong>Ravi</strong> is playing.</p>
                                        <p style={{ fontSize: '18px', margin: 0, color: '#334155' }}><strong style={{ color: '#EA580C' }}>He</strong> is playing.</p>
                                    </div>
                                    <p style={{ fontSize: '15px', color: '#9A3412', margin: 0 }}>
                                        Check it out! <strong style={{ background: '#FFEDD5', padding: '2px 6px', borderRadius: '4px' }}>He</strong> replaces the name Ravi!
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── USE OF IS, AM, ARE ──────────── */}
                            <Section>
                                <SectionTitle emoji="🔗">Using Is, Am, Are</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    We use <strong>is</strong>, <strong>am</strong>, and <strong>are</strong> to connect words and form clear sentences.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                                    {[
                                        { word: 'am', pairs: 'I → am', color: '#9333EA', bg: '#FAF5FF', border: '#E9D5FF' },
                                        { word: 'is', pairs: 'He / She / It → is', color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' },
                                        { word: 'are', pairs: 'We / You / They → are', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: item.bg, padding: '20px', borderRadius: '12px', border: `1px solid ${item.border}`, textAlign: 'center' }}>
                                            <div style={{ fontSize: '32px', fontWeight: 900, color: item.color, marginBottom: '12px' }}>{item.word}</div>
                                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>{item.pairs}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        'I <strong>am</strong> happy.',
                                        'She <strong>is</strong> reading a book.',
                                        'They <strong>are</strong> playing football.'
                                    ].map((sentence, i) => (
                                        <div key={i} style={{ background: '#F8FAFC', padding: '12px 20px', borderRadius: '12px', fontSize: '18px', color: '#334155', border: '1px solid #E2E8F0' }} dangerouslySetInnerHTML={{ __html: sentence }} />
                                    ))}
                                </div>
                            </Section>

                            {/* ──────────── SENTENCE EXAMPLES ──────────── */}
                            <Section>
                                <SectionTitle emoji="✨">Simple Grammar in Sentences</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                    Grammar helps make our sentences clear and correct!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                                        { text: 'The boy is running.', icon: '🏃‍♂️' },
                                        { text: 'I am a student.', icon: '🎓' },
                                        { text: 'They are playing in the park.', icon: '🛝' },
                                        { text: 'She is reading a book.', icon: '📖' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#FFFFFF', padding: '16px 24px', borderRadius: '12px', borderLeft: '6px solid #F59E0B', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '28px' }}>{item.icon}</span>
                                            <span style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </>
                    )}

                    {classId === '2' && chapterId === 'rhymes-stories' && (
                        <>
                            {/* ──────────── WHAT ARE RHYMES AND STORIES ──────────── */}
                            <Section>
                                <SectionTitle emoji="📖">What Are Rhymes and Stories?</SectionTitle>
                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                    <strong>Rhymes</strong> are short poems or songs with repeating sounds. <strong>Stories</strong> are short narratives that tell about people, animals, or events!
                                </p>
                                <div style={{ background: '#F0F9FF', borderRadius: '16px', padding: '24px', border: '1px solid #BAE6FD', textAlign: 'center' }}>
                                    <p style={{ fontSize: '18px', color: '#0369A1', fontWeight: 700, margin: 0 }}>
                                        Reading rhymes and stories helps us improve our vocabulary, imagination, and reading skills! ✨
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── RHYME EXAMPLE ──────────── */}
                            <Section>
                                <SectionTitle emoji="🎶">A Simple Rhyme</SectionTitle>
                                <div style={{ background: '#FEFCE8', padding: '24px', borderRadius: '16px', border: '1px solid #FEF08A', marginBottom: '20px' }}>
                                    <p style={{ fontSize: '20px', color: '#854D0E', fontWeight: 700, fontStyle: 'italic', margin: '0 0 16px', lineHeight: 1.8, textAlign: 'center' }}>
                                        "The sun shines bright in the sky,<br />
                                        Birds fly happily up high.<br />
                                        Children laugh and run to play,<br />
                                        Enjoying the warm sunny day."
                                    </p>
                                </div>
                                <div style={{ background: '#FFFBEB', padding: '16px', borderRadius: '12px', borderLeft: '6px solid #F59E0B' }}>
                                    <p style={{ fontSize: '15px', color: '#B45309', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase' }}>Rhyme Vocabulary:</p>
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#451A03', fontSize: '16px' }}>
                                        <li style={{ marginBottom: '8px' }}><strong style={{ color: '#D97706' }}>bright</strong> → shining strongly ☀️</li>
                                        <li><strong style={{ color: '#D97706' }}>happily</strong> → feeling joy 😊</li>
                                    </ul>
                                </div>
                            </Section>

                            {/* ──────────── SHORT STORY ──────────── */}
                            <Section>
                                <SectionTitle emoji="📚">The Honest Boy</SectionTitle>
                                <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                                    <p style={{ fontSize: '18px', color: '#334155', lineHeight: 1.8, margin: '0 0 16px' }}>
                                        Once there was a boy named Arun. One day he found a wallet on the road. The wallet had some money inside.
                                    </p>
                                    <p style={{ fontSize: '18px', color: '#334155', lineHeight: 1.8, margin: '0 0 16px' }}>
                                        Instead of keeping it, Arun took it to the police station. The police found the owner of the wallet and returned it.
                                    </p>
                                    <p style={{ fontSize: '18px', color: '#334155', lineHeight: 1.8, margin: 0 }}>
                                        The owner thanked Arun for his honesty!
                                    </p>
                                </div>
                                <div style={{ background: '#DCFCE7', padding: '16px 24px', borderRadius: '12px', border: '1px solid #86EFAC', textAlign: 'center' }}>
                                    <p style={{ fontSize: '14px', color: '#166534', fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase' }}>Moral of the story:</p>
                                    <p style={{ fontSize: '22px', color: '#15803D', fontWeight: 800, margin: 0 }}>
                                        Honesty is always the best policy. 🌟
                                    </p>
                                </div>
                            </Section>

                            {/* ──────────── READING PRACTICE ──────────── */}
                            <Section>
                                <SectionTitle emoji="🗣️">Practice Reading</SectionTitle>
                                <div style={{ background: '#F5F3FF', borderRadius: '16px', padding: '24px', border: '1px solid #DDD6FE' }}>
                                    <p style={{ fontSize: '16px', color: '#6D28D9', fontWeight: 600, margin: '0 0 20px', textAlign: 'center' }}>
                                        Let's read these sentences aloud together!
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            'The boy found a wallet. 👛',
                                            'He returned it to the police. 👮',
                                            'The owner was very happy. 😄',
                                            'Honesty makes people respect us. 🤝'
                                        ].map((sentence, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '16px 24px', borderRadius: '12px', borderLeft: '6px solid #8B5CF6', fontSize: '18px', color: '#4C1D95', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                {sentence}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                {classId === '2' && chapterId === 'my-family' && (
                    <>
                        {/* ──────────── WHAT IS A FAMILY ──────────── */}
                        <Section>
                            <SectionTitle emoji="👨‍👩‍👧‍👦">What is a Family?</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                A <strong>family</strong> is a group of people who live together and care for each other.
                            </p>
                            <div style={{ background: '#FEF2F2', borderRadius: '16px', padding: '24px', border: '1px solid #FECACA', textAlign: 'center', marginBottom: '20px' }}>
                                <p style={{ fontSize: '18px', color: '#DC2626', fontWeight: 700, margin: 0 }}>
                                    Family members love, help, and support one another. ❤️
                                </p>
                                <p style={{ fontSize: '16px', color: '#EF4444', margin: '8px 0 0 0' }}>
                                    A family helps children grow, learn good habits, and feel safe.
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {[
                                    { name: 'Father', emoji: '👨' },
                                    { name: 'Mother', emoji: '👩' },
                                    { name: 'Brother', emoji: '👦' },
                                    { name: 'Sister', emoji: '👧' },
                                    { name: 'Grandfather', emoji: '👴' },
                                    { name: 'Grandmother', emoji: '👵' }
                                ].map((member, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', padding: '12px 20px', borderRadius: '99px', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 600, color: '#334155' }}>
                                        <span>{member.emoji}</span>
                                        <span>{member.name}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* ──────────── TYPES OF FAMILIES ──────────── */}
                        <Section>
                            <SectionTitle emoji="🏡">Types of Families</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                There are different types of families, and they are all loving and supportive!
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {/* Small Family */}
                                <div style={{ background: '#F0FDF4', padding: '24px', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                                    <h3 style={{ fontSize: '20px', color: '#16A34A', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🏠 Small Family <span style={{ fontSize: '14px', color: '#22C55E', fontWeight: 'normal' }}>(Nuclear)</span>
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#15803D', margin: '0 0 16px' }}>
                                        A family with parents and their children.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['👨 Father', '👩 Mother', '🧒 Children'].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', fontSize: '16px', color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Joint Family */}
                                <div style={{ background: '#EFF6FF', padding: '24px', borderRadius: '16px', border: '1px solid #BFDBFE' }}>
                                    <h3 style={{ fontSize: '20px', color: '#2563EB', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🏘️ Joint Family
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#1D4ED8', margin: '0 0 16px' }}>
                                        A large family living together.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['👴👵 Grandparents', '👨👩 Parents', '🧒 Children', '👨‍🦱👩‍🦱 Uncles & Aunts'].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', fontSize: '16px', color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── ROLES IN A FAMILY ──────────── */}
                        <Section>
                            <SectionTitle emoji="🤝">Roles in a Family</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                Every family member has responsibilities.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                {[
                                    { text: 'Parents take care of children.', icon: '🛡️' },
                                    { text: 'Children should respect elders.', icon: '🙏' },
                                    { text: 'Family members help each other.', icon: '💞' }
                                ].map((role, i) => (
                                    <div key={i} style={{ background: '#FFFFFF', padding: '16px 24px', borderRadius: '12px', borderLeft: '6px solid #8B5CF6', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <span style={{ fontSize: '24px' }}>{role.icon}</span>
                                        <span style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>{role.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: '#F8FAFC', padding: '16px 24px', borderRadius: '12px', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '20px' }}>🗣️</span>
                                <span style={{ fontSize: '18px', color: '#475569', fontStyle: 'italic' }}>"I help my mother at home."</span>
                            </div>
                        </Section>

                        {/* ──────────── HELPING FAMILY MEMBERS ──────────── */}
                        <Section>
                            <SectionTitle emoji="🧹">Helping at Home</SectionTitle>
                            <div style={{ background: '#FFFBEB', borderRadius: '16px', padding: '24px', border: '1px solid #FEF08A' }}>
                                <p style={{ fontSize: '18px', color: '#B45309', fontWeight: 700, margin: '0 0 20px', textAlign: 'center' }}>
                                    Helping family members keeps the home happy! ✨
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    {[
                                        { text: 'Cleaning our room', icon: '🛏️' },
                                        { text: 'Helping parents', icon: '🍽️' },
                                        { text: 'Taking care of younger siblings', icon: '👶' },
                                        { text: 'Sharing household work', icon: '🤲' }
                                    ].map((task, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '24px' }}>{task.icon}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#451A03' }}>{task.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>
                    </>
                )}

                {/* ══════════════════════════════════════════════════════════════════════════
                   CLASS 2 - FOOD WE EAT
                ══════════════════════════════════════════════════════════════════════════ */}
                {classId === '2' && chapterId === 'food-we-eat' && (
                    <>
                        {/* ──────────── WHY DO WE NEED FOOD ──────────── */}
                        <Section id="lesson-content">
                            <SectionTitle emoji="🍽️">Why Do We Need Food?</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                <strong>Food</strong> gives us energy to work, play, and grow.
                            </p>
                            <div style={{ background: '#FEF3C7', borderRadius: '16px', padding: '24px', border: '1px solid #FDE68A', textAlign: 'center', marginBottom: '20px' }}>
                                <p style={{ fontSize: '18px', color: '#B45309', fontWeight: 700, margin: 0 }}>
                                    Food helps us stay healthy and strong! 💪
                                </p>
                                <p style={{ fontSize: '16px', color: '#D97706', margin: '8px 0 0 0' }}>
                                    We need food every day to live.
                                </p>
                            </div>
                            <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                                <p style={{ fontSize: '16px', color: '#334155', fontWeight: 600, marginBottom: '16px' }}>Examples of food we eat:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {[
                                        { name: 'Rice', emoji: '🍚' },
                                        { name: 'Fruits', emoji: '🍎' },
                                        { name: 'Vegetables', emoji: '🥕' },
                                        { name: 'Milk', emoji: '🥛' },
                                        { name: 'Eggs', emoji: '🥚' }
                                    ].map((food, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '12px 20px', borderRadius: '99px', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 600, color: '#334155', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '24px' }}>{food.emoji}</span>
                                            <span>{food.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── TYPES OF FOOD ──────────── */}
                        <Section>
                            <SectionTitle emoji="🥗">Different Types of Food</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                There are many kinds of food that we eat every day. Healthy foods help our body grow strong!
                            </p>
                            <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '24px', border: '1px solid #BBF7D0' }}>
                                <p style={{ fontSize: '18px', color: '#16A34A', fontWeight: 700, margin: '0 0 20px', textAlign: 'center' }}>
                                    Healthy Foods Include: 🌟
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                                    {[
                                        { name: 'Fruits', emoji: '🍇', color: '#8B5CF6' },
                                        { name: 'Vegetables', emoji: '🥦', color: '#22C55E' },
                                        { name: 'Milk', emoji: '🥛', color: '#3B82F6' },
                                        { name: 'Grains', emoji: '🌾', color: '#F59E0B' },
                                        { name: 'Eggs', emoji: '🥚', color: '#EF4444' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `2px solid ${item.color}20` }}>
                                            <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>{item.emoji}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: item.color }}>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── FOOD FROM PLANTS ──────────── */}
                        <Section>
                            <SectionTitle emoji="🌱">Food from Plants</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                Many foods come from <strong>plants</strong>. Plants give us many kinds of food!
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                <div style={{ background: '#ECFDF5', padding: '24px', borderRadius: '16px', border: '1px solid #A7F3D0' }}>
                                    <h3 style={{ fontSize: '18px', color: '#047857', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🌾 Grains
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[
                                            { food: 'Rice', source: 'from rice plants' },
                                            { food: 'Wheat', source: 'from wheat plants' }
                                        ].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: '10px', fontSize: '15px', color: '#065F46', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 700 }}>{item.food}</span>
                                                <span style={{ fontSize: '13px', color: '#10B981' }}>→ {item.source}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ background: '#FEF3C7', padding: '24px', borderRadius: '16px', border: '1px solid #FDE68A' }}>
                                    <h3 style={{ fontSize: '18px', color: '#B45309', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🍎 Fruits
                                    </h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {['🍎 Apples', '🍌 Bananas', '🥭 Mangoes', '🍊 Oranges'].map((fruit, i) => (
                                            <span key={i} style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '99px', fontSize: '15px', fontWeight: 600, color: '#92400E' }}>{fruit}</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ background: '#F0FDF4', padding: '24px', borderRadius: '16px', border: '1px solid #BBF7D0', gridColumn: 'span 2' }}>
                                    <h3 style={{ fontSize: '18px', color: '#16A34A', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🥕 Vegetables
                                    </h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {['🥕 Carrots', '🥔 Potatoes', '🥬 Spinach', '🍅 Tomatoes', '🫛 Peas'].map((veg, i) => (
                                            <span key={i} style={{ background: '#FFFFFF', padding: '12px 20px', borderRadius: '99px', fontSize: '16px', fontWeight: 600, color: '#15803D', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>{veg}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── FOOD FROM ANIMALS ──────────── */}
                        <Section>
                            <SectionTitle emoji="🐄">Food from Animals</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                Some foods come from <strong>animals</strong>. Animals also provide important food for us!
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                {[
                                    { food: 'Milk', source: 'from cows and goats', emoji: '🥛', animal: '🐄', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
                                    { food: 'Eggs', source: 'from hens', emoji: '🥚', animal: '🐔', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
                                    { food: 'Honey', source: 'from bees', emoji: '🍯', animal: '🐝', color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
                                    { food: 'Fish', source: 'from water animals', emoji: '🐟', animal: '🎣', color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD' }
                                ].map((item, i) => (
                                    <div key={i} style={{ background: item.bg, padding: '24px', borderRadius: '16px', border: `1px solid ${item.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.emoji}</div>
                                        <h4 style={{ fontSize: '18px', fontWeight: 700, color: item.color, margin: '0 0 8px' }}>{item.food}</h4>
                                        <p style={{ fontSize: '14px', color: '#64748B', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                            <span>{item.animal}</span> {item.source}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* ──────────── HEALTHY EATING HABITS ──────────── */}
                        <Section>
                            <SectionTitle emoji="🥗">Healthy Food Habits</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                Eating <strong>healthy food</strong> keeps our body strong. Good food habits help us stay healthy!
                            </p>
                            <div style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '20px', padding: '28px', border: '1px solid #A7F3D0' }}>
                                <p style={{ fontSize: '20px', color: '#047857', fontWeight: 700, margin: '0 0 24px', textAlign: 'center' }}>
                                    ✨ Healthy Habits Include: ✨
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    {[
                                        { habit: 'Eating fresh fruits and vegetables', emoji: '🍎🥕', color: '#16A34A' },
                                        { habit: 'Drinking milk every day', emoji: '🥛', color: '#3B82F6' },
                                        { habit: 'Eating balanced meals', emoji: '🍱', color: '#8B5CF6' },
                                        { habit: 'Avoiding too much junk food', emoji: '🚫🍔', color: '#EF4444' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                                            <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: item.color }}>{item.habit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: '#FEF2F2', borderRadius: '16px', padding: '20px', border: '1px solid #FECACA', marginTop: '20px', textAlign: 'center' }}>
                                <p style={{ fontSize: '18px', color: '#DC2626', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span>❤️</span> Good food habits help us stay healthy and happy! <span>❤️</span>
                                </p>
                            </div>
                        </Section>
                    </>
                )}

                {/* ══════════════════════════════════════════════════════════════════════════
                   CLASS 2 - OUR SCHOOL
                ══════════════════════════════════════════════════════════════════════════ */}
                {classId === '2' && chapterId === 'our-school' && (
                    <>
                        {/* ──────────── WHAT IS A SCHOOL ──────────── */}
                        <Section id="lesson-content">
                            <SectionTitle emoji="🏫">What is a School?</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                A <strong>school</strong> is a place where children go to learn new things.
                            </p>
                            <div style={{ background: '#EFF6FF', borderRadius: '16px', padding: '24px', border: '1px solid #BFDBFE', textAlign: 'center', marginBottom: '20px' }}>
                                <p style={{ fontSize: '18px', color: '#1D4ED8', fontWeight: 700, margin: 0 }}>
                                    In school, students learn subjects like math, English, science, and art! 📚
                                </p>
                                <p style={{ fontSize: '16px', color: '#3B82F6', margin: '8px 0 0 0' }}>
                                    Schools help children gain knowledge and develop good habits.
                                </p>
                            </div>
                            <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                                <p style={{ fontSize: '16px', color: '#334155', fontWeight: 600, marginBottom: '16px' }}>Activities in school:</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                    {[
                                        { activity: 'Reading books', emoji: '📖' },
                                        { activity: 'Writing and drawing', emoji: '✏️' },
                                        { activity: 'Playing with friends', emoji: '🤝' },
                                        { activity: 'Learning new skills', emoji: '🎯' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
                                            <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>{item.emoji}</span>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{item.activity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── PEOPLE IN SCHOOL ──────────── */}
                        <Section>
                            <SectionTitle emoji="👨‍🏫">People Who Work in a School</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                Many people help students learn and grow in school. Everyone works together to create a good learning environment!
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                {[
                                    { role: 'Teachers', desc: 'Teach lessons and help students learn', emoji: '👩‍🏫', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
                                    { role: 'Principal', desc: 'The head of the school', emoji: '👨‍💼', color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD' },
                                    { role: 'Students', desc: 'Children who come to learn', emoji: '👧👦', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
                                    { role: 'Helpers', desc: 'Keep the school clean and organized', emoji: '🧹', color: '#22C55E', bg: '#F0FDF4', border: '#BBF7D0' }
                                ].map((person, i) => (
                                    <div key={i} style={{ background: person.bg, padding: '24px', borderRadius: '16px', border: `1px solid ${person.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{person.emoji}</div>
                                        <h4 style={{ fontSize: '18px', fontWeight: 700, color: person.color, margin: '0 0 8px' }}>{person.role}</h4>
                                        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{person.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* ──────────── SCHOOL PLACES ──────────── */}
                        <Section>
                            <SectionTitle emoji="🏢">Important Places in a School</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                A school has many places where students learn and play. Each place has a special purpose!
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                <div style={{ background: '#EFF6FF', padding: '24px', borderRadius: '16px', border: '1px solid #BFDBFE' }}>
                                    <h3 style={{ fontSize: '20px', color: '#2563EB', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>🏫</span> Classroom
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#1E40AF', margin: 0 }}>Where students study and learn lessons from teachers.</p>
                                </div>
                                <div style={{ background: '#FEF3C7', padding: '24px', borderRadius: '16px', border: '1px solid #FDE68A' }}>
                                    <h3 style={{ fontSize: '20px', color: '#B45309', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>📚</span> Library
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#92400E', margin: 0 }}>Where students read books and find new stories.</p>
                                </div>
                                <div style={{ background: '#F0FDF4', padding: '24px', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                                    <h3 style={{ fontSize: '20px', color: '#16A34A', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>⚽</span> Playground
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#15803D', margin: 0 }}>Where students play games and have fun with friends.</p>
                                </div>
                                <div style={{ background: '#F5F3FF', padding: '24px', borderRadius: '16px', border: '1px solid #DDD6FE' }}>
                                    <h3 style={{ fontSize: '20px', color: '#7C3AED', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>💻</span> Computer Room
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#6D28D9', margin: 0 }}>Where students learn to use computers and technology.</p>
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── SCHOOL RULES ──────────── */}
                        <Section>
                            <SectionTitle emoji="📋">Following School Rules</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                Schools have rules that help students stay safe and learn well. Following rules helps everyone learn happily!
                            </p>
                            <div style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', borderRadius: '20px', padding: '28px', border: '1px solid #FCD34D' }}>
                                <p style={{ fontSize: '20px', color: '#B45309', fontWeight: 700, margin: '0 0 24px', textAlign: 'center' }}>
                                    ⭐ Important School Rules ⭐
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    {[
                                        { rule: 'Listen to teachers', emoji: '👂', color: '#2563EB' },
                                        { rule: 'Respect classmates', emoji: '🤝', color: '#16A34A' },
                                        { rule: 'Keep the classroom clean', emoji: '🧹', color: '#8B5CF6' },
                                        { rule: 'Do homework on time', emoji: '📝', color: '#DC2626' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                                            <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: item.color }}>{item.rule}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '20px', border: '1px solid #BBF7D0', marginTop: '20px', textAlign: 'center' }}>
                                <p style={{ fontSize: '18px', color: '#16A34A', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span>✅</span> Following rules makes school a happy place for everyone! <span>✅</span>
                                </p>
                            </div>
                        </Section>
                    </>
                )}

                {/* ══════════════════════════════════════════════════════════════════════════
                   CLASS 2 - OUR NEIGHBOURHOOD
                ══════════════════════════════════════════════════════════════════════════ */}
                {classId === '2' && chapterId === 'our-neighbourhood' && (
                    <>
                        {/* ──────────── WHAT IS A NEIGHBOURHOOD ──────────── */}
                        <Section id="lesson-content">
                            <SectionTitle emoji="🏠">What is a Neighbourhood?</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                A <strong>neighbourhood</strong> is the area around our home. It includes houses, roads, parks, and places where people work and live.
                            </p>
                            <div style={{ background: '#EFF6FF', borderRadius: '16px', padding: '24px', border: '1px solid #BFDBFE', textAlign: 'center', marginBottom: '20px' }}>
                                <p style={{ fontSize: '18px', color: '#1D4ED8', fontWeight: 700, margin: 0 }}>
                                    People living near our homes are called neighbours! 👫
                                </p>
                                <p style={{ fontSize: '16px', color: '#3B82F6', margin: '8px 0 0 0' }}>
                                    Neighbours help and support each other.
                                </p>
                            </div>
                            <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '20px', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '24px' }}>💬</span>
                                <span style={{ fontSize: '18px', color: '#475569', fontStyle: 'italic' }}>"My neighbours live next to my house."</span>
                            </div>
                        </Section>

                        {/* ──────────── PLACES IN NEIGHBOURHOOD ──────────── */}
                        <Section>
                            <SectionTitle emoji="🏘️">Places Around Us</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                Many useful places are found in our neighbourhood. These places help our daily life!
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                                {[
                                    { place: 'Hospital', desc: 'For medical help', emoji: '🏥', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
                                    { place: 'School', desc: 'For education', emoji: '🏫', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
                                    { place: 'Market', desc: 'To buy food', emoji: '🛒', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
                                    { place: 'Park', desc: 'To play and relax', emoji: '🌳', color: '#22C55E', bg: '#F0FDF4', border: '#BBF7D0' },
                                    { place: 'Police Station', desc: 'For safety', emoji: '👮', color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE' }
                                ].map((item, i) => (
                                    <div key={i} style={{ background: item.bg, padding: '24px 16px', borderRadius: '16px', border: `1px solid ${item.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.emoji}</div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: item.color, margin: '0 0 6px' }}>{item.place}</h4>
                                        <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* ──────────── COMMUNITY HELPERS ──────────── */}
                        <Section>
                            <SectionTitle emoji="🧑‍🤝‍🧑">People Who Help in Our Neighbourhood</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                Many people work to help the community. These helpers make our neighbourhood better!
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                                {[
                                    { role: 'Doctor', desc: 'Treats sick people', emoji: '👨‍⚕️', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
                                    { role: 'Police Officer', desc: 'Protects people', emoji: '👮', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                                    { role: 'Teacher', desc: 'Teaches students', emoji: '👩‍🏫', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
                                    { role: 'Shopkeeper', desc: 'Sells goods', emoji: '🧑‍💼', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
                                    { role: 'Postman', desc: 'Delivers letters', emoji: '📨', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' }
                                ].map((person, i) => (
                                    <div key={i} style={{ background: person.bg, padding: '24px 16px', borderRadius: '16px', border: `1px solid ${person.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{person.emoji}</div>
                                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: person.color, margin: '0 0 6px' }}>{person.role}</h4>
                                        <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{person.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* ──────────── CLEAN NEIGHBOURHOOD ──────────── */}
                        <Section>
                            <SectionTitle emoji="✨">Clean Neighbourhood</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                We should keep our neighbourhood <strong>clean and safe</strong>. A clean neighbourhood keeps everyone healthy!
                            </p>
                            <div style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '20px', padding: '28px', border: '1px solid #A7F3D0' }}>
                                <p style={{ fontSize: '20px', color: '#047857', fontWeight: 700, margin: '0 0 24px', textAlign: 'center' }}>
                                    🌟 Good Habits for a Clean Neighbourhood 🌟
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    {[
                                        { habit: 'Throwing waste in dustbins', emoji: '🗑️', color: '#16A34A' },
                                        { habit: 'Keeping roads clean', emoji: '🛣️', color: '#2563EB' },
                                        { habit: 'Planting trees', emoji: '🌳', color: '#15803D' },
                                        { habit: 'Not wasting water', emoji: '💧', color: '#0EA5E9' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                                            <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: item.color }}>{item.habit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: '#FEF3C7', borderRadius: '16px', padding: '20px', border: '1px solid #FDE68A', marginTop: '20px', textAlign: 'center' }}>
                                <p style={{ fontSize: '18px', color: '#B45309', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span>🏞️</span> A clean neighbourhood is a happy neighbourhood! <span>🏞️</span>
                                </p>
                            </div>
                        </Section>
                    </>
                )}

                {/* ══════════════════════════════════════════════════════════════════════════
                   CLASS 2 - TRANSPORT
                ══════════════════════════════════════════════════════════════════════════ */}
                {classId === '2' && chapterId === 'transport' && (
                    <>
                        {/* ──────────── WHAT IS TRANSPORT ──────────── */}
                        <Section id="lesson-content">
                            <SectionTitle emoji="🚗">What is Transport?</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                <strong>Transport</strong> means moving people or goods from one place to another. We use different vehicles to travel to places like school, market, or park.
                            </p>
                            <div style={{ background: '#EFF6FF', borderRadius: '16px', padding: '24px', border: '1px solid #BFDBFE', textAlign: 'center', marginBottom: '20px' }}>
                                <p style={{ fontSize: '18px', color: '#1D4ED8', fontWeight: 700, margin: 0 }}>
                                    Transport helps us travel quickly and easily! 🚀
                                </p>
                            </div>
                            <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                                <p style={{ fontSize: '16px', color: '#334155', fontWeight: 600, marginBottom: '16px' }}>Examples of transport:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                                    {[
                                        { name: 'Car', emoji: '🚗' },
                                        { name: 'Bus', emoji: '🚌' },
                                        { name: 'Train', emoji: '🚆' },
                                        { name: 'Boat', emoji: '🚤' },
                                        { name: 'Aeroplane', emoji: '✈️' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '14px 24px', borderRadius: '99px', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 600, color: '#334155', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── TYPES OF TRANSPORT ──────────── */}
                        <Section>
                            <SectionTitle emoji="🚦">Different Types of Transport</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                There are <strong>three main types</strong> of transport based on where vehicles move.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {/* Land Transport */}
                                <div style={{ background: '#FEF3C7', padding: '24px', borderRadius: '16px', border: '1px solid #FDE68A' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '48px' }}>🛣️</span>
                                    </div>
                                    <h3 style={{ fontSize: '20px', color: '#B45309', margin: '0 0 12px', textAlign: 'center' }}>
                                        Land Transport
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#92400E', margin: '0 0 16px', textAlign: 'center' }}>Vehicles that move on land</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['🚗 Car', '🚌 Bus', '🚆 Train', '🚲 Bicycle'].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '10px', fontSize: '16px', fontWeight: 600, color: '#B45309', textAlign: 'center' }}>{item}</div>
                                        ))}
                                    </div>
                                </div>
                                {/* Water Transport */}
                                <div style={{ background: '#EFF6FF', padding: '24px', borderRadius: '16px', border: '1px solid #BFDBFE' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '48px' }}>🌊</span>
                                    </div>
                                    <h3 style={{ fontSize: '20px', color: '#2563EB', margin: '0 0 12px', textAlign: 'center' }}>
                                        Water Transport
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#1D4ED8', margin: '0 0 16px', textAlign: 'center' }}>Vehicles that move on water</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['🚤 Boat', '🚢 Ship'].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '10px', fontSize: '16px', fontWeight: 600, color: '#2563EB', textAlign: 'center' }}>{item}</div>
                                        ))}
                                    </div>
                                </div>
                                {/* Air Transport */}
                                <div style={{ background: '#F0FDF4', padding: '24px', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '48px' }}>☁️</span>
                                    </div>
                                    <h3 style={{ fontSize: '20px', color: '#16A34A', margin: '0 0 12px', textAlign: 'center' }}>
                                        Air Transport
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#15803D', margin: '0 0 16px', textAlign: 'center' }}>Vehicles that fly in the sky</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['✈️ Aeroplane', '🚁 Helicopter'].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '10px', fontSize: '16px', fontWeight: 600, color: '#16A34A', textAlign: 'center' }}>{item}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── IMPORTANCE OF TRANSPORT ──────────── */}
                        <Section>
                            <SectionTitle emoji="🌟">Why Transport is Important</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                Transport helps us travel from one place to another. It also helps carry goods like food, clothes, and other items.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                <div style={{ background: '#F5F3FF', padding: '24px', borderRadius: '16px', border: '1px solid #DDD6FE', textAlign: 'center' }}>
                                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🏫</span>
                                    <p style={{ fontSize: '16px', color: '#6D28D9', fontWeight: 600, margin: 0 }}>We travel to school by bus or bicycle</p>
                                </div>
                                <div style={{ background: '#FEF2F2', padding: '24px', borderRadius: '16px', border: '1px solid #FECACA', textAlign: 'center' }}>
                                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📦</span>
                                    <p style={{ fontSize: '16px', color: '#DC2626', fontWeight: 600, margin: 0 }}>Goods are carried by trucks and ships</p>
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── TRANSPORT SAFETY ──────────── */}
                        <Section>
                            <SectionTitle emoji="⚠️">Transport Safety</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                We must follow <strong>safety rules</strong> while traveling. Safety rules protect us from accidents!
                            </p>
                            <div style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)', borderRadius: '20px', padding: '28px', border: '1px solid #FCA5A5' }}>
                                <p style={{ fontSize: '20px', color: '#DC2626', fontWeight: 700, margin: '0 0 24px', textAlign: 'center' }}>
                                    🚨 Important Safety Rules 🚨
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    {[
                                        { rule: 'Wear seat belts in cars', emoji: '🚗', color: '#DC2626' },
                                        { rule: 'Wait for the bus safely', emoji: '🚏', color: '#2563EB' },
                                        { rule: 'Follow traffic signals', emoji: '🚦', color: '#16A34A' },
                                        { rule: 'Do not run on the road', emoji: '🚫', color: '#F59E0B' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                                            <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: item.color }}>{item.rule}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '20px', border: '1px solid #BBF7D0', marginTop: '20px', textAlign: 'center' }}>
                                <p style={{ fontSize: '18px', color: '#16A34A', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span>✅</span> Following safety rules keeps us safe on the road! <span>✅</span>
                                </p>
                            </div>
                        </Section>
                    </>
                )}

                {/* ══════════════════════════════════════════════════════════════════════════
                   CLASS 2 - CLOTHES WE WEAR
                ══════════════════════════════════════════════════════════════════════════ */}
                {classId === '2' && chapterId === 'clothes-we-wear' && (
                    <>
                        {/* ──────────── WHY DO WE WEAR CLOTHES ──────────── */}
                        <Section id="lesson-content">
                            <SectionTitle emoji="👕">Why Do We Wear Clothes?</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                <strong>Clothes</strong> protect our body from heat, cold, rain, and dust. They also keep us comfortable and make us look neat.
                            </p>
                            <div style={{ background: '#F5F3FF', borderRadius: '16px', padding: '24px', border: '1px solid #DDD6FE', textAlign: 'center', marginBottom: '20px' }}>
                                <p style={{ fontSize: '18px', color: '#7C3AED', fontWeight: 700, margin: 0 }}>
                                    Clothes keep us safe and comfortable! 👗
                                </p>
                            </div>
                            <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                                <p style={{ fontSize: '16px', color: '#334155', fontWeight: 600, marginBottom: '16px' }}>Examples of clothes:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                                    {[
                                        { name: 'Shirt', emoji: '👔' },
                                        { name: 'Pants', emoji: '👖' },
                                        { name: 'Dress', emoji: '👗' },
                                        { name: 'T-shirt', emoji: '👕' },
                                        { name: 'Uniform', emoji: '🧑‍🏫' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '14px 24px', borderRadius: '99px', border: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 600, color: '#334155', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── CLOTHES FOR SEASONS ──────────── */}
                        <Section>
                            <SectionTitle emoji="🌦️">Clothes for Seasons</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                We wear <strong>different clothes</strong> in different seasons to stay comfortable.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {/* Summer Clothes */}
                                <div style={{ background: '#FEF3C7', padding: '24px', borderRadius: '16px', border: '1px solid #FDE68A' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '48px' }}>☀️</span>
                                    </div>
                                    <h3 style={{ fontSize: '20px', color: '#B45309', margin: '0 0 12px', textAlign: 'center' }}>
                                        Summer Clothes
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#92400E', margin: '0 0 16px', textAlign: 'center' }}>Light clothes keep us cool</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['👕 Cotton shirts', '🩳 Shorts', '👕 T-shirts'].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#B45309', textAlign: 'center' }}>{item}</div>
                                        ))}
                                    </div>
                                </div>
                                {/* Winter Clothes */}
                                <div style={{ background: '#EFF6FF', padding: '24px', borderRadius: '16px', border: '1px solid #BFDBFE' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '48px' }}>❄️</span>
                                    </div>
                                    <h3 style={{ fontSize: '20px', color: '#2563EB', margin: '0 0 12px', textAlign: 'center' }}>
                                        Winter Clothes
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#1D4ED8', margin: '0 0 16px', textAlign: 'center' }}>Warm clothes keep us warm</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['🧥 Sweaters', '🧥 Jackets', '🧢 Caps'].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#2563EB', textAlign: 'center' }}>{item}</div>
                                        ))}
                                    </div>
                                </div>
                                {/* Rainy Clothes */}
                                <div style={{ background: '#F0FDF4', padding: '24px', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '48px' }}>🌧️</span>
                                    </div>
                                    <h3 style={{ fontSize: '20px', color: '#16A34A', margin: '0 0 12px', textAlign: 'center' }}>
                                        Rainy Season
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#15803D', margin: '0 0 16px', textAlign: 'center' }}>Special clothes for rain</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['🧥 Raincoat', '☂️ Umbrella', '🥾 Boots'].map((item, i) => (
                                            <div key={i} style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#16A34A', textAlign: 'center' }}>{item}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── CLOTHES FOR SPECIAL OCCASIONS ──────────── */}
                        <Section>
                            <SectionTitle emoji="🎉">Clothes for Special Days</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                We wear <strong>special clothes</strong> for different occasions and activities.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {[
                                    { occasion: 'School Uniform', desc: 'Worn in school', emoji: '🏫', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                                    { occasion: 'Party Clothes', desc: 'Worn during celebrations', emoji: '🎈', color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8' },
                                    { occasion: 'Sports Clothes', desc: 'Worn while playing', emoji: '⚽', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' }
                                ].map((item, i) => (
                                    <div key={i} style={{ background: item.bg, padding: '24px', borderRadius: '16px', border: `1px solid ${item.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.emoji}</div>
                                        <h4 style={{ fontSize: '18px', fontWeight: 700, color: item.color, margin: '0 0 8px' }}>{item.occasion}</h4>
                                        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* ──────────── CLEAN CLOTHES ──────────── */}
                        <Section>
                            <SectionTitle emoji="✨">Clean Clothes and Good Habits</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                We should always wear <strong>clean clothes</strong>. Clean clothes help us stay healthy!
                            </p>
                            <div style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderRadius: '20px', padding: '28px', border: '1px solid #A7F3D0' }}>
                                <p style={{ fontSize: '20px', color: '#047857', fontWeight: 700, margin: '0 0 24px', textAlign: 'center' }}>
                                    🌟 Good Habits for Clean Clothes 🌟
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                    {[
                                        { habit: 'Washing clothes regularly', emoji: '🧼', color: '#0EA5E9' },
                                        { habit: 'Keeping clothes neat and folded', emoji: '👕', color: '#8B5CF6' },
                                        { habit: 'Wearing clean uniforms to school', emoji: '🏫', color: '#16A34A' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                                            <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>{item.emoji}</span>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: item.color }}>{item.habit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: '#FEF3C7', borderRadius: '16px', padding: '20px', border: '1px solid #FDE68A', marginTop: '20px', textAlign: 'center' }}>
                                <p style={{ fontSize: '18px', color: '#B45309', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span>👍</span> Clean clothes make us look good and feel healthy! <span>👍</span>
                                </p>
                            </div>
                        </Section>
                    </>
                )}

                {/* ══════════════════════════════════════════════════════════════════════════
                   CLASS 2 - CLEANLINESS & GOOD HABITS
                ══════════════════════════════════════════════════════════════════════════ */}
                {classId === '2' && chapterId === 'cleanliness-good-habits' && (
                    <>
                        {/* ──────────── WHAT IS CLEANLINESS ──────────── */}
                        <Section id="lesson-content">
                            <SectionTitle emoji="✨">What is Cleanliness?</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 16px' }}>
                                <strong>Cleanliness</strong> means keeping our body, clothes, and surroundings clean. Being clean helps us stay healthy and prevents diseases.
                            </p>
                            <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '24px', border: '1px solid #BBF7D0', textAlign: 'center', marginBottom: '20px' }}>
                                <p style={{ fontSize: '18px', color: '#16A34A', fontWeight: 700, margin: 0 }}>
                                    Cleanliness is the key to good health! 🌟
                                </p>
                            </div>
                            <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                                <p style={{ fontSize: '16px', color: '#334155', fontWeight: 600, marginBottom: '16px' }}>Examples of cleanliness:</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                    {[
                                        { habit: 'Taking a bath daily', emoji: '🚿' },
                                        { habit: 'Washing hands before eating', emoji: '👐' },
                                        { habit: 'Wearing clean clothes', emoji: '👕' },
                                        { habit: 'Keeping surroundings tidy', emoji: '🏠' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
                                            <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>{item.emoji}</span>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{item.habit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── PERSONAL HYGIENE ──────────── */}
                        <Section>
                            <SectionTitle emoji="🧹">Keeping Our Body Clean</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                <strong>Personal hygiene</strong> means taking care of our body. Clean habits protect us from germs!
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                {[
                                    { habit: 'Brushing teeth twice a day', emoji: '🪷', color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD' },
                                    { habit: 'Washing hands with soap', emoji: '🧼', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
                                    { habit: 'Cutting nails regularly', emoji: '💅', color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8' },
                                    { habit: 'Taking a bath daily', emoji: '🚿', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' }
                                ].map((item, i) => (
                                    <div key={i} style={{ background: item.bg, padding: '24px 16px', borderRadius: '16px', border: `1px solid ${item.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.emoji}</div>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: item.color, margin: 0 }}>{item.habit}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* ──────────── GOOD HABITS ──────────── */}
                        <Section>
                            <SectionTitle emoji="🌟">Good Daily Habits</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                <strong>Good habits</strong> help us become responsible and healthy people.
                            </p>
                            <div style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '20px', padding: '28px', border: '1px solid #BFDBFE' }}>
                                <p style={{ fontSize: '20px', color: '#2563EB', fontWeight: 700, margin: '0 0 24px', textAlign: 'center' }}>
                                    ⭐ Examples of Good Habits ⭐
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                                    {[
                                        { habit: 'Helping parents at home', emoji: '🏠', color: '#DC2626' },
                                        { habit: 'Respecting elders', emoji: '🙏', color: '#7C3AED' },
                                        { habit: 'Listening to teachers', emoji: '👩‍🏫', color: '#2563EB' },
                                        { habit: 'Speaking politely', emoji: '💬', color: '#16A34A' },
                                        { habit: 'Keeping room clean', emoji: '🛏️', color: '#F59E0B' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                                            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>{item.emoji}</span>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: item.color }}>{item.habit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* ──────────── CLEAN SURROUNDINGS ──────────── */}
                        <Section>
                            <SectionTitle emoji="🌿">Clean Surroundings</SectionTitle>
                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8, margin: '0 0 20px' }}>
                                We should keep our <strong>surroundings clean</strong>. Clean surroundings help everyone stay healthy!
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                {[
                                    { practice: 'Throwing waste in dustbins', emoji: '🗑️', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
                                    { practice: 'Not littering on roads', emoji: '🚫', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
                                    { practice: 'Planting trees', emoji: '🌳', color: '#15803D', bg: '#ECFDF5', border: '#A7F3D0' },
                                    { practice: 'Saving water', emoji: '💧', color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD' }
                                ].map((item, i) => (
                                    <div key={i} style={{ background: item.bg, padding: '24px 16px', borderRadius: '16px', border: `1px solid ${item.border}`, textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.emoji}</div>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: item.color, margin: 0 }}>{item.practice}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '20px', border: '1px solid #BBF7D0', marginTop: '20px', textAlign: 'center' }}>
                                <p style={{ fontSize: '18px', color: '#16A34A', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span>🌍</span> A clean environment is a happy environment! <span>🌍</span>
                                </p>
                            </div>
                        </Section>
                    </>
                )}

                {/* ──────────── 6. VIDEO ──────────── */}
                <Section id="videos">
                    <SectionTitle emoji="🎬">Watch the Lesson Videos</SectionTitle>
                    <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '20px' }}>
                        {currentLesson.videoSubtitle || 'Watch these fun videos to learn more! Click a video to watch it in full screen.'}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: currentLesson.videos.length === 1 ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
                        {currentLesson.videos.map((video, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedVideo(video)}
                                style={{
                                    borderRadius: '16px', overflow: 'hidden',
                                    border: '1px solid #E2E8F0', aspectRatio: '16/9',
                                    cursor: 'pointer', position: 'relative',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'scale(1.03)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <img
                                    src={video.thumb}
                                    alt={video.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                                {/* Play overlay */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s',
                                }}>
                                    <div style={{
                                        width: '52px', height: '52px', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.95)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                    }}>
                                        <Play size={22} style={{ color: '#EF4444', marginLeft: '3px' }} fill="#EF4444" />
                                    </div>
                                </div>
                                {/* Title bar */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                    padding: '16px 12px 10px', color: '#fff',
                                    fontSize: '12px', fontWeight: 600,
                                }}>
                                    {video.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Video Modal */}
                {selectedVideo && (
                    <div
                        onClick={() => setSelectedVideo(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(0,0,0,0.85)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '40px',
                        }}
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'rgba(255,255,255,0.15)', border: 'none',
                                borderRadius: '50%', width: '48px', height: '48px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#fff',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        >
                            <X size={24} />
                        </button>
                        <div
                            onClick={e => e.stopPropagation()}
                            style={{
                                width: '100%', maxWidth: '1100px',
                                aspectRatio: '16/9', borderRadius: '16px',
                                overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                            }}
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src={selectedVideo.src + '&autoplay=1'}
                                title={selectedVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                style={{ display: 'block' }}
                            />
                        </div>
                    </div>
                )}

                {/* ──────────── 7. QUIZ ──────────── */}
                <Section id="quiz" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    <SectionTitle emoji="🧠">Quiz Time!</SectionTitle>
                    <p style={{ fontSize: '15px', color: '#1E40AF', marginBottom: '24px' }}>
                        Let's test what you learned! Choose the correct answer for each question.
                    </p>

                    {currentLesson.quiz.map((q, qIndex) => (
                        <div key={qIndex} style={{
                            background: '#FFFFFF', borderRadius: '16px', padding: '24px',
                            marginBottom: '20px', border: '1px solid #DBEAFE',
                        }}>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                                Question {qIndex + 1}
                            </p>
                            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '12px' }}>
                                {q.question}
                            </p>
                            <div style={{
                                fontSize: '32px', letterSpacing: '6px', marginBottom: '18px',
                                background: '#F8FAFC', borderRadius: '12px', padding: '16px',
                                textAlign: 'center',
                            }}>
                                {q.visual}
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {q.options.map((opt, oIndex) => {
                                    const isSelected = answers[qIndex] === oIndex;
                                    const isCorrect = oIndex === q.correct;
                                    let bg = '#F1F5F9';
                                    let border = '2px solid #E2E8F0';
                                    let color = '#334155';

                                    if (showResults && isSelected && isCorrect) {
                                        bg = '#D1FAE5'; border = '2px solid #22C55E'; color = '#065F46';
                                    } else if (showResults && isSelected && !isCorrect) {
                                        bg = '#FEE2E2'; border = '2px solid #EF4444'; color = '#991B1B';
                                    } else if (showResults && isCorrect) {
                                        bg = '#D1FAE5'; border = '2px solid #22C55E'; color = '#065F46';
                                    } else if (isSelected) {
                                        bg = '#DBEAFE'; border = '2px solid #3B82F6'; color = '#1E40AF';
                                    }

                                    return (
                                        <button
                                            key={oIndex}
                                            onClick={() => handleAnswer(qIndex, oIndex)}
                                            style={{
                                                flex: '1 1 auto', minWidth: '80px',
                                                padding: '14px 20px', borderRadius: '12px',
                                                background: bg, border, color,
                                                fontSize: '16px', fontWeight: 700,
                                                cursor: showResults ? 'default' : 'pointer',
                                                display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', gap: '8px',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {showResults && isSelected && isCorrect && <CheckCircle2 size={18} />}
                                            {showResults && isSelected && !isCorrect && <XCircle size={18} />}
                                            {showResults && !isSelected && isCorrect && <CheckCircle2 size={18} />}
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {!showResults ? (
                        <button
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(answers).length < currentLesson.quiz.length}
                            style={{
                                width: '100%', padding: '16px',
                                background: Object.keys(answers).length < currentLesson.quiz.length ? '#94A3B8' : '#3B82F6',
                                color: '#FFFFFF', border: 'none', borderRadius: '14px',
                                fontSize: '16px', fontWeight: 700, cursor: Object.keys(answers).length < currentLesson.quiz.length ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s ease',
                            }}
                        >
                            Submit Answers
                        </button>
                    ) : (
                        <div style={{
                            background: score === currentLesson.quiz.length ? '#D1FAE5' : '#FEF3C7',
                            borderRadius: '14px', padding: '20px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                                {score === currentLesson.quiz.length ? '🎉' : '💪'}
                            </div>
                            <p style={{
                                fontSize: '18px', fontWeight: 700,
                                color: score === currentLesson.quiz.length ? '#065F46' : '#92400E',
                            }}>
                                You got {score} out of {currentLesson.quiz.length} correct!
                            </p>
                            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                                {score === currentLesson.quiz.length ? 'Perfect score! Amazing! 🌟' : 'Keep practicing, you\'re doing great!'}
                            </p>
                        </div>
                    )}
                </Section>

                {/* ──────────── 8. SUMMARY ──────────── */}
                <Section style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                    <SectionTitle emoji="📋">Lesson Summary</SectionTitle>
                    <p style={{ fontSize: '15px', color: '#166534', marginBottom: '14px', fontWeight: 500 }}>
                        Today we learned:
                    </p>
                    <ul style={{
                        listStyle: 'none', padding: 0, margin: '0 0 20px',
                        display: 'flex', flexDirection: 'column', gap: '10px',
                    }}>
                        {currentLesson.summary.map((item, i) => (
                            <li key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                fontSize: '15px', color: '#166534',
                            }}>
                                <CheckCircle2 size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div style={{
                        background: '#DCFCE7', borderRadius: '12px', padding: '16px 20px',
                        display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                        <Sparkles size={22} style={{ color: '#16A34A' }} />
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#14532D' }}>
                            {currentLesson.summaryEnd}
                        </span>
                    </div>
                </Section>

                {/* ──────────── 9. NEXT LESSON ──────────── */}
                {currentLesson.nextLesson && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        style={{ marginBottom: '64px' }}
                    >
                        <button
                            onClick={() => navigate(`/learning/class/${classId}/subject/${subjectId}/chapter/${currentLesson.nextLesson.id}`)}
                            style={{
                                width: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                color: '#FFFFFF', border: 'none', borderRadius: '18px',
                                padding: '22px 28px', cursor: 'pointer',
                                boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(37,99,235,0.35)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.25)';
                            }}
                        >
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8, marginBottom: '4px' }}>
                                    Next Lesson
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 700 }}>
                                    {currentLesson.nextLesson.title} →
                                </div>
                            </div>
                            <ArrowRight size={24} />
                        </button>
                    </motion.div>
                )}
            </div>
        </div>

            {/* Footer */ }
    <div style={{
        textAlign: 'center', padding: '24px',
        borderTop: '1px solid #E2E8F0', color: '#94A3B8', fontSize: '13px',
    }}>
        © 2024 EduReach Education. All rights reserved.
    </div>
        </div >
    );
};

export default LessonPage;
