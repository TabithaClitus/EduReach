import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Grid2x2, ArrowLeft } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

// Base subjects for Class 1 and 2
const baseSubjects = [
    {
        id: 'maths',
        name: 'Maths',
        description: 'Master numbers, shapes, and logic with fun interactive puzzles and daily challenges.',
        icon: '➕✖️',
        emoji: '🔢',
        bgColor: '#FFF3E0',
        iconBg: '#FFE0B2',
        accentColor: '#FF9800',
        buttonGradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    },
    {
        id: 'english',
        name: 'English',
        description: 'Improve reading, writing, and storytelling skills through immersive phonics and tales.',
        icon: '📖',
        emoji: '📚',
        bgColor: '#E3F2FD',
        iconBg: '#BBDEFB',
        accentColor: '#2196F3',
        buttonGradient: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
    },
    {
        id: 'evs',
        name: 'EVS',
        description: "Explore the world around you, plants, animals, and nature's wonderful mysteries.",
        icon: '🌿',
        emoji: '🍃',
        bgColor: '#E8F5E9',
        iconBg: '#C8E6C9',
        accentColor: '#4CAF50',
        buttonGradient: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    },
];

// Class 3 subjects (includes Science instead of EVS, plus GK)
const class3Subjects = [
    {
        id: 'maths',
        name: 'Maths',
        description: 'Master multiplication, division, fractions, and geometry with engaging problem-solving activities.',
        icon: '➕✖️',
        emoji: '🔢',
        bgColor: '#FFF3E0',
        iconBg: '#FFE0B2',
        accentColor: '#FF9800',
        buttonGradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    },
    {
        id: 'english',
        name: 'English',
        description: 'Build reading comprehension, grammar skills, and creative writing through stories and exercises.',
        icon: '📖',
        emoji: '📚',
        bgColor: '#E3F2FD',
        iconBg: '#BBDEFB',
        accentColor: '#2196F3',
        buttonGradient: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
    },
    {
        id: 'evs',
        name: 'EVS / Science',
        description: 'Discover plants, animals, the human body, and our environment through interactive experiments.',
        icon: '🔬',
        emoji: '🔬',
        bgColor: '#E8F5E9',
        iconBg: '#C8E6C9',
        accentColor: '#4CAF50',
        buttonGradient: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    },
    {
        id: 'gk',
        name: 'General Knowledge',
        description: 'Explore the world with facts about countries, famous people, inventions, and current affairs.',
        icon: '🌍',
        emoji: '🌍',
        bgColor: '#F3E5F5',
        iconBg: '#E1BEE7',
        accentColor: '#9C27B0',
        buttonGradient: 'linear-gradient(135deg, #AB47BC 0%, #8E24AA 100%)',
    },
];

// Class 4 subjects (includes Mathematics, English, EVS/Science, Social Studies, and GK)
const class4Subjects = [
    {
        id: 'maths',
        name: 'Mathematics',
        description: 'Explore advanced arithmetic, fractions, decimals, geometry, and data handling with real-world applications.',
        icon: '➕✖️',
        emoji: '🔢',
        bgColor: '#FFF3E0',
        iconBg: '#FFE0B2',
        accentColor: '#FF9800',
        buttonGradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    },
    {
        id: 'english',
        name: 'English',
        description: 'Develop grammar mastery, reading comprehension, vocabulary, and creative writing through engaging activities.',
        icon: '📖',
        emoji: '📚',
        bgColor: '#E3F2FD',
        iconBg: '#BBDEFB',
        accentColor: '#2196F3',
        buttonGradient: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
    },
    {
        id: 'evs',
        name: 'EVS / Science',
        description: 'Understand ecosystems, human body systems, matter, energy, and environmental conservation.',
        icon: '🔬',
        emoji: '🔬',
        bgColor: '#E8F5E9',
        iconBg: '#C8E6C9',
        accentColor: '#4CAF50',
        buttonGradient: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    },
    {
        id: 'social',
        name: 'Social Studies',
        description: 'Learn about history, geography, civics, and cultures of India and the world.',
        icon: '🗺️',
        emoji: '🌍',
        bgColor: '#FFF8E1',
        iconBg: '#FFECB3',
        accentColor: '#FFA000',
        buttonGradient: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)',
    },
];

// Class 5 subjects (English, Mathematics, Science, Social Studies, Computer Basics)
const class5Subjects = [
    {
        id: 'english',
        name: 'English',
        description: 'Develop advanced reading comprehension, grammar, vocabulary, and creative writing through engaging activities.',
        icon: '📖',
        emoji: '📚',
        bgColor: '#E3F2FD',
        iconBg: '#BBDEFB',
        accentColor: '#2196F3',
        buttonGradient: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
    },
    {
        id: 'maths',
        name: 'Mathematics',
        description: 'Master fractions, decimals, geometry, data handling, and problem-solving with real-world applications.',
        icon: '➕✖️',
        emoji: '🔢',
        bgColor: '#FFF3E0',
        iconBg: '#FFE0B2',
        accentColor: '#FF9800',
        buttonGradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    },
    {
        id: 'science',
        name: 'Science',
        description: 'Explore the wonders of physics, chemistry, biology, and the environment through experiments and discovery.',
        icon: '🔬',
        emoji: '🔬',
        bgColor: '#E8F5E9',
        iconBg: '#C8E6C9',
        accentColor: '#4CAF50',
        buttonGradient: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    },
    {
        id: 'social',
        name: 'Social Studies',
        description: 'Learn about history, geography, civics, and cultures with stories, maps, and real-life connections.',
        icon: '🗺️',
        emoji: '🌍',
        bgColor: '#FFF8E1',
        iconBg: '#FFECB3',
        accentColor: '#FFA000',
        buttonGradient: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)',
    },
    {
        id: 'computers',
        name: 'Computer Basics',
        description: 'Learn about computers, the internet, typing skills, and basic coding concepts in a fun and interactive way.',
        icon: '💻',
        emoji: '💻',
        bgColor: '#EDE7F6',
        iconBg: '#D1C4E9',
        accentColor: '#673AB7',
        buttonGradient: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
    },
];

// Class 6 subjects (English, Mathematics, Science, Social Studies, Computer Science)
const class6Subjects = [
    {
        id: 'maths',
        name: 'Mathematics',
        description: 'Dive into algebra, integers, fractions, decimals, geometry, and data handling in depth.',
        icon: '➕✖️',
        emoji: '🔢',
        bgColor: '#FFF3E0',
        iconBg: '#FFE0B2',
        accentColor: '#FF9800',
        buttonGradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    },
    {
        id: 'science',
        name: 'Science',
        description: 'Explore light and shadows, electricity, living organisms, and their surroundings.',
        icon: '🔬',
        emoji: '🔬',
        bgColor: '#E8F5E9',
        iconBg: '#C8E6C9',
        accentColor: '#4CAF50',
        buttonGradient: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    },
    {
        id: 'social',
        name: 'Social Studies',
        description: 'Learn about ancient history, our earth, diversity, and local government functions.',
        icon: '🗺️',
        emoji: '🌍',
        bgColor: '#FFF8E1',
        iconBg: '#FFECB3',
        accentColor: '#FFA000',
        buttonGradient: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)',
    },
    {
        id: 'english',
        name: 'English',
        description: 'Enhance your literature and grammar skills with complex stories, poems, and exercises.',
        icon: '📖',
        emoji: '📚',
        bgColor: '#E3F2FD',
        iconBg: '#BBDEFB',
        accentColor: '#2196F3',
        buttonGradient: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
    },
    {
        id: 'computers',
        name: 'Computer Science',
        description: 'Learn advanced computer concepts, introduction to internet, and basic programming.',
        icon: '💻',
        emoji: '💻',
        bgColor: '#EDE7F6',
        iconBg: '#D1C4E9',
        accentColor: '#673AB7',
        buttonGradient: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
    },
];

// Class 7 subjects (Mathematics, Science, Social Studies, English, Computer Basics)
const class7Subjects = [
    {
        id: 'maths',
        name: 'Mathematics',
        description: 'Explore advanced arithmetic, algebra, geometry, and data handling with real-world applications.',
        icon: '➕✖️',
        emoji: '🔢',
        bgColor: '#FFF3E0',
        iconBg: '#FFE0B2',
        accentColor: '#FF9800',
        buttonGradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    },
    {
        id: 'science',
        name: 'Science',
        description: 'Discover physics, chemistry, biology, and the environment through interactive experiments.',
        icon: '🔬',
        emoji: '🔬',
        bgColor: '#E8F5E9',
        iconBg: '#C8E6C9',
        accentColor: '#4CAF50',
        buttonGradient: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    },
    {
        id: 'social',
        name: 'Social Studies',
        description: 'Learn about history, geography, civics, and cultures of India and the world.',
        icon: '🗺️',
        emoji: '🌍',
        bgColor: '#FFF8E1',
        iconBg: '#FFECB3',
        accentColor: '#FFA000',
        buttonGradient: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)',
    },
    {
        id: 'english',
        name: 'English',
        description: 'Build grammar mastery, reading comprehension, vocabulary, and creative writing through engaging activities.',
        icon: '📖',
        emoji: '📚',
        bgColor: '#E3F2FD',
        iconBg: '#BBDEFB',
        accentColor: '#2196F3',
        buttonGradient: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
    },
    {
        id: 'computers',
        name: 'Computer Basics',
        description: 'Learn about computers, software, the internet, typing skills, and coding concepts.',
        icon: '💻',
        emoji: '💻',
        bgColor: '#EDE7F6',
        iconBg: '#D1C4E9',
        accentColor: '#673AB7',
        buttonGradient: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
    },
];

// Function to get subjects based on class
const getSubjectsForClass = (classId) => {
    if (classId === '3') return class3Subjects;
    if (classId === '4') return class4Subjects;
    if (classId === '5') return class5Subjects;
    if (classId === '6') return class6Subjects;
    if (classId === '7') return class7Subjects;
    return baseSubjects;
};

const SubjectPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const subjects = getSubjectsForClass(classId);

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
                maxWidth: '1100px',
                width: '100%',
                margin: '0 auto',
                padding: '48px 24px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* Header with Back Button */}
                <div style={{ position: 'relative', width: '100%' }}>
                    {/* Back Button — top right */}
                    <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigate('/learning')}
                        style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
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
                        Back to Classes
                    </motion.button>
                </div>

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#E8F5E9',
                        color: '#2E7D32',
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        marginBottom: '20px',
                    }}
                >
                    <GraduationCap size={16} />
                    Class {classId} Learning Path
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: 800,
                        color: '#0F172A',
                        textAlign: 'center',
                        margin: '0 0 16px',
                        letterSpacing: '-0.5px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                >
                    Select a Subject
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    style={{
                        fontSize: '17px',
                        color: '#64748B',
                        textAlign: 'center',
                        maxWidth: '520px',
                        lineHeight: 1.7,
                        margin: '0 0 48px',
                    }}
                >
                    Choose a subject to explore lessons, videos, and activities designed
                    specifically for your level. Adventure awaits!
                </motion.p>

                {/* Subject Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '28px',
                        width: '100%',
                        marginBottom: '64px',
                    }}
                >
                    {subjects.map((subject) => (
                        <motion.div
                            key={subject.id}
                            variants={cardVariants}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '20px',
                                border: '1px solid #E2E8F0',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.3s ease',
                            }}
                            onClick={() => navigate(`/learning/class/${classId}/subject/${subject.id}`)}
                        >
                            {/* Colored Icon Area */}
                            <div style={{
                                background: subject.bgColor,
                                height: '180px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: subject.iconBg,
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '36px',
                                }}>
                                    {subject.emoji}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div style={{ padding: '24px 24px 28px' }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    margin: '0 0 8px',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}>
                                    {subject.name}
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#64748B',
                                    lineHeight: 1.7,
                                    margin: '0 0 20px',
                                    minHeight: '48px',
                                }}>
                                    {subject.description}
                                </p>
                                <button
                                    style={{
                                        width: '100%',
                                        padding: '14px 24px',
                                        background: subject.buttonGradient,
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        boxShadow: `0 4px 14px ${subject.accentColor}40`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = `0 6px 20px ${subject.accentColor}50`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = `0 4px 14px ${subject.accentColor}40`;
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/learning/class/${classId}/subject/${subject.id}`);
                                    }}
                                >
                                    Start Learning <span style={{ fontSize: '18px' }}>→</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Divider */}
                <div style={{
                    width: '100%',
                    height: '1px',
                    background: '#E2E8F0',
                    marginBottom: '48px',
                }} />

                {/* Bottom CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '64px',
                    }}
                >
                    <p style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: '#475569',
                        marginBottom: '20px',
                    }}>
                        Looking for something specific?
                    </p>
                    <button
                        onClick={() => navigate('/learning/browse')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: '#1E293B',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '14px',
                            padding: '16px 32px',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'background 0.2s ease, transform 0.2s ease',
                            boxShadow: '0 4px 14px rgba(30,41,59,0.2)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#334155';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#1E293B';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Grid2x2 size={18} />
                        Browse All Courses
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
                © 2024 EduReach Learning Platforms. All rights reserved.
            </div>
        </div>
    );
};

export default SubjectPage;
