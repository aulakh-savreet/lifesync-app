'use client'

export default function InsightCard({ insight, theme }) {
  const Icon = insight.icon
  
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
      insight.type === 'positive' 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50/50 border-green-200/60' 
        : insight.type === 'warning'
        ? 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200/60'
        : 'bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-200/60'
    }`}>
      <div className="flex gap-3">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${
          insight.type === 'positive' ? 'bg-green-100 text-green-600' :
          insight.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{insight.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{insight.description}</p>
          {insight.correlation && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Strength:</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      insight.type === 'positive' ? 'bg-green-500' :
                      insight.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.abs(insight.correlation) * 100}%` }}
                  />
                </div>
                <span className="font-medium">{(Math.abs(insight.correlation) * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
