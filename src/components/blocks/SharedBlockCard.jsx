import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const menuItemBase = {
  display: 'block', width: '100%', textAlign: 'left',
  padding: '9px 14px', background: 'none', border: 'none',
  cursor: 'pointer', fontSize: 'var(--text-sm)',
};

export default function SharedBlockCard({ block, usageCount, onDelete, onRename, onDuplicate }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameVal, setNameVal] = useState(block.name);
  const [hovered, setHovered] = useState(false);

  function handleDelete() {
    if (usageCount > 0 && !confirmDelete) { setConfirmDelete(true); return; }
    onDelete(block.id);
  }

  function commitRename() {
    if (nameVal.trim() && nameVal.trim() !== block.name) onRename(block.id, nameVal.trim());
    setRenaming(false);
    setMenuOpen(false);
  }

  const menuItems = [
    { label: 'Rename', action: () => { setRenaming(true); setMenuOpen(false); } },
    { label: 'Duplicate', action: () => { onDuplicate(block.id); setMenuOpen(false); } },
    { type: 'divider' },
    confirmDelete
      ? { label: usageCount > 0 ? `⚠ Delete anyway (used in ${usageCount})` : '⚠ Confirm delete', danger: true, bold: true, action: () => { onDelete(block.id); setMenuOpen(false); } }
      : { label: 'Delete', danger: true, action: handleDelete },
  ];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); setConfirmDelete(false); }}
      style={{
        position: 'relative', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)', background: 'var(--color-white)',
        overflow: 'hidden', transition: 'box-shadow 0.15s',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: 140, background: 'var(--color-ghost)', position: 'relative', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
          Saved Block
        </div>
        {hovered && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={() => navigate(`/blocks/${block.id}`)}
              style={{ padding: '8px 20px', background: 'var(--color-white)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', color: 'var(--color-ink)' }}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {renaming ? (
          <input
            autoFocus value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') { setRenaming(false); setNameVal(block.name); }
            }}
            style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 600, border: 'none', outline: '2px solid var(--color-amber)', borderRadius: 'var(--radius-sm)', padding: '2px 6px', background: 'var(--color-amber-soft)', color: 'var(--color-ink)' }}
          />
        ) : (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {block.name}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
              {usageCount === 0 ? 'Not used' : `Used in ${usageCount} template${usageCount === 1 ? '' : 's'}`}
            </div>
          </div>
        )}

        {/* Three-dot menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); setConfirmDelete(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: 16, padding: '4px 6px', borderRadius: 'var(--radius-sm)', lineHeight: 1 }}
            title="More options"
          >
            ···
          </button>

          {menuOpen && (
            <div
              onClick={e => e.stopPropagation()}
              style={{ position: 'absolute', right: 0, bottom: '100%', marginBottom: 4, background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', zIndex: 50, minWidth: 160, overflow: 'hidden' }}
            >
              {menuItems.map((item, i) =>
                item.type === 'divider'
                  ? <div key={i} style={{ height: 1, background: 'var(--color-border)', margin: '2px 0' }} />
                  : (
                    <button
                      key={item.label}
                      onClick={item.action}
                      style={{ ...menuItemBase, color: item.danger ? 'var(--color-error)' : 'var(--color-ink)', fontWeight: item.bold ? 700 : 400 }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      {item.label}
                    </button>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
