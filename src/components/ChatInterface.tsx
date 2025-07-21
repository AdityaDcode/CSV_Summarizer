import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { chatWithData } from '../services/api';

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  language?: string;
}

interface ChatInterfaceProps {
  csvData: CSVData | null;
  selectedLanguage: 'english' | 'hindi' | 'kannada' | 'marathi';
  isDataAnalyzed: boolean;
}

function ChatInterface({ csvData, selectedLanguage, isDataAnalyzed }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (csvData && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: getWelcomeMessage(),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [csvData, selectedLanguage]);

  const getWelcomeMessage = () => {
    const messages = {
      english: `Hello! I'm your CSV data analyst. I can help you explore and understand your data in detail. You can ask me questions like:
      
• "What are the top 5 performing regions?"
• "Show me trends over time"
• "Which products have the highest sales?"
• "Are there any outliers in the data?"
• "What correlations do you see?"

What would you like to know about your data?`,
      hindi: `नमस्ते! मैं आपका CSV डेटा विश्लेषक हूं। मैं आपको आपके डेटा को विस्तार से समझने में मदद कर सकता हूं। आप मुझसे इस तरह के प्रश्न पूछ सकते हैं:

• "शीर्ष 5 प्रदर्शन करने वाले क्षेत्र कौन से हैं?"
• "समय के साथ रुझान दिखाएं"
• "किन उत्पादों की सबसे अधिक बिक्री है?"
• "डेटा में कोई असामान्यताएं हैं?"
• "आप कौन से संबंध देखते हैं?"

आप अपने डेटा के बारे में क्या जानना चाहते हैं?`,
      kannada: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ CSV ಡೇಟಾ ವಿಶ್ಲೇಷಕ. ನಿಮ್ಮ ಡೇಟಾವನ್ನು ವಿವರವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ನೀವು ನನ್ನನ್ನು ಈ ರೀತಿಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು:

• "ಟಾಪ್ 5 ಪ್ರದರ್ಶನ ನೀಡುವ ಪ್ರದೇಶಗಳು ಯಾವುವು?"
• "ಕಾಲಾನಂತರದಲ್ಲಿ ಪ್ರವೃತ್ತಿಗಳನ್ನು ತೋರಿಸಿ"
• "ಯಾವ ಉತ್ಪಾದನೆಗಳು ಅತ್ಯಧಿಕ ಮಾರಾಟವನ್ನು ಹೊಂದಿವೆ?"
• "ಡೇಟಾದಲ್ಲಿ ಯಾವುದೇ ಅಸಾಮಾನ್ಯತೆಗಳಿವೆಯೇ?"

ನಿಮ್ಮ ಡೇಟಾದ ಬಗ್ಗೆ ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?`,
      marathi: `नमस्कार! मी तुमचा CSV डेटा विश्लेषक आहे। मी तुम्हाला तुमचा डेटा तपशीलवार समजून घेण्यास मदत करू शकतो. तुम्ही मला अशा प्रकारचे प्रश्न विचारू शकता:

• "टॉप 5 कामगिरी करणारे प्रदेश कोणते आहेत?"
• "कालांतराने ट्रेंड दाखवा"
• "कोणत्या उत्पादनांची सर्वाधिक विक्री आहे?"
• "डेटामध्ये काही विसंगती आहेत का?"
• "तुम्हाला कोणते संबंध दिसतात?"

तुम्हाला तुमच्या डेटाबद्दल काय जाणून घ्यायचे आहे?`
    };
    return messages[selectedLanguage];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !csvData) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await chatWithData(inputMessage, csvData, selectedLanguage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are the key trends in this data?",
    "Show me the top performing categories",
    "Are there any correlations I should know about?",
    "What insights can you provide about seasonality?"
  ];

  if (!csvData) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Upload a CSV file to start chatting about your data</p>
      </div>
    );
  }

  if (!isDataAnalyzed) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Please analyze your data first</p>
        <p className="text-sm text-gray-500">Click "Analyze Data" to enable the chat feature</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-t-xl">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && (
                  <Bot className="w-4 h-4 mt-1 text-blue-600 flex-shrink-0" />
                )}
                {message.type === 'user' && (
                  <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm">Analyzing your question...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 bg-white border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask me anything about your data... (in ${selectedLanguage})`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
