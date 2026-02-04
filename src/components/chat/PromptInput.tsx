import React, { useState } from 'react';
import { Plus, Copy, Send, Check } from 'lucide-react';
import { usePromptStore } from '../../hooks/usePromptStore';

interface PromptInputProps {
  className?: string;
  isFloating?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ className = '', isFloating = true }) => {
  const { prompt, setPrompt } = usePromptStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const containerClasses = isFloating 
    ? "fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50"
    : `w-full max-w-4xl mx-auto px-4 ${className}`;

  return (
    <div className={containerClasses}>
      <div 
        className="backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(66, 67, 72, 0.8) 0%, rgba(32, 33, 37, 0.6) 100%)'
        }}
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="点击提示词标签或输入提示词"
          className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 outline-none shadow-none resize-none h-24 text-lg leading-relaxed"
        />
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/50">
          <div className="flex items-center space-x-3">
            <button className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-2 bg-gray-800/80 px-2.5 py-1.5 rounded-lg border border-gray-700/50">
              <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <span className="text-xs text-gray-300 font-medium">Seedream4.0</span>
            </div>

            <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-gray-700/50 text-xs text-gray-400">
              1:1
            </div>

            <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-gray-700/50 text-xs text-gray-400">
              1张
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleCopy}
              className={`p-1.5 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1 ${
                copied ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button className={`p-2 rounded-xl transition-all duration-200 ${
              prompt.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
