import React, {useEffect, useRef, useState} from 'react';
import {useSendMessage} from '@/api/chat-api';
import {MessageCircle, Send, X} from 'lucide-react';

interface ChatMessage {
    role: 'user' | 'chatbot';
    content: string;
}

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const sendMessageMutation = useSendMessage();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        setChatHistory((prev) => [...prev, { role: 'user', content: message }]);

        const currentMessage = message;
        setMessage('');

        try {
            const response = await sendMessageMutation.mutateAsync(currentMessage);

            setChatHistory((prev) => [...prev, { role: 'chatbot', content: response.message }]);
        } catch (error) {
            console.error('Error communicating with the server:', error);
            setChatHistory((prev) => [...prev, {
                role: 'chatbot',
                content: 'Sorry, I encountered an error processing your request.'
            }]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendMessageMutation.isPending && message.trim()) {
                handleSendMessage();
            }
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl w-96 sm:w-[450px] md:w-[500px] flex flex-col overflow-hidden border border-gray-200">
                    <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
                        <h3 className="font-medium">Quolance Chatbot</h3>
                        <button onClick={toggleChat} className="text-white hover:text-gray-200">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 max-h-[450px]">
                        {chatHistory.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <p>How can I help you today?</p>
                            </div>
                        ) : (
                            chatHistory.map((chat, index) => (
                                <div
                                    key={index}
                                    className={`mb-3 flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`p-3 rounded-lg break-words max-w-[80%] ${
                                        chat.role === 'user'
                                            ? 'bg-indigo-100 text-gray-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {chat.content}
                                    </div>
                                </div>
                            ))
                        )}
                        {sendMessageMutation.isPending && (
                            <div className="mb-3 flex justify-start">
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-gray-200 p-3">
                        <div className="flex items-end space-x-2">
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
                                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-hidden min-h-[40px] max-h-[120px]"
                                disabled={sendMessageMutation.isPending}
                                rows={1}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={sendMessageMutation.isPending || !message.trim()}
                                className={`p-3 rounded-lg flex-shrink-0 ${
                                    sendMessageMutation.isPending || !message.trim()
                                        ? 'bg-gray-300 text-gray-500'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all"
                >
                    <MessageCircle size={24} />
                </button>
            )}
        </div>
    );
};

export default Chatbot;