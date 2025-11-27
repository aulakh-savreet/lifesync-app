'use client'

import { useState } from 'react'
import { 
  X, Download, Upload, LineChart as LineChartIcon, 
  BarChart3, Activity, Brain, Heart, Moon, Sun, Zap, 
  Coffee, Dumbbell, Wind, Droplets, Timer, Target 
} from 'lucide-react'
import { themes } from '@/lib/themes'

const availableIcons = [
  { name: 'Activity', icon: Activity },
  { name: 'Brain', icon: Brain },
  { name: 'Heart', icon: Heart },
  { name: 'Moon', icon: Moon },
  { name: 'Sun', icon: Sun },
  { name: 'Zap', icon: Zap },
  { name: 'Coffee', icon: Coffee },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Wind', icon: Wind },
  { name: 'Droplets', icon: Droplets },
  { name: 'Timer', icon: Timer },
  { name: 'Target', icon: Target }
]

export default function SettingsModal({ 
  onClose, 
  theme, 
  selectedTheme, 
  onThemeChange, 
  metrics, 
  onMetricsChange, 
  preferences, 
  onPreferencesChange, 
  onExport, 
  onImport 
}) {
  const [activeTab, setActiveTab] = useState('appearance')
  const [newMetric, setNewMetric] = useState({
    id: '',
    name: '',
    icon: Zap,
    unit: '/10',
    min: 1,
    max: 10,
    step: 1,
    color: '#3B82F6',
    type: 'number'
  })
  
  const handleAddMetric = () => {
    if (newMetric.name && newMetric.id) {
      const updatedMetrics = [...metrics, { ...newMetric }]
      onMetricsChange(updatedMetrics)
      setNewMetric({
        id: '',
        name: '',
        icon: Zap,
        unit: '/10',
        min: 1,
        max: 10,
        step: 1,
        color: '#3B82F6',
        type: 'number'
      })
    }
  }
  
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('lifesync-entries')
      localStorage.removeItem('lifesync-metrics')
      localStorage.removeItem('lifesync-preferences')
      localStorage.removeItem('lifesync-theme')
      window.location.reload()
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
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
            {['appearance', 'metrics', 'preferences', 'data'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Theme</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(themes).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => onThemeChange(key)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedTheme === key
                          ? 'border-blue-500 shadow-lg bg-blue-50/50'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-3">
                        <div 
                          className="w-5 h-5 rounded-full shadow-sm"
                          style={{ backgroundColor: t.primary }}
                        />
                        <div 
                          className="w-5 h-5 rounded-full shadow-sm"
                          style={{ backgroundColor: t.secondary }}
                        />
                        <div 
                          className="w-5 h-5 rounded-full shadow-sm"
                          style={{ backgroundColor: t.tertiary }}
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Chart Style</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => onPreferencesChange({...preferences, chartType: 'line'})}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                      preferences.chartType === 'line'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <LineChartIcon className="w-5 h-5" />
                    Line
                  </button>
                  <button
                    onClick={() => onPreferencesChange({...preferences, chartType: 'area'})}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                      preferences.chartType === 'area'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    Area
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Active Metrics</h3>
                <div className="space-y-2">
                  {metrics.map((metric, index) => (
                    <div
                      key={metric.id}
                      className="p-4 rounded-xl bg-gray-50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${metric.color}15` }}
                        >
                          <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{metric.name}</p>
                          <p className="text-sm text-gray-500">
                            {metric.type === 'boolean' ? 'Yes/No' : `${metric.min}-${metric.max} ${metric.unit}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updated = metrics.filter((_, i) => i !== index)
                          onMetricsChange(updated)
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
                      >
                        <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Add Custom Metric</h3>
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Metric Name"
                      value={newMetric.name}
                      onChange={(e) => setNewMetric({
                        ...newMetric, 
                        name: e.target.value,
                        id: e.target.value.toLowerCase().replace(/\s+/g, '_')
                      })}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={newMetric.type}
                      onChange={(e) => setNewMetric({...newMetric, type: e.target.value})}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="number">Number</option>
                      <option value="boolean">Yes/No</option>
                    </select>
                  </div>
                  
                  {newMetric.type === 'number' && (
                    <div className="grid grid-cols-4 gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={newMetric.min}
                        onChange={(e) => setNewMetric({...newMetric, min: parseFloat(e.target.value)})}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={newMetric.max}
                        onChange={(e) => setNewMetric({...newMetric, max: parseFloat(e.target.value)})}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Step"
                        value={newMetric.step}
                        onChange={(e) => setNewMetric({...newMetric, step: parseFloat(e.target.value)})}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={newMetric.unit}
                        onChange={(e) => setNewMetric({...newMetric, unit: e.target.value})}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {availableIcons.slice(0, 6).map(({ name, icon: Icon }) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setNewMetric({...newMetric, icon: Icon})}
                          className={`p-2 rounded-lg transition-all ${
                            newMetric.icon === Icon 
                              ? 'bg-blue-100 ring-2 ring-blue-500' 
                              : 'bg-white border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-5 h-5 text-gray-600" />
                        </button>
                      ))}
                    </div>
                    <input
                      type="color"
                      value={newMetric.color}
                      onChange={(e) => setNewMetric({...newMetric, color: e.target.value})}
                      className="h-10 w-14 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={handleAddMetric}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Features</h3>
              {[
                { key: 'notifications', label: 'Push Notifications', desc: 'Get reminders to check in' },
                { key: 'autoAnalysis', label: 'Auto-Analysis', desc: 'Automatically detect patterns' },
                { key: 'privacyMode', label: 'Privacy Mode', desc: 'Hide sensitive data' },
                { key: 'weatherTracking', label: 'Weather Tracking', desc: 'Track weather impact on performance' },
                { key: 'moodTracking', label: 'Mood Tracking', desc: 'Add mood to daily check-ins' }
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div>
                    <span className="font-medium text-gray-900">{label}</span>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences[key]}
                    onChange={(e) => onPreferencesChange({...preferences, [key]: e.target.checked})}
                    className="w-5 h-5 rounded text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          )}
          
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Export & Import</h3>
                <div className="flex gap-3">
                  <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Export Data
                  </button>
                  
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5" />
                    Import Data
                    <input
                      type="file"
                      accept=".json"
                      onChange={onImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Privacy</h3>
                <p className="text-sm text-gray-500 mb-4">
                  All your data is stored locally on your device. We never send your personal information to any servers.
                </p>
                <button 
                  onClick={handleClearData}
                  className="px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
