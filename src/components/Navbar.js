'use client'

import { Activity, Plus, Settings, EyeOff, Database } from 'lucide-react'

export default function Navbar({ 
  theme, 
  viewMode, 
  onViewModeChange, 
  todayEntry, 
  onCheckIn, 
  onSettings,
  onDataUpload,
  userPreferences,
  entriesCount = 0
}) {
  const navItems = ['dashboard', 'analytics', 'calendar', 'insights']

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-semibold ${theme.textPrimary}`}>LifeSync</h1>
              {entriesCount > 0 && (
                <p className="text-xs text-gray-500">{entriesCount} entries</p>
              )}
            </div>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/80 rounded-full p-1">
            {navItems.map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  viewMode === mode 
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Privacy Toggle Indicator */}
            {userPreferences?.privacyMode && (
              <div className="p-2 rounded-full bg-gray-100">
                <EyeOff className="w-4 h-4 text-gray-500" />
              </div>
            )}

            {/* Data Upload Button */}
            <button
              onClick={onDataUpload}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              title="Upload Data"
            >
              <Database className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Quick Add Button */}
            {!todayEntry && (
              <button
                onClick={onCheckIn}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Check In</span>
              </button>
            )}
            
            {/* Settings Button */}
            <button
              onClick={onSettings}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-100">
        <div className="flex justify-around py-2 px-4">
          {navItems.map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === mode 
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}