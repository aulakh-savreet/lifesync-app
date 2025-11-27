'use client'

import { subDays, format } from 'date-fns'

export default function WeeklyHeatmap({ entries, metric, theme }) {
  const weeks = 12 // Show last 12 weeks
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const getHeatmapData = () => {
    const data = []
    const today = new Date()
    
    for (let w = weeks - 1; w >= 0; w--) {
      for (let d = 0; d < 7; d++) {
        const date = subDays(today, w * 7 + (6 - d))
        const dateStr = format(date, 'yyyy-MM-dd')
        const entry = entries.find(e => e.date === dateStr)
        
        data.push({
          week: w,
          day: d,
          date: dateStr,
          value: entry ? entry[metric?.id] || 0 : 0,
          hasEntry: !!entry
        })
      }
    }
    
    return data
  }
  
  if (!metric) {
    return (
      <div className="text-center py-8 text-gray-500">
        Select a metric to view heatmap
      </div>
    )
  }
  
  const heatmapData = getHeatmapData()
  
  return (
    <div className="space-y-3">
      {/* Day labels */}
      <div className="flex gap-1 pl-8">
        {days.map((day, i) => (
          <div key={day} className="flex-1 text-center text-xs text-gray-400">
            {i % 2 === 0 ? day[0] : ''}
          </div>
        ))}
      </div>
      
      {/* Heatmap grid */}
      <div className="flex gap-1">
        {/* Week labels */}
        <div className="w-7 flex flex-col gap-1 text-right">
          {Array.from({ length: weeks }).map((_, i) => (
            <div key={i} className="aspect-square flex items-center justify-end">
              {i % 4 === 0 && (
                <span className="text-xs text-gray-400">
                  {format(subDays(new Date(), (weeks - 1 - i) * 7), 'M/d')}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Grid */}
        <div className="flex-1">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
            {heatmapData.map((cell, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm transition-all hover:scale-125 cursor-pointer"
                style={{
                  backgroundColor: cell.hasEntry 
                    ? `${metric.color}${Math.floor((cell.value / metric.max) * 200 + 55).toString(16).padStart(2, '0')}`
                    : '#f3f4f6',
                }}
                title={`${format(new Date(cell.date), 'MMM d')}: ${cell.hasEntry ? cell.value : 'No data'}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-0.5">
          {[0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: `${metric.color}${Math.floor(intensity * 200 + 55).toString(16).padStart(2, '0')}`
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
