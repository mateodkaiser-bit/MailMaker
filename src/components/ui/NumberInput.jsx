export default function NumberInput({ value, onChange, min, max, step = 1, label, suffix }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {label && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', flex: 1 }}>
          {label}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <button
          onClick={() => {
            const next = Math.max(min ?? -Infinity, (value ?? 0) - step);
            onChange(next);
          }}
          style={{
            background: 'var(--color-ghost)', border: 'none', cursor: 'pointer',
            width: 24, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-slate)', fontWeight: 700, fontSize: 14,
          }}
        >
          −
        </button>
        <input
          type="number"
          value={value ?? ''}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: 48,
            border: 'none',
            outline: 'none',
            textAlign: 'center',
            fontSize: 'var(--text-sm)',
            padding: '4px 0',
            background: 'transparent',
          }}
        />
        <button
          onClick={() => {
            const next = Math.min(max ?? Infinity, (value ?? 0) + step);
            onChange(next);
          }}
          style={{
            background: 'var(--color-ghost)', border: 'none', cursor: 'pointer',
            width: 24, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-slate)', fontWeight: 700, fontSize: 14,
          }}
        >
          +
        </button>
        {suffix && (
          <span style={{
            padding: '0 6px', fontSize: 'var(--text-xs)', color: 'var(--color-muted)',
            background: 'var(--color-ghost)', height: 28, display: 'flex', alignItems: 'center',
            borderLeft: '1px solid var(--color-border)',
          }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
