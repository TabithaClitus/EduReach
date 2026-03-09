import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
};

const ClassSelection = () => {
    const navigate = useNavigate();
    const classes = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div style={{ minHeight: 'calc(100vh - 68px)', marginTop: '68px', background: '#F8FAFC' }} className="w-full pb-24 px-4 sm:px-6 flex flex-col items-center">

            <div className="w-full max-w-[1000px] flex flex-col items-center gap-10 mt-12 sm:mt-16">

                {/* 1. Header Section */}
                <div className="text-center w-full max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Select Your Class
                    </h1>
                    <p className="text-base md:text-lg text-slate-500 leading-relaxed">
                        Choose your academic class to explore tailored subjects, chapters, and comprehensive learning materials.
                    </p>
                </div>

                {/* 2. Grid Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full"
                >
                    {classes.map((classNum) => {
                        return (
                            <motion.div
                                key={classNum}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/learning/class/${classNum}`)}
                                style={{
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '28px 20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#3B82F6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#E2E8F0';
                                }}
                            >
                                <div style={{
                                    background: '#EFF6FF',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <BookOpen style={{ width: '24px', height: '24px', color: '#3B82F6' }} />
                                </div>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    color: '#1E293B',
                                    marginTop: '4px',
                                }}>
                                    Class {classNum}
                                </span>
                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#3B82F6',
                                }}>
                                    Explore materials
                                </span>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* 3. Bottom CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    style={{
                        textAlign: 'center',
                        width: '100%',
                        maxWidth: '480px',
                        margin: '0 auto',
                        background: '#F1F5F9',
                        borderRadius: '20px',
                        padding: '32px 24px',
                        marginTop: '24px',
                    }}
                >
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#1E293B',
                        marginBottom: '8px',
                    }}>
                        Looking for something specific?
                    </h3>
                    <p style={{
                        fontSize: '14px',
                        color: '#64748B',
                        marginBottom: '20px',
                        lineHeight: 1.6,
                    }}>
                        Access our full catalog of specialized courses and certifications.
                    </p>
                    <button
                        onClick={() => navigate('/learning/browse')}
                        style={{
                            background: '#2563EB',
                            color: '#FFFFFF',
                            fontWeight: 600,
                            padding: '14px 28px',
                            fontSize: '14px',
                            borderRadius: '99px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#1D4ED8'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#2563EB'}
                    >
                        Browse All Courses →
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

export default ClassSelection;
