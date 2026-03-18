export default function SocialIconsBlock({ block }) {
  const { icons = [], align = 'center' } = block.attrs;

  const justifyMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  if (icons.length === 0) {
    return (
      <div style={{
        padding: '24px 16px',
        textAlign: 'center',
        color: 'var(--color-muted)',
        fontSize: 'var(--text-sm)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-ghost)',
      }}>
        Social Icons — configure in style panel →
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: justifyMap[align] || 'center', gap: '12px', padding: '8px 0' }}>
      {icons.map((icon, i) => (
        <span
          key={i}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--color-ghost)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-slate)',
            userSelect: 'none',
          }}
          title={icon.network || 'Social'}
        >
          {(icon.network || '?')[0].toUpperCase()}
        </span>
      ))}
    </div>
  );
}
