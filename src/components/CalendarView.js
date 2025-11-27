'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns'

export default function CalendarView({ entries, metrics, theme, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const getDaysInMonth = () => {
    const start = startOfWeek(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1))
    const end = endOfWeek(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))
    return eachDayOfInterval({ start, end })
  }
  
  const days = getDaysInMonth()
  
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }
  
  const goToToday = () => {
    setCurrentMonth(new Date())
  }
  
  return (
    <div className={`p-6 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${theme.textPrimary}`}>
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180 text-gray-600" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const entry = entries.find(e => e.date === dateStr)
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
          const isTodayDate = isToday(day)
          
          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(day)}
              className={`
                aspect-square p-2 rounded-xl transition-all relative group
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                ${isTodayDate ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                ${entry ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'hover:bg-gray-50'}
                hover:shadow-md hover:scale-105
              `}
            >
              <span className={`text-sm font-medium ${isTodayDate ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </span>
              
              {/* Entry Indicators */}
              {entry && (
                <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-0.5">
                    {metrics.slice(0, 3).map(metric => {
                      const value = entry[metric.id]
                      const normalizedValue = metric.type === 'boolean' 
                        ? (value ? 1 : 0)
                        : (value - metric.min) / (metric.max - metric.min)
                      
                      return (
                        <div
                          key={metric.id}
                          className="w-1.5 h-1.5 rounded-full transition-all"
                          style={{
                            backgroundColor: metric.color,
                            opacity: 0.3 + (normalizedValue * 0.7)
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
              
              {/* Hover tooltip */}
              {entry && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                    {metrics.slice(0, 2).map(m => (
                      <span key={m.id} className="mr-2">
                        {m.name}: {entry[m.id]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4">
        {metrics.slice(0, 3).map(metric => (
          <div key={metric.id} className="flex items-center gap-1.5">
            <div 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: metric.color }}
            />
            <span className="text-xs text-gray-500">{metric.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
