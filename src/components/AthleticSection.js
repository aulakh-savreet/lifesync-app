'use client'

import { Dumbbell, Timer, Flame, Heart, TrendingUp, Mountain, Footprints, Zap, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, Cell
} from 'recharts'
import { average } from '@/lib/utils'

export default function AthleticSection({ entries, theme }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No athletic data available. Upload data to see performance analytics.
      </div>
    )
  }

  // Filter workout days
  const workoutDays = entries.filter(e => e.workout_completed || e.exercise)
  const climbingDays = entries.filter(e => e.climbing_session === true || e.workout_type?.toLowerCase().includes('climb'))
  const runningDays = entries.filter(e => e.workout_type?.toLowerCase().includes('run') || e.running_distance_km > 0)

  // Calculate averages
  const avgCaloriesBurned = average(entries.map(e => e.calories_burned_total || e.caloriesBurned || 0).filter(v => v > 0))
  const avgActiveCalories = average(entries.map(e => e.active_calories || 0).filter(v => v > 0))
  const avgSteps = average(entries.map(e => e.steps || 0).filter(v => v > 0))
  const avgWorkoutDuration = average(entries.map(e => e.workout_duration_min || 0).filter(v => v > 0))
  const avgHRMax = average(entries.map(e => e.heart_rate_max_workout || 0).filter(v => v > 0))
  const avgHRAvg = average(entries.map(e => e.heart_rate_avg_workout || 0).filter(v => v > 0))
  const avgPerformance = average(entries.map(e => e.performance_score || e.performance || 0).filter(v => v > 0))
  const avgVO2Max = average(entries.map(e => e.vo2_max_estimate || 0).filter(v => v > 0))

  // Climbing specific stats
  const avgClimbingGrade = climbingDays.length > 0 
    ? average(climbingDays.map(e => e.climbing_grade_max || 0).filter(v => v > 0))
    : 0
  const totalProblems = climbingDays.reduce((sum, e) => sum + (e.climbing_problems_completed || 0), 0)
  const avgSendRate = climbingDays.length > 0
    ? average(climbingDays.map(e => e.climbing_send_rate || 0).filter(v => v > 0))
    : 0

  // Running specific stats
  const avgRunningPace = runningDays.length > 0
    ? average(runningDays.map(e => e.running_pace_min_km || 0).filter(v => v > 0))
    : 0
  const totalRunningDistance = runningDays.reduce((sum, e) => sum + (e.running_distance_km || 0), 0)
  const avgRunningCadence = runningDays.length > 0
    ? average(runningDays.map(e => e.running_cadence || 0).filter(v => v > 0))
    : 0

  // Performance trend
  const performanceTrend = entries.slice(-14).map(entry => ({
    date: entry.date,
    performance: entry.performance_score || entry.performance || 0,
    energy: entry.energy_level || entry.energy || 0,
    workout: entry.workout_completed || entry.exercise ? 1 : 0
  }))

  // Workout intensity distribution
  const intensityData = entries.slice(-14).map(entry => ({
    date: entry.date,
    caloriesBurned: entry.calories_burned_total || entry.caloriesBurned || 0,
    duration: entry.workout_duration_min || 0,
    hrMax: entry.heart_rate_max_workout || 0
  }))

  // Climbing progression (if climbing data exists)
  const climbingProgression = climbingDays.slice(-10).map(entry => ({
    date: entry.date,
    grade: entry.climbing_grade_max || 0,
    problems: entry.climbing_problems_completed || 0,
    sendRate: entry.climbing_send_rate || 0,
    projecting: entry.climbing_projecting_time_min || 0
  }))

  // Stats cards
  const statsCards = [
    { title: 'Avg Calories Burned', value: `${avgCaloriesBurned.toFixed(0)}`, icon: Flame, color: '#EF4444', subtitle: 'kcal/day' },
    { title: 'Daily Steps', value: `${(avgSteps / 1000).toFixed(1)}k`, icon: Footprints, color: '#22C55E', subtitle: 'average' },
    { title: 'Workout Duration', value: `${avgWorkoutDuration.toFixed(0)}`, icon: Timer, color: '#3B82F6', subtitle: 'min avg' },
    { title: 'Performance', value: `${avgPerformance.toFixed(1)}/10`, icon: Zap, color: '#F59E0B', subtitle: 'score' },
    { title: 'Max HR (Workout)', value: `${avgHRMax.toFixed(0)}`, icon: Heart, color: '#EC4899', subtitle: 'bpm avg' },
    { title: 'VO2 Max', value: `${avgVO2Max.toFixed(1)}`, icon: Activity, color: '#8B5CF6', subtitle: 'ml/kg/min' }
  ]

  // Workout type breakdown
  const workoutTypes = {}
  entries.forEach(e => {
    if (e.workout_type) {
      workoutTypes[e.workout_type] = (workoutTypes[e.workout_type] || 0) + 1
    }
  })
  const workoutTypeData = Object.entries(workoutTypes).map(([type, count]) => ({
    type,
    count,
    color: type.toLowerCase().includes('climb') ? '#F59E0B' 
      : type.toLowerCase().includes('run') ? '#22C55E'
      : type.toLowerCase().includes('strength') ? '#EF4444'
      : type.toLowerCase().includes('cardio') ? '#3B82F6'
      : '#8B5CF6'
  }))

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${theme.textPrimary}`}>Athletic Performance</h2>
          <p className={`text-sm ${theme.textSecondary}`}>Workout tracking, running metrics, and climbing progression</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((stat, i) => (
          <div 
            key={i}
            className={`p-4 rounded-xl ${theme.cardBg} border ${theme.cardBorder} hover:shadow-lg transition-all`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="p-1.5 rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className={`text-xs ${theme.textSecondary}`}>{stat.title}</span>
            </div>
            <p className={`text-xl font-bold ${theme.textPrimary}`}>{stat.value}</p>
            <p className={`text-xs ${theme.textSecondary}`}>{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance & Energy Trend */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Performance & Energy Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={performanceTrend}>
              <defs>
                <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                stroke="#9ca3af"
                fontSize={11}
              />
              <YAxis domain={[0, 10]} stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px'
                }}
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
              />
              <Area
                type="monotone"
                dataKey="performance"
                stroke="#F59E0B"
                fill="url(#perfGradient)"
                strokeWidth={2}
                name="Performance"
              />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="#22C55E"
                fill="url(#energyGradient)"
                strokeWidth={2}
                name="Energy"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Type Distribution */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Workout Distribution</h3>
          {workoutTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workoutTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9ca3af" fontSize={11} />
                <YAxis dataKey="type" type="category" stroke="#9ca3af" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  name="Sessions"
                  radius={[0, 4, 4, 0]}
                >
                  {workoutTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              No workout type data available
            </div>
          )}
        </div>
      </div>

      {/* Climbing Section */}
      {climbingDays.length > 0 && (
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <div className="flex items-center gap-2 mb-4">
            <Mountain className="w-5 h-5 text-amber-500" />
            <h3 className={`text-base font-semibold ${theme.textPrimary}`}>Climbing Performance</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-xs text-amber-600 mb-1">Max Grade</p>
              <p className="text-2xl font-bold text-amber-700">V{avgClimbingGrade.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
              <p className="text-xs text-green-600 mb-1">Total Problems</p>
              <p className="text-2xl font-bold text-green-700">{totalProblems}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-600 mb-1">Sessions</p>
              <p className="text-2xl font-bold text-blue-700">{climbingDays.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
              <p className="text-xs text-purple-600 mb-1">Avg Send Rate</p>
              <p className="text-2xl font-bold text-purple-700">{avgSendRate.toFixed(0)}%</p>
            </div>
          </div>

          {climbingProgression.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={climbingProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                  stroke="#9ca3af"
                  fontSize={11}
                />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                  labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                />
                <Line
                  type="monotone"
                  dataKey="grade"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', r: 4 }}
                  name="Max Grade (V)"
                />
                <Line
                  type="monotone"
                  dataKey="problems"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={{ fill: '#22C55E', r: 4 }}
                  name="Problems Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Running Section */}
      {runningDays.length > 0 && (
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <div className="flex items-center gap-2 mb-4">
            <Footprints className="w-5 h-5 text-green-500" />
            <h3 className={`text-base font-semibold ${theme.textPrimary}`}>Running Metrics</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
              <p className="text-xs text-green-600 mb-1">Total Distance</p>
              <p className="text-2xl font-bold text-green-700">{totalRunningDistance.toFixed(1)} km</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-600 mb-1">Avg Pace</p>
              <p className="text-2xl font-bold text-blue-700">{avgRunningPace.toFixed(1)} min/km</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
              <p className="text-xs text-purple-600 mb-1">Runs</p>
              <p className="text-2xl font-bold text-purple-700">{runningDays.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-xs text-amber-600 mb-1">Avg Cadence</p>
              <p className="text-2xl font-bold text-amber-700">{avgRunningCadence.toFixed(0)} spm</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={runningDays.slice(-10).map(e => ({
              date: e.date,
              distance: e.running_distance_km || 0,
              pace: e.running_pace_min_km || 0,
              elevation: e.running_elevation_gain || 0
            }))}>
              <defs>
                <linearGradient id="distGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                stroke="#9ca3af"
                fontSize={11}
              />
              <YAxis yAxisId="left" stroke="#22C55E" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px'
                }}
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="distance"
                stroke="#22C55E"
                fill="url(#distGradient)"
                strokeWidth={2}
                name="Distance (km)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pace"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 3 }}
                name="Pace (min/km)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Calorie Burn & Intensity */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Daily Activity & Calorie Burn</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={intensityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MM/dd')}
              stroke="#9ca3af"
              fontSize={11}
            />
            <YAxis yAxisId="left" stroke="#EF4444" fontSize={11} />
            <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px'
              }}
              labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
            />
            <Bar 
              yAxisId="left"
              dataKey="caloriesBurned" 
              name="Calories Burned" 
              fill="#EF4444" 
              radius={[4, 4, 0, 0]} 
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="duration"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 3 }}
              name="Duration (min)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Workout Table */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Recent Workouts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${theme.cardBorder}`}>
                <th className={`text-left py-3 px-2 font-medium ${theme.textSecondary}`}>Date</th>
                <th className={`text-left py-3 px-2 font-medium ${theme.textSecondary}`}>Type</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Duration</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Calories</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Avg HR</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Max HR</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Steps</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(-10).reverse().map((entry, i) => (
                <tr key={i} className={`border-b ${theme.cardBorder} hover:bg-gray-50`}>
                  <td className={`py-3 px-2 ${theme.textPrimary}`}>
                    {format(new Date(entry.date), 'MMM d')}
                  </td>
                  <td className={`py-3 px-2 ${theme.textPrimary}`}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.workout_type?.toLowerCase().includes('climb') 
                        ? 'bg-amber-100 text-amber-700'
                        : entry.workout_type?.toLowerCase().includes('run')
                        ? 'bg-green-100 text-green-700'
                        : entry.workout_type?.toLowerCase().includes('strength')
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.workout_type || 'Rest'}
                    </span>
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.workout_duration_min ? `${entry.workout_duration_min}min` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 font-medium ${theme.textPrimary}`}>
                    {entry.calories_burned_total || entry.caloriesBurned || '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.heart_rate_avg_workout || '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.heart_rate_max_workout || '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.steps ? entry.steps.toLocaleString() : '-'}
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (entry.performance_score || entry.performance || 0) >= 7 
                        ? 'bg-green-100 text-green-700' 
                        : (entry.performance_score || entry.performance || 0) >= 5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.performance_score || entry.performance || '-'}/10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}