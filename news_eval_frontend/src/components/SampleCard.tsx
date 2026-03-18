import type { NewsSample } from '../types'

export default function SampleCard({ sample }: { sample: NewsSample }) {
  const llm = sample.llm_label ?? sample.gold_label ?? ''

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>Sample ID</div>
          <div style={{ fontWeight: 700 }}>{sample.sample_id}</div>
          {sample.article_id ? <div style={{ fontSize: 12, color: '#6b7280' }}>Article: {sample.article_id}</div> : null}
          {sample.context_type ? <div style={{ fontSize: 12, color: '#6b7280' }}>Context: {sample.context_type}</div> : null}
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>LLM Label</div>
          <div style={{ fontWeight: 700 }}>{String(llm)}</div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: '#6b7280' }}>Previous Sentence</div>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{sample.previous_sentence ?? ''}</div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: '#6b7280' }}>Target Sentence</div>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
            padding: 12,
            borderRadius: 8,
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            fontWeight: 650,
          }}
        >
          {sample.target_sentence ?? ''}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: '#6b7280' }}>Next Sentence</div>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{sample.next_sentence ?? ''}</div>
      </div>

      {(sample.segment_1 || sample.segment_2) && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Segments</div>
          {sample.segment_1 ? (
            <div style={{ padding: 10, border: '1px dashed #d1d5db', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Segment 1 ({sample.segment_1_label ?? '-'})</div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{sample.segment_1}</div>
            </div>
          ) : null}

          {sample.segment_2 ? (
            <div style={{ padding: 10, border: '1px dashed #d1d5db', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Segment 2 ({sample.segment_2_label ?? '-'})</div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{sample.segment_2}</div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
