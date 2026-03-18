import Icon from '../../ui/Icon.jsx';

export default function SharedInstanceBlock({ block }) {
  const { label = 'Shared Block' } = block.attrs;

  return (
    <div style={{
      border: '2px dashed #D97706',
      borderRadius: 'var(--radius-sm)',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(217,119,6,0.05)',
      userSelect: 'none',
    }}>
      <Icon name="bolt" size={16} style={{ color: '#D97706' }} />
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)' }}>
        {label}
      </span>
    </div>
  );
}
