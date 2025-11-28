// Utility functions for LifeSync

/**
 * Calculate the average of an array of numbers
 * @param {number[]} arr - Array of numbers
 * @returns {number} - Average value, or 0 if array is empty
 */
export function average(arr) {
  if (!arr || arr.length === 0) return 0
  return arr.reduce((sum, val) => sum + val, 0) / arr.length
}

/**
 * Get the current streak count for a metric
 * @param {Array} entries - Array of daily entries
 * @param {string} metricKey - Key of the metric to check
 * @param {number} threshold - Minimum value to count as "good" (default: 7)
 * @returns {number} - Current streak count
 */
export function getStreakCount(entries, metricKey = 'performance', threshold = 7) {
  if (!entries || entries.length === 0) return 0
  
  let streak = 0
  // Go backwards from most recent
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i]
    const value = entry[metricKey] || entry[`${metricKey}_score`] || entry[`${metricKey}_level`] || 0
    
    if (value >= threshold) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

/**
 * Get the best value for a metric in the given entries
 * @param {Array} entries - Array of daily entries
 * @param {string} metricKey - Key of the metric to check
 * @returns {Object} - Object with value and date of best metric
 */
export function getBestMetric(entries, metricKey = 'performance') {
  if (!entries || entries.length === 0) return { value: 0, date: null }
  
  let best = { value: 0, date: null }
  
  entries.forEach(entry => {
    const value = entry[metricKey] || entry[`${metricKey}_score`] || entry[`${metricKey}_level`] || 0
    
    if (value > best.value) {
      best = { value, date: entry.date }
    }
  })
  
  return best
}

/**
 * Calculate the sum of an array of numbers
 * @param {number[]} arr - Array of numbers
 * @returns {number} - Sum value
 */
export function sum(arr) {
  if (!arr || arr.length === 0) return 0
  return arr.reduce((total, val) => total + val, 0)
}

/**
 * Calculate standard deviation
 * @param {number[]} arr - Array of numbers
 * @returns {number} - Standard deviation
 */
export function standardDeviation(arr) {
  if (!arr || arr.length < 2) return 0
  const avg = average(arr)
  const squareDiffs = arr.map(value => Math.pow(value - avg, 2))
  return Math.sqrt(average(squareDiffs))
}

/**
 * Calculate correlation coefficient between two arrays
 * @param {number[]} arr1 - First array
 * @param {number[]} arr2 - Second array
 * @returns {number} - Correlation coefficient (-1 to 1)
 */
export function correlation(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length !== arr2.length || arr1.length < 2) return 0
  
  const avg1 = average(arr1)
  const avg2 = average(arr2)
  const std1 = standardDeviation(arr1)
  const std2 = standardDeviation(arr2)
  
  if (std1 === 0 || std2 === 0) return 0
  
  const covariance = arr1.reduce((sum, val, i) => {
    return sum + (val - avg1) * (arr2[i] - avg2)
  }, 0) / arr1.length
  
  return covariance / (std1 * std2)
}

/**
 * Format a number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted string
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '-'
  return num.toLocaleString()
}

/**
 * Format minutes to hours and minutes string
 * @param {number} minutes - Total minutes
 * @returns {string} - Formatted string like "2h 30m"
 */
export function formatMinutesToHours(minutes) {
  if (!minutes || minutes <= 0) return '0m'
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Get color based on value and thresholds
 * @param {number} value - Value to check
 * @param {number} low - Low threshold
 * @param {number} high - High threshold
 * @param {boolean} inverse - If true, low is good (like stress)
 * @returns {string} - Color class
 */
export function getStatusColor(value, low, high, inverse = false) {
  if (inverse) {
    if (value <= low) return 'text-green-600'
    if (value <= high) return 'text-yellow-600'
    return 'text-red-600'
  }
  if (value >= high) return 'text-green-600'
  if (value >= low) return 'text-yellow-600'
  return 'text-red-600'
}

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} - Percentage change
 */
export function percentageChange(current, previous) {
  if (!previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Group entries by week
 * @param {Array} entries - Array of entries with date field
 * @returns {Object} - Object with week keys and entry arrays
 */
export function groupByWeek(entries) {
  const weeks = {}
  entries.forEach(entry => {
    const date = new Date(entry.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]
    if (!weeks[weekKey]) weeks[weekKey] = []
    weeks[weekKey].push(entry)
  })
  return weeks
}

/**
 * Get trend direction
 * @param {number[]} values - Array of values over time
 * @returns {string} - 'up', 'down', or 'stable'
 */
export function getTrend(values) {
  if (!values || values.length < 2) return 'stable'
  const firstHalf = average(values.slice(0, Math.floor(values.length / 2)))
  const secondHalf = average(values.slice(Math.floor(values.length / 2)))
  const change = percentageChange(secondHalf, firstHalf)
  if (change > 5) return 'up'
  if (change < -5) return 'down'
  return 'stable'
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Parse time string to decimal hours
 * @param {string} timeStr - Time string like "22:30"
 * @returns {number} - Decimal hours
 */
export function parseTimeToHours(timeStr) {
  if (!timeStr) return null
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours + minutes / 60
}

/**
 * Format decimal hours to time string
 * @param {number} hours - Decimal hours
 * @returns {string} - Time string like "22:30"
 */
export function formatHoursToTime(hours) {
  if (hours === null || hours === undefined) return '-'
  const h = Math.floor(hours % 24)
  const m = Math.round((hours % 1) * 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/**
 * Calculate correlation coefficient (alias for correlation)
 * @param {number[]} arr1 - First array
 * @param {number[]} arr2 - Second array
 * @returns {number} - Correlation coefficient (-1 to 1)
 */
export function calculateCorrelation(arr1, arr2) {
  return correlation(arr1, arr2)
}

/**
 * Detect patterns in health data
 * @param {Array} entries - Array of daily entries
 * @returns {Array} - Array of detected patterns
 */
export function detectPatterns(entries) {
  if (!entries || entries.length < 7) return []
  
  const patterns = []
  
  // Extract data arrays
  const sleepData = entries.map(e => e.sleep || e.sleep_duration_hours || 0)
  const performanceData = entries.map(e => e.performance || e.performance_score || 0)
  const energyData = entries.map(e => e.energy || e.energy_level || 0)
  const stressData = entries.map(e => e.stress || e.stress_level || 0)
  
  // Check sleep-performance correlation
  const sleepPerfCorr = correlation(
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
  
  // Check stress-energy correlation
  const stressEnergyCorr = correlation(stressData, energyData)
  
  if (stressEnergyCorr < -0.4) {
    patterns.push({
      type: 'warning',
      title: 'Stress Impacting Energy',
      description: `Higher stress days show lower energy levels (r=${stressEnergyCorr.toFixed(2)})`
    })
  }
  
  // Check for sleep debt
  const avgSleep = average(sleepData.filter(v => v > 0))
  if (avgSleep < 7 && avgSleep > 0) {
    patterns.push({
      type: 'warning',
      title: 'Sleep Deficit',
      description: `Average sleep of ${avgSleep.toFixed(1)}h is below recommended 7-9 hours`
    })
  }
  
  // Check for consistent good sleep
  const goodSleepDays = sleepData.filter(v => v >= 7).length
  if (goodSleepDays >= entries.length * 0.7) {
    patterns.push({
      type: 'positive',
      title: 'Consistent Sleep',
      description: `${Math.round((goodSleepDays / entries.length) * 100)}% of days with 7+ hours sleep`
    })
  }
  
  // Check for high stress pattern
  const highStressDays = stressData.filter(v => v >= 7).length
  if (highStressDays >= entries.length * 0.3) {
    patterns.push({
      type: 'warning',
      title: 'Elevated Stress',
      description: `${Math.round((highStressDays / entries.length) * 100)}% of days with high stress (7+/10)`
    })
  }
  
  return patterns
}

/**
 * Generate recommendations based on insights and data
 * @param {Array} insights - Array of detected patterns/insights
 * @param {Array} entries - Array of daily entries
 * @param {Array} metrics - Array of tracked metrics
 * @returns {Array} - Array of recommendations
 */
export function generateRecommendations(insights, entries, metrics) {
  if (!entries || entries.length === 0) return []
  
  const recommendations = []
  const recentEntries = entries.slice(-7)
  
  // Calculate recent averages
  const avgSleep = average(recentEntries.map(e => e.sleep || e.sleep_duration_hours || 0).filter(v => v > 0))
  const avgEnergy = average(recentEntries.map(e => e.energy || e.energy_level || 0).filter(v => v > 0))
  const avgStress = average(recentEntries.map(e => e.stress || e.stress_level || 0).filter(v => v > 0))
  const avgPerformance = average(recentEntries.map(e => e.performance || e.performance_score || 0).filter(v => v > 0))
  const avgScreenTime = average(recentEntries.map(e => e.screenTime || e.screen_time_hours || (e.screen_time_total_min || 0) / 60).filter(v => v > 0))
  
  // Sleep recommendations
  if (avgSleep > 0 && avgSleep < 7) {
    recommendations.push({
      category: 'Sleep',
      priority: 'high',
      title: 'Increase Sleep Duration',
      description: `Your average sleep is ${avgSleep.toFixed(1)}h. Aim for 7-9 hours for optimal recovery.`,
      action: 'Try going to bed 30 minutes earlier this week'
    })
  }
  
  // Energy recommendations
  if (avgEnergy > 0 && avgEnergy < 5) {
    recommendations.push({
      category: 'Energy',
      priority: 'medium',
      title: 'Boost Energy Levels',
      description: `Your energy has been averaging ${avgEnergy.toFixed(1)}/10 this week.`,
      action: 'Consider reviewing sleep quality, hydration, and nutrition'
    })
  }
  
  // Stress recommendations
  if (avgStress > 6) {
    recommendations.push({
      category: 'Stress',
      priority: 'high',
      title: 'Manage Stress',
      description: `Stress levels averaging ${avgStress.toFixed(1)}/10 - elevated range.`,
      action: 'Try incorporating 10 minutes of meditation or deep breathing daily'
    })
  }
  
  // Screen time recommendations
  if (avgScreenTime > 5) {
    recommendations.push({
      category: 'Digital Wellness',
      priority: 'medium',
      title: 'Reduce Screen Time',
      description: `Averaging ${avgScreenTime.toFixed(1)}h of screen time daily.`,
      action: 'Set a screen-free hour before bed to improve sleep quality'
    })
  }
  
  // Performance celebration
  if (avgPerformance >= 7) {
    recommendations.push({
      category: 'Performance',
      priority: 'low',
      title: 'Great Performance!',
      description: `Averaging ${avgPerformance.toFixed(1)}/10 - keep up the good work!`,
      action: 'Maintain your current habits and routines'
    })
  }
  
  // Workout consistency
  const workoutDays = recentEntries.filter(e => e.workout_completed || e.exercise).length
  if (workoutDays < 3) {
    recommendations.push({
      category: 'Fitness',
      priority: 'medium',
      title: 'Increase Activity',
      description: `Only ${workoutDays} workout days in the past week.`,
      action: 'Aim for at least 3-4 active days per week'
    })
  }
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  
  return recommendations
}