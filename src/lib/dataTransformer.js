// Transform database field names to UI field names
// This maps the comprehensive database schema to the simpler UI metrics

export function transformDatabaseToUI(entries) {
  if (!Array.isArray(entries)) return []
  
  return entries.map(entry => {
    // Start with original entry
    const transformed = { ...entry }
    
    // Map sleep fields
    if (entry.sleep_duration_hours !== undefined) {
      transformed.sleep = entry.sleep_duration_hours
    }
    if (entry.sleep_quality_score !== undefined) {
      transformed.sleepQuality = entry.sleep_quality_score
    }
    
    // Map performance/mental fields
    if (entry.performance_score !== undefined) {
      transformed.performance = entry.performance_score
    }
    if (entry.energy_level !== undefined) {
      transformed.energy = entry.energy_level
    }
    if (entry.stress_level !== undefined) {
      transformed.stress = entry.stress_level
    }
    if (entry.mood_score !== undefined) {
      transformed.mood = entry.mood_score
    }
    
    // Map nutrition fields
    if (entry.nutrition_quality_score !== undefined) {
      transformed.nutrition = entry.nutrition_quality_score
    }
    if (entry.calories_consumed !== undefined) {
      transformed.caloriesConsumed = entry.calories_consumed
    }
    
    // Map fitness fields
    if (entry.calories_burned_total !== undefined) {
      transformed.caloriesBurned = entry.calories_burned_total
    }
    if (entry.workout_completed !== undefined) {
      transformed.exercise = entry.workout_completed
    }
    // steps stays the same
    
    // Map screen time
    if (entry.screen_time_hours !== undefined) {
      transformed.screenTime = entry.screen_time_hours
    } else if (entry.screen_time_total_min !== undefined) {
      transformed.screenTime = entry.screen_time_total_min / 60
    }
    
    return transformed
  })
}

// Transform UI field names back to database field names (for saving)
export function transformUIToDatabase(entries) {
  if (!Array.isArray(entries)) return []
  
  return entries.map(entry => {
    const transformed = { ...entry }
    
    // Map sleep fields
    if (entry.sleep !== undefined) {
      transformed.sleep_duration_hours = entry.sleep
    }
    if (entry.sleepQuality !== undefined) {
      transformed.sleep_quality_score = entry.sleepQuality
    }
    
    // Map performance/mental fields  
    if (entry.performance !== undefined) {
      transformed.performance_score = entry.performance
    }
    if (entry.energy !== undefined) {
      transformed.energy_level = entry.energy
    }
    if (entry.stress !== undefined) {
      transformed.stress_level = entry.stress
    }
    
    // Map nutrition
    if (entry.nutrition !== undefined) {
      transformed.nutrition_quality_score = entry.nutrition
    }
    if (entry.caloriesConsumed !== undefined) {
      transformed.calories_consumed = entry.caloriesConsumed
    }
    
    // Map fitness
    if (entry.caloriesBurned !== undefined) {
      transformed.calories_burned_total = entry.caloriesBurned
    }
    if (entry.exercise !== undefined) {
      transformed.workout_completed = entry.exercise
    }
    
    // Map screen time
    if (entry.screenTime !== undefined) {
      transformed.screen_time_hours = entry.screenTime
    }
    
    return transformed
  })
}