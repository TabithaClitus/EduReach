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
        <div style={{ minHeight: 'calc(100vh - 68px)', marginTop: '68px' }} className="w-full bg-slate-50 pb-24 px-4 sm:px-6 flex flex-col items-center">

            <div className="w-full max-w-[1100px] flex flex-col items-center gap-12 mt-12 sm:mt-16">

                {/* 1. Header Section */}
                <div className="text-center w-full max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Select Your Class
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                        Choose your academic class to explore tailored subjects, chapters, and comprehensive learning materials.
                    </p>
                </div>

                {/* 2. Grid Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
                >
                    {classes.map((classNum) => (
                        <motion.div
                            key={classNum}
                            variants={itemVariants}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/learning/class/${classNum}`)}
                            className="bg-white rounded-2xl border border-slate-200 py-10 px-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group"
                        >
                            <div className="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors">
                                <BookOpen className="w-8 h-8 text-blue-600 group-hover:text-blue-700" />
                            </div>
                            <span className="text-xl font-bold text-slate-800 tracking-wide">
                                Class {classNum}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* 3. Bottom CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-center w-full max-w-lg mx-auto bg-gray-100 rounded-xl p-8 mt-16"
                >
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        Looking for something specific?
                    </h3>
                    <p className="text-gray-600 mb-5 leading-relaxed">
                        You can also browse all our available courses across different subjects, grades, and languages.
                    </p>
                    <button
                        onClick={() => navigate('/learning/browse')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-16 py-5 text-base rounded-full transition-all duration-200 mt-2.5"
                    >
                        Browse All Courses
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

export default ClassSelection;
