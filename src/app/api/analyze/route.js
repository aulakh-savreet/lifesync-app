// app/api/analyze/route.js
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

    // Analyze patterns (this is where you'd call AI API later)
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
  
  // Pattern 4: Exercise Impact (24-48hr delayed effect)
  const exerciseDays = entries.filter(e => e.exercise)
  if (exerciseDays.length >= 5) {
    const nextDayEffects = []
    
    exerciseDays.forEach(exerciseEntry => {
      const exerciseIndex = entries.findIndex(e => e.date === exerciseEntry.date)
      if (exerciseIndex < entries.length - 1) {
        const nextDay = entries[exerciseIndex + 1]
        nextDayEffects.push({
          energy: nextDay.energy,
          performance: nextDay.performance
        })
      }
    })
    
    if (nextDayEffects.length >= 3) {
      const avgNextDayEnergy = average(nextDayEffects.map(e => e.energy))
      const overallAvgEnergy = average(entries.map(e => e.energy))
      
      if (Math.abs(avgNextDayEnergy - overallAvgEnergy) > 1) {
        patterns.push({
          type: avgNextDayEnergy > overallAvgEnergy ? 'positive' : 'warning',
          strength: 0.6,
          title: 'Exercise Recovery Pattern',
          description: `Energy ${avgNextDayEnergy > overallAvgEnergy ? 'increases' : 'decreases'} by ${Math.abs(avgNextDayEnergy - overallAvgEnergy).toFixed(1)} points day after exercise`,
          recommendation: avgNextDayEnergy > overallAvgEnergy ? 
            'Current exercise intensity is optimal for recovery' :
            'Consider reducing exercise intensity or improving post-workout nutrition',
          discoveredAt: new Date().toISOString()
        })
      }
    }
  }
  
  // Pattern 5: Nutrition-Energy Connection
  const wellFedDays = entries.filter(e => e.nutrition >= 7)
  const poorNutritionDays = entries.filter(e => e.nutrition <= 4)
  
  if (wellFedDays.length >= 3 && poorNutritionDays.length >= 3) {
    const wellFedEnergy = average(wellFedDays.map(e => e.energy))
    const poorNutritionEnergy = average(poorNutritionDays.map(e => e.energy))
    
    if (wellFedEnergy - poorNutritionEnergy > 2) {
      patterns.push({
        type: 'positive',
        strength: 0.75,
        title: 'Fuel = Energy',
        description: `Good nutrition days show ${((wellFedEnergy/poorNutritionEnergy - 1) * 100).toFixed(0)}% higher energy levels`,
        recommendation: 'Maintain consistent meal quality for sustained energy',
        discoveredAt: new Date().toISOString()
      })
    }
  }
  
  // Self-Modifying Component: Generate new detection rule
  if (patterns.length > 0) {
    const newRule = generateNewDetectionRule(entries, patterns)
    if (newRule) {
      patterns.push(newRule)
    }
  }
  
  return patterns
}

// Helper functions
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

  const correlation = (n * sumXY - sumX * sumY) / denominator

  return correlation
}

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

// Self-Reflective Code: This function writes new pattern detection logic
function generateNewDetectionRule(entries, existingPatterns) {
  // This is where the SRC magic happens - the system creates new rules
  // For now, a simple example that could be replaced with AI-generated code
  
  // Look for combinations not yet detected
  const hasStressSleepCombo = existingPatterns.some(p => 
    p.title.includes('Stress') && p.title.includes('Sleep')
  )
  
  if (!hasStressSleepCombo && entries.length >= 14) {
    // Check if poor sleep + high stress has compound effect
    const poorSleepHighStress = entries.filter(e => 
      e.sleep < 6 && e.stress > 7
    )
    
    if (poorSleepHighStress.length >= 3) {
      const comboPerformance = average(poorSleepHighStress.map(e => e.performance))
      const normalPerformance = average(entries.map(e => e.performance))
      
      if (normalPerformance - comboPerformance > 3) {
        return {
          type: 'warning',
          strength: 0.9,
          title: '🔍 New Pattern Discovered',
          description: `Poor sleep + high stress creates a ${((1 - comboPerformance/normalPerformance) * 100).toFixed(0)}% performance crash`,
          recommendation: 'Avoid high-stress activities when sleep-deprived',
          discoveredAt: new Date().toISOString(),
          selfDiscovered: true // Flag that this was auto-generated
        }
      }
    }
  }
  
  return null
}