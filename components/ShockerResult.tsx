
import React from 'react';
import { motion } from 'framer-motion';

interface ShockerResultProps {
    totalAnnualLeak: string;
    recoveryAmount: string;
    onConsultationClick: () => void;
}

const ShockerResult: React.FC<ShockerResultProps> = ({ totalAnnualLeak, recoveryAmount, onConsultationClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto mt-8"
        >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-red-100">
                <div className="bg-red-600 p-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">ANNUAL PROFIT LEAK DETECTED</h2>
                    <p className="text-red-100">Money currently leaving your business</p>
                </div>

                <div className="p-8 text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="mb-8"
                    >
                        <span className="text-5xl md:text-6xl font-extrabold text-red-600 block mb-2">
                            {totalAnnualLeak}
                        </span>
                        <span className="text-gray-500 text-sm uppercase tracking-wider">Total Annual Loss</span>
                    </motion.div>

                    <div className="bg-green-50 rounded-xl p-6 mb-8 border border-green-100">
                        <p className="text-green-800 font-medium mb-1">Potential Recovery Amount</p>
                        <p className="text-3xl font-bold text-green-600">{recoveryAmount}</p>
                    </div>

                    <button
                        onClick={onConsultationClick}
                        className="btn-primary w-full text-lg uppercase tracking-wide"
                    >
                        Schedule My Profit Recovery Consultation
                    </button>

                    <p className="mt-4 text-xs text-gray-400">
                        *Based on your provided metrics and industry standard recovery rates.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ShockerResult;
