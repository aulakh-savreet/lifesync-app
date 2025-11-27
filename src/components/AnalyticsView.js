'use client'

import { useState } from 'react'
import { Calendar, Filter } from 'lucide-react'
import { subDays, format } from 'date-fns'
import { 
  ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { average } from '@/lib/utils'
import WeeklyHeatmap from './WeeklyHeatmap'

export default function AnalyticsView({ 
  entries, 
  metrics, 
  theme, 
  preferences, 
  dateRange, 
  onDateRangeChange 
}) {
  const [selectedMetrics, setSelectedMetrics] = useState(
    metrics.filter(m => m.type !== 'boolean').slice(0, 2)
  )
  
  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => 
      prev.find(m => m.id === metric.id)
        ? prev.filter(m => m.id !== metric.id)
        : [...prev, metric]
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className={`p-4 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select 
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-100 border-0 text-sm font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex gap-2 flex-wrap">
              {metrics.filter(m => m.type !== 'boolean').map(metric => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedMetrics.find(m => m.id === metric.id)
                      ? 'text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={selectedMetrics.find(m => m.id === metric.id) 
                    ? { backgroundColor: metric.color }
                    : {}
                  }
                >
                  {metric.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlation Scatter Plot */}
        {selectedMetrics.length >= 2 && (
          <div className={`p-6 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
            <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>
              {selectedMetrics[0].name} vs {selectedMetrics[1].name}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey={selectedMetrics[0].id} 
                  name={selectedMetrics[0].name}
                  stroke="#9ca3af"
                  fontSize={11}
                />
                <YAxis 
                  dataKey={selectedMetrics[1].id}
                  name={selectedMetrics[1].name}
                  stroke="#9ca3af"
                  fontSize={11}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Scatter 
                  name="Correlation"
                  data={entries}
                  fill={theme.primary || '#3b82f6'}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Distribution Chart */}
        <div className={`p-6 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Metric Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={selectedMetrics.map(metric => {
              const values = entries
                .map(e => e[metric.id])
                .filter(v => typeof v === 'number' && !isNaN(v))
              return {
                name: metric.name,
                avg: values.length ? average(values) : 0,
                color: metric.color
              }
            })}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="avg" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Heatmap */}
        <div className={`p-6 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Weekly Heatmap</h3>
          <WeeklyHeatmap entries={entries} metric={selectedMetrics[0]} theme={theme} />
        </div>

        {/* Statistical Summary */}
        <div className={`p-6 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Statistical Summary</h3>
          <div className="space-y-5">
            {selectedMetrics.map(metric => {
              const values = entries
                .map(e => e[metric.id])
                .filter(v => typeof v === 'number' && !isNaN(v))

              if (!values.length) {
                return (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
                      <span className={`font-medium ${theme.textPrimary}`}>{metric.name}</span>
                    </div>
                    <p className={`text-sm ${theme.textSecondary}`}>No data recorded yet</p>
                  </div>
                )
              }

              const avg = average(values)
              const sorted = [...values].sort((a, b) => a - b)
              const mid = Math.floor(sorted.length / 2)
              const median = sorted.length % 2 !== 0
                ? sorted[mid]
                : (sorted[mid - 1] + sorted[mid]) / 2
              const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
              const stdDev = Math.sqrt(variance)
              const min = Math.min(...values)
              const max = Math.max(...values)
              
              return (
                <div key={metric.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: `${metric.color}15` }}
                    >
                      <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
                    </div>
                    <span className={`font-medium ${theme.textPrimary}`}>{metric.name}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Mean', value: avg.toFixed(2) },
                      { label: 'Median', value: median.toFixed(2) },
                      { label: 'Std Dev', value: stdDev.toFixed(2) },
                      { label: 'Range', value: `${min.toFixed(1)}-${max.toFixed(1)}` }
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                        <span className={`text-xs ${theme.textSecondary}`}>{label}</span>
                        <p className={`font-semibold ${theme.textPrimary} text-sm`}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
