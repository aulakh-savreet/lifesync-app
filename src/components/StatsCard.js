'use client'

export default function StatsCard({ title, value, icon: Icon, trend, color, theme }) {
  return (
    <div className={`p-5 rounded-2xl ${theme.cardBg} backdrop-blur-xl shadow-sm border ${theme.cardBorder} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 bg-gradient-to-br ${color} rounded-xl shadow-lg shadow-blue-500/20`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`text-xs font-medium ${theme.textSecondary} bg-gray-100 px-2 py-1 rounded-full`}>
          {trend}
        </span>
      </div>
      <p className={`text-2xl font-bold ${theme.textPrimary} tracking-tight`}>{value}</p>
      <p className={`text-sm ${theme.textSecondary} mt-1`}>{title}</p>
    </div>
  )
}
