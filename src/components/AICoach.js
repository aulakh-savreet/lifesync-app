'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Loader2, Sparkles, X, Maximize2, Minimize2, Trash2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function AICoach({ entries, theme, isOpen, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setError(null)
    }
  }, [isOpen])

  // Generate context from user data
  const generateDataContext = () => {
    if (!entries || entries.length === 0) {
      return "No health data available yet."
    }

    const recentEntries = entries.slice(-14)
    const latestEntry = entries[entries.length - 1]
    
    const avg = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 'N/A'
    
    const sleepData = recentEntries.map(e => e.sleep_duration_hours || e.sleep || 0).filter(v => v > 0)
    const performanceData = recentEntries.map(e => e.performance_score || e.performance || 0).filter(v => v > 0)
    const energyData = recentEntries.map(e => e.energy_level || e.energy || 0).filter(v => v > 0)
    const stressData = recentEntries.map(e => e.stress_level || e.stress || 0).filter(v => v > 0)
    const caloriesConsumed = recentEntries.map(e => e.calories_consumed || 0).filter(v => v > 0)
    const caloriesBurned = recentEntries.map(e => e.calories_burned_total || e.caloriesBurned || 0).filter(v => v > 0)
    const screenTime = recentEntries.map(e => e.screen_time_hours || e.screenTime || (e.screen_time_total_min || 0) / 60).filter(v => v > 0)

    const workoutDays = recentEntries.filter(e => e.workout_completed || e.exercise)
    const climbingDays = recentEntries.filter(e => e.climbing_session || e.workout_type?.toLowerCase().includes('climb'))
    const runningDays = recentEntries.filter(e => e.workout_type?.toLowerCase().includes('run') || e.running_distance_km > 0)

    let context = `
## User Health Data Summary (Last 14 Days)

### Overall Stats
- Total entries: ${entries.length} days of data
- Date range: ${format(new Date(entries[0]?.date), 'MMM d')} to ${format(new Date(latestEntry?.date), 'MMM d, yyyy')}

### Sleep
- Average duration: ${avg(sleepData)} hours/night
- Average quality: ${avg(recentEntries.map(e => e.sleep_quality_score || e.sleepQuality || 0).filter(v => v > 0))}/10
- Recent trend: ${sleepData.slice(-3).map(s => s.toFixed(1)).join('h → ')}h
${latestEntry?.deep_sleep_hours ? `- Deep sleep avg: ${avg(recentEntries.map(e => e.deep_sleep_hours || 0).filter(v => v > 0))}h` : ''}
${latestEntry?.hrv_overnight ? `- HRV avg: ${avg(recentEntries.map(e => e.hrv_overnight || 0).filter(v => v > 0))} ms` : ''}

### Energy & Performance
- Average energy: ${avg(energyData)}/10
- Average performance: ${avg(performanceData)}/10
- Average stress: ${avg(stressData)}/10
- Recent energy trend: ${energyData.slice(-3).map(e => e.toFixed(0)).join(' → ')}/10

### Nutrition
- Average calories consumed: ${avg(caloriesConsumed)} kcal
- Average calories burned: ${avg(caloriesBurned)} kcal
- Average protein: ${avg(recentEntries.map(e => e.protein_g || 0).filter(v => v > 0))}g
- Nutrition quality: ${avg(recentEntries.map(e => e.nutrition_quality_score || 0).filter(v => v > 0))}/10
${latestEntry?.water_intake_ml ? `- Water intake avg: ${(avg(recentEntries.map(e => e.water_intake_ml || 0).filter(v => v > 0)) / 1000).toFixed(1)}L` : ''}

### Activity
- Workout days: ${workoutDays.length} of last 14 days
- Average steps: ${Math.round(avg(recentEntries.map(e => e.steps || 0).filter(v => v > 0))).toLocaleString()}
- Average screen time: ${avg(screenTime)} hours/day
`

    if (climbingDays.length > 0) {
      const grades = climbingDays.map(e => e.climbing_grade_max || 0).filter(v => v > 0)
      const problems = climbingDays.reduce((sum, e) => sum + (e.climbing_problems_completed || 0), 0)
      context += `
### Climbing
- Sessions: ${climbingDays.length} in last 14 days
- Max grade: V${Math.max(...grades)}
- Average grade: V${avg(grades)}
- Total problems completed: ${problems}
- Average send rate: ${avg(climbingDays.map(e => e.climbing_send_rate || 0).filter(v => v > 0))}%
`
    }

    if (runningDays.length > 0) {
      const distances = runningDays.map(e => e.running_distance_km || 0).filter(v => v > 0)
      const paces = runningDays.map(e => e.running_pace_min_km || 0).filter(v => v > 0)
      context += `
### Running
- Runs: ${runningDays.length} in last 14 days
- Total distance: ${distances.reduce((a, b) => a + b, 0).toFixed(1)} km
- Average pace: ${avg(paces)} min/km
`
    }

    context += `
### Most Recent Entry (${format(new Date(latestEntry?.date), 'MMM d, yyyy')})
- Sleep: ${latestEntry?.sleep_duration_hours || latestEntry?.sleep || 'N/A'}h (Quality: ${latestEntry?.sleep_quality_score || latestEntry?.sleepQuality || 'N/A'}/10)
- Energy: ${latestEntry?.energy_level || latestEntry?.energy || 'N/A'}/10
- Performance: ${latestEntry?.performance_score || latestEntry?.performance || 'N/A'}/10
- Stress: ${latestEntry?.stress_level || latestEntry?.stress || 'N/A'}/10
- Workout: ${latestEntry?.workout_type || (latestEntry?.workout_completed ? 'Yes' : 'Rest day')}
- Calories: ${latestEntry?.calories_consumed || 'N/A'} consumed / ${latestEntry?.calories_burned_total || latestEntry?.caloriesBurned || 'N/A'} burned
`

    const lowSleepDays = recentEntries.filter(e => (e.sleep_duration_hours || e.sleep || 0) < 6)
    const highStressDays = recentEntries.filter(e => (e.stress_level || e.stress || 0) > 7)
    const lowEnergyDays = recentEntries.filter(e => (e.energy_level || e.energy || 0) < 5)

    if (lowSleepDays.length > 0 || highStressDays.length > 0 || lowEnergyDays.length > 0) {
      context += `
### Patterns Detected
${lowSleepDays.length > 0 ? `- ${lowSleepDays.length} days with less than 6 hours sleep` : ''}
${highStressDays.length > 0 ? `- ${highStressDays.length} days with high stress (>7/10)` : ''}
${lowEnergyDays.length > 0 ? `- ${lowEnergyDays.length} days with low energy (<5/10)` : ''}
`
    }

    return context
  }

  // Send message to Claude via API route
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setError(null)
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const dataContext = generateDataContext()
      
      const systemPrompt = `You are an AI Health & Fitness Coach analyzing a user's personal health data. You have access to their sleep, nutrition, exercise, and wellness metrics.

Your role is to:
1. Analyze their data to provide personalized insights
2. Answer questions about their health patterns and performance
3. Give actionable recommendations based on their actual data
4. Help them understand correlations (e.g., sleep affecting performance)
5. Provide encouragement while being honest about areas to improve

Guidelines:
- Be conversational and supportive, not clinical
- Reference specific numbers from their data when relevant
- Consider recovery needs when recommending workouts
- Factor in sleep debt, stress levels, and recent activity
- For climbing: consider finger recovery (48-72h between hard sessions)
- For running: consider cumulative fatigue and rest needs
- Keep responses concise but helpful (2-4 paragraphs max)
- Use bullet points sparingly, only when listing specific recommendations

Here is the user's health data:
${dataContext}

Today's date is ${format(new Date(), 'EEEE, MMMM d, yyyy')}.`

      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      // Call our API route (no CORS issues!)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system: systemPrompt,
          messages: [...conversationHistory, { role: 'user', content: userMessage }]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`)
      }

      const assistantMessage = data.content[0].text
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }])
      
    } catch (error) {
      console.error('Error calling AI:', error)
      setError(error.message)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I couldn't process that request. ${error.message}`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickPrompts = [
    "Should I work out today?",
    "How's my sleep affecting performance?",
    "What should I focus on this week?",
    "Am I recovered enough to climb?",
    "How can I improve my energy?"
  ]

  if (!isOpen) return null

  return (
    <div className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4 w-96 h-[600px]'} z-50 flex flex-col rounded-2xl shadow-2xl border ${theme.cardBorder} ${theme.cardBg} transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Coach</h3>
            <p className="text-xs text-white/80">{entries?.length || 0} days of data loaded</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4 text-white" />
            ) : (
              <Maximize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-indigo-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-500" />
            </div>
            <h4 className={`font-semibold ${theme.textPrimary} mb-2`}>Hi! I'm your AI Coach</h4>
            <p className={`text-sm ${theme.textSecondary} mb-6`}>
              I can analyze your health data and help you make better decisions about training, recovery, and wellness.
            </p>
            
            <div className="space-y-2">
              <p className={`text-xs ${theme.textSecondary} mb-2`}>Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-md'
                      : `${theme.cardBg} border ${theme.cardBorder} rounded-bl-md`
                  }`}
                >
                  <p className={`text-sm whitespace-pre-wrap ${message.role === 'assistant' ? theme.textPrimary : ''}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-2xl rounded-bl-md ${theme.cardBg} border ${theme.cardBorder}`}>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span className={`text-sm ${theme.textSecondary}`}>Analyzing your data...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Banner */}
      {error && error.includes('API key') && (
        <div className="mx-4 mb-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="text-xs text-amber-700">
              <p className="font-medium">API Key Required</p>
              <p>Add to <code className="bg-amber-100 px-1 rounded">.env.local</code>:</p>
              <code className="block mt-1 bg-amber-100 p-1 rounded">CLAUDE_API_KEY=sk-ant-...</code>
            </div>
          </div>
        </div>
      )}

      {/* Quick prompts */}
      {messages.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMessages([]); setError(null); }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className={`w-5 h-5 ${theme.textSecondary}`} />
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your health data..."
              className={`w-full p-3 pr-12 rounded-xl border ${theme.cardBorder} ${theme.textPrimary} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                input.trim() && !isLoading
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}