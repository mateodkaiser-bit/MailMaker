export default function DividerBlock({ block }) {
  const { color = '#E5E7EB', thickness = 1, width = 100, align = 'center' } = block.attrs;

  const marginMap = {
    left: '0 auto 0 0',
    center: '0 auto',
    right: '0 0 0 auto',
  };

  return (
    <div style={{ padding: '8px 0' }}>
      <hr style={{
        border: 'none',
        borderTop: `${thickness}px solid ${color}`,
        width: `${width}%`,
        margin: marginMap[align] || '0 auto',
      }} />
    </div>
  );
}
