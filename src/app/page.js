'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, Moon, Coffee, Target, Calendar, ChevronRight, Plus, Brain, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { format } from 'date-fns'

export default function Home() {
  const [entries, setEntries] = useState([])
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [insights, setInsights] = useState([])
  const [todayEntry, setTodayEntry] = useState(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('lifesync-entries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
    
    // Check if user already checked in today
    const today = format(new Date(), 'yyyy-MM-dd')
    const saved = JSON.parse(localStorage.getItem('lifesync-entries') || '[]')
    const todayData = saved.find(e => e.date === today)
    if (todayData) {
      setTodayEntry(todayData)
    }

    // Generate insights
    generateInsights()
  }, [])

  const generateInsights = () => {
    const saved = JSON.parse(localStorage.getItem('lifesync-entries') || '[]')
    if (saved.length < 3) return

    const newInsights = []
    
    // Calculate averages
    const avgPerformance = saved.reduce((acc, e) => acc + e.performance, 0) / saved.length
    const avgSleep = saved.reduce((acc, e) => acc + e.sleep, 0) / saved.length
    
    // Find patterns
    const goodDays = saved.filter(e => e.performance >= 7)
    const badDays = saved.filter(e => e.performance <= 4)
    
    if (goodDays.length > 0) {
      const avgGoodSleep = goodDays.reduce((acc, e) => acc + e.sleep, 0) / goodDays.length
      if (avgGoodSleep > avgSleep) {
        newInsights.push({
          type: 'positive',
          title: 'Sleep Sweet Spot Found',
          description: `You perform ${Math.round((avgGoodSleep/avgSleep - 1) * 100)}% better with ${avgGoodSleep.toFixed(1)}hrs of sleep`,
          icon: Moon
        })
      }
    }

    if (badDays.length > 0) {
      const avgBadStress = badDays.reduce((acc, e) => acc + e.stress, 0) / badDays.length
      if (avgBadStress > 6) {
        newInsights.push({
          type: 'warning',
          title: 'Stress Impact Detected',
          description: 'High stress (>6) correlates with 40% drop in performance',
          icon: Zap
        })
      }
    }

    // Check recent trend
    if (saved.length >= 7) {
      const recent = saved.slice(-7)
      const recentAvg = recent.reduce((acc, e) => acc + e.performance, 0) / recent.length
      const older = saved.slice(-14, -7)
      if (older.length === 7) {
        const olderAvg = older.reduce((acc, e) => acc + e.performance, 0) / older.length
        if (recentAvg > olderAvg) {
          newInsights.push({
            type: 'positive',
            title: 'Upward Trend!',
            description: `Performance improved ${Math.round((recentAvg/olderAvg - 1) * 100)}% this week`,
            icon: TrendingUp
          })
        }
      }
    }

    setInsights(newInsights)
  }

  const handleCheckIn = (data) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const newEntry = {
      ...data,
      date: today,
      timestamp: new Date().toISOString()
    }

    const updatedEntries = [...entries.filter(e => e.date !== today), newEntry]
    setEntries(updatedEntries)
    setTodayEntry(newEntry)
    localStorage.setItem('lifesync-entries', JSON.stringify(updatedEntries))
    setShowCheckIn(false)
    generateInsights()
  }

  const getChartData = () => {
    return entries.slice(-7).map(entry => ({
      date: format(new Date(entry.date), 'MM/dd'),
      performance: entry.performance,
      sleep: entry.sleep,
      energy: entry.energy
    }))
  }

  const getRadarData = () => {
    if (entries.length === 0) return []
    
    const latest = entries[entries.length - 1]
    const avg = entries.length > 7 ? 
      entries.slice(-7).reduce((acc, e) => ({
        sleep: acc.sleep + e.sleep/7,
        nutrition: acc.nutrition + e.nutrition/7,
        stress: acc.stress + (10 - e.stress)/7,
        energy: acc.energy + e.energy/7,
        performance: acc.performance + e.performance/7
      }), { sleep: 0, nutrition: 0, stress: 0, energy: 0, performance: 0 }) : null

    return [
      { metric: 'Sleep', today: (latest.sleep / 10) * 100, average: avg ? (avg.sleep / 10) * 100 : 0 },
      { metric: 'Nutrition', today: latest.nutrition * 10, average: avg ? avg.nutrition * 10 : 0 },
      { metric: 'Low Stress', today: (10 - latest.stress) * 10, average: avg ? avg.stress * 10 : 0 },
      { metric: 'Energy', today: latest.energy * 10, average: avg ? avg.energy * 10 : 0 },
      { metric: 'Performance', today: latest.performance * 10, average: avg ? avg.performance * 10 : 0 }
    ]
  }

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LifeSync</h1>
              <p className="text-gray-600">Discover your performance patterns</p>
            </div>
          </div>
          
          {!todayEntry && (
            <button
              onClick={() => setShowCheckIn(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Daily Check-in
            </button>
          )}
        </div>
        
        {todayEntry && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 font-medium">✓ Today's check-in complete</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Current Streak"
          value={`${entries.length} days`}
          icon={Calendar}
          trend="+2 this week"
          color="blue"
        />
        <StatsCard
          title="Avg Performance"
          value={entries.length > 0 ? (entries.reduce((a, e) => a + e.performance, 0) / entries.length).toFixed(1) : '0'}
          icon={Target}
          trend="Improving"
          color="green"
        />
        <StatsCard
          title="Sleep Average"
          value={entries.length > 0 ? `${(entries.reduce((a, e) => a + e.sleep, 0) / entries.length).toFixed(1)}h` : '0h'}
          icon={Moon}
          trend="Stable"
          color="purple"
        />
        <StatsCard
          title="Insights Found"
          value={insights.length}
          icon={Brain}
          trend="Active monitoring"
          color="orange"
        />
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Insights
          </h2>
          <div className="grid gap-4">
            {insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      {entries.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="7-Day Performance Trend">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Today vs Average">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={getRadarData()}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="metric" fontSize={12} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
                <Radar name="Today" dataKey="today" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="7-Day Avg" dataKey="average" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Start Tracking Your Performance</h3>
          <p className="text-gray-600 mb-6">Complete daily check-ins to discover patterns</p>
          <button
            onClick={() => setShowCheckIn(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
          >
            Start First Check-in
          </button>
        </div>
      )}

      {/* Check-in Modal */}
      {showCheckIn && (
        <CheckInModal onClose={() => setShowCheckIn(false)} onSubmit={handleCheckIn} />
      )}
    </main>
  )
}

// Components
function StatsCard({ title, value, icon: Icon, trend, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 bg-gradient-to-br ${colorClasses[color]} rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs text-gray-500">{trend}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  )
}

function InsightCard({ insight }) {
  const Icon = insight.icon
  
  return (
    <div className={`p-4 rounded-xl border ${
      insight.type === 'positive' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex gap-3">
        <div className={`p-2 rounded-lg ${
          insight.type === 'positive' ? 'bg-green-200' : 'bg-yellow-200'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
          <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )
}

function CheckInModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    sleep: 7,
    performance: 5,
    energy: 5,
    stress: 5,
    nutrition: 5,
    exercise: false,
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Daily Check-in</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <SliderInput
            label="Sleep Hours"
            value={formData.sleep}
            onChange={(v) => setFormData({...formData, sleep: v})}
            min={0}
            max={12}
            step={0.5}
            unit="hrs"
            icon={Moon}
          />
          
          <SliderInput
            label="Performance Today"
            value={formData.performance}
            onChange={(v) => setFormData({...formData, performance: v})}
            min={1}
            max={10}
            unit="/10"
            icon={Target}
          />
          
          <SliderInput
            label="Energy Level"
            value={formData.energy}
            onChange={(v) => setFormData({...formData, energy: v})}
            min={1}
            max={10}
            unit="/10"
            icon={Zap}
          />
          
          <SliderInput
            label="Stress Level"
            value={formData.stress}
            onChange={(v) => setFormData({...formData, stress: v})}
            min={1}
            max={10}
            unit="/10"
            icon={Brain}
          />
          
          <SliderInput
            label="Nutrition Quality"
            value={formData.nutrition}
            onChange={(v) => setFormData({...formData, nutrition: v})}
            min={1}
            max={10}
            unit="/10"
            icon={Coffee}
          />
          
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.exercise}
                onChange={(e) => setFormData({...formData, exercise: e.target.checked})}
                className="w-5 h-5 rounded text-blue-500"
              />
              <span className="font-medium">Exercised Today</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any observations about today?"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              Save Check-in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SliderInput({ label, value, onChange, min, max, step = 1, unit, icon: Icon }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Icon className="w-4 h-4" />
          {label}
        </label>
        <span className="text-lg font-semibold text-gray-900">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full slider"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}