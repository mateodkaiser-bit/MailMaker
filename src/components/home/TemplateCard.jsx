import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { relativeTime } from '../../lib/utils.js';
import Icon from '../ui/Icon.jsx';

function EmailThumbnail() {
  return (
    <div style={{
      height: '100%',
      padding: '12px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
    }}>
      {/* Header bar */}
      <div style={{ height: 8, width: '45%', background: 'var(--color-border)', borderRadius: 3 }} />
      {/* Sub-line */}
      <div style={{ height: 5, width: '70%', background: '#EAECEF', borderRadius: 3, marginTop: 2 }} />
      <div style={{ height: 5, width: '60%', background: '#EAECEF', borderRadius: 3 }} />
      {/* Image placeholder */}
      <div style={{
        height: 36, background: 'var(--color-ghost)', borderRadius: 4, marginTop: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--color-border)',
      }}>
        <Icon name="image" size={14} style={{ color: 'var(--color-border)' }} />
      </div>
      {/* Text lines */}
      <div style={{ height: 5, width: '85%', background: '#EAECEF', borderRadius: 3, marginTop: 2 }} />
      <div style={{ height: 5, width: '75%', background: '#EAECEF', borderRadius: 3 }} />
      <div style={{ height: 5, width: '80%', background: '#EAECEF', borderRadius: 3 }} />
      {/* Button */}
      <div style={{
        height: 14, width: 60, background: 'var(--color-border)',
        borderRadius: 4, marginTop: 3, alignSelf: 'center',
      }} />
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
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s, transform 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = '#D1D5DB';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onClick={() => navigate(`/editor/${template.id}`)}
    >
      {/* Thumbnail */}
      <div style={{
        height: 148,
        background: '#FAFAFA',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        <EmailThumbnail />
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'var(--color-ink)',
            }}>
              {template.name}
            </div>
            <div style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginTop: 2 }}>
              {relativeTime(template.updatedAt)}
            </div>
          </div>

          {/* Three-dot menu */}
          <div style={{ position: 'relative', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-muted)', padding: '4px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-slate)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-muted)'; }}
            >
              <Icon name="more_horiz" size={17} style={{ color: 'inherit' }} />
            </button>

            {menuOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 9 }}
                  onClick={() => setMenuOpen(false)}
                />
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 4,
                  background: 'var(--color-white)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)',
                  zIndex: 10, minWidth: 150, overflow: 'hidden',
                  padding: 4,
                }}>
                  {menuItems.map(({ label, icon, action, danger }) => (
                    <button
                      key={label}
                      onClick={action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        width: '100%', textAlign: 'left',
                        padding: '7px 10px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-sm)',
                        color: danger ? 'var(--color-danger)' : 'var(--color-ink)',
                        fontWeight: 400,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ghost)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <Icon
                        name={icon}
                        size={14}
                        style={{ color: danger ? 'var(--color-danger)' : 'var(--color-muted)', flexShrink: 0 }}
                      />
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
