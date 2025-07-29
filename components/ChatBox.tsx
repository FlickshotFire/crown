import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { ChatMessage } from '../types';

interface ChatBoxProps {
    onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
    const { gameState, sendChatMessage } = useGame();
    const { chatHistory } = gameState;
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [chatHistory]);

    const handleSend = async () => {
        if (!message.trim() || isSending) return;
        setIsSending(true);
        const messageToSend = message;
        setMessage('');
        await sendChatMessage(messageToSend);
        setIsSending(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    }
    
    const renderMessage = (msg: ChatMessage, index: number) => {
        const senderStyle = msg.sender === 'user' 
            ? 'text-amber-300 font-bold' 
            : msg.sender === 'ai' 
                ? 'text-cyan-300 font-bold'
                : 'text-red-400 italic';
        const senderName = msg.sender === 'user' ? 'You' : msg.sender === 'ai' ? 'Advisor' : 'System';

        return (
            <div key={`${msg.timestamp}-${index}`}>
                <span className={senderStyle}>{senderName}: </span>
                <span className="text-white/90 break-words">{msg.text}</span>
            </div>
        );
    }

    return (
        <div className="absolute bottom-24 left-4 w-96 h-80 bg-stone-900/80 backdrop-blur-sm border-2 border-stone-600 rounded-lg flex flex-col pointer-events-auto shadow-2xl animate-fade-in z-[600]">
             <header className="p-2 bg-stone-900/50 border-b-2 border-stone-700 flex justify-between items-center">
                <h2 className="text-lg text-amber-300">Royal Advisor</h2>
                <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-red-700/60 transition-colors" title="Close Chat">
                    <i className="fas fa-times"></i>
                </button>
            </header>
            <div className="flex-grow overflow-y-auto p-2 text-sm space-y-2">
                {chatHistory.length === 0 && (
                    <div className="text-gray-400 italic text-center p-4">
                        Your Royal Advisor, Eldrin, awaits your counsel.
                    </div>
                )}
                {chatHistory.map(renderMessage)}
                {isSending && (
                    <div className="text-cyan-300 italic">Advisor is thinking...</div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-2 border-t-2 border-stone-700 flex items-center space-x-2">
                <input 
                    type="text" 
                    className="flex-grow bg-stone-800 border border-stone-500 rounded px-2 py-1.5 text-white placeholder-gray-500" 
                    placeholder="Ask your advisor..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSending}
                />
                <button 
                    className="w-12 h-9 rounded bg-stone-700 hover:bg-stone-600 text-white disabled:bg-stone-800 disabled:cursor-not-allowed flex items-center justify-center"
                    onClick={handleSend}
                    disabled={isSending || !message.trim()}
                    title="Send"
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ChatBox;