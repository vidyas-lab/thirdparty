
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ShockerResult from './ShockerResult';

interface Message {
    sender: 'bot' | 'user';
    text: string;
}

interface ChatState {
    state: string;
    prompt: string;
    input_type: string;
    data: any;
    options?: string[];
    result?: {
        formatted_leak: string;
        formatted_recovery: string;
        lead_score: string;
        crm_payload?: any;
        breakdown?: {
            commission_loss: { value: number; percentage: number; formatted: string };
            fixed_fee_loss: { value: number; percentage: number; formatted: string };
            lost_customer_value: { value: number; percentage: number; formatted: string };
        };
    };
}

const ChatInterface: React.FC = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentState, setCurrentState] = useState<string>('intro');
    const [inputType, setInputType] = useState<string>('button');
    const [options, setOptions] = useState<string[]>([]);
    const [inputData, setInputData] = useState<any>({});
    const [userInput, setUserInput] = useState<any>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [showModal, setShowModal] = useState<boolean>(false);

    const stepKeys = ['intro', 'business_type', 'aov', 'orders', 'commission', 'fixed_fees', 'third_party_apps', 'email', 'result'];
    const totalSteps = stepKeys.length;

    const progressPercentage = Math.min(100, (stepKeys.indexOf(currentState) / (totalSteps - 1)) * 100);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/chat/';

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    }, [inputType]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Scroll to top of result when it appears
    useEffect(() => {
        if (result) {
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [result]);

    const hasInitialized = useRef(false);

    // Auto-start conversation
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            // Enable delay for the first message to show typing animation
            fetchNextStep('Start', false, true);
        }
    }, []);

    const fetchNextStep = async (input?: string | string[], skipDelay = false, hideUserMessage = false) => {
        // Show user message immediately
        if (input && !hideUserMessage) {
            const displayText = Array.isArray(input) ? input.join(', ') : input;
            setMessages(prev => [...prev, { sender: 'user', text: displayText }]);
        }

        setIsLoading(true);
        const startTime = Date.now();
        try {
            const payload = {
                current_state: currentState,
                user_input: input,
                data: inputData
            };

            const response = await axios.post(API_URL, payload);
            const data: ChatState = response.data;

            // Calculate remaining time to meet minimum delay
            if (!skipDelay) {
                const elapsed = Date.now() - startTime;
                // Keep 3s delay for the first message, reduce to 1.2s for others
                const minDelay = messages.length === 0 ? 3000 : 1200;
                const remaining = Math.max(0, minDelay - elapsed);

                if (remaining > 0) {
                    await new Promise(resolve => setTimeout(resolve, remaining));
                }
            }

            if (data.result) {
                setResult(data.result);
                setCurrentState('result');
                // Don't add bot message if it's just "Calculation complete" - show result instead
            } else {
                let promptText = data.prompt;
                // Removed prepend logic as per request

                setMessages(prev => [...prev, { sender: 'bot', text: promptText }]);
                setCurrentState(data.state);
                setInputType(data.input_type);
                setOptions(data.options || []);
                setInputData(data.data);
            }

        } catch (error) {
            console.error("Error fetching chat step:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
            setUserInput('');
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!userInput && inputType !== 'button') return;

        // Safety check for string input
        if (typeof userInput === 'string' && !userInput.trim()) return;

        fetchNextStep(userInput || 'Start');
    };

    const handleConsultationClick = async () => {
        if (result?.crm_payload) {
            try {
                // Trigger CRM hand-off (tracks consultation_requested)
                await axios.post('http://localhost:8000/api/lead/', result.crm_payload);
                console.log("Lead sent to CRM");
            } catch (error) {
                console.error("Error sending lead to CRM:", error);
            }
        }
        // Redirect to demo page
        const utmParams = 'utm_source=profit_advisor_app&utm_medium=web_app&utm_campaign=profit_recovery_report';
        router.push(`/book-demo?email=${encodeURIComponent(inputData.email || '')}&${utmParams}`);
    };

    const renderMessageText = (text: string) => {
        const parts = text.split('**');
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return <strong key={index}>{part}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto p-4 relative">
            {/* PROGRESS BAR */}
            <div className="w-full bg-red-100 rounded-full h-2.5 mb-4">
                <div
                    className="bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
                {/* Welcome Title - Only shown when there are no messages yet */}
                <AnimatePresence>
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome! I'm your Profit Leakage Calculator.</h2>
                            <p className="text-gray-600">I specialize in quantifying the hidden costs of third-party apps. Ready to see your <strong className="text-red-600">Annual Profit Leak</strong>?</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                                {renderMessageText(msg.text)}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="chat-bubble-bot">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}

                {result && (
                    <div ref={resultRef}>
                        <ShockerResult
                            totalAnnualLeak={result.formatted_leak}
                            recoveryAmount={result.formatted_recovery}
                            onConsultationClick={handleConsultationClick}
                            breakdown={result.breakdown}
                        />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {!result && !isLoading && (
                <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                    {inputType === 'button' ? (
                        <div className="flex flex-col items-end">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                animate={{
                                    boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 20px 25px -5px rgba(220, 38, 38, 0.15)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"],
                                }}
                                transition={{
                                    boxShadow: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                onClick={() => fetchNextStep('Start')}
                                className="btn-primary w-full max-w-xs shadow-lg hover:shadow-xl transition-all rounded-full"
                                disabled={isLoading}
                            >
                                Start Recovery Now
                            </motion.button>
                        </div>
                    ) : inputType === 'select_button' ? (
                        <div className="flex flex-col gap-3 items-end w-full">
                            {options.map((option: string, idx: number) => (
                                <motion.div
                                    key={option}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.15, type: "spring", stiffness: 200, damping: 20 }}
                                    className="w-full max-w-md flex justify-end"
                                >
                                    <motion.button
                                        animate={{
                                            scale: [1, 1.05, 1] // Continuous zoom
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        whileHover={{
                                            scale: 1.1,
                                            backgroundColor: '#fee2e2', // red-100
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => fetchNextStep(option)}
                                        className="bg-red-50 border border-red-200 text-red-800 font-semibold py-4 px-8 rounded-full text-right shadow-sm transition-all flex items-center justify-end gap-3 group relative overflow-hidden w-full"
                                        disabled={isLoading}
                                    >
                                        <span className="relative z-10 text-lg">{option}</span>
                                        <svg className="w-6 h-6 text-red-400 group-hover:text-red-600 transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    ) : inputType === 'multi_select' ? (
                        <div className="space-y-4 flex flex-col items-end w-full">
                            <div className="flex flex-col gap-3 items-end w-full">
                                {options.map((option: string, idx: number) => (
                                    <motion.div
                                        key={option}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="w-full max-w-md flex justify-end"
                                    >
                                        <motion.button
                                            animate={{
                                                scale: [1, 1.05, 1] // Continuous zoom
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: idx * 0.2
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                const current = Array.isArray(userInput) ? userInput : [];
                                                const updated = current.includes(option)
                                                    ? current.filter((i: string) => i !== option)
                                                    : [...current, option];
                                                setUserInput(updated);
                                            }}
                                            className={`py-4 px-8 rounded-full border font-semibold text-right shadow-sm transition-all flex items-center justify-end gap-3 relative overflow-hidden w-full ${(Array.isArray(userInput) ? userInput : []).includes(option)
                                                ? 'bg-red-200 border-red-400 text-red-900 shadow-md'
                                                : 'bg-red-50 border-red-100 text-red-800 hover:bg-red-100'
                                                }`}
                                        >
                                            <span className="relative z-10">{option}</span>
                                            {(Array.isArray(userInput) ? userInput : []).includes(option) && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center relative z-10"
                                                >
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                animate={{
                                    boxShadow: ["0 4px 6px -1px rgba(0, 0, 0, 0.1)", "0 10px 15px -3px rgba(220, 38, 38, 0.2)", "0 4px 6px -1px rgba(0, 0, 0, 0.1)"],
                                }}
                                transition={{
                                    boxShadow: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                onClick={() => fetchNextStep(userInput)}
                                className="btn-primary w-full max-w-xs py-4 shadow-lg rounded-full"
                                disabled={isLoading || !userInput || (Array.isArray(userInput) && userInput.length === 0)}
                            >
                                Confirm Selection
                            </motion.button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                ref={inputRef}
                                type={inputType === 'email' ? 'email' : (inputType === 'numeric_float' || inputType === 'numeric_int' ? 'number' : 'text')}
                                value={typeof userInput === 'string' ? userInput : ''}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type your answer..."
                                className="input-field"
                                disabled={isLoading}
                                step={inputType === 'numeric_float' ? "0.01" : "1"}
                            />
                            <button
                                type="submit"
                                className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                disabled={isLoading || !userInput}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center"
                    >
                        <svg className="w-16 h-16 mx-auto text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Delivered!</h2>
                        <p className="text-sm text-gray-600 mb-4">Your detailed <strong>Profit Recovery Report</strong> has been sent to:</p>
                        <p className="text-lg font-semibold text-red-600 mb-6 break-all">{inputData.email}</p>

                        <p className="text-sm font-medium text-gray-700 mb-2">Applova is ready to help you recover:</p>
                        <p className="text-3xl font-extrabold text-red-600 mb-6">{result?.formatted_recovery}</p>

                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition duration-200"
                        >
                            Close & Check Email
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
