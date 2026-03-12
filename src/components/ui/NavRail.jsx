import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/',        label: 'Templates', icon: '▦' },
  { to: '/blocks',  label: 'Blocks',    icon: '⚡' },
  { to: '/settings',label: 'Settings',  icon: '⚙' },
];

export default function NavRail() {
  return (
    <nav
      style={{
        width: 'var(--nav-width)',
        height: '100%',
        background: 'var(--color-ink-light)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 0',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '0 16px 24px' }}>
        <span style={{ color: 'var(--color-amber)', fontWeight: 700, fontSize: 'var(--text-md)' }}>
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
              color: isActive ? 'var(--color-white)' : 'var(--color-muted)',
              background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              margin: '0 8px',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 600 : 400,
              transition: 'background 0.15s, color 0.15s',
            })}
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
