import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { relativeTime } from '../../lib/utils.js';

export default function TemplateCard({ template, onDuplicate, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onClick={() => navigate(`/editor/${template.id}`)}
    >
      {/* Thumbnail */}
      <div style={{
        height: 140,
        background: 'var(--color-ghost)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 32 }}>✉</span>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 600, fontSize: 'var(--text-sm)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {template.name}
            </div>
            <div style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginTop: 2 }}>
              {relativeTime(template.updatedAt)}
            </div>
          </div>

          {/* Menu */}
          <div style={{ position: 'relative', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-muted)', padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 16,
              }}
            >
              ⋯
            </button>
            {menuOpen && (
              <div
                style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 4,
                  background: 'var(--color-white)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)',
                  zIndex: 10,
                  minWidth: 140,
                  overflow: 'hidden',
                }}
              >
                {[
                  { label: 'Edit', action: () => { navigate(`/editor/${template.id}`); setMenuOpen(false); } },
                  { label: 'Duplicate', action: () => { onDuplicate(template.id); setMenuOpen(false); } },
                  { label: 'Delete', action: () => { onDelete(template.id); setMenuOpen(false); }, danger: true },
                ].map(({ label, action, danger }) => (
                  <button
                    key={label}
                    onClick={action}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '9px 14px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      color: danger ? 'var(--color-danger)' : 'var(--color-ink)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
