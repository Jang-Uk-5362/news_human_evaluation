import { useMemo, useState } from 'react'
import type { EvaluationPayload, FinalLabel, NewsSample } from '../types'
import RatingQuestion from './RatingQuestion'

type Props = {
  sample: NewsSample
  onSubmit: (payload: EvaluationPayload) => Promise<void>
}

function isMixedLabel(llmLabel: NewsSample['llm_label']) {
  return String(llmLabel ?? '').toUpperCase() === 'M'
}

export default function EvaluationForm({ sample, onSubmit }: Props) {
  const llm = sample.llm_label ?? sample.gold_label
  const showMixedQuestions = useMemo(() => isMixedLabel(llm), [llm])

  const [annotatorId, setAnnotatorId] = useState<string>(() => localStorage.getItem('annotator_id') ?? 'test_user')

  const [q1, setQ1] = useState<number | null>(null)
  const [q2, setQ2] = useState<number | null>(null)
  const [q3, setQ3] = useState<number | null>(null)
  const [q4_1, setQ4_1] = useState<number | null>(null)
  const [q4_2, setQ4_2] = useState<number | null>(null)
  const [q5, setQ5] = useState<FinalLabel>('Unsure')

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!annotatorId.trim()) {
      setError('annotator_id를 입력해주세요.')
      return
    }
    if (q1 == null) {
      setError('Q1은 필수입니다.')
      return
    }
    if (showMixedQuestions) {
      if (q2 == null || q3 == null) {
        setError('LLM Label이 M인 경우 Q2~Q3는 필수입니다.')
        return
      }

      if (q4_1 == null) {
        setError('LLM Label이 M인 경우 Q4-1(Segment 1)은 필수입니다.')
        return
      }

      if (sample.segment_2 && q4_2 == null) {
        setError('Segment 2가 제시된 경우 Q4-2(Segment 2)는 필수입니다.')
        return
      }
    }

    const payload: EvaluationPayload = {
      sample_id: String(sample.sample_id),
      annotator_id: annotatorId.trim(),
      article_id: sample.article_id ?? null,
      q1_label_appropriateness: q1,
      q5_final_label: q5,
    }

    if (showMixedQuestions) {
      payload.q2_need_segmentation = q2
      payload.q3_segmentation_quality = q3
      payload.q4_segment_1_label_quality = q4_1
      payload.q4_segment_2_label_quality = sample.segment_2 ? q4_2 : null
    } else {
      payload.q2_need_segmentation = null
      payload.q3_segmentation_quality = null
      payload.q4_segment_1_label_quality = null
      payload.q4_segment_2_label_quality = null
    }

    try {
      setSubmitting(true)
      localStorage.setItem('annotator_id', annotatorId.trim())
      await onSubmit(payload)
      setMessage('제출이 완료되었습니다. 다음 샘플로 이동합니다.')

      setQ1(null)
      setQ2(null)
      setQ3(null)
      setQ4_1(null)
      setQ4_2(null)
      setQ5('Unsure')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, background: '#fff' }}>
      <h2 style={{ margin: 0, marginBottom: 12 }}>Evaluation</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Annotator ID</span>
          <input
            value={annotatorId}
            onChange={(e) => setAnnotatorId(e.target.value)}
            placeholder="e.g., test_user"
            style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
          />
        </label>

        <RatingQuestion
          id="q1"
          label="Q1. LLM이 부여한 라벨이 적절한가? (1~5)"
          value={q1}
          onChange={setQ1}
          required
        />

        {showMixedQuestions ? (
          <>
            <RatingQuestion
              id="q2"
              label="Q2. 이 문장은 Mixed 구조로서 분절이 필요한가? (1~5)"
              value={q2}
              onChange={setQ2}
              required
            />
            <RatingQuestion
              id="q3"
              label="Q3. 제시된 분절이 가이드라인에 맞는가? (1~5)"
              value={q3}
              onChange={setQ3}
              required
            />

            <RatingQuestion
              id="q4_1"
              label={`Q4-1. Segment 1의 라벨(F/C)이 적절한가? (1~5)${sample.segment_1_label ? ` (제시 라벨: ${sample.segment_1_label})` : ''}`}
              value={q4_1}
              onChange={setQ4_1}
              required
            />

            {sample.segment_2 ? (
              <RatingQuestion
                id="q4_2"
                label={`Q4-2. Segment 2의 라벨(F/C)이 적절한가? (1~5)${sample.segment_2_label ? ` (제시 라벨: ${sample.segment_2_label})` : ''}`}
                value={q4_2}
                onChange={setQ4_2}
                required
              />
            ) : (
              <div style={{ fontSize: 13, color: '#6b7280' }}>Segment 2가 없어서 Q4-2는 표시하지 않습니다.</div>
            )}
          </>
        ) : (
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            LLM Label이 M이 아니므로(Q2~Q4) 문항은 표시하지 않습니다.
          </div>
        )}

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Q5. annotator가 생각하는 적절한 최종 라벨은?</span>
          <select
            value={q5}
            onChange={(e) => setQ5(e.target.value as FinalLabel)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
          >
            <option value="F">F</option>
            <option value="C">C</option>
            <option value="M">M</option>
            <option value="Unsure">Unsure</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #111827',
            background: submitting ? '#9ca3af' : '#111827',
            color: '#fff',
            fontWeight: 700,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>

        {message ? (
          <div style={{ padding: 10, borderRadius: 8, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46' }}>
            {message}
          </div>
        ) : null}
        {error ? (
          <div style={{ padding: 10, borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', whiteSpace: 'pre-wrap' }}>
            {error}
          </div>
        ) : null}
      </form>
    </section>
  )
}
