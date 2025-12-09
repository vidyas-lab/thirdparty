'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
    isChatVisible: boolean;
    setIsChatVisible: (visible: boolean) => void;
    scrollToChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isChatVisible, setIsChatVisible] = useState(false);

    const scrollToChat = () => {
        // We need a small delay to allow the component to mount if it was just made visible
        setTimeout(() => {
            const chatSection = document.getElementById('chat-section');
            if (chatSection) {
                chatSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    return (
        <ChatContext.Provider value={{ isChatVisible, setIsChatVisible, scrollToChat }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
