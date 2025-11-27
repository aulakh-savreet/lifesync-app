'use client'

import { Sparkles } from 'lucide-react'
import { generateRecommendations } from '@/lib/utils'

export default function InsightsView({ insights, entries, metrics, theme }) {
  const recommendations = generateRecommendations(insights, entries, metrics)
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`p-6 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
        <h2 className={`text-xl font-semibold ${theme.textPrimary} mb-6`}>AI-Powered Insights</h2>
        
        {insights.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-2`}>
              Gathering Insights
            </h3>
            <p className={`text-sm ${theme.textSecondary} max-w-sm mx-auto`}>
              Keep tracking for at least 7 days to unlock AI-powered pattern detection and personalized recommendations.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {insights.map((insight, i) => {
              const Icon = insight.icon
              
              return (
                <div
                  key={i}
                  className={`p-5 rounded-xl border transition-all hover:shadow-lg ${
                    insight.type === 'positive' 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50/50 border-green-200/60' 
                      : insight.type === 'warning'
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200/60'
                      : 'bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-200/60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${
                      insight.type === 'positive' ? 'bg-green-100 text-green-600' :
                      insight.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {Icon && <Icon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      
                      {/* Correlation bar */}
                      {insight.correlation && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                            <span>Correlation strength</span>
                            <span className="ml-auto font-medium">
                              {(Math.abs(insight.correlation) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                insight.type === 'positive' ? 'bg-green-500' :
                                insight.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.abs(insight.correlation) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Recommendation */}
                      {insight.recommendation && (
                        <div className="mt-3 p-3 rounded-lg bg-white/60 text-sm text-gray-700">
                          <span className="font-medium text-gray-900">Recommendation:</span>{' '}
                          {insight.recommendation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {/* Personalized Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-4`}>
              Personalized Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100"
                >
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
