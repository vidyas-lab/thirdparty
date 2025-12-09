
import React from 'react';
import { motion } from 'framer-motion';

interface ShockerResultProps {
    totalAnnualLeak: string;
    recoveryAmount: string;
    onConsultationClick: () => void;
    breakdown?: {
        commission_loss: { value: number; percentage: number; formatted: string };
        fixed_fee_loss: { value: number; percentage: number; formatted: string };
        lost_customer_value: { value: number; percentage: number; formatted: string };
    };
}

const ShockerResult: React.FC<ShockerResultProps> = ({ totalAnnualLeak, recoveryAmount, onConsultationClick, breakdown }) => {
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

                    {/* Leak Breakdown Visualization */}
                    {breakdown && (
                        <div className="mb-8 text-left">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Leak Breakdown Visualization</h3>
                            <div className="space-y-4">
                                {/* Commission Loss */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">Commission Loss</span>
                                        <span className="font-bold text-red-600">{breakdown.commission_loss.formatted} ({breakdown.commission_loss.percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${breakdown.commission_loss.percentage}%` }}></div>
                                    </div>
                                </div>



                                {/* Fixed Fee Loss */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">Fixed Fee Loss</span>
                                        <span className="font-bold text-yellow-600">{breakdown.fixed_fee_loss.formatted} ({breakdown.fixed_fee_loss.percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${breakdown.fixed_fee_loss.percentage}%` }}></div>
                                    </div>
                                </div>

                                {/* Lost Customer Value */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">Lost Customer Value</span>
                                        <span className="font-bold text-blue-600">{breakdown.lost_customer_value.formatted} ({breakdown.lost_customer_value.percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${breakdown.lost_customer_value.percentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onConsultationClick}
                        className="btn-primary w-full text-lg uppercase tracking-wide"
                    >
                        Schedule a Free Demo
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
