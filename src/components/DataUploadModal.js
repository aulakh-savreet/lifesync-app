'use client'

import { useState, useRef } from 'react'
import { 
  Upload, Download, Database, Activity, Moon, 
  Utensils, Smartphone, X, Check, AlertCircle,
  RefreshCw, Trash2, FileJson
} from 'lucide-react'
import { isSupabaseConfigured, bulkUploadEntries, getAllDailyEntries, clearAllData } from '@/lib/supabase'

export default function DataUploadModal({ onClose, onDataLoaded, theme }) {
  const [activeTab, setActiveTab] = useState('upload')
  const [uploading, setUploading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState({
    sleep: true,
    fitness: true,
    nutrition: true,
    screenTime: true
  })
  const fileInputRef = useRef(null)

  const supabaseReady = isSupabaseConfigured()

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    try {
      const text = await file.text()
      let data

      if (file.name.endsWith('.json')) {
        data = JSON.parse(text)
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(text)
      } else {
        throw new Error('Unsupported file format. Use JSON or CSV.')
      }

      // Ensure data is an array
      if (!Array.isArray(data)) {
        data = [data]
      }

      // Validate data has required fields
      const validData = data.filter(entry => entry.date)
      
      if (validData.length === 0) {
        throw new Error('No valid entries found. Each entry must have a "date" field.')
      }

      // If Supabase is configured, upload to database
      if (supabaseReady) {
        await bulkUploadEntries(validData)
        setMessage({ type: 'success', text: `Uploaded ${validData.length} entries to database` })
      } else {
        // Save to localStorage as fallback
        const existing = JSON.parse(localStorage.getItem('lifesync-entries') || '[]')
        const merged = mergeEntries(existing, validData)
        localStorage.setItem('lifesync-entries', JSON.stringify(merged))
        setMessage({ type: 'success', text: `Loaded ${validData.length} entries locally` })
      }

      // Notify parent to refresh
      if (onDataLoaded) {
        const allData = supabaseReady ? await getAllDailyEntries() : JSON.parse(localStorage.getItem('lifesync-entries') || '[]')
        onDataLoaded(allData)
      }

    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const parseCSV = (text) => {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const entry = {}
      headers.forEach((header, index) => {
        let value = values[index]
        // Try to parse numbers
        if (value && !isNaN(value)) {
          value = parseFloat(value)
        } else if (value === 'true') {
          value = true
        } else if (value === 'false') {
          value = false
        }
        entry[header] = value
      })
      return entry
    })
  }

  const mergeEntries = (existing, newEntries) => {
    const map = new Map()
    existing.forEach(e => map.set(e.date, e))
    newEntries.forEach(e => map.set(e.date, { ...map.get(e.date), ...e }))
    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const handleSyncFromDatabase = async () => {
    if (!supabaseReady) {
      setMessage({ type: 'error', text: 'Supabase not configured' })
      return
    }

    setSyncing(true)
    setMessage(null)

    try {
      const data = await getAllDailyEntries()
      localStorage.setItem('lifesync-entries', JSON.stringify(data))
      
      if (onDataLoaded) {
        onDataLoaded(data)
      }

      setMessage({ type: 'success', text: `Synced ${data.length} entries from database` })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSyncing(false)
    }
  }

  const handleDownloadSample = () => {
    window.open('/sample-data.json', '_blank')
  }

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) return

    try {
      if (supabaseReady) {
        await clearAllData()
      }
      localStorage.removeItem('lifesync-entries')
      
      if (onDataLoaded) {
        onDataLoaded([])
      }
      
      setMessage({ type: 'success', text: 'All data cleared' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  const dataCategories = [
    { 
      id: 'sleep', 
      name: 'Sleep Data', 
      icon: Moon, 
      color: '#8B5CF6',
      fields: ['Duration', 'Quality', 'Deep/REM/Light', 'Circadian Rhythm', 'HRV', 'SpO2']
    },
    { 
      id: 'fitness', 
      name: 'Fitness Data', 
      icon: Activity, 
      color: '#10B981',
      fields: ['Steps', 'Calories Burned', 'Workouts', 'Heart Rate Zones', 'VO2 Max', 'Climbing']
    },
    { 
      id: 'nutrition', 
      name: 'Nutrition Data', 
      icon: Utensils, 
      color: '#F59E0B',
      fields: ['Calories', 'Macros (P/C/F)', 'Micronutrients', 'Water', 'Meal Timing']
    },
    { 
      id: 'screenTime', 
      name: 'Screen Time', 
      icon: Smartphone, 
      color: '#3B82F6',
      fields: ['Total Time', 'By Category', 'App Usage', 'Pickups', 'Notifications']
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
              <p className="text-sm text-gray-500">
                {supabaseReady ? '✓ Connected to Supabase' : '⚠ Using local storage'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {[
              { id: 'upload', label: 'Upload Data' },
              { id: 'connect', label: 'Connected Apps' },
              { id: 'manage', label: 'Manage' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Message */}
          {message && (
            <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <Check className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Data Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Data Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {dataCategories.map(cat => (
                    <label
                      key={cat.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedCategories[cat.id]
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCategories[cat.id]}
                          onChange={(e) => setSelectedCategories({
                            ...selectedCategories,
                            [cat.id]: e.target.checked
                          })}
                          className="mt-1 w-4 h-4 rounded text-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                            <span className="font-medium text-gray-900">{cat.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {cat.fields.join(' • ')}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Upload Zone */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload File</h3>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">JSON or CSV file</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadSample}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Sample Data
                </button>
                {supabaseReady && (
                  <button
                    onClick={handleSyncFromDatabase}
                    disabled={syncing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync from Database'}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'connect' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Connect external apps to automatically sync your health data.
              </p>
              
              {[
                { name: 'Apple Health', icon: '🍎', status: 'coming_soon', description: 'Requires iOS app' },
                { name: 'Fitbit', icon: '⌚', status: 'available', description: 'Steps, sleep, heart rate' },
                { name: 'Strava', icon: '🏃', status: 'available', description: 'Workouts, running, cycling' },
                { name: 'Google Fit', icon: '🏋️', status: 'available', description: 'Activity, nutrition' },
                { name: 'MyFitnessPal', icon: '🥗', status: 'coming_soon', description: 'Nutrition tracking' },
                { name: 'Oura Ring', icon: '💍', status: 'coming_soon', description: 'Sleep, recovery, HRV' }
              ].map(app => (
                <div 
                  key={app.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{app.name}</p>
                      <p className="text-sm text-gray-500">{app.description}</p>
                    </div>
                  </div>
                  <button
                    disabled={app.status === 'coming_soon'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      app.status === 'coming_soon'
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {app.status === 'coming_soon' ? 'Coming Soon' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-6">
              {/* Database Status */}
              <div className={`p-4 rounded-xl ${supabaseReady ? 'bg-green-50' : 'bg-amber-50'}`}>
                <div className="flex items-center gap-3">
                  <Database className={`w-5 h-5 ${supabaseReady ? 'text-green-600' : 'text-amber-600'}`} />
                  <div>
                    <p className={`font-medium ${supabaseReady ? 'text-green-700' : 'text-amber-700'}`}>
                      {supabaseReady ? 'Supabase Connected' : 'Supabase Not Configured'}
                    </p>
                    <p className={`text-sm ${supabaseReady ? 'text-green-600' : 'text-amber-600'}`}>
                      {supabaseReady 
                        ? 'Your data is being stored in the cloud database'
                        : 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Data Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const data = localStorage.getItem('lifesync-entries')
                      if (data) {
                        const blob = new Blob([data], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `lifesync-backup-${new Date().toISOString().split('T')[0]}.json`
                        a.click()
                      }
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <FileJson className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Export Backup</p>
                      <p className="text-sm text-gray-500">Download all your data as JSON</p>
                    </div>
                  </button>

                  <button
                    onClick={handleClearData}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div className="text-left">
                      <p className="font-medium text-red-700">Clear All Data</p>
                      <p className="text-sm text-red-500">Permanently delete all entries</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Schema Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Database Schema</h3>
                <div className="p-4 rounded-xl bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto">
                  <p className="text-gray-400">// Run supabase-schema.sql in Supabase SQL Editor</p>
                  <p className="text-green-400">// Includes 100+ fields for comprehensive tracking:</p>
                  <p>• Sleep: duration, stages, circadian, HRV, SpO2</p>
                  <p>• Fitness: steps, HR zones, VO2max, climbing</p>
                  <p>• Nutrition: macros, micros, hydration</p>
                  <p>• Screen: total, by category, pickups</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}