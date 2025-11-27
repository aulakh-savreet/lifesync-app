// Theme configurations
export const themes = {
  default: {
    name: 'System',
    primary: '#007AFF',
    secondary: '#34C759',
    tertiary: '#FF9500',
    danger: '#FF3B30',
    cardBg: 'bg-white/80',
    cardBorder: 'border-gray-200',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-500',
    bgGradient: 'from-slate-50 via-white to-blue-50'
  },
  midnight: {
    name: 'Midnight',
    primary: '#0A84FF',
    secondary: '#30D158',
    tertiary: '#FF9F0A',
    danger: '#FF453A',
    cardBg: 'bg-gray-900/80',
    cardBorder: 'border-gray-700',
    textPrimary: 'text-gray-100',
    textSecondary: 'text-gray-400',
    bgGradient: 'from-gray-950 via-gray-900 to-gray-950'
  },
  aurora: {
    name: 'Aurora',
    primary: '#BF5AF2',
    secondary: '#5E5CE6',
    tertiary: '#64D2FF',
    danger: '#FF375F',
    cardBg: 'bg-purple-50/80',
    cardBorder: 'border-purple-200',
    textPrimary: 'text-purple-950',
    textSecondary: 'text-purple-600',
    bgGradient: 'from-purple-100 via-pink-50 to-blue-100'
  },
  forest: {
    name: 'Forest',
    primary: '#32D74B',
    secondary: '#248A3D',
    tertiary: '#8E8E0A',
    danger: '#FF6961',
    cardBg: 'bg-green-50/80',
    cardBorder: 'border-green-200',
    textPrimary: 'text-green-950',
    textSecondary: 'text-green-600',
    bgGradient: 'from-green-100 via-emerald-50 to-teal-100'
  }
}

// Default metrics configuration - COMPREHENSIVE
export const defaultMetrics = [
  // Sleep metrics
  { id: 'sleep', name: 'Sleep', icon: 'Moon', unit: 'hrs', min: 0, max: 12, step: 0.5, color: '#8B5CF6', category: 'sleep' },
  { id: 'sleepQuality', name: 'Sleep Quality', icon: 'Moon', unit: '/10', min: 1, max: 10, step: 1, color: '#7C3AED', category: 'sleep' },
  
  // Performance metrics
  { id: 'performance', name: 'Performance', icon: 'Target', unit: '/10', min: 1, max: 10, step: 1, color: '#3B82F6', category: 'performance' },
  { id: 'energy', name: 'Energy', icon: 'Zap', unit: '/10', min: 1, max: 10, step: 1, color: '#10B981', category: 'performance' },
  { id: 'stress', name: 'Stress', icon: 'Brain', unit: '/10', min: 1, max: 10, step: 1, color: '#EF4444', category: 'performance' },
  
  // Nutrition metrics
  { id: 'nutrition', name: 'Nutrition', icon: 'Coffee', unit: '/10', min: 1, max: 10, step: 1, color: '#F59E0B', category: 'nutrition' },
  { id: 'caloriesConsumed', name: 'Calories In', icon: 'Coffee', unit: 'kcal', min: 1000, max: 4000, step: 50, color: '#F97316', category: 'nutrition' },
  
  // Fitness metrics
  { id: 'caloriesBurned', name: 'Calories Out', icon: 'Dumbbell', unit: 'kcal', min: 1000, max: 4000, step: 50, color: '#EC4899', category: 'fitness' },
  { id: 'steps', name: 'Steps', icon: 'Target', unit: '', min: 0, max: 25000, step: 500, color: '#06B6D4', category: 'fitness' },
  { id: 'exercise', name: 'Exercise', icon: 'Dumbbell', unit: 'bool', type: 'boolean', color: '#EC4899', category: 'fitness' },
  
  // Screen time
  { id: 'screenTime', name: 'Screen Time', icon: 'Brain', unit: 'hrs', min: 0, max: 16, step: 0.5, color: '#6366F1', category: 'screentime' }
]

// Comprehensive metrics for detailed tracking (used with database)
export const comprehensiveMetrics = {
  sleep: [
    { id: 'sleep_duration_hours', name: 'Sleep Duration', unit: 'hrs' },
    { id: 'sleep_efficiency', name: 'Sleep Efficiency', unit: '%' },
    { id: 'deep_sleep_hours', name: 'Deep Sleep', unit: 'hrs' },
    { id: 'rem_sleep_hours', name: 'REM Sleep', unit: 'hrs' },
    { id: 'light_sleep_hours', name: 'Light Sleep', unit: 'hrs' },
    { id: 'sleep_quality_score', name: 'Sleep Quality', unit: '/10' },
    { id: 'sleep_onset_latency_min', name: 'Time to Sleep', unit: 'min' },
    { id: 'hrv_overnight', name: 'HRV (Sleep)', unit: 'ms' },
    { id: 'resting_heart_rate_sleep', name: 'Resting HR (Sleep)', unit: 'bpm' },
    { id: 'blood_oxygen_avg', name: 'SpO2 Average', unit: '%' }
  ],
  fitness: [
    { id: 'steps', name: 'Steps', unit: '' },
    { id: 'distance_km', name: 'Distance', unit: 'km' },
    { id: 'calories_burned_total', name: 'Calories Burned', unit: 'kcal' },
    { id: 'active_minutes', name: 'Active Minutes', unit: 'min' },
    { id: 'workout_duration_min', name: 'Workout Duration', unit: 'min' },
    { id: 'workout_type', name: 'Workout Type', unit: '' },
    { id: 'resting_heart_rate', name: 'Resting HR', unit: 'bpm' },
    { id: 'hrv_daily', name: 'Daily HRV', unit: 'ms' },
    { id: 'vo2_max', name: 'VO2 Max', unit: '' },
    { id: 'climbing_max_grade', name: 'Climbing Grade', unit: '' },
    { id: 'climbing_problems_sent', name: 'Problems Sent', unit: '' }
  ],
  nutrition: [
    { id: 'calories_consumed', name: 'Calories In', unit: 'kcal' },
    { id: 'protein_g', name: 'Protein', unit: 'g' },
    { id: 'carbs_g', name: 'Carbs', unit: 'g' },
    { id: 'fat_g', name: 'Fat', unit: 'g' },
    { id: 'fiber_g', name: 'Fiber', unit: 'g' },
    { id: 'sugar_g', name: 'Sugar', unit: 'g' },
    { id: 'water_ml', name: 'Water', unit: 'ml' },
    { id: 'caffeine_mg', name: 'Caffeine', unit: 'mg' },
    { id: 'nutrition_quality_score', name: 'Nutrition Score', unit: '/10' }
  ],
  screenTime: [
    { id: 'screen_time_hours', name: 'Total Screen Time', unit: 'hrs' },
    { id: 'screen_time_social_min', name: 'Social Media', unit: 'min' },
    { id: 'screen_time_productivity_min', name: 'Productive', unit: 'min' },
    { id: 'screen_time_entertainment_min', name: 'Entertainment', unit: 'min' },
    { id: 'phone_pickups', name: 'Phone Pickups', unit: '' },
    { id: 'notifications_received', name: 'Notifications', unit: '' }
  ],
  mental: [
    { id: 'energy_level', name: 'Energy', unit: '/10' },
    { id: 'stress_level', name: 'Stress', unit: '/10' },
    { id: 'mood_score', name: 'Mood', unit: '/5' },
    { id: 'focus_score', name: 'Focus', unit: '/10' },
    { id: 'performance_score', name: 'Performance', unit: '/10' }
  ]
}