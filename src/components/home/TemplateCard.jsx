import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { relativeTime } from '../../lib/utils.js';
import Icon from '../ui/Icon.jsx';

function EmailThumbnail() {
  return (
    <div style={{ height: '100%', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ height: 8, width: '45%', background: 'var(--color-surface-mid)' }} />
      <div style={{ height: 5, width: '70%', background: 'var(--color-hover-light)', marginTop: 2 }} />
      <div style={{ height: 5, width: '60%', background: 'var(--color-hover-light)' }} />
      <div style={{
        height: 36, background: 'var(--color-ghost)', marginTop: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--color-surface-mid)',
      }}>
        <Icon name="image" size={14} style={{ color: 'var(--color-surface-mid)' }} />
      </div>
      <div style={{ height: 5, width: '85%', background: 'var(--color-hover-light)', marginTop: 2 }} />
      <div style={{ height: 5, width: '75%', background: 'var(--color-hover-light)' }} />
      <div style={{ height: 5, width: '80%', background: 'var(--color-hover-light)' }} />
      {/* CTA button preview — orange */}
      <div style={{ height: 14, width: 60, background: 'var(--color-punch)', marginTop: 3, alignSelf: 'center' }} />
    </div>
  );
}

export default function TemplateCard({ template, onDuplicate, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Edit',      icon: 'edit',         action: () => { navigate(`/editor/${template.id}`); setMenuOpen(false); } },
    { label: 'Duplicate', icon: 'content_copy',  action: () => { onDuplicate(template.id); setMenuOpen(false); } },
    { label: 'Delete',    icon: 'delete',        action: () => { onDelete(template.id); setMenuOpen(false); }, danger: true },
  ];

  return (
    <div
      style={{
        background: 'var(--color-white)',
        border: '1.5px solid var(--color-surface-mid)',
        borderRadius: 0,
        overflow: 'hidden',
        boxShadow: 'none',
        cursor: 'pointer',
        transition: 'border-color 0.1s',
        position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-punch)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-surface-mid)'; }}
      onClick={() => navigate(`/editor/${template.id}`)}
    >
      {/* Thumbnail */}
      <div style={{
        height: 148,
        background: 'var(--color-ghost)',
        borderBottom: '1px solid var(--color-surface-mid)',
        overflow: 'hidden',
      }}>
        <EmailThumbnail />
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 600, fontSize: 'var(--text-sm)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              color: 'var(--color-ink)',
            }}>
              {template.name}
            </div>
            <div style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginTop: 2 }}>
              {relativeTime(template.updatedAt)}
            </div>
          </div>

          {/* Context menu */}
          <div style={{ position: 'relative', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-muted)', padding: '4px',
                borderRadius: 0, display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-slate)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-muted)'; }}
            >
              <Icon name="more_horiz" size={17} style={{ color: 'inherit' }} />
            </button>

            {menuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setMenuOpen(false)} />
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 2,
                  background: 'var(--color-white)',
                  border: '1.5px solid #000',
                  borderRadius: 0,
                  boxShadow: 'none',
                  zIndex: 10, minWidth: 150, overflow: 'hidden',
                }}>
                  {menuItems.map(({ label, icon, action, danger }) => (
                    <button
                      key={label}
                      onClick={action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        width: '100%', textAlign: 'left',
                        padding: '8px 10px',
                        background: 'none', border: 'none',
                        borderBottom: '1px solid var(--color-ghost)',
                        borderRadius: 0, cursor: 'pointer',
                        fontSize: 'var(--text-sm)',
                        color: danger ? 'var(--color-danger)' : 'var(--color-ink)',
                        fontWeight: 400,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <Icon name={icon} size={14} style={{ color: danger ? 'var(--color-danger)' : 'var(--color-muted)', flexShrink: 0 }} />
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
