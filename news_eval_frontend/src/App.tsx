import { useCallback, useEffect, useState } from 'react'
import './styles.css'

import { createEvaluation, getRandomSample } from './api'
import type { EvaluationPayload, NewsSample } from './types'
import SampleCard from './components/SampleCard'
import EvaluationForm from './components/EvaluationForm'

export default function App() {
  const [sample, setSample] = useState<NewsSample | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSample = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const s = await getRandomSample()
      setSample(s)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setSample(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSample()
  }, [loadSample])

  const handleSubmit = useCallback(async (payload: EvaluationPayload) => {
    await createEvaluation(payload)
    await loadSample()
  }, [loadSample])

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 style={{ margin: 0 }}>News Sentence Human Evaluation (MVP)</h1>
          <div className="small">Backend: http://127.0.0.1:8000 / Frontend: http://127.0.0.1:5173</div>
        </div>
        <button
          onClick={() => void loadSample()}
          disabled={loading}
          style={{
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {loading ? 'Loading...' : 'Next sample'}
        </button>
      </div>

      {error ? (
        <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', whiteSpace: 'pre-wrap' }}>
          {error}
        </div>
      ) : null}

      {!error && loading && !sample ? <div className="small">샘플을 불러오는 중...</div> : null}

      {sample ? (
        <div className="grid">
          <SampleCard sample={sample} />
          <EvaluationForm sample={sample} onSubmit={handleSubmit} />
        </div>
      ) : null}
    </div>
  )
}
