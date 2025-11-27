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

// Default metrics configuration
export const defaultMetrics = [
  { id: 'sleep', name: 'Sleep', icon: 'Moon', unit: 'hrs', min: 0, max: 12, step: 0.5, color: '#8B5CF6' },
  { id: 'performance', name: 'Performance', icon: 'Target', unit: '/10', min: 1, max: 10, step: 1, color: '#3B82F6' },
  { id: 'energy', name: 'Energy', icon: 'Zap', unit: '/10', min: 1, max: 10, step: 1, color: '#10B981' },
  { id: 'stress', name: 'Stress', icon: 'Brain', unit: '/10', min: 1, max: 10, step: 1, color: '#EF4444' },
  { id: 'nutrition', name: 'Nutrition', icon: 'Coffee', unit: '/10', min: 1, max: 10, step: 1, color: '#F59E0B' },
  { id: 'exercise', name: 'Exercise', icon: 'Dumbbell', unit: 'bool', type: 'boolean', color: '#EC4899' }
]
