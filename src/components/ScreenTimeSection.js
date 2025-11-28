'use client'

import { Smartphone, Monitor, Gamepad2, MessageSquare, Clock, TrendingDown, TrendingUp, Wifi } from 'lucide-react'
import { format } from 'date-fns'
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { average } from '@/lib/utils'

export default function ScreenTimeSection({ entries, theme }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No screen time data available. Upload data to see digital wellness analytics.
      </div>
    )
  }

  // Calculate averages
  const avgScreenTime = average(entries.map(e => e.screen_time_hours || e.screenTime || (e.screen_time_total_min || 0) / 60).filter(v => v > 0))
  const avgSocialMedia = average(entries.map(e => e.screen_time_social_min || 0).filter(v => v > 0)) / 60
  const avgProductivity = average(entries.map(e => e.screen_time_productive_min || 0).filter(v => v > 0)) / 60
  const avgEntertainment = average(entries.map(e => e.screen_time_entertainment_min || 0).filter(v => v > 0)) / 60
  const avgGaming = average(entries.map(e => e.screen_time_gaming_min || 0).filter(v => v > 0)) / 60
  const avgPhonePickups = average(entries.map(e => e.phone_pickups || 0).filter(v => v > 0))
  const avgNotifications = average(entries.map(e => e.notifications_received || 0).filter(v => v > 0))
  const avgLongestSession = average(entries.map(e => e.longest_session_min || 0).filter(v => v > 0))

  // Screen time breakdown pie chart
  const screenTimeBreakdown = [
    { name: 'Social Media', value: avgSocialMedia, color: '#EC4899' },
    { name: 'Productivity', value: avgProductivity, color: '#22C55E' },
    { name: 'Entertainment', value: avgEntertainment, color: '#8B5CF6' },
    { name: 'Gaming', value: avgGaming, color: '#F59E0B' }
  ].filter(d => d.value > 0)

  const totalCategorized = screenTimeBreakdown.reduce((sum, d) => sum + d.value, 0)

  // Screen time trend
  const screenTimeTrend = entries.slice(-14).map(entry => ({
    date: entry.date,
    total: entry.screen_time_hours || entry.screenTime || (entry.screen_time_total_min || 0) / 60,
    social: (entry.screen_time_social_min || 0) / 60,
    productive: (entry.screen_time_productive_min || 0) / 60,
    entertainment: (entry.screen_time_entertainment_min || 0) / 60
  }))

  // Phone usage pattern
  const usagePattern = entries.slice(-14).map(entry => ({
    date: entry.date,
    pickups: entry.phone_pickups || 0,
    notifications: entry.notifications_received || 0,
    firstPickup: entry.first_pickup_time || null
  }))

  // App usage data
  const appUsageData = entries.slice(-7).map(entry => ({
    date: entry.date,
    app1: entry.top_app_1_name || 'N/A',
    app1Time: entry.top_app_1_min || 0,
    app2: entry.top_app_2_name || 'N/A',
    app2Time: entry.top_app_2_min || 0,
    app3: entry.top_app_3_name || 'N/A',
    app3Time: entry.top_app_3_min || 0
  }))

  // Calculate productive vs unproductive ratio
  const productiveRatio = avgProductivity / (avgScreenTime || 1) * 100
  const isHealthy = avgScreenTime < 4 && productiveRatio > 30

  // Stats cards
  const statsCards = [
    { 
      title: 'Daily Screen Time', 
      value: `${avgScreenTime.toFixed(1)}h`, 
      icon: Smartphone, 
      color: avgScreenTime > 6 ? '#EF4444' : avgScreenTime > 4 ? '#F59E0B' : '#22C55E',
      subtitle: avgScreenTime > 6 ? 'High usage' : avgScreenTime > 4 ? 'Moderate' : 'Healthy'
    },
    { title: 'Social Media', value: `${(avgSocialMedia * 60).toFixed(0)}m`, icon: MessageSquare, color: '#EC4899', subtitle: 'daily avg' },
    { title: 'Productivity', value: `${(avgProductivity * 60).toFixed(0)}m`, icon: Monitor, color: '#22C55E', subtitle: 'daily avg' },
    { title: 'Phone Pickups', value: `${avgPhonePickups.toFixed(0)}`, icon: Smartphone, color: '#3B82F6', subtitle: 'per day' },
    { title: 'Notifications', value: `${avgNotifications.toFixed(0)}`, icon: Wifi, color: '#8B5CF6', subtitle: 'per day' },
    { title: 'Longest Session', value: `${avgLongestSession.toFixed(0)}m`, icon: Clock, color: '#F59E0B', subtitle: 'average' }
  ]

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${theme.textPrimary}`}>Screen Time & Digital Wellness</h2>
          <p className={`text-sm ${theme.textSecondary}`}>App usage, phone habits, and productivity tracking</p>
        </div>
      </div>

      {/* Health Status Banner */}
      <div className={`p-4 rounded-xl ${isHealthy ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} border`}>
        <div className="flex items-center gap-3">
          {isHealthy ? (
            <TrendingDown className="w-6 h-6 text-green-600" />
          ) : (
            <TrendingUp className="w-6 h-6 text-amber-600" />
          )}
          <div>
            <p className={`font-semibold ${isHealthy ? 'text-green-700' : 'text-amber-700'}`}>
              {isHealthy ? 'Healthy Screen Habits' : 'Consider Reducing Screen Time'}
            </p>
            <p className={`text-sm ${isHealthy ? 'text-green-600' : 'text-amber-600'}`}>
              {productiveRatio.toFixed(0)}% of your screen time is productive
            </p>
          </div>
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
        {/* Screen Time Trend */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Screen Time Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={screenTimeTrend}>
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
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
                formatter={(value) => [`${value.toFixed(1)}h`, '']}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                fill="url(#totalGradient)"
                strokeWidth={2}
                name="Total"
              />
              <Line
                type="monotone"
                dataKey="social"
                stroke="#EC4899"
                strokeWidth={2}
                dot={{ fill: '#EC4899', r: 3 }}
                name="Social"
              />
              <Line
                type="monotone"
                dataKey="productive"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: '#22C55E', r: 3 }}
                name="Productive"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className={`text-sm ${theme.textSecondary}`}>Total</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span className={`text-sm ${theme.textSecondary}`}>Social</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className={`text-sm ${theme.textSecondary}`}>Productive</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
          <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Usage by Category</h3>
          {screenTimeBreakdown.length > 0 ? (
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={screenTimeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {screenTimeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${(value * 60).toFixed(0)} min`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {screenTimeBreakdown.map((category, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className={`text-sm ${theme.textSecondary}`}>{category.name}</span>
                      </div>
                      <span className={`font-semibold ${theme.textPrimary}`}>
                        {(category.value * 60).toFixed(0)}m
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(category.value / totalCategorized) * 100}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400">
              No category breakdown available
            </div>
          )}
        </div>
      </div>

      {/* Phone Usage Pattern */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Phone Usage Patterns</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={usagePattern}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MM/dd')}
              stroke="#9ca3af"
              fontSize={11}
            />
            <YAxis yAxisId="left" stroke="#3B82F6" fontSize={11} />
            <YAxis yAxisId="right" orientation="right" stroke="#8B5CF6" fontSize={11} />
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
              dataKey="pickups" 
              name="Phone Pickups" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="notifications"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', r: 3 }}
              name="Notifications"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Apps Table */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Top Apps Usage (Last 7 Days)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${theme.cardBorder}`}>
                <th className={`text-left py-3 px-2 font-medium ${theme.textSecondary}`}>Date</th>
                <th className={`text-left py-3 px-2 font-medium ${theme.textSecondary}`}>#1 App</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Time</th>
                <th className={`text-left py-3 px-2 font-medium ${theme.textSecondary}`}>#2 App</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Time</th>
                <th className={`text-left py-3 px-2 font-medium ${theme.textSecondary}`}>#3 App</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Time</th>
              </tr>
            </thead>
            <tbody>
              {appUsageData.reverse().map((entry, i) => (
                <tr key={i} className={`border-b ${theme.cardBorder} hover:bg-gray-50`}>
                  <td className={`py-3 px-2 ${theme.textPrimary}`}>
                    {format(new Date(entry.date), 'MMM d')}
                  </td>
                  <td className={`py-3 px-2 ${theme.textPrimary}`}>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                      {entry.app1}
                    </span>
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.app1Time ? `${entry.app1Time}m` : '-'}
                  </td>
                  <td className={`py-3 px-2 ${theme.textPrimary}`}>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {entry.app2}
                    </span>
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.app2Time ? `${entry.app2Time}m` : '-'}
                  </td>
                  <td className={`py-3 px-2 ${theme.textPrimary}`}>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {entry.app3}
                    </span>
                  </td>
                  <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                    {entry.app3Time ? `${entry.app3Time}m` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className={`p-6 rounded-xl ${theme.cardBg} border ${theme.cardBorder}`}>
        <h3 className={`text-base font-semibold ${theme.textPrimary} mb-4`}>Recent Screen Time Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${theme.cardBorder}`}>
                <th className={`text-left py-3 px-2 font-medium ${theme.textSecondary}`}>Date</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Total</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Social</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Productive</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Entertainment</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>Pickups</th>
                <th className={`text-center py-3 px-2 font-medium ${theme.textSecondary}`}>First Pickup</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(-10).reverse().map((entry, i) => {
                const total = entry.screen_time_hours || entry.screenTime || (entry.screen_time_total_min || 0) / 60
                return (
                  <tr key={i} className={`border-b ${theme.cardBorder} hover:bg-gray-50`}>
                    <td className={`py-3 px-2 ${theme.textPrimary}`}>
                      {format(new Date(entry.date), 'MMM d')}
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        total > 6 
                          ? 'bg-red-100 text-red-700' 
                          : total > 4
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {total.toFixed(1)}h
                      </span>
                    </td>
                    <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                      {entry.screen_time_social_min ? `${entry.screen_time_social_min}m` : '-'}
                    </td>
                    <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                      {entry.screen_time_productive_min ? `${entry.screen_time_productive_min}m` : '-'}
                    </td>
                    <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                      {entry.screen_time_entertainment_min ? `${entry.screen_time_entertainment_min}m` : '-'}
                    </td>
                    <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                      {entry.phone_pickups || '-'}
                    </td>
                    <td className={`text-center py-3 px-2 ${theme.textSecondary}`}>
                      {entry.first_pickup_time || '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}