'use client'

import { Calendar, Target, Brain, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import StatsCard from './StatsCard'
import InsightCard from './InsightCard'
import { average, getStreakCount, getBestMetric } from '@/lib/utils'

export default function DashboardView({ 
  entries, 
  insights, 
  metrics, 
  theme, 
  preferences, 
  todayEntry 
}) {
  const getMetricValue = (metricId) => {
    if (!entries.length) return 0
    const validEntries = entries.filter(e => e[metricId] !== undefined)
    return validEntries.length ? average(validEntries.map(e => e[metricId])) : 0
  }

  const streak = getStreakCount(entries)
  const bestMetric = getBestMetric(entries, metrics)
  const consistency = Math.min(100, Math.round((entries.length / 30) * 100))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Today's Status Card */}
      {todayEntry && (
        <div className={`p-6 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>Today's Summary</h2>
            <span className={`text-sm ${theme.textSecondary} bg-gray-100 px-3 py-1 rounded-full`}>
              {format(new Date(), 'EEEE, MMM d')}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.filter(m => m.type !== 'boolean' && todayEntry[m.id] !== undefined).map(metric => {
              const Icon = metric.icon
              const value = todayEntry[metric.id]
              const avg = getMetricValue(metric.id)
              const diff = avg > 0 ? ((value - avg) / avg * 100).toFixed(0) : 0
              
              return (
                <div key={metric.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: `${metric.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: metric.color }} />
                    </div>
                    <span className={`text-sm ${theme.textSecondary}`}>{metric.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${theme.textPrimary}`}>
                      {value}
                      {metric.unit !== '/10' && <span className="text-sm font-normal ml-0.5">{metric.unit}</span>}
                    </span>
                    {diff !== '0' && diff !== 0 && (
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        parseFloat(diff) > 0 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-red-600 bg-red-50'
                      }`}>
                        {parseFloat(diff) > 0 ? '+' : ''}{diff}%
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Streak"
          value={`${streak} days`}
          icon={Calendar}
          trend="Building momentum"
          color="from-blue-500 to-blue-600"
          theme={theme}
        />
        <StatsCard
          title="Best Metric"
          value={bestMetric?.name || 'Sleep'}
          icon={Target}
          trend="Above average"
          color="from-green-500 to-green-600"
          theme={theme}
        />
        <StatsCard
          title="Insights"
          value={insights.length}
          icon={Brain}
          trend="Patterns detected"
          color="from-purple-500 to-purple-600"
          theme={theme}
        />
        <StatsCard
          title="Consistency"
          value={`${consistency}%`}
          icon={TrendingUp}
          trend="Last 30 days"
          color="from-orange-500 to-orange-600"
          theme={theme}
        />
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div className={`p-6 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>AI Insights</h2>
            <span className={`text-xs ${theme.textSecondary}`}>{insights.length} patterns found</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.slice(0, 3).map((insight, i) => (
              <InsightCard key={i} insight={insight} theme={theme} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Trends Chart */}
      {entries.length > 0 && (
        <div className={`p-6 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>Recent Trends</h2>
            <span className={`text-xs ${theme.textSecondary}`}>Last {Math.min(14, entries.length)} days</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            {preferences?.chartType === 'area' ? (
              <AreaChart data={entries.slice(-14)}>
                <defs>
                  {metrics.filter(m => m.type !== 'boolean').map(metric => (
                    <linearGradient key={metric.id} id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metric.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={metric.color} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                  stroke="#9ca3af" 
                  fontSize={11}
                  tickMargin={8}
                />
                <YAxis stroke="#9ca3af" fontSize={11} tickMargin={8} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                />
                {metrics.filter(m => m.type !== 'boolean').map(metric => (
                  <Area
                    key={metric.id}
                    type="monotone"
                    dataKey={metric.id}
                    stroke={metric.color}
                    fill={`url(#gradient-${metric.id})`}
                    strokeWidth={2}
                    name={metric.name}
                  />
                ))}
              </AreaChart>
            ) : (
              <LineChart data={entries.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                  stroke="#9ca3af" 
                  fontSize={11}
                  tickMargin={8}
                />
                <YAxis stroke="#9ca3af" fontSize={11} tickMargin={8} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                />
                {metrics.filter(m => m.type !== 'boolean').map(metric => (
                  <Line
                    key={metric.id}
                    type="monotone"
                    dataKey={metric.id}
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={{ fill: metric.color, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    name={metric.name}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 && (
        <div className={`p-12 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder} text-center`}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-2`}>
            Start Your Journey
          </h3>
          <p className={`text-sm ${theme.textSecondary} max-w-sm mx-auto`}>
            Complete your first daily check-in to start tracking patterns and unlock personalized insights.
          </p>
        </div>
      )}
    </div>
  )
}
