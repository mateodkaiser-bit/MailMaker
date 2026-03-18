import { NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';

const NAV_ITEMS = [
  { to: '/',         label: 'Templates', icon: 'space_dashboard' },
  { to: '/blocks',   label: 'Blocks',    icon: 'widgets'         },
  { to: '/settings', label: 'Settings',  icon: 'settings'        },
];

// Swiss-style uppercase label — reused across the nav
const sectionLabel = {
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--color-surface-mid)',
  padding: '16px 16px 8px',
};

export default function NavRail() {
  return (
    <nav
      style={{
        width: 'var(--nav-width)',
        height: '100%',
        background: 'var(--color-white)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: '1.5px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      {/* Logo lockup */}
      <div style={{
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1.5px solid var(--color-border)',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 26, height: 26,
          background: 'var(--color-punch)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name="mail" size={14} fill={1} style={{ color: '#fff' }} />
        </div>
        <span style={{
          color: 'var(--color-ink)',
          fontWeight: 800,
          fontSize: 'var(--text-base)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          MailDraft
        </span>
      </div>

      {/* Section label */}
      <div style={sectionLabel}>Navigation</div>

      {/* Nav links */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        flex: 1,
        padding: '0 8px',
        overflowY: 'auto',
      }}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              color: isActive ? 'var(--color-ink)' : 'var(--color-slate)',
              background: isActive ? 'var(--color-ghost)' : 'transparent',
              borderLeft: isActive
                ? '3px solid var(--color-punch)'
                : '3px solid transparent',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 600 : 400,
              transition: 'background 0.1s',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'var(--color-ghost)';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {({ isActive }) => (
              <>
                <Icon
                  name={icon}
                  size={16}
                  fill={isActive ? 1 : 0}
                  weight={isActive ? 400 : 300}
                  style={{ color: isActive ? 'var(--color-ink)' : 'var(--color-slate)', flexShrink: 0 }}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer stamp */}
      <div style={{
        fontSize: 9,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--color-muted)',
        padding: '12px 16px',
        borderTop: '1px solid var(--color-border)',
        opacity: 0.5,
      }}>
        MailDraft v1
      </div>
    </nav>
  );
}
