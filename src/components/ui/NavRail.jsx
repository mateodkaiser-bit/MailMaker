import { NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';

const NAV_ITEMS = [
  { to: '/',         label: 'Templates', icon: 'space_dashboard' },
  { to: '/blocks',   label: 'Blocks',    icon: 'widgets'         },
  { to: '/settings', label: 'Settings',  icon: 'settings'        },
];

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
        borderRight: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid var(--color-border)',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{
          width: 28, height: 28,
          background: 'var(--color-ink)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name="mail" size={15} fill={1} style={{ color: '#fff' }} />
        </div>
        <span style={{
          color: 'var(--color-ink)',
          fontWeight: 700,
          fontSize: 'var(--text-base)',
          letterSpacing: '-0.01em',
        }}>
          MailDraft
        </span>
      </div>

      {/* Nav links */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        padding: '10px 8px',
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
              gap: 9,
              padding: '8px 10px',
              color: isActive ? 'var(--color-ink)' : 'var(--color-slate)',
              background: isActive ? 'var(--color-ghost)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 600 : 400,
              transition: 'background 0.12s, color 0.12s',
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
                  size={17}
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
    </nav>
  );
}
