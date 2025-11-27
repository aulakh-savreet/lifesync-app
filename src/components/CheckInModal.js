'use client'

import { useState } from 'react'
import { X, Check, ChevronRight } from 'lucide-react'
import SliderInput from './SliderInput'

export default function CheckInModal({ 
  onClose, 
  onSubmit, 
  metrics, 
  theme, 
  preferences 
}) {
  const [formData, setFormData] = useState(() => {
    const initial = {}
    metrics.forEach(metric => {
      initial[metric.id] = metric.type === 'boolean' ? false : metric.min + (metric.max - metric.min) / 2
    })
    initial.notes = ''
    initial.tags = []
    return initial
  })
  
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  
  const commonTags = ['work', 'rest', 'social', 'travel', 'sick', 'weekend', 'milestone', 'challenge']
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...formData, tags: selectedTags })
  }
  
  // Group metrics into steps
  const metricsGroups = [
    metrics.filter(m => ['sleep', 'energy', 'stress'].includes(m.id)),
    metrics.filter(m => ['performance', 'nutrition', 'exercise'].includes(m.id)),
    metrics.filter(m => !['sleep', 'energy', 'stress', 'performance', 'nutrition', 'exercise'].includes(m.id))
  ].filter(group => group.length > 0)

  const isLastStep = currentStep === metricsGroups.length - 1

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Daily Check-in</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Step {currentStep + 1} of {metricsGroups.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="px-5 py-3 bg-gray-50">
          <div className="flex items-center gap-2">
            {metricsGroups.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">
            {/* Current Step Metrics */}
            {metricsGroups[currentStep]?.map(metric => (
              <div key={metric.id}>
                {metric.type === 'boolean' ? (
                  <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[metric.id]}
                      onChange={(e) => setFormData({...formData, [metric.id]: e.target.checked})}
                      className="w-5 h-5 rounded-lg text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <div 
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: `${metric.color}15` }}
                    >
                      <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                    </div>
                    <span className="font-medium text-gray-900">{metric.name}</span>
                  </label>
                ) : (
                  <SliderInput
                    label={metric.name}
                    value={formData[metric.id]}
                    onChange={(v) => setFormData({...formData, [metric.id]: v})}
                    min={metric.min}
                    max={metric.max}
                    step={metric.step}
                    unit={metric.unit}
                    icon={metric.icon}
                    color={metric.color}
                    theme={theme}
                  />
                )}
              </div>
            ))}
            
            {/* Additional Fields on Last Step */}
            {isLastStep && (
              <>
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3">
                    Tags (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSelectedTags(prev => 
                            prev.includes(tag) 
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          )
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    rows={3}
                    placeholder="Any observations about today?"
                  />
                </div>
                
                {/* Mood Tracking */}
                {preferences?.moodTracking && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-3">
                      How are you feeling?
                    </label>
                    <div className="flex gap-2 justify-center bg-gray-50 rounded-xl p-3">
                      {['😔', '😐', '🙂', '😊', '🤩'].map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setFormData({...formData, mood: index + 1})}
                          className={`text-3xl p-3 rounded-xl transition-all duration-200 ${
                            formData.mood === index + 1
                              ? 'bg-white shadow-md scale-110'
                              : 'hover:bg-white hover:shadow-sm hover:scale-105'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              
              {!isLastStep ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Save Check-in
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
