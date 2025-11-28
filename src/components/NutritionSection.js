'use client'

import { Apple, Flame, Beef, Wheat, Droplets, Pill, TrendingUp, Target } from 'lucide-react'
import { format } from 'date-fns'
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { average } from '@/lib/utils'

export default function NutritionSection({ entries, theme }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No nutrition data available. Upload data to see nutrition analytics.
      </div>
    )
  }

  // Calculate averages
  const avgCalories = average(entries.map(e => e.calories_consumed || 0).filter(v => v > 0))
  const avgProtein = average(entries.map(e => e.protein_g || 0).filter(v => v > 0))
  const avgCarbs = average(entries.map(e => e.carbs_g || 0).filter(v => v > 0))
  const avgFat = average(entries.map(e => e.fat_g || 0).filter(v => v > 0))
  const avgFiber = average(entries.map(e => e.fiber_g || 0).filter(v => v > 0))
  const avgWater = average(entries.map(e => e.water_intake_ml || 0).filter(v => v > 0))
  const avgNutritionScore = average(entries.map(e => e.nutrition_quality_score || 0).filter(v => v > 0))

  // Macro breakdown for pie chart
  const macroData = [
    { name: 'Protein', value: avgProtein * 4, grams: avgProtein, color: '#EF4444' },
    { name: 'Carbs', value: avgCarbs * 4, grams: avgCarbs, color: '#F59E0B' },
    { name: 'Fat', value: avgFat * 9, grams: avgFat, color: '#3B82F6' }
  ]

  const totalMacroCalories = macroData.reduce((sum, m) => sum + m.value, 0)

  // Micronutrient data
  const micronutrients = [
    { name: 'Vitamin A', value: average(entries.map(e => e.vitamin_a_mcg || 0)), unit: 'mcg', target: 900, color: '#F97316' },
    { name: 'Vitamin C', value: average(entries.map(e => e.vitamin_c_mg || 0)), unit: 'mg', target: 90, color: '#FBBF24' },
    { name: 'Vitamin D', value: average(entries.map(e => e.vitamin_d_mcg || 0)), unit: 'mcg', target: 20, color: '#FDE047' },
    { name: 'Vitamin B12', value: average(entries.map(e => e.vitamin_b12_mcg || 0)), unit: 'mcg', target: 2.4, color: '#A3E635' },
    { name: 'Iron', value: average(entries.map(e => e.iron_mg || 0)), unit: 'mg', target: 8, color: '#EF4444' },
    { name: 'Calcium', value: average(entries.map(e => e.calcium_mg || 0)), unit: 'mg', target: 1000, color: '#F5F5F5' },
    { name: 'Magnesium', value: average(entries.map(e => e.magnesium_mg || 0)), unit: 'mg', target: 400, color: '#14B8A6' },
    { name: 'Zinc', value: average(entries.map(e => e.zinc_mg || 0)), unit: 'mg', target: 11, color: '#6366F1' },
    { name: 'Potassium', value: average(entries.map(e => e.potassium_mg || 0)), unit: 'mg', target: 3400, color: '#8B5CF6' },
    { name: 'Omega-3', value: average(entries.map(e => e.omega3_mg || 0)), unit: 'mg', target: 1600, color: '#06B6D4' }
  ]

  // Calorie trend data
  const calorieTrend = entries.slice(-14).map(entry => ({
    date: entry.date,
    consumed: entry.calories_consumed || 0,
    burned: entry.calories_burned_total || entry.caloriesBurned || 0,
    net: (entry.calories_consumed || 0) - (entry.calories_burned_total || entry.caloriesBurned || 0)
  }))

  // Macro trend over time
  const macroTrend = entries.slice(-14).map(entry => ({
    date: entry.date,
    protein: entry.protein_g || 0,
    carbs: entry.carbs_g || 0,
    fat: entry.fat_g || 0
  }))

  // Stats cards
  const statsCards = [
    { title: 'Avg Calories', value: `${avgCalories.toFixed(0)}`, icon: Flame, color: '#EF4444', subtitle: 'kcal/day' },
    { title: 'Protein', value: `${avgProtein.toFixed(0)}g`, icon: Beef, color: '#DC2626', subtitle: `${((avgProtein * 4 / avgCalories) * 100).toFixed(0)}% of cals` },
    { title: 'Carbs', value: `${avgCarbs.toFixed(0)}g`, icon: Wheat, color: '#F59E0B', subtitle: `${((avgCarbs * 4 / avgCalories) * 100).toFixed(0)}% of cals` },
    { title: 'Fat', value: `${avgFat.toFixed(0)}g`, icon: Droplets, color: '#3B82F6', subtitle: `${((avgFat * 9 / avgCalories) * 100).toFixed(0)}% of cals` },
    { title: 'Fiber', value: `${avgFiber.toFixed(0)}g`, icon: Apple, color: '#22C55E', subtitle: 'daily avg' },
    { title: 'Water', value: `${(avgWater / 1000).toFixed(1)}L`, icon: Droplets, color: '#06B6D4', subtitle: 'daily avg' }
  ]

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
          <Apple className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${theme.textPrimary}`}>Nutrition Analytics</h2>
          <p className={`text-sm ${theme.textSecondary}`}>Macronutrients, micronutrients, and calorie tracking</p>
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
        {/* Calorie Balance */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Calorie Balance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={calorieTrend}>
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
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
              />
              <Bar dataKey="consumed" name="Consumed" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="burned" name="Burned" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className={`text-sm ${theme.textSecondary}`}>Consumed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className={`text-sm ${theme.textSecondary}`}>Burned</span>
            </div>
          </div>
        </div>

        {/* Macro Breakdown Pie */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Macronutrient Breakdown</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(0)} kcal`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {macroData.map((macro, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: macro.color }}
                      />
                      <span className={`text-sm ${theme.textSecondary}`}>{macro.name}</span>
                    </div>
                    <span className={`font-semibold ${theme.textPrimary}`}>
                      {macro.grams.toFixed(0)}g
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(macro.value / totalMacroCalories) * 100}%`,
                        backgroundColor: macro.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Macro Trend */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Macronutrient Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={macroTrend}>
            <defs>
              <linearGradient id="proteinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="carbsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area type="monotone" dataKey="protein" stroke="#EF4444" fill="url(#proteinGrad)" strokeWidth={2} name="Protein (g)" />
            <Area type="monotone" dataKey="carbs" stroke="#F59E0B" fill="url(#carbsGrad)" strokeWidth={2} name="Carbs (g)" />
            <Area type="monotone" dataKey="fat" stroke="#3B82F6" fill="url(#fatGrad)" strokeWidth={2} name="Fat (g)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Micronutrients Section */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-purple-500" />
          <h3 className={`text-base font-semibold ${theme.textPrimary}`}>Micronutrient Status</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {micronutrients.map((micro, i) => {
            const percentage = Math.min((micro.value / micro.target) * 100, 150)
            const status = percentage >= 100 ? 'text-green-600' : percentage >= 70 ? 'text-yellow-600' : 'text-red-600'
            
            return (
              <div key={i} className={`p-3 rounded-lg bg-gray-50 border border-gray-100`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${theme.textSecondary}`}>{micro.name}</span>
                  <span className={`text-xs font-bold ${status}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: percentage >= 100 ? '#22C55E' : percentage >= 70 ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className={theme.textPrimary}>{micro.value.toFixed(1)}</span>
                  <span className={theme.textSecondary}>/ {micro.target} {micro.unit}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Recent Nutrition Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${theme.cardBorder}`}>
                <th className={`text-left py-3 px-2 font-medium ${theme.textSecondary}`}>Date</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Calories</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Protein</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Carbs</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Fat</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Fiber</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Sugar</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Water</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Score</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(-10).reverse().map((entry, i) => (
                <tr key={i} className={`border-b ${theme.cardBorder} hover:bg-gray-50`}>
                  <td className={`py-3 px-2 ${theme.textPrimary}`}>
                    {format(new Date(entry.date), 'MMM d')}
                  </td>
                  <td className={`text-center py-3 px-2 font-medium ${theme.textPrimary}`}>
                    {entry.calories_consumed || '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.protein_g ? `${entry.protein_g}g` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.carbs_g ? `${entry.carbs_g}g` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.fat_g ? `${entry.fat_g}g` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.fiber_g ? `${entry.fiber_g}g` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.sugar_g ? `${entry.sugar_g}g` : '-'}
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.water_intake_ml ? `${(entry.water_intake_ml / 1000).toFixed(1)}L` : '-'}
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (entry.nutrition_quality_score || 0) >= 7 
                        ? 'bg-green-100 text-green-700' 
                        : (entry.nutrition_quality_score || 0) >= 5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.nutrition_quality_score || '-'}/10
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