'use client'

import { Moon, Clock, Heart, Wind, Droplets, TrendingUp, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { average } from '@/lib/utils'

export default function SleepSection({ entries, theme }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No sleep data available. Upload data to see sleep analytics.
      </div>
    )
  }

  // Calculate sleep stage data for pie chart
  const latestEntry = entries[entries.length - 1]
  const avgSleepDuration = average(entries.map(e => e.sleep_duration_hours || e.sleep || 0).filter(v => v > 0))
  const avgSleepQuality = average(entries.map(e => e.sleep_quality_score || e.sleepQuality || 0).filter(v => v > 0))
  const avgDeepSleep = average(entries.map(e => e.deep_sleep_hours || 0).filter(v => v > 0))
  const avgRemSleep = average(entries.map(e => e.rem_sleep_hours || 0).filter(v => v > 0))
  const avgLightSleep = average(entries.map(e => e.light_sleep_hours || 0).filter(v => v > 0))
  const avgHRV = average(entries.map(e => e.hrv_overnight || 0).filter(v => v > 0))
  const avgRestingHR = average(entries.map(e => e.resting_heart_rate_sleep || 0).filter(v => v > 0))
  const avgSpO2 = average(entries.map(e => e.blood_oxygen_avg || 0).filter(v => v > 0))

  const sleepStageData = [
    { name: 'Deep Sleep', value: avgDeepSleep, color: '#6366F1' },
    { name: 'REM Sleep', value: avgRemSleep, color: '#8B5CF6' },
    { name: 'Light Sleep', value: avgLightSleep, color: '#A78BFA' }
  ].filter(d => d.value > 0)

  // Circadian rhythm data
  const circadianData = entries.slice(-14).map(entry => ({
    date: entry.date,
    bedtime: entry.bedtime ? parseTimeToHours(entry.bedtime) : null,
    wakeTime: entry.wake_time ? parseTimeToHours(entry.wake_time) : null,
    sleepMidpoint: entry.sleep_midpoint ? parseTimeToHours(entry.sleep_midpoint) : null
  })).filter(d => d.bedtime !== null)

  function parseTimeToHours(timeStr) {
    if (!timeStr) return null
    const [hours, minutes] = timeStr.split(':').map(Number)
    let h = hours + minutes / 60
    // Adjust for times after midnight (e.g., 00:30 becomes 24.5 for display)
    if (h < 12) h += 24
    return h
  }

  // Sleep quality trend
  const qualityTrend = entries.slice(-14).map(entry => ({
    date: entry.date,
    quality: entry.sleep_quality_score || entry.sleepQuality || 0,
    duration: entry.sleep_duration_hours || entry.sleep || 0,
    efficiency: entry.sleep_efficiency || 0
  }))

  // Stats cards data
  const statsCards = [
    {
      title: 'Avg Duration',
      value: `${avgSleepDuration.toFixed(1)}h`,
      icon: Clock,
      color: '#8B5CF6',
      subtitle: 'per night'
    },
    {
      title: 'Sleep Quality',
      value: `${avgSleepQuality.toFixed(1)}/10`,
      icon: Moon,
      color: '#6366F1',
      subtitle: 'average score'
    },
    {
      title: 'HRV (Sleep)',
      value: `${avgHRV.toFixed(0)} ms`,
      icon: Heart,
      color: '#EC4899',
      subtitle: 'overnight avg'
    },
    {
      title: 'Resting HR',
      value: `${avgRestingHR.toFixed(0)} bpm`,
      icon: Heart,
      color: '#EF4444',
      subtitle: 'during sleep'
    },
    {
      title: 'Blood Oxygen',
      value: `${avgSpO2.toFixed(1)}%`,
      icon: Droplets,
      color: '#06B6D4',
      subtitle: 'SpO2 average'
    },
    {
      title: 'Deep Sleep',
      value: `${avgDeepSleep.toFixed(1)}h`,
      icon: Moon,
      color: '#4F46E5',
      subtitle: `${((avgDeepSleep / avgSleepDuration) * 100).toFixed(0)}% of sleep`
    }
  ]

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
          <Moon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${theme.textPrimary}`}>Sleep Analytics</h2>
          <p className={`text-sm ${theme.textSecondary}`}>Comprehensive sleep tracking and circadian rhythm analysis</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((stat, i) => (
          <div 
            key={i}
            className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder} hover:shadow-lg transition-all`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="p-1.5 rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className={`text-xs ${theme.textSecondary}`}>{stat.title}</span>
            </div>
            <p className={`text-xl font-bold ${theme.textPrimary}`}>{stat.value}</p>
            <p className={`text-xs ${theme.textSecondary}`}>{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Duration & Quality Trend */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Sleep Duration & Quality Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={qualityTrend}>
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                stroke="#9ca3af"
                fontSize={11}
              />
              <YAxis yAxisId="left" stroke="#8B5CF6" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="duration"
                stroke="#8B5CF6"
                fill="url(#sleepGradient)"
                strokeWidth={2}
                name="Duration (hrs)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="quality"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 3 }}
                name="Quality (/10)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sleep Stages Breakdown */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Sleep Stages Breakdown</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={sleepStageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sleepStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {sleepStageData.map((stage, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className={`text-sm ${theme.textSecondary}`}>{stage.name}</span>
                  </div>
                  <span className={`font-semibold ${theme.textPrimary}`}>
                    {stage.value.toFixed(1)}h
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className={`text-sm font-medium ${theme.textSecondary}`}>Total</span>
                  <span className={`font-bold ${theme.textPrimary}`}>
                    {(avgDeepSleep + avgRemSleep + avgLightSleep).toFixed(1)}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circadian Rhythm */}
        {circadianData.length > 0 && (
          <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
            <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Circadian Rhythm Pattern</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={circadianData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                  stroke="#9ca3af"
                  fontSize={11}
                />
                <YAxis 
                  domain={[20, 32]}
                  tickFormatter={(v) => {
                    const h = v % 24
                    return `${h.toFixed(0)}:00`
                  }}
                  stroke="#9ca3af"
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                  formatter={(value) => {
                    const h = Math.floor(value % 24)
                    const m = Math.floor((value % 1) * 60)
                    return [`${h}:${m.toString().padStart(2, '0')}`, '']
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bedtime"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{ fill: '#6366F1', r: 4 }}
                  name="Bedtime"
                />
                <Line
                  type="monotone"
                  dataKey="wakeTime"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', r: 4 }}
                  name="Wake Time"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className={`text-sm ${theme.textSecondary}`}>Bedtime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className={`text-sm ${theme.textSecondary}`}>Wake Time</span>
              </div>
            </div>
          </div>
        )}

        {/* HRV & Recovery */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Recovery Metrics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={entries.slice(-14).map(e => ({
              date: e.date,
              hrv: e.hrv_overnight || 0,
              restingHR: e.resting_heart_rate_sleep || 0,
              spo2: e.blood_oxygen_avg || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                stroke="#9ca3af"
                fontSize={11}
              />
              <YAxis yAxisId="left" stroke="#EC4899" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#06B6D4" domain={[90, 100]} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px'
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="hrv"
                stroke="#EC4899"
                strokeWidth={2}
                dot={{ fill: '#EC4899', r: 3 }}
                name="HRV (ms)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="spo2"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ fill: '#06B6D4', r: 3 }}
                name="SpO2 (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Recent Sleep Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${theme.cardBorder}`}>
                <th className={`text-left py-3 px-2 font-medium ${theme.textSecondary}`}>Date</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Duration</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Quality</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Deep</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>REM</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Light</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>HRV</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>SpO2</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Bedtime</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(-10).reverse().map((entry, i) => (
                <tr key={i} className={`border-b ${theme.cardBorder} hover:bg-gray-50`}>
                  <td className={`py-3 px-2 ${theme.textPrimary}`}>
                    {format(new Date(entry.date), 'MMM d')}
                  </td>
                  <td className={`text-center py-3 px-2 font-medium ${theme.textPrimary}`}>
                    {(entry.sleep_duration_hours || entry.sleep || 0).toFixed(1)}h
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (entry.sleep_quality_score || entry.sleepQuality || 0) >= 7 
                        ? 'bg-green-100 text-green-700' 
                        : (entry.sleep_quality_score || entry.sleepQuality || 0) >= 5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.sleep_quality_score || entry.sleepQuality || '-'}/10
                    </span>
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.deep_sleep_hours ? `${entry.deep_sleep_hours.toFixed(1)}h` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.rem_sleep_hours ? `${entry.rem_sleep_hours.toFixed(1)}h` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.light_sleep_hours ? `${entry.light_sleep_hours.toFixed(1)}h` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.hrv_overnight ? `${entry.hrv_overnight.toFixed(0)}` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.blood_oxygen_avg ? `${entry.blood_oxygen_avg.toFixed(1)}%` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.bedtime || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}