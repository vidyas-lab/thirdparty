'use client';

import React from 'react';
import Link from 'next/link';
import { useChat } from '@/context/ChatContext';

const Header = () => {
    const { setIsChatVisible, scrollToChat } = useChat();

    const handleStartAnalysis = () => {
        setIsChatVisible(true);
        scrollToChat();
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            {/* Applova Logo */}
                            <img
                                src="/applova-logo.png"
                                alt="Applova"
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Navigation Links - REMOVED per requirements */}
                    {/* Added Start Analysis Button */}
                    <div className="hidden md:flex items-center">
                        <button
                            onClick={handleStartAnalysis}
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            Start Analysis
                        </button>
                    </div>

                    {/* Mobile menu button placeholder (optional for now) */}
                    <div className="md:hidden">
                        <button
                            onClick={handleStartAnalysis}
                            className="text-red-600 font-bold text-sm"
                        >
                            Start Analysis
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
