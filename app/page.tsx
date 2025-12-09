'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/context/ChatContext';

export default function Home() {
  const { isChatVisible, setIsChatVisible, scrollToChat } = useChat();

  const handleStartAnalysis = () => {
    setIsChatVisible(true);
    scrollToChat();
  };

  // Effect to scroll to chat when it becomes visible
  useEffect(() => {
    if (isChatVisible) {
      scrollToChat();
    }
  }, [isChatVisible, scrollToChat]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">

      <main className="flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-red-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              You're Losing $1000s Every Month to Third-Party Fees <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                Fix It Today with Applova
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Subheading removed or merged as per new design if needed, but keeping structure for now */}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Run your free profit leak scan and see exactly how much you can save by switching to your own direct ordering system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.button
              onClick={handleStartAnalysis}
              animate={{
                boxShadow: ["0 10px 15px -3px rgba(22, 163, 74, 0.4)", "0 25px 30px -5px rgba(22, 163, 74, 0.7)", "0 10px 15px -3px rgba(22, 163, 74, 0.4)"],
                scale: [1, 1.2, 1], // More pronounced zoom effect
                filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
              }}
              transition={{
                duration: 1.5, // Faster pulse
                repeat: Infinity,
                ease: "easeInOut",
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ scale: 1.25, filter: "brightness(1.25)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg transform transition-all duration-300 ring-4 ring-green-100"
            >
              Start Your Free Analysis
            </motion.button>
          </motion.div>
        </section>

        {/* Chat Interface Section */}
        <AnimatePresence>
          {isChatVisible && (
            <section id="chat-section" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 scroll-mt-24">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 h-[85vh] max-h-[800px] min-h-[600px] flex flex-col ring-1 ring-gray-900/5"
              >
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      PA
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Profit Advisor</h3>
                      <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden bg-white">
                  <ChatInterface />
                </div>
              </motion.div>
            </section>
          )}
        </AnimatePresence>

        {/* Features / How it Works Section */}
        <section className="w-full bg-white py-24 border-t border-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Stop Guessing — Start Knowing</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Your restaurant may look profitable, but unseen leaks silently drain your margins. Our AI analyzes real operational data to reveal exactly where your money is slipping away.
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant, Clear Financial Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  No more waiting for accountants or end-of-month reports. Get a precise, real-time snapshot of your profit leaks in seconds so you can act immediately.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Benchmarking Backed by Real Industry Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your numbers aren’t evaluated in isolation. Our AI compares your performance to thousands of similar restaurants, exposing gaps that traditional tools overlook.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Actionable Recommendations — Not Just Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  We don’t just show you the problems we give you step-by-step, practical solutions to reduce commissions, improve efficiency, and increase your yearly profit.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
