/**
 * Thin wrapper around Material Symbols Rounded.
 * Usage: <Icon name="delete" />  <Icon name="arrow_back" size={20} fill={1} />
 */
export default function Icon({ name, size = 18, fill = 0, weight = 300, style, ...props }) {
  return (
    <span
      className="material-symbols-rounded"
      style={{
        fontSize: size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${Math.round(size)}`,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
