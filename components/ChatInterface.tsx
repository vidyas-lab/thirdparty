
import React, { useState, useEffect, useRef } from 'react';
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
    };
}

const ChatInterface: React.FC = () => {
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

    const API_URL = 'http://localhost:8000/api/chat/'; // Adjust if needed

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial load
    useEffect(() => {
        fetchNextStep();
    }, []);

    const fetchNextStep = async (input?: string | string[]) => {
        setIsLoading(true);
        try {
            const payload = {
                current_state: currentState,
                user_input: input,
                data: inputData
            };

            const response = await axios.post(API_URL, payload);
            const data: ChatState = response.data;

            if (input) {
                const displayText = Array.isArray(input) ? input.join(', ') : input;
                setMessages(prev => [...prev, { sender: 'user', text: displayText }]);
            }

            if (data.result) {
                setResult(data.result);
                setCurrentState('result');
                // Don't add bot message if it's just "Calculation complete" - show result instead
            } else {
                setMessages(prev => [...prev, { sender: 'bot', text: data.prompt }]);
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
                // Trigger CRM hand-off
                await axios.post('http://localhost:8000/api/lead/', result.crm_payload);
                console.log("Lead sent to CRM");
            } catch (error) {
                console.error("Error sending lead to CRM:", error);
            }
        }
        setShowModal(true);
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
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                                {msg.text}
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
                    <ShockerResult
                        totalAnnualLeak={result.formatted_leak}
                        recoveryAmount={result.formatted_recovery}
                        onConsultationClick={handleConsultationClick}
                    />
                )}

                <div ref={messagesEndRef} />
            </div>

            {!result && (
                <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                    {inputType === 'button' ? (
                        <button
                            onClick={() => fetchNextStep('Start')}
                            className="btn-primary w-full"
                            disabled={isLoading}
                        >
                            Start Recovery Now
                        </button>
                    ) : inputType === 'select_button' ? (
                        <div className="grid grid-cols-2 gap-2">
                            {options.map((option: string) => (
                                <button
                                    key={option}
                                    onClick={() => fetchNextStep(option)}
                                    className="bg-white border-2 border-red-100 text-red-600 font-medium py-3 px-4 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                                    disabled={isLoading}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    ) : inputType === 'multi_select' ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                {options.map((option: string) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            const current = Array.isArray(userInput) ? userInput : [];
                                            const updated = current.includes(option)
                                                ? current.filter((i: string) => i !== option)
                                                : [...current, option];
                                            setUserInput(updated);
                                        }}
                                        className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${(Array.isArray(userInput) ? userInput : []).includes(option)
                                            ? 'bg-red-600 border-red-600 text-white'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-red-200'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => fetchNextStep(userInput)}
                                className="btn-primary w-full"
                                disabled={isLoading || !userInput || (Array.isArray(userInput) && userInput.length === 0)}
                            >
                                Confirm Selection
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type={inputType === 'numeric_float' || inputType === 'numeric_int' ? 'number' : 'text'}
                                value={typeof userInput === 'string' ? userInput : ''}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type your answer..."
                                className="input-field"
                                autoFocus
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
