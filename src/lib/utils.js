// Utility functions for data analysis

export function calculateCorrelation(x, y) {
  const n = x.length
  if (n === 0) return 0
  
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0)
  const sumX2 = x.reduce((total, xi) => total + xi * xi, 0)
  const sumY2 = y.reduce((total, yi) => total + yi * yi, 0)
  
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  if (denominator === 0) return 0
  
  return (n * sumXY - sumX * sumY) / denominator
}

export function average(arr) {
  if (!arr || arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

export function detectPatterns(data, metrics) {
  const patterns = []
  const { format } = require('date-fns')
  
  // Day of week patterns
  const dayStats = {}
  data.forEach(entry => {
    const day = format(new Date(entry.date), 'EEEE')
    if (!dayStats[day]) dayStats[day] = []
    dayStats[day].push(entry.performance || 5)
  })
  
  let bestDay = null, worstDay = null
  let bestAvg = 0, worstAvg = 10
  
  Object.entries(dayStats).forEach(([day, values]) => {
    if (values.length >= 2) {
      const avg = average(values)
      if (avg > bestAvg) { bestAvg = avg; bestDay = day }
      if (avg < worstAvg) { worstAvg = avg; worstDay = day }
    }
  })
  
  if (bestDay && worstDay && bestAvg - worstAvg > 1.5) {
    patterns.push({
      type: 'insight',
      title: 'Weekly Rhythm',
      description: `Peak performance on ${bestDay}s, lowest on ${worstDay}s`,
      iconName: 'Calendar'
    })
  }
  
  return patterns
}

export function generateRecommendations(insights, entries, metrics) {
  const recommendations = []
  
  insights.forEach(insight => {
    if (insight.type === 'warning') {
      recommendations.push(`Consider addressing ${insight.title} to improve overall performance`)
    } else if (insight.type === 'positive') {
      recommendations.push(`Keep up the great work with ${insight.title}`)
    }
  })
  
  if (entries.length > 7) {
    const recentAvg = entries.slice(-7).reduce((sum, e) => sum + (e.performance || 0), 0) / 7
    if (recentAvg < 5) {
      recommendations.push('Focus on improving sleep quality and reducing stress this week')
    } else if (recentAvg > 7) {
      recommendations.push('Excellent performance! Document what\'s working to maintain momentum')
    }
  }
  
  return recommendations.slice(0, 3)
}

export function getStreakCount(entries) {
  if (!entries || entries.length === 0) return 0
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date)
    entryDate.setHours(0, 0, 0, 0)
    
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++
    } else if (i === 0 && entryDate.getTime() === expectedDate.getTime() - 86400000) {
      // Allow for yesterday if no entry today
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export function getBestMetric(entries, metrics) {
  if (!entries || entries.length === 0) return { name: 'Sleep', value: 0 }
  
  const numericMetrics = metrics.filter(m => m.type !== 'boolean')
  let bestMetric = null
  let highestAvg = 0
  
  numericMetrics.forEach(metric => {
    const values = entries
      .map(e => e[metric.id])
      .filter(v => typeof v === 'number' && !isNaN(v))
    
    if (values.length > 0) {
      const avg = average(values)
      const normalized = (avg - metric.min) / (metric.max - metric.min)
      
      if (normalized > highestAvg) {
        highestAvg = normalized
        bestMetric = { ...metric, avgValue: avg }
      }
    }
  })
  
  return bestMetric || { name: 'Sleep', avgValue: 0 }
}
