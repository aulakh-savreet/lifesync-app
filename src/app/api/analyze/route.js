import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { entries } = await request.json()
    
    if (!entries || entries.length < 7) {
      return NextResponse.json({ 
        patterns: [],
        message: 'Need at least 7 days of data for pattern analysis' 
      })
    }

    const patterns = analyzePatterns(entries)
    
    return NextResponse.json({ patterns })
  } catch (error) {
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}

function analyzePatterns(entries) {
  const patterns = []
  
  // Pattern 1: Sleep-Performance Correlation
  const sleepPerformanceCorr = calculateCorrelation(
    entries.map(e => e.sleep),
    entries.map(e => e.performance)
  )
  
  if (Math.abs(sleepPerformanceCorr) > 0.5) {
    patterns.push({
      type: sleepPerformanceCorr > 0 ? 'positive' : 'negative',
      strength: Math.abs(sleepPerformanceCorr),
      title: 'Sleep-Performance Link',
      description: `${sleepPerformanceCorr > 0 ? 'More' : 'Less'} sleep correlates with ${Math.abs(sleepPerformanceCorr * 100).toFixed(0)}% ${sleepPerformanceCorr > 0 ? 'better' : 'worse'} performance`,
      recommendation: sleepPerformanceCorr > 0 ? 
        'Prioritize 7+ hours of sleep for optimal performance' : 
        'Quality over quantity - focus on sleep efficiency',
      discoveredAt: new Date().toISOString()
    })
  }
  
  // Pattern 2: Stress Impact
  const highStressDays = entries.filter(e => e.stress >= 7)
  const lowStressDays = entries.filter(e => e.stress <= 3)
  
  if (highStressDays.length >= 3 && lowStressDays.length >= 3) {
    const highStressPerf = average(highStressDays.map(e => e.performance))
    const lowStressPerf = average(lowStressDays.map(e => e.performance))
    
    if (Math.abs(highStressPerf - lowStressPerf) > 2) {
      patterns.push({
        type: lowStressPerf > highStressPerf ? 'warning' : 'insight',
        strength: 0.8,
        title: 'Stress Response Pattern',
        description: `Performance ${lowStressPerf > highStressPerf ? 'drops' : 'improves'} by ${Math.abs(highStressPerf - lowStressPerf).toFixed(1)} points under high stress`,
        recommendation: lowStressPerf > highStressPerf ? 
          'Implement stress management before important sessions' :
          'You perform well under pressure - use controlled stress strategically',
        discoveredAt: new Date().toISOString()
      })
    }
  }
  
  // Pattern 3: Weekly Rhythm
  const dayPerformance = {}
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  entries.forEach(entry => {
    const day = days[new Date(entry.date).getDay()]
    if (!dayPerformance[day]) dayPerformance[day] = []
    dayPerformance[day].push(entry.performance)
  })
  
  let bestDay = null
  let worstDay = null
  let bestAvg = 0
  let worstAvg = 10
  
  Object.entries(dayPerformance).forEach(([day, perfs]) => {
    if (perfs.length >= 2) {
      const avg = average(perfs)
      if (avg > bestAvg) {
        bestAvg = avg
        bestDay = day
      }
      if (avg < worstAvg) {
        worstAvg = avg
        worstDay = day
      }
    }
  })
  
  if (bestDay && worstDay && bestAvg - worstAvg > 2) {
    patterns.push({
      type: 'insight',
      strength: 0.7,
      title: 'Weekly Performance Cycle',
      description: `You perform best on ${bestDay}s (${bestAvg.toFixed(1)}/10) and struggle on ${worstDay}s (${worstAvg.toFixed(1)}/10)`,
      recommendation: `Schedule important activities on ${bestDay}s, use ${worstDay}s for recovery`,
      discoveredAt: new Date().toISOString()
    })
  }
  
  return patterns
}

function calculateCorrelation(x, y) {
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

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}
