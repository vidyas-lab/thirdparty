'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function BookDemoContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        restaurantName: '',
        preferredTime: '',
        notes: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Pre-fill email if passed from chat
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setFormData(prev => ({ ...prev, email: emailParam }));
        }

        // Capture UTM parameters
        const utmSource = searchParams.get('utm_source');
        const utmMedium = searchParams.get('utm_medium');
        const utmCampaign = searchParams.get('utm_campaign');

        if (utmSource || utmMedium || utmCampaign) {
            setFormData(prev => ({
                ...prev,
                utm_source: utmSource || '',
                utm_medium: utmMedium || '',
                utm_campaign: utmCampaign || ''
            }));
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        try {
            // In a real app, you would POST to your backend here
            // await axios.post('/api/demo-request', formData);

            await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
            setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-green-100"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h2>
                    <p className="text-gray-600 mb-8">
                        Thanks, <span className="font-semibold text-gray-900">{formData.name}</span>! We've received your request. One of our profit experts will contact you shortly at <span className="font-semibold text-gray-900">{formData.email}</span>.
                    </p>
                    <Link
                        href="/"
                        className="block w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

                {/* Left Column: Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:block"
                >
                    <Link href="/" className="inline-flex items-center text-gray-500 hover:text-red-600 mb-8 transition-colors font-medium">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Analysis
                    </Link>

                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Stop the <span className="text-red-600">Profit Leak</span> in Your Restaurant
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        You've seen the numbers. Now let's fix them. Schedule a personalized demo to see how Applova can help you reclaim your lost revenue.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-red-100 text-red-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">Customized Strategy</h3>
                                <p className="mt-1 text-gray-500">We'll build a plan tailored to your specific volume and menu.</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-red-100 text-red-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">Instant Implementation</h3>
                                <p className="mt-1 text-gray-500">See how fast you can switch and start saving immediately.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600"></div>

                    <div className="md:hidden mb-6">
                        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-red-600 transition-colors text-sm font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900 mt-4">Book Your Demo</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none bg-gray-50 focus:bg-white"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none bg-gray-50 focus:bg-white"
                                placeholder="john@restaurant.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none bg-gray-50 focus:bg-white"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                            <div>
                                <label htmlFor="restaurantName" className="block text-sm font-semibold text-gray-700 mb-1">Restaurant Name</label>
                                <input
                                    type="text"
                                    id="restaurantName"
                                    name="restaurantName"
                                    required
                                    value={formData.restaurantName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none bg-gray-50 focus:bg-white"
                                    placeholder="Tasty Bites"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time (Optional)</label>
                            <select
                                id="preferredTime"
                                name="preferredTime"
                                value={formData.preferredTime}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none bg-gray-50 focus:bg-white"
                            >
                                <option value="">Select a time...</option>
                                <option value="morning">Morning (9AM - 12PM)</option>
                                <option value="afternoon">Afternoon (12PM - 4PM)</option>
                                <option value="evening">Evening (4PM - 7PM)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                "Confirm Booking"
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            By clicking "Confirm Booking", you agree to our Terms of Service and Privacy Policy.
                        </p>

                        {/* Hidden UTM Fields */}
                        <input type="hidden" name="utm_source" value={formData.utm_source} />
                        <input type="hidden" name="utm_medium" value={formData.utm_medium} />
                        <input type="hidden" name="utm_campaign" value={formData.utm_campaign} />
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default function BookDemoPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookDemoContent />
        </Suspense>
    );
}
