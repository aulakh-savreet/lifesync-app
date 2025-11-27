'use client'

export default function SliderInput({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  unit, 
  icon: Icon, 
  color, 
  theme 
}) {
  const percentage = ((value - min) / (max - min)) * 100
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={`flex items-center gap-2 text-sm font-medium ${theme.textSecondary}`}>
          <div 
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          {label}
        </label>
        <span 
          className="text-xl font-bold tabular-nums"
          style={{ color }}
        >
          {value}{unit !== '/10' && unit !== 'bool' && <span className="text-sm font-normal ml-0.5">{unit}</span>}
        </span>
      </div>
      <div className="relative pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
            '--tw-ring-color': color
          }}
        />
        <div className="flex justify-between text-xs mt-2 px-0.5" style={{ color: '#9ca3af' }}>
          <span>{min}{unit === 'hrs' ? 'h' : ''}</span>
          <span>{max}{unit === 'hrs' ? 'h' : ''}</span>
        </div>
      </div>
    </div>
  )
}
