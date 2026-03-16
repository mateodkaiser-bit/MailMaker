import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedBlockStore } from '../../store/sharedBlocks.js';
import { useTemplateStore } from '../../store/templates.js';
import NavRail from '../ui/NavRail.jsx';
import SharedBlockCard from './SharedBlockCard.jsx';
import { useToast } from '../ui/Toast.jsx';
import Icon from '../ui/Icon.jsx';

export default function SharedBlocksPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { blocks, createSharedBlock, deleteSharedBlock, updateSharedBlock, getUsageCount } = useSharedBlockStore();
  const { templates } = useTemplateStore();
  const [search, setSearch] = useState('');

  const filtered = blocks.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleNew() {
    const block = createSharedBlock({
      name: 'Untitled block',
      doc: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }],
      },
    });
    navigate(`/blocks/${block.id}`);
  }

  function handleDelete(id) {
    deleteSharedBlock(id);
    toast('Block deleted', 'info');
  }

  function handleRename(id, name) {
    updateSharedBlock(id, { name });
    toast('Block renamed', 'success');
  }

  function handleDuplicate(id) {
    const src = blocks.find(b => b.id === id);
    if (!src) return;
    const copy = createSharedBlock({
      name: `${src.name} (copy)`,
      doc: JSON.parse(JSON.stringify(src.doc)),
      styles: JSON.parse(JSON.stringify(src.styles ?? {})),
    });
    toast('Block duplicated', 'success');
    navigate(`/blocks/${copy.id}`);
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <NavRail />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          height: 64,
          display: 'flex', alignItems: 'center',
          padding: '0 32px',
          borderBottom: '1px solid var(--color-border)',
          gap: 16, flexShrink: 0,
          background: 'var(--color-white)',
        }}>
          <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
            Saved Blocks
          </h1>

          <input
            placeholder="Search blocks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              width: 220,
              background: 'var(--color-ghost)',
              color: 'var(--color-ink)',
              outline: 'none',
            }}
          />

          <div style={{ flex: 1 }} />

          <button
            onClick={handleNew}
            style={{
              padding: '8px 18px',
              background: 'var(--color-accent)', color: 'var(--color-white)',
              border: 'none', borderRadius: 'var(--radius-md)',
              fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Icon name="add" size={16} style={{ color: 'inherit' }} />
            New saved block
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: 300,
              color: 'var(--color-muted)', gap: 12,
            }}>
              <Icon name="bolt" size={48} style={{ color: 'var(--color-border)' }} />
              <div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>
                {search ? 'No matching blocks' : 'No saved blocks yet'}
              </div>
              {!search && (
                <div style={{ fontSize: 'var(--text-sm)', textAlign: 'center', maxWidth: 320 }}>
                  Create reusable blocks — headers, footers, CTA sections — and drop them into any template.
                </div>
              )}
              {!search && (
                <button
                  onClick={handleNew}
                  style={{
                    marginTop: 8, padding: '8px 20px',
                    background: 'var(--color-accent)', color: 'var(--color-white)',
                    border: 'none', borderRadius: 'var(--radius-md)',
                    fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <Icon name="add" size={16} style={{ color: 'inherit' }} />
                  Create your first block
                </button>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 20,
            }}>
              {filtered.map(block => (
                <SharedBlockCard
                  key={block.id}
                  block={block}
                  usageCount={getUsageCount(block.id, templates)}
                  onDelete={handleDelete}
                  onRename={handleRename}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
