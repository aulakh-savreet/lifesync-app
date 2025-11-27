'use client'

import { useState, useEffect } from 'react'
import { format, subDays } from 'date-fns'
import { 
  Moon, Target, Zap, Brain, Coffee, Dumbbell,
  Calendar, TrendingUp, Sparkles
} from 'lucide-react'

import { themes, defaultMetrics as defaultMetricConfigs } from '@/lib/themes'
import { calculateCorrelation, average, detectPatterns } from '@/lib/utils'

import Navbar from '@/components/Navbar'
import DashboardView from '@/components/DashboardView'
import AnalyticsView from '@/components/AnalyticsView'
import CalendarView from '@/components/CalendarView'
import InsightsView from '@/components/InsightsView'
import CheckInModal from '@/components/CheckInModal'
import SettingsModal from '@/components/SettingsModal'

// Map icon strings to actual icon components
const iconMap = {
  Moon, Target, Zap, Brain, Coffee, Dumbbell,
  Calendar, TrendingUp, Sparkles
}

// Convert default metrics with icon components
const defaultMetrics = defaultMetricConfigs.map(metric => ({
  ...metric,
  icon: iconMap[metric.icon] || Zap
}))

export default function Home() {
  const [entries, setEntries] = useState([])
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [insights, setInsights] = useState([])
  const [todayEntry, setTodayEntry] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [metrics, setMetrics] = useState(defaultMetrics)
  const [viewMode, setViewMode] = useState('dashboard')
  const [selectedDateRange, setSelectedDateRange] = useState('week')
  const [userPreferences, setUserPreferences] = useState({
    notifications: true,
    autoAnalysis: true,
    privacyMode: false,
    chartType: 'line',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    goals: {},
    tags: [],
    weatherTracking: false,
    moodTracking: true,
    customReminders: []
  })

  // Load data on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('lifesync-entries')
    const savedTheme = localStorage.getItem('lifesync-theme')
    const savedMetrics = localStorage.getItem('lifesync-metrics')
    const savedPreferences = localStorage.getItem('lifesync-preferences')
    
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries)
      setEntries(parsed)
    }
    if (savedTheme) setSelectedTheme(savedTheme)
    if (savedMetrics) {
      const parsed = JSON.parse(savedMetrics)
      // Restore icon components
      const restored = parsed.map(m => ({
        ...m,
        icon: iconMap[m.iconName] || iconMap[m.icon] || Zap
      }))
      setMetrics(restored)
    }
    if (savedPreferences) setUserPreferences(JSON.parse(savedPreferences))
    
    // Check today's entry
    const today = format(new Date(), 'yyyy-MM-dd')
    const saved = JSON.parse(localStorage.getItem('lifesync-entries') || '[]')
    const todayData = saved.find(e => e.date === today)
    if (todayData) setTodayEntry(todayData)
  }, [])

  // Generate insights when entries change
  useEffect(() => {
    if (entries.length >= 3) {
      generateInsights()
    }
  }, [entries])

  const generateInsights = () => {
    if (entries.length < 3) return

    const newInsights = []
    
    // Correlation analysis
    metrics.forEach(metric1 => {
      metrics.forEach(metric2 => {
        if (metric1.id !== metric2.id && metric1.type !== 'boolean' && metric2.type !== 'boolean') {
          const correlation = calculateCorrelation(
            entries.map(e => e[metric1.id] || 0),
            entries.map(e => e[metric2.id] || 0)
          )
          
          if (Math.abs(correlation) > 0.6) {
            newInsights.push({
              type: correlation > 0 ? 'positive' : 'warning',
              title: `${metric1.name} ↔ ${metric2.name}`,
              description: `Strong ${correlation > 0 ? 'positive' : 'negative'} correlation (${(Math.abs(correlation) * 100).toFixed(0)}%)`,
              icon: Sparkles,
              metric1: metric1.id,
              metric2: metric2.id,
              correlation
            })
          }
        }
      })
    })

    // Trend detection
    if (entries.length >= 7) {
      metrics.forEach(metric => {
        if (metric.type !== 'boolean') {
          const recent = entries.slice(-7)
          const older = entries.slice(-14, -7)
          
          if (older.length === 7) {
            const recentAvg = average(recent.map(e => e[metric.id] || 0))
            const olderAvg = average(older.map(e => e[metric.id] || 0))
            const change = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0
            
            if (Math.abs(change) > 20) {
              newInsights.push({
                type: change > 0 ? 'positive' : 'warning',
                title: `${metric.name} Trend`,
                description: `${change > 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(0)}% this week`,
                icon: TrendingUp,
                metric: metric.id,
                change
              })
            }
          }
        }
      })
    }

    // Pattern recognition
    const patterns = detectPatterns(entries, metrics)
    patterns.forEach(p => {
      newInsights.push({
        ...p,
        icon: iconMap[p.iconName] || Calendar
      })
    })
    
    setInsights(newInsights.slice(0, 6))
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
  }

  const getFilteredEntries = () => {
    let filtered = [...entries]
    const now = new Date()
    
    switch (selectedDateRange) {
      case 'week':
        filtered = filtered.filter(e => new Date(e.date) >= subDays(now, 7))
        break
      case 'month':
        filtered = filtered.filter(e => new Date(e.date) >= subDays(now, 30))
        break
      case 'quarter':
        filtered = filtered.filter(e => new Date(e.date) >= subDays(now, 90))
        break
      case 'year':
        filtered = filtered.filter(e => new Date(e.date) >= subDays(now, 365))
        break
    }
    
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const exportData = () => {
    const dataStr = JSON.stringify({
      entries,
      metrics: metrics.map(m => ({ ...m, iconName: m.icon?.name || 'Zap', icon: undefined })),
      preferences: userPreferences,
      theme: selectedTheme
    }, null, 2)
    
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lifesync-export-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result)
        if (data.entries) {
          setEntries(data.entries)
          localStorage.setItem('lifesync-entries', JSON.stringify(data.entries))
        }
        if (data.metrics) {
          const restored = data.metrics.map(m => ({
            ...m,
            icon: iconMap[m.iconName] || Zap
          }))
          setMetrics(restored)
          localStorage.setItem('lifesync-metrics', JSON.stringify(data.metrics))
        }
        if (data.preferences) {
          setUserPreferences(data.preferences)
          localStorage.setItem('lifesync-preferences', JSON.stringify(data.preferences))
        }
        if (data.theme) {
          setSelectedTheme(data.theme)
          localStorage.setItem('lifesync-theme', data.theme)
        }
      } catch (error) {
        console.error('Import failed:', error)
      }
    }
    reader.readAsText(file)
  }

  const theme = themes[selectedTheme]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} transition-colors duration-300`}>
      {/* Fixed Navbar */}
      <Navbar
        theme={theme}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        todayEntry={todayEntry}
        onCheckIn={() => setShowCheckIn(true)}
        onSettings={() => setShowSettings(true)}
        userPreferences={userPreferences}
      />

      {/* Main Content - Add padding-top to account for fixed navbar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-20 pb-8">
        {viewMode === 'dashboard' && (
          <DashboardView 
            entries={getFilteredEntries()}
            insights={insights}
            metrics={metrics}
            theme={theme}
            preferences={userPreferences}
            todayEntry={todayEntry}
          />
        )}
        
        {viewMode === 'analytics' && (
          <AnalyticsView
            entries={getFilteredEntries()}
            metrics={metrics}
            theme={theme}
            preferences={userPreferences}
            dateRange={selectedDateRange}
            onDateRangeChange={setSelectedDateRange}
          />
        )}
        
        {viewMode === 'calendar' && (
          <CalendarView
            entries={entries}
            metrics={metrics}
            theme={theme}
            onDateSelect={(date) => {
              const entry = entries.find(e => e.date === format(date, 'yyyy-MM-dd'))
              if (!entry) {
                setShowCheckIn(true)
              }
            }}
          />
        )}
        
        {viewMode === 'insights' && (
          <InsightsView
            insights={insights}
            entries={getFilteredEntries()}
            metrics={metrics}
            theme={theme}
          />
        )}
      </main>

      {/* Modals */}
      {showCheckIn && (
        <CheckInModal
          onClose={() => setShowCheckIn(false)}
          onSubmit={handleCheckIn}
          metrics={metrics}
          theme={theme}
          preferences={userPreferences}
        />
      )}
      
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          theme={theme}
          selectedTheme={selectedTheme}
          onThemeChange={(t) => {
            setSelectedTheme(t)
            localStorage.setItem('lifesync-theme', t)
          }}
          metrics={metrics}
          onMetricsChange={(m) => {
            setMetrics(m)
            const toSave = m.map(metric => ({ 
              ...metric, 
              iconName: metric.icon?.name || 'Zap',
              icon: undefined 
            }))
            localStorage.setItem('lifesync-metrics', JSON.stringify(toSave))
          }}
          preferences={userPreferences}
          onPreferencesChange={(p) => {
            setUserPreferences(p)
            localStorage.setItem('lifesync-preferences', JSON.stringify(p))
          }}
          onExport={exportData}
          onImport={importData}
        />
      )}
    </div>
  )
}
