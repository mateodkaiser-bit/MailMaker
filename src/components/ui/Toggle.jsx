export default function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      {label && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', flex: 1 }}>
          {label}
        </span>
      )}
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36, height: 20,
          borderRadius: 10,
          background: checked ? 'var(--color-amber)' : 'var(--color-border)',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 2, left: checked ? 18 : 2,
          width: 16, height: 16,
          borderRadius: '50%',
          background: 'var(--color-white)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          transition: 'left 0.2s',
        }} />
      </div>
    </label>
  );
}
