import { NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';

const NAV_ITEMS = [
  { to: '/',         label: 'Templates', icon: 'grid_view' },
  { to: '/blocks',   label: 'Blocks',    icon: 'bolt'      },
  { to: '/settings', label: 'Settings',  icon: 'settings'  },
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
        padding: '16px 0',
        flexShrink: 0,
        borderRight: '1px solid var(--color-border)',
      }}
    >
      <div style={{ padding: '0 16px 24px' }}>
        <span style={{ color: 'var(--color-ink)', fontWeight: 700, fontSize: 'var(--text-md)' }}>
          MailDraft
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              color: isActive ? 'var(--color-ink)' : 'var(--color-slate)',
              background: isActive ? 'var(--color-ghost)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              margin: '0 8px',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 500 : 400,
              transition: 'background 0.15s, color 0.15s',
            })}
            onMouseEnter={e => !e.target.closest('a').matches('[aria-current]') && (e.currentTarget.style.background = 'var(--color-ghost)')}
            onMouseLeave={e => !e.target.closest('a').matches('[aria-current]') && (e.currentTarget.style.background = 'transparent')}
          >
            <Icon name={icon} size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
