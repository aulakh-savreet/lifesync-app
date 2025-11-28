'use client'

import { useState, useEffect } from 'react'
import { format, subDays } from 'date-fns'
import { 
  Moon, Target, Zap, Brain, Coffee, Dumbbell,
  Calendar, TrendingUp, Sparkles
} from 'lucide-react'

import { themes, defaultMetrics as defaultMetricConfigs } from '@/lib/themes'
import { transformDatabaseToUI } from '@/lib/dataTransformer'

import Navbar from '@/components/Navbar'
import DashboardView from '@/components/DashboardView'
import AnalyticsView from '@/components/AnalyticsView'
import CalendarView from '@/components/CalendarView'
import InsightsView from '@/components/InsightsView'
import CheckInModal from '@/components/CheckInModal'
import SettingsModal from '@/components/SettingsModal'
import DataUploadModal from '@/components/DataUploadModal'
import AICoach from '@/components/AICoach'
import AIFloatingButton from '@/components/AIFloatingButton'

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

// Helper functions
function average(arr) {
  if (!arr || arr.length === 0) return 0
  return arr.reduce((sum, val) => sum + val, 0) / arr.length
}

function calculateCorrelation(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length !== arr2.length || arr1.length < 2) return 0
  const avg1 = average(arr1)
  const avg2 = average(arr2)
  const numerator = arr1.reduce((sum, val, i) => sum + (val - avg1) * (arr2[i] - avg2), 0)
  const denom1 = Math.sqrt(arr1.reduce((sum, val) => sum + Math.pow(val - avg1, 2), 0))
  const denom2 = Math.sqrt(arr2.reduce((sum, val) => sum + Math.pow(val - avg2, 2), 0))
  if (denom1 === 0 || denom2 === 0) return 0
  return numerator / (denom1 * denom2)
}

function detectPatterns(entries) {
  if (!entries || entries.length < 7) return []
  const patterns = []
  
  const sleepData = entries.map(e => e.sleep || e.sleep_duration_hours || 0)
  const performanceData = entries.map(e => e.performance || e.performance_score || 0)
  
  const sleepPerfCorr = calculateCorrelation(
    sleepData.slice(0, -1),
    performanceData.slice(1)
  )
  
  if (sleepPerfCorr > 0.5) {
    patterns.push({
      type: 'positive',
      title: 'Sleep-Performance Link',
      description: `Better sleep correlates with improved performance (r=${sleepPerfCorr.toFixed(2)})`
    })
  }
  
  return patterns
}

export default function Home() {
  const [entries, setEntries] = useState([])
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDataUpload, setShowDataUpload] = useState(false)
  const [showAICoach, setShowAICoach] = useState(false)
  const [insights, setInsights] = useState([])
  const [todayEntry, setTodayEntry] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [metrics, setMetrics] = useState(defaultMetrics)
  const [viewMode, setViewMode] = useState('dashboard')
  const [selectedDateRange, setSelectedDateRange] = useState('month')
  const [userPreferences, setUserPreferences] = useState({
    notifications: true,
    autoAnalysis: true,
    privacyMode: false,
    chartType: 'line',
    weekStart: 'monday',
    goals: {
      sleep: 8,
      steps: 10000,
      calories: 2200
    }
  })

  const theme = themes[selectedTheme]

  // Load data on mount
  useEffect(() => {
    // Load saved entries
    const savedEntries = localStorage.getItem('lifesync-entries')
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries)
        // Transform database fields to UI fields
        const transformed = transformDatabaseToUI(parsed)
        setEntries(transformed)
        
        // Check if today's entry exists
        const today = format(new Date(), 'yyyy-MM-dd')
        const todaysEntry = transformed.find(e => e.date === today)
        setTodayEntry(todaysEntry || null)
      } catch (e) {
        console.error('Error loading entries:', e)
      }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('lifesync-theme')
    if (savedTheme && themes[savedTheme]) {
      setSelectedTheme(savedTheme)
    }

    // Load saved preferences
    const savedPrefs = localStorage.getItem('lifesync-preferences')
    if (savedPrefs) {
      try {
        setUserPreferences(JSON.parse(savedPrefs))
      } catch (e) {
        console.error('Error loading preferences:', e)
      }
    }

    // Load saved metrics
    const savedMetrics = localStorage.getItem('lifesync-metrics')
    if (savedMetrics) {
      try {
        const parsed = JSON.parse(savedMetrics)
        const withIcons = parsed.map(m => ({
          ...m,
          icon: iconMap[m.iconName] || Zap
        }))
        setMetrics(withIcons)
      } catch (e) {
        console.error('Error loading metrics:', e)
      }
    }
  }, [])

  // Generate insights when entries change
  useEffect(() => {
    if (entries.length > 0) {
      const patterns = detectPatterns(entries)
      setInsights(patterns)
    }
  }, [entries])

  // Handle data loaded from upload modal
  const handleDataLoaded = (data) => {
    // Transform database fields to UI fields
    const transformed = transformDatabaseToUI(data)
    setEntries(transformed)
    
    // Save raw data to localStorage (keep database format for persistence)
    localStorage.setItem('lifesync-entries', JSON.stringify(data))
    
    // Update today's entry
    const today = format(new Date(), 'yyyy-MM-dd')
    const todaysEntry = transformed.find(e => e.date === today)
    setTodayEntry(todaysEntry || null)
    
    setShowDataUpload(false)
  }

  // Handle check-in
  const handleCheckIn = (newEntry) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const entryWithDate = { ...newEntry, date: today }
    
    const existingIndex = entries.findIndex(e => e.date === today)
    let updatedEntries
    
    if (existingIndex >= 0) {
      updatedEntries = [...entries]
      updatedEntries[existingIndex] = entryWithDate
    } else {
      updatedEntries = [...entries, entryWithDate].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      )
    }
    
    setEntries(updatedEntries)
    setTodayEntry(entryWithDate)
    localStorage.setItem('lifesync-entries', JSON.stringify(updatedEntries))
    setShowCheckIn(false)
  }

  // Export data
  const exportData = () => {
    const data = {
      entries,
      metrics,
      preferences: userPreferences,
      theme: selectedTheme,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lifesync-export-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import data
  const importData = (data) => {
    if (data.entries) {
      const transformed = transformDatabaseToUI(data.entries)
      setEntries(transformed)
      localStorage.setItem('lifesync-entries', JSON.stringify(data.entries))
    }
    if (data.preferences) {
      setUserPreferences(data.preferences)
      localStorage.setItem('lifesync-preferences', JSON.stringify(data.preferences))
    }
    if (data.theme && themes[data.theme]) {
      setSelectedTheme(data.theme)
      localStorage.setItem('lifesync-theme', data.theme)
    }
  }

  // Filter entries based on date range
  const getFilteredEntries = () => {
    if (!entries.length) return []
    
    const now = new Date()
    let startDate
    
    switch (selectedDateRange) {
      case 'week':
        startDate = subDays(now, 7)
        break
      case 'month':
        startDate = subDays(now, 30)
        break
      case 'quarter':
        startDate = subDays(now, 90)
        break
      case 'year':
        startDate = subDays(now, 365)
        break
      default:
        return entries
    }
    
    return entries.filter(e => new Date(e.date) >= startDate)
  }

  const filteredEntries = getFilteredEntries()

  return (
    <div className={`min-h-screen ${theme.background}`}>
      {/* Navbar */}
      <Navbar 
        theme={theme}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSettings={() => setShowSettings(true)}
        onCheckIn={() => setShowCheckIn(true)}
        onDataUpload={() => setShowDataUpload(true)}
        entriesCount={entries.length}
        todayEntry={todayEntry}
        userPreferences={userPreferences}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Date Range Filter */}
        <div className="flex justify-end mb-6">
          <div className={`flex gap-1 p-1 rounded-lg ${theme.cardBg} border ${theme.cardBorder}`}>
            {[
              { id: 'week', label: '7D' },
              { id: 'month', label: '30D' },
              { id: 'quarter', label: '90D' },
              { id: 'year', label: '1Y' },
              { id: 'all', label: 'All' }
            ].map(range => (
              <button
                key={range.id}
                onClick={() => setSelectedDateRange(range.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedDateRange === range.id
                    ? `${theme.accent} text-white`
                    : `${theme.textSecondary} hover:bg-gray-100`
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Views */}
        {viewMode === 'dashboard' && (
          <DashboardView 
            entries={filteredEntries}
            theme={theme}
            metrics={metrics}
            todayEntry={todayEntry}
            onCheckIn={() => setShowCheckIn(true)}
            dateRange={selectedDateRange}
            insights={insights}
          />
        )}
        
        {viewMode === 'analytics' && (
          <AnalyticsView 
            entries={filteredEntries}
            theme={theme}
            dateRange={selectedDateRange}
          />
        )}
        
        {viewMode === 'calendar' && (
          <CalendarView 
            entries={entries}
            theme={theme}
            metrics={metrics}
            onDateSelect={(date) => {
              // Could open a modal or show details for that date
              console.log('Selected date:', date)
            }}
          />
        )}
        
        {viewMode === 'insights' && (
          <InsightsView 
            entries={filteredEntries}
            theme={theme}
            insights={insights}
          />
        )}
      </main>

      {/* AI Floating Button */}
      <AIFloatingButton 
        onClick={() => setShowAICoach(true)}
        hasData={entries.length > 0}
        theme={theme}
      />

      {/* AI Coach */}
      <AICoach 
        entries={entries}
        theme={theme}
        isOpen={showAICoach}
        onClose={() => setShowAICoach(false)}
      />

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

      {/* Data Upload Modal */}
      {showDataUpload && (
        <DataUploadModal
          onClose={() => setShowDataUpload(false)}
          onDataLoaded={handleDataLoaded}
          theme={theme}
        />
      )}
    </div>
  )
}