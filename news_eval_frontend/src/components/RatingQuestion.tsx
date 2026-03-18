type Props = {
  id: string
  label: string
  value: number | null
  onChange: (v: number) => void
  required?: boolean
  hint?: string
}

export default function RatingQuestion({ id, label, value, onChange, required, hint }: Props) {
  return (
    <fieldset style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
      <legend style={{ padding: '0 6px', fontWeight: 600 }}>
        {label} {required ? <span style={{ color: '#b91c1c' }}>*</span> : null}
      </legend>
      {hint ? <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 8 }}>{hint}</div> : null}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <input
              type="radio"
              name={id}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              required={required}
            />
            {n}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
