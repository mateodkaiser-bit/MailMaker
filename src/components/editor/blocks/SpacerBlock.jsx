export default function SpacerBlock({ block }) {
  const { height = 24 } = block.attrs;

  return (
    <div
      style={{
        height: `${height}px`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        borderTop: '1px dashed var(--color-border)',
      }} />
      <span style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--color-white)',
        padding: '0 8px',
        fontSize: '10px',
        color: 'var(--color-muted)',
        whiteSpace: 'nowrap',
      }}>
        {height}px
      </span>
    </div>
  );
}
