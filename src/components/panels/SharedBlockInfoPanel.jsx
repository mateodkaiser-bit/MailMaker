import { useNavigate } from 'react-router-dom';
import { useSharedBlockStore } from '../../store/sharedBlocks.js';

export default function SharedBlockInfoPanel({ editor }) {
  const navigate = useNavigate();
  const { getBlock, getUsageCount } = useSharedBlockStore();

  if (!editor) return null;
  if (!editor.isActive('sharedInstance')) return null;

  const attrs = editor.getAttributes('sharedInstance');
  const block = getBlock(attrs.sharedBlockId);
  const usageCount = getUsageCount(attrs.sharedBlockId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        SHARED BLOCK
      </h3>

      <div style={{
        background: 'var(--color-amber-soft)',
        border: '1px solid var(--color-amber-light)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
      }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
          {block?.name ?? attrs.label ?? 'Shared Block'}
        </div>
        <div style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
          Used in {usageCount} template{usageCount !== 1 ? 's' : ''}
        </div>
      </div>

      {!block && (
        <div style={{
          background: 'var(--color-danger-bg)', color: 'var(--color-danger)',
          borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 'var(--text-xs)',
        }}>
          ⚠ Original block deleted — snapshot is being used
        </div>
      )}

      <button
        onClick={() => navigate('/blocks')}
        style={{
          padding: '8px 14px',
          background: 'transparent', color: 'var(--color-amber)',
          border: '1px solid var(--color-amber)', borderRadius: 'var(--radius-md)',
          fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
        }}
      >
        ↗ Edit in Blocks
      </button>
    </div>
  );
}
