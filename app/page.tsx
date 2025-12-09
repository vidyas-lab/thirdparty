
'use client';

import React from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100 h-[80vh] flex flex-col">
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
              PA
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">ProfitAdvisor AI</h1>
              <p className="text-xs text-gray-500">Applova Profit Recovery Specialist</p>
            </div>
          </div>
          <div className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            ● Online
          </div>
        </header>

        <div className="flex-1 overflow-hidden bg-gray-50">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
