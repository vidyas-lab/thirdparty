import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-gray-500 text-sm">
                        Applova© 2025 Applova Inc. | All Rights Reserved.
                    </div>
                    <div className="flex space-x-6">
                        <Link href="https://applova.io/terms/" className="text-gray-500 hover:text-red-600 text-sm transition-colors">
                            Terms of Service
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link href="https://applova.io/privacy-policy" className="text-gray-500 hover:text-red-600 text-sm transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
