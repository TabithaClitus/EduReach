import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

// Subject-specific chapters data, keyed by classId then subjectId
const subjectChapters = {
    '1': {
        maths: {
            title: 'Maths Skills',
            subtitle: 'Choose a skill to start learning basic mathematics concepts designed for',
            buttonColor: '#42A5F5',
            buttonHover: '#1E88E5',
            ctaTitle: 'Need more practice?',
            ctaText: 'Explore more maths activities and exercises to sharpen your skills.',
            ctaButton: 'Browse All Maths Lessons',
            chapters: [
                {
                    id: 'counting-numbers',
                    title: 'Counting Numbers',
                    description: 'Learn to recognize and count numbers from 1 to 10 with fun interactive visuals.',
                    emoji: '🔢',
                    bgColor: '#FFF9C4',
                    iconBg: '#FFF176',
                },
                {
                    id: 'counting-objects',
                    title: 'Counting Objects',
                    description: 'Practice counting real objects using colorful pictures and everyday examples.',
                    emoji: '🟩',
                    bgColor: '#C8E6C9',
                    iconBg: '#A5D6A7',
                },
                {
                    id: 'addition',
                    title: 'Addition',
                    description: 'Learn basic addition using single digit numbers and simple visuals.',
                    emoji: '➕',
                    bgColor: '#F8BBD0',
                    iconBg: '#F48FB1',
                },
                {
                    id: 'subtraction',
                    title: 'Subtraction',
                    description: 'Understand subtraction with easy examples and taking away objects.',
                    emoji: '➖',
                    bgColor: '#D1C4E9',
                    iconBg: '#B39DDB',
                },
                {
                    id: 'shapes',
                    title: 'Shapes',
                    description: 'Identify basic shapes like circle, square, triangle and rectangle.',
                    emoji: '🔶',
                    bgColor: '#FFE0B2',
                    iconBg: '#FFCC80',
                },
            ],
        },
        english: {
            title: 'English Skills',
            subtitle: 'Choose a skill to start learning English language concepts designed for',
            buttonColor: '#5C6BC0',
            buttonHover: '#3949AB',
            ctaTitle: 'Need more practice?',
            ctaText: 'Explore more English activities and exercises to improve your skills.',
            ctaButton: 'Browse All English Lessons',
            chapters: [
                {
                    id: 'alphabets',
                    title: 'Alphabets',
                    description: 'Learn to identify and write all 26 letters of the English alphabet.',
                    emoji: '🔤',
                    bgColor: '#E3F2FD',
                    iconBg: '#90CAF9',
                },
                {
                    id: 'phonics',
                    title: 'Phonics',
                    description: 'Understand letter sounds and their combinations for early reading.',
                    emoji: '🔊',
                    bgColor: '#F3E5F5',
                    iconBg: '#CE93D8',
                },
                {
                    id: 'simple-words',
                    title: 'Simple Words',
                    description: 'Learn to read and write basic three and four letter words.',
                    emoji: '📝',
                    bgColor: '#FFF9C4',
                    iconBg: '#FFF176',
                },
                {
                    id: 'rhymes',
                    title: 'Rhymes & Stories',
                    description: 'Enjoy fun rhymes and short stories to build listening skills.',
                    emoji: '📖',
                    bgColor: '#C8E6C9',
                    iconBg: '#A5D6A7',
                },
            ],
        },
        evs: {
            title: 'EVS Skills',
            subtitle: 'Choose a topic to start exploring the world around you, designed for',
            buttonColor: '#66BB6A',
            buttonHover: '#43A047',
            ctaTitle: 'Need more practice?',
            ctaText: 'Explore more EVS activities and experiments to discover nature.',
            ctaButton: 'Browse All EVS Lessons',
            chapters: [
                {
                    id: 'my-body',
                    title: 'My Body',
                    description: 'Learn about body parts, senses, and how to take care of your health.',
                    emoji: '🧍',
                    bgColor: '#F8BBD0',
                    iconBg: '#F48FB1',
                },
                {
                    id: 'plants',
                    title: 'Plants Around Us',
                    description: 'Discover different types of plants, their parts, and how they grow.',
                    emoji: '🌱',
                    bgColor: '#C8E6C9',
                    iconBg: '#A5D6A7',
                },
                {
                    id: 'animals',
                    title: 'Animals',
                    description: 'Explore the animal kingdom — pets, wild animals, and their habitats.',
                    emoji: '🐾',
                    bgColor: '#FFE0B2',
                    iconBg: '#FFCC80',
                },
                {
                    id: 'weather',
                    title: 'Weather & Seasons',
                    description: 'Understand different seasons, weather patterns, and how they affect us.',
                    emoji: '🌦️',
                    bgColor: '#E3F2FD',
                    iconBg: '#90CAF9',
                },
                {
                    id: 'water',
                    title: 'Water',
                    description: 'Learn about sources of water, its uses, and why we should save it.',
                    emoji: '💧',
                    bgColor: '#D1C4E9',
                    iconBg: '#B39DDB',
                },
            ],
        },
    },
    '2': {
        maths: {
            title: 'Maths Skills',
            subtitle: 'Choose a skill to start learning mathematics concepts designed for',
            buttonColor: '#42A5F5',
            buttonHover: '#1E88E5',
            ctaTitle: 'Need more practice?',
            ctaText: 'Explore more maths activities and exercises to sharpen your skills.',
            ctaButton: 'Browse All Maths Lessons',
            chapters: [
                {
                    id: 'numbers-up-to-100',
                    title: 'Numbers up to 100',
                    description: 'Learn to read, write, and count numbers from 1 to 100.',
                    emoji: '💯',
                    bgColor: '#FFF9C4',
                    iconBg: '#FFF176',
                },
                {
                    id: 'addition',
                    title: 'Addition',
                    description: 'Practice adding two-digit numbers with carrying and word problems.',
                    emoji: '➕',
                    bgColor: '#C8E6C9',
                    iconBg: '#A5D6A7',
                },
                {
                    id: 'subtraction',
                    title: 'Subtraction',
                    description: 'Learn to subtract two-digit numbers with borrowing and real-life examples.',
                    emoji: '➖',
                    bgColor: '#F8BBD0',
                    iconBg: '#F48FB1',
                },
                {
                    id: 'multiplication',
                    title: 'Multiplication',
                    description: 'Understand multiplication as repeated addition with fun tables.',
                    emoji: '✖️',
                    bgColor: '#D1C4E9',
                    iconBg: '#B39DDB',
                },
                {
                    id: 'time',
                    title: 'Time',
                    description: 'Learn to read a clock, understand hours and minutes, and tell time.',
                    emoji: '⏰',
                    bgColor: '#E3F2FD',
                    iconBg: '#90CAF9',
                },
                {
                    id: 'money',
                    title: 'Money',
                    description: 'Identify coins and notes, and learn to add and subtract money.',
                    emoji: '💰',
                    bgColor: '#FFF9C4',
                    iconBg: '#FFF176',
                },
                {
                    id: 'shapes',
                    title: 'Shapes',
                    description: 'Explore 2D and 3D shapes, their properties, and patterns.',
                    emoji: '🔶',
                    bgColor: '#FFE0B2',
                    iconBg: '#FFCC80',
                },
            ],
        },
        english: {
            title: 'English Skills',
            subtitle: 'Choose a skill to start your language learning journey designed for',
            buttonColor: '#2196F3',
            buttonHover: '#1E88E5',
            ctaTitle: 'Ready to write your own story?',
            ctaText: 'Practice your English skills with interactive stories and spelling challenges.',
            ctaButton: 'Explore English Path',
            chapters: [
                {
                    id: 'reading-sentences',
                    title: 'Reading Sentences',
                    description: 'Practice reading simple sentences and short paragraphs.',
                    emoji: '📖',
                    bgColor: '#FFE0B2',
                    iconBg: '#FFB74D',
                },
                {
                    id: 'phonics-practice',
                    title: 'Phonics Practice',
                    description: 'Learn complex letter sounds and blending.',
                    emoji: '🗣️',
                    bgColor: '#C8E6C9',
                    iconBg: '#81C784',
                },
                {
                    id: 'simple-words',
                    title: 'Simple Words',
                    description: 'Build vocabulary with new everyday words.',
                    emoji: '📝',
                    bgColor: '#BBDEFB',
                    iconBg: '#64B5F6',
                },
                {
                    id: 'opposite-words',
                    title: 'Opposite Words',
                    description: 'Learn antonyms like hot/cold, big/small, and happy/sad.',
                    emoji: '🔄',
                    bgColor: '#E1BEE7',
                    iconBg: '#BA68C8',
                },
                {
                    id: 'simple-grammar',
                    title: 'Simple Grammar',
                    description: 'Understand nouns, verbs, and basic sentence structure.',
                    emoji: '✏️',
                    bgColor: '#FFF9C4',
                    iconBg: '#FFF176',
                },
                {
                    id: 'rhymes-stories',
                    title: 'Rhymes & Stories',
                    description: 'Enjoy fun poems and engaging short stories.',
                    emoji: '📚',
                    bgColor: '#FFCDD2',
                    iconBg: '#E57373',
                },
            ],
        },
        evs: {
            title: 'Environmental Studies',
            subtitle: 'Discover the world around you with fun EVS topics designed for',
            buttonColor: '#2196F3',
            buttonHover: '#1E88E5',
            ctaTitle: 'Explore the World Around You!',
            ctaText: 'Discover more about nature, society, and healthy habits.',
            ctaButton: 'View EVS Activities',
            chapters: [
                {
                    id: 'my-family',
                    title: 'My Family',
                    description: 'Learn about family members, relationships, and how families care for each other.',
                    emoji: '👨‍👩‍👧‍👦',
                    bgColor: '#FFE0B2',
                    iconBg: '#FFB74D',
                },
                {
                    id: 'food-we-eat',
                    title: 'Food We Eat',
                    description: 'Understand the importance of healthy food, meals of the day, and food sources.',
                    emoji: '🍎',
                    bgColor: '#C8E6C9',
                    iconBg: '#81C784',
                },
                {
                    id: 'our-school',
                    title: 'Our School',
                    description: 'Discover places in a school, people who help us there, and good behavior.',
                    emoji: '🏫',
                    bgColor: '#BBDEFB',
                    iconBg: '#64B5F6',
                },
                {
                    id: 'our-neighbourhood',
                    title: 'Our Neighbourhood',
                    description: 'Learn about important places near our homes like hospitals, markets, and parks.',
                    emoji: '🏡',
                    bgColor: '#E1BEE7',
                    iconBg: '#BA68C8',
                },
                {
                    id: 'transport',
                    title: 'Transport',
                    description: 'Explore different modes of land, water, and air transportation.',
                    emoji: '🚗',
                    bgColor: '#FFF9C4',
                    iconBg: '#FFF176',
                },
                {
                    id: 'clothes-we-wear',
                    title: 'Clothes We Wear',
                    description: 'Learn about different types of clothes we wear in different seasons.',
                    emoji: '👕',
                    bgColor: '#FFCDD2',
                    iconBg: '#E57373',
                },
                {
                    id: 'cleanliness-good-habits',
                    title: 'Cleanliness & Good Habits',
                    description: 'Understand the importance of staying clean, healthy, and being polite.',
                    emoji: '🧼',
                    bgColor: '#E3F2FD',
                    iconBg: '#90CAF9',
                },
            ],
        },
    },
};

const ChapterPage = () => {
    const { classId, subjectId } = useParams();
    const navigate = useNavigate();

    const subjectData = subjectChapters[classId]?.[subjectId] || subjectChapters['1']?.maths;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F8FAFC',
            paddingTop: '68px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Main Content */}
            <div style={{
                flex: 1,
                maxWidth: '1000px',
                width: '100%',
                margin: '0 auto',
                padding: '48px 24px 0',
            }}>
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate(`/learning/class/${classId}`)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                        marginBottom: '24px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F1F5F9';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                >
                    <ArrowLeft size={16} />
                    Back to Subjects
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ marginBottom: '40px' }}
                >
                    <h1 style={{
                        fontSize: 'clamp(28px, 4vw, 40px)',
                        fontWeight: 800,
                        color: '#0F172A',
                        margin: '0 0 12px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        {subjectData.title}
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#64748B',
                        lineHeight: 1.7,
                        margin: 0,
                        maxWidth: '520px',
                    }}>
                        {subjectData.subtitle} Class {classId} students.
                    </p>
                </motion.div>

                {/* Chapter Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                        marginBottom: '48px',
                    }}
                >
                    {subjectData.chapters.map((chapter) => (
                        <motion.div
                            key={chapter.id}
                            variants={cardVariants}
                            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '16px',
                                border: '1px solid #E2E8F0',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.3s ease',
                            }}
                            onClick={() => navigate(`/learning/class/${classId}/subject/${subjectId}/chapter/${chapter.id}`)}
                        >
                            {/* Colored Icon Area */}
                            <div style={{
                                background: chapter.bgColor,
                                height: '140px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '12px',
                                margin: '12px 12px 0',
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: chapter.iconBg,
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '28px',
                                }}>
                                    {chapter.emoji}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div style={{ padding: '20px 20px 22px' }}>
                                <h3 style={{
                                    fontSize: '17px',
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    margin: '0 0 6px',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}>
                                    {chapter.title}
                                </h3>
                                <p style={{
                                    fontSize: '13px',
                                    color: '#64748B',
                                    lineHeight: 1.6,
                                    margin: '0 0 16px',
                                    minHeight: '42px',
                                }}>
                                    {chapter.description}
                                </p>
                                <button
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: subjectData.buttonColor,
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = subjectData.buttonHover;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = subjectData.buttonColor;
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/learning/class/${classId}/subject/${subjectId}/chapter/${chapter.id}`);
                                    }}
                                >
                                    Start Lesson
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    style={{
                        background: '#F1F5F9',
                        borderRadius: '20px',
                        border: '2px dashed #CBD5E1',
                        padding: '36px 40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '64px',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}
                >
                    <div>
                        <h3 style={{
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#0F172A',
                            margin: '0 0 6px',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>
                            {subjectData.ctaTitle}
                        </h3>
                        <p style={{
                            fontSize: '15px',
                            color: '#64748B',
                            margin: 0,
                        }}>
                            {subjectData.ctaText}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/learning/browse')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#FFFFFF',
                            color: subjectData.buttonColor,
                            border: `2px solid ${subjectData.buttonColor}`,
                            borderRadius: '14px',
                            padding: '14px 28px',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = subjectData.buttonColor;
                            e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FFFFFF';
                            e.currentTarget.style.color = subjectData.buttonColor;
                        }}
                    >
                        {subjectData.ctaButton}
                    </button>
                </motion.div>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                padding: '24px',
                borderTop: '1px solid #E2E8F0',
                color: '#94A3B8',
                fontSize: '13px',
            }}>
                © 2024 EduReach Education. All rights reserved.
            </div>
        </div>
    );
};

export default ChapterPage;
