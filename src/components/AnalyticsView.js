'use client'

import { useState } from 'react'
import { Moon, Apple, Dumbbell, Smartphone, BarChart3, Brain, TrendingUp } from 'lucide-react'
import SleepSection from './SleepSection'
import NutritionSection from './NutritionSection'
import AthleticSection from './AthleticSection'
import ScreenTimeSection from './ScreenTimeSection'
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { format } from 'date-fns'
import { average } from '@/lib/utils'

export default function AnalyticsView({ entries, theme, dateRange }) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: '#6366F1' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: '#8B5CF6' },
    { id: 'nutrition', label: 'Nutrition', icon: Apple, color: '#EF4444' },
    { id: 'athletic', label: 'Athletic', icon: Dumbbell, color: '#22C55E' },
    { id: 'screentime', label: 'Screen Time', icon: Smartphone, color: '#3B82F6' }
  ]

  // Overview metrics
  const calculateOverviewMetrics = () => {
    if (!entries || entries.length === 0) return null

    const avgSleep = average(entries.map(e => e.sleep_duration_hours || e.sleep || 0).filter(v => v > 0))
    const avgSleepQuality = average(entries.map(e => e.sleep_quality_score || e.sleepQuality || 0).filter(v => v > 0))
    const avgPerformance = average(entries.map(e => e.performance_score || e.performance || 0).filter(v => v > 0))
    const avgEnergy = average(entries.map(e => e.energy_level || e.energy || 0).filter(v => v > 0))
    const avgStress = average(entries.map(e => e.stress_level || e.stress || 0).filter(v => v > 0))
    const avgMood = average(entries.map(e => e.mood_score || e.mood || 0).filter(v => v > 0))
    const avgNutrition = average(entries.map(e => e.nutrition_quality_score || 0).filter(v => v > 0))
    const avgScreenTime = average(entries.map(e => e.screen_time_hours || e.screenTime || (e.screen_time_total_min || 0) / 60).filter(v => v > 0))
    const avgCaloriesBurned = average(entries.map(e => e.calories_burned_total || e.caloriesBurned || 0).filter(v => v > 0))
    const avgSteps = average(entries.map(e => e.steps || 0).filter(v => v > 0))

    return {
      avgSleep, avgSleepQuality, avgPerformance, avgEnergy, 
      avgStress, avgMood, avgNutrition, avgScreenTime,
      avgCaloriesBurned, avgSteps
    }
  }

  const metrics = calculateOverviewMetrics()

  // Radar chart data for overview
  const radarData = metrics ? [
    { subject: 'Sleep', value: (metrics.avgSleep / 9) * 10, fullMark: 10 },
    { subject: 'Energy', value: metrics.avgEnergy, fullMark: 10 },
    { subject: 'Performance', value: metrics.avgPerformance, fullMark: 10 },
    { subject: 'Mood', value: metrics.avgMood, fullMark: 10 },
    { subject: 'Nutrition', value: metrics.avgNutrition, fullMark: 10 },
    { subject: 'Recovery', value: 10 - metrics.avgStress, fullMark: 10 }
  ] : []

  // Correlation data
  const correlationData = entries?.slice(-14).map(e => ({
    date: e.date,
    sleep: e.sleep_duration_hours || e.sleep || 0,
    performance: e.performance_score || e.performance || 0,
    energy: e.energy_level || e.energy || 0,
    stress: e.stress_level || e.stress || 0
  })) || []

  // Weekly averages
  const calculateWeeklyAverages = () => {
    if (!entries || entries.length < 7) return []
    
    const weeks = []
    for (let i = 0; i < Math.min(4, Math.floor(entries.length / 7)); i++) {
      const weekEntries = entries.slice(i * 7, (i + 1) * 7)
      weeks.push({
        week: `Week ${i + 1}`,
        sleep: average(weekEntries.map(e => e.sleep_duration_hours || e.sleep || 0)),
        performance: average(weekEntries.map(e => e.performance_score || e.performance || 0)),
        energy: average(weekEntries.map(e => e.energy_level || e.energy || 0)),
        stress: average(weekEntries.map(e => e.stress_level || e.stress || 0))
      })
    }
    return weeks.reverse()
  }

  const weeklyAverages = calculateWeeklyAverages()

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Summary Cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-purple-500" />
              <span className={`text-xs ${theme.textSecondary}`}>Sleep</span>
            </div>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>{metrics.avgSleep.toFixed(1)}h</p>
            <p className={`text-xs ${theme.textSecondary}`}>avg duration</p>
          </div>
          
          <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span className={`text-xs ${theme.textSecondary}`}>Performance</span>
            </div>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>{metrics.avgPerformance.toFixed(1)}/10</p>
            <p className={`text-xs ${theme.textSecondary}`}>avg score</p>
          </div>
          
          <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="w-4 h-4 text-green-500" />
              <span className={`text-xs ${theme.textSecondary}`}>Activity</span>
            </div>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>{(metrics.avgSteps / 1000).toFixed(1)}k</p>
            <p className={`text-xs ${theme.textSecondary}`}>avg steps</p>
          </div>
          
          <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
            <div className="flex items-center gap-2 mb-2">
              <Apple className="w-4 h-4 text-red-500" />
              <span className={`text-xs ${theme.textSecondary}`}>Nutrition</span>
            </div>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>{metrics.avgNutrition.toFixed(1)}/10</p>
            <p className={`text-xs ${theme.textSecondary}`}>quality score</p>
          </div>
          
          <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <span className={`text-xs ${theme.textSecondary}`}>Screen Time</span>
            </div>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>{metrics.avgScreenTime.toFixed(1)}h</p>
            <p className={`text-xs ${theme.textSecondary}`}>avg daily</p>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wellness Radar */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Wellness Score</h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 10]}
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                />
                <Radar
                  name="Wellness"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Correlation Chart */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Sleep vs Performance Correlation</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                stroke="#9ca3af"
                fontSize={11}
              />
              <YAxis yAxisId="left" stroke="#8B5CF6" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" domain={[0, 10]} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px'
                }}
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sleep"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 3 }}
                name="Sleep (hrs)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="performance"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 3 }}
                name="Performance (/10)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trends */}
      {weeklyAverages.length > 0 && (
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyAverages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px'
                }}
              />
              <Bar dataKey="sleep" name="Sleep (hrs)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="performance" name="Performance" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="energy" name="Energy" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insights */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-indigo-500" />
          <h3 className={`text-base font-semibold ${theme.textPrimary}`}>AI Insights</h3>
        </div>
        <div className="space-y-3">
          {metrics && (
            <>
              {metrics.avgSleep < 7 && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-sm text-amber-800">
                    <strong>Sleep Deficit:</strong> Your average sleep of {metrics.avgSleep.toFixed(1)}h is below the recommended 7-9 hours. 
                    This may be impacting your performance and recovery.
                  </p>
                </div>
              )}
              {metrics.avgStress > 6 && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-sm text-red-800">
                    <strong>High Stress:</strong> Your average stress level of {metrics.avgStress.toFixed(1)}/10 is elevated. 
                    Consider incorporating more recovery activities.
                  </p>
                </div>
              )}
              {metrics.avgScreenTime > 5 && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <strong>Screen Time Alert:</strong> {metrics.avgScreenTime.toFixed(1)}h daily average. 
                    High screen time before bed may affect sleep quality.
                  </p>
                </div>
              )}
              {metrics.avgPerformance >= 7 && metrics.avgSleep >= 7 && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-sm text-green-800">
                    <strong>Great Progress:</strong> Your sleep and performance are both in healthy ranges! 
                    Keep maintaining these habits.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className={`p-2 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'text-white shadow-lg'
                  : `${theme.textSecondary} hover:bg-gray-100`
              }`}
              style={activeTab === tab.id ? { backgroundColor: tab.color } : {}}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'sleep' && <SleepSection entries={entries} theme={theme} />}
        {activeTab === 'nutrition' && <NutritionSection entries={entries} theme={theme} />}
        {activeTab === 'athletic' && <AthleticSection entries={entries} theme={theme} />}
        {activeTab === 'screentime' && <ScreenTimeSection entries={entries} theme={theme} />}
      </div>
    </div>
  )
}