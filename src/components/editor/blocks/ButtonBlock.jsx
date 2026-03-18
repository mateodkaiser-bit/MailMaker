export default function ButtonBlock({ block }) {
  const {
    label = 'Click here', backgroundColor = '#D97706', color = '#ffffff',
    borderRadius = 6, paddingTop = 12, paddingBottom = 12,
    paddingLeft = 24, paddingRight = 24, fontSize = 14,
    fontWeight = 600, fullWidth = false, align = 'center',
  } = block.attrs;

  return (
    <div style={{ textAlign: align, padding: '8px 0' }}>
      <span
        style={{
          display: fullWidth ? 'block' : 'inline-block',
          backgroundColor,
          color,
          borderRadius: `${borderRadius}px`,
          padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
          fontSize: `${fontSize}px`,
          fontWeight,
          textDecoration: 'none',
          textAlign: 'center',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
}
