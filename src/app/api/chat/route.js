// API Route: /api/chat
// This proxies requests to Claude API to avoid CORS issues

export async function POST(request) {
  try {
    const body = await request.json()
    const { messages, system } = body

    const apiKey = process.env.CLAUDE_API_KEY

    if (!apiKey) {
      return Response.json(
        { error: 'API key not configured. Add CLAUDE_API_KEY to .env.local' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: system,
        messages: messages
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Claude API Error:', errorData)
      return Response.json(
        { error: errorData.error?.message || `API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return Response.json(data)

  } catch (error) {
    console.error('Error in chat API:', error)
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}