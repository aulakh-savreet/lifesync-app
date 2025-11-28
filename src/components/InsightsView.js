'use client'

import { useState } from 'react'
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Lightbulb, Brain, Target } from 'lucide-react'
import { generateRecommendations } from '@/lib/utils'

export default function InsightsView({ insights = [], entries = [], metrics = [], theme }) {
  const [activeTab, setActiveTab] = useState('patterns')
  
  const recommendations = generateRecommendations(insights, entries, metrics)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800'
      case 'medium': return 'bg-amber-50 border-amber-200 text-amber-800'
      case 'low': return 'bg-green-50 border-green-200 text-green-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'medium': return <Lightbulb className="w-5 h-5 text-amber-500" />
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />
      default: return <Sparkles className="w-5 h-5 text-gray-500" />
    }
  }

  const getPatternIcon = (type) => {
    switch (type) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-500" />
      default: return <Sparkles className="w-5 h-5 text-blue-500" />
    }
  }

  const getPatternColor = (type) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-amber-50 border-amber-200'
      case 'negative': return 'bg-red-50 border-red-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${theme.textPrimary}`}>AI Insights</h2>
          <p className={`text-sm ${theme.textSecondary}`}>Patterns and recommendations based on your data</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 p-1 rounded-lg ${theme.cardBg} border ${theme.cardBorder} w-fit`}>
        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'patterns'
              ? 'bg-purple-500 text-white'
              : `${theme.textSecondary} hover:bg-gray-100`
          }`}
        >
          Patterns ({insights.length})
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'recommendations'
              ? 'bg-purple-500 text-white'
              : `${theme.textSecondary} hover:bg-gray-100`
          }`}
        >
          Recommendations ({recommendations.length})
        </button>
      </div>

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className={`p-8 rounded-xl ${theme.cardBg} border ${theme.cardBorder} text-center`}>
              <Sparkles className={`w-12 h-12 mx-auto mb-4 ${theme.textSecondary}`} />
              <h3 className={`font-semibold ${theme.textPrimary} mb-2`}>No patterns detected yet</h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                Keep logging your data for at least 7 days to see patterns emerge.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getPatternColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getPatternIcon(insight.type)}
                    <div className="flex-1">
                      <h3 className={`font-semibold ${theme.textPrimary} mb-1`}>
                        {insight.title}
                      </h3>
                      <p className={`text-sm ${theme.textSecondary}`}>
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className={`p-8 rounded-xl ${theme.cardBg} border ${theme.cardBorder} text-center`}>
              <Target className={`w-12 h-12 mx-auto mb-4 ${theme.textSecondary}`} />
              <h3 className={`font-semibold ${theme.textPrimary} mb-2`}>No recommendations yet</h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                Add more data to receive personalized recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    {getPriorityIcon(rec.priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 bg-white/50 rounded-full">
                          {rec.category}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-white/50 rounded-full capitalize">
                          {rec.priority} priority
                        </span>
                      </div>
                      <h3 className={`font-semibold ${theme.textPrimary} mb-1`}>
                        {rec.title}
                      </h3>
                      <p className={`text-sm ${theme.textSecondary} mb-2`}>
                        {rec.description}
                      </p>
                      {rec.action && (
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Lightbulb className="w-4 h-4" />
                          <span>{rec.action}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {entries.length > 0 && (
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`font-semibold ${theme.textPrimary} mb-4`}>Data Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className={`text-2xl font-bold ${theme.textPrimary}`}>{entries.length}</p>
              <p className={`text-sm ${theme.textSecondary}`}>Days Tracked</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${theme.textPrimary}`}>{insights.length}</p>
              <p className={`text-sm ${theme.textSecondary}`}>Patterns Found</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${theme.textPrimary}`}>
                {recommendations.filter(r => r.priority === 'high').length}
              </p>
              <p className={`text-sm ${theme.textSecondary}`}>High Priority</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${theme.textPrimary}`}>
                {recommendations.filter(r => r.priority === 'low').length}
              </p>
              <p className={`text-sm ${theme.textSecondary}`}>Positive Notes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}