export default function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      {label && (
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.05em', color: 'var(--color-muted)', flex: 1,
        }}>
          {label}
        </span>
      )}
      {/* Rectangular track — sharp corners, Safety Orange when on */}
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36, height: 18,
          background: checked ? 'var(--color-punch)' : 'var(--color-surface-mid)',
          position: 'relative',
          transition: 'background 0.15s',
          flexShrink: 0,
          borderRadius: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 2,
          left: checked ? 20 : 2,
          width: 14, height: 14,
          background: '#fff',
          transition: 'left 0.15s',
          borderRadius: 0,
        }} />
      </div>
    </label>
  );
}
