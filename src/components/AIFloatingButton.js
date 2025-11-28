'use client'

import { Bot, Sparkles } from 'lucide-react'

export default function AIFloatingButton({ onClick, hasData, theme }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group"
      title="Open AI Coach"
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-ping opacity-25" />
        
        {/* Button */}
        <div className="relative flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <Bot className="w-5 h-5" />
          <span className="font-medium">AI Coach</span>
          <Sparkles className="w-4 h-4 opacity-75" />
        </div>

        {/* Data indicator */}
        {hasData && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        )}
      </div>
    </button>
  )
}
