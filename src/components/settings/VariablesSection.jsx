import { useState } from 'react';
import { useToast } from '../ui/Toast.jsx';
import Icon from '../ui/Icon.jsx';

function Card({ children }) {
  return (
    <div style={{
      background: 'var(--color-white)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      marginBottom: 24,
    }}>
      {children}
    </div>
  );
}

const inputStyle = {
  padding: '6px 10px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  background: 'var(--color-white)',
  color: 'var(--color-ink)',
};

export default function VariablesSection({ variables, onAdd, onUpdate, onDelete }) {
  const { toast } = useToast();
  const [newKey, setNewKey] = useState('');
  const [newFallback, setNewFallback] = useState('');

  function handleAdd() {
    const key = newKey.trim().replace(/\s+/g, '_').toLowerCase();
    if (!key) return;
    if (variables.some(v => v.key === key)) {
      toast('Variable name already exists', 'danger');
      return;
    }
    onAdd({ key, fallback: newFallback.trim() });
    setNewKey('');
    setNewFallback('');
    toast('Variable added', 'success');
  }

  return (
    <Card>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: '0 0 20px' }}>
        Use{' '}
        <code style={{ background: 'var(--color-ghost)', padding: '1px 5px', borderRadius: 4 }}>
          {'{{ variable_name }}'}
        </code>{' '}
        in your templates. The fallback is shown in preview when no value is provided.
      </p>

      {variables.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, padding: '0 0 8px' }}>
            {['Variable name', 'Fallback value', ''].map(h => (
              <div key={h} style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {h}
              </div>
            ))}
          </div>

          {variables.map((v, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, marginBottom: 8, alignItems: 'center' }}>
              <input
                value={v.key}
                onChange={e => onUpdate(i, { key: e.target.value.replace(/\s/g, '_').toLowerCase() })}
                style={{ ...inputStyle, fontFamily: 'monospace' }}
              />
              <input
                value={v.fallback}
                placeholder="(empty)"
                onChange={e => onUpdate(i, { fallback: e.target.value })}
                style={inputStyle}
              />
              <button
                onClick={() => onDelete(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: '4px 6px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center' }}
                title="Delete variable"
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-danger)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-muted)'; }}
              >
                <Icon name="delete" size={16} style={{ color: 'inherit' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'center',
        paddingTop: variables.length > 0 ? 12 : 0,
        borderTop: variables.length > 0 ? '1px solid var(--color-border)' : 'none',
      }}>
        <input
          placeholder="variable_name"
          value={newKey}
          onChange={e => setNewKey(e.target.value.replace(/\s/g, '_').toLowerCase())}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          style={{ ...inputStyle, fontFamily: 'monospace' }}
        />
        <input
          placeholder="Fallback value"
          value={newFallback}
          onChange={e => setNewFallback(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          style={inputStyle}
        />
        <button
          onClick={handleAdd}
          disabled={!newKey.trim()}
          style={{
            padding: '6px 14px',
            background: newKey.trim() ? 'var(--color-amber)' : 'var(--color-ghost)',
            color: newKey.trim() ? 'var(--color-white)' : 'var(--color-muted)',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: 'var(--text-sm)',
            cursor: newKey.trim() ? 'pointer' : 'default',
          }}
        >
          Add
        </button>
      </div>
    </Card>
  );
}
