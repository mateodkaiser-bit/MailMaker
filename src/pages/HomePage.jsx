import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store/templates.js';
import TemplateGrid from '../components/home/TemplateGrid.jsx';
import NavRail from '../components/ui/NavRail.jsx';
import Modal from '../components/ui/Modal.jsx';
import Icon from '../components/ui/Icon.jsx';
import { STARTER_TEMPLATES } from '../lib/constants.js';

export default function HomePage() {
  const navigate = useNavigate();
  const { templates, createTemplate, duplicateTemplate, deleteTemplate } = useTemplateStore();
  const [starterOpen, setStarterOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreateBlank() {
    const id = createTemplate({ name: 'Untitled Template' });
    navigate(`/editor/${id}`);
  }

  function handlePickStarter(starter) {
    const id = createTemplate({ name: starter.name, doc: starter.doc });
    setStarterOpen(false);
    navigate(`/editor/${id}`);
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <NavRail />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1.5px solid #000',
          background: 'var(--color-white)',
          flexShrink: 0,
          gap: 12,
        }}>
          {/* Page title — uppercase label style */}
          <h1 style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-muted)',
          }}>
            Templates
          </h1>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Icon
                name="search"
                size={14}
                style={{
                  position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-muted)', pointerEvents: 'none',
                }}
              />
              <input
                type="search"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: '1.5px solid var(--color-surface-mid)',
                  borderRadius: 0,
                  padding: '6px 12px 6px 28px',
                  fontSize: 'var(--text-sm)',
                  width: 180,
                  outline: 'none',
                  background: 'var(--color-ghost)',
                  color: 'var(--color-ink)',
                }}
              />
            </div>

            {/* Secondary button */}
            <button
              onClick={() => setStarterOpen(true)}
              style={{
                padding: '6px 14px',
                background: 'transparent',
                color: 'var(--color-slate)',
                border: '1.5px solid var(--color-surface-mid)',
                borderRadius: 0,
                fontWeight: 500, fontSize: 'var(--text-sm)', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-slate)'; }}
            >
              Starters
            </button>

            {/* Primary — Safety Orange */}
            <button
              onClick={handleCreateBlank}
              style={{
                padding: '6px 14px',
                background: 'var(--color-punch)',
                color: '#fff',
                border: '1.5px solid var(--color-punch)',
                borderRadius: 0,
                fontWeight: 700, fontSize: 'var(--text-sm)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-punch-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-punch)'}
            >
              <Icon name="add" size={15} style={{ color: 'inherit' }} />
              New
            </button>
          </div>
        </div>

        {/* Grid content area */}
        <div className="dot-grid" style={{ flex: 1, overflowY: 'auto' }}>
          <TemplateGrid
            templates={filtered}
            onCreateBlank={handleCreateBlank}
            onCreateFromTemplate={() => setStarterOpen(true)}
            onDuplicate={duplicateTemplate}
            onDelete={deleteTemplate}
          />
        </div>
      </div>

      {/* Starter modal */}
      <Modal
        open={starterOpen}
        onClose={() => setStarterOpen(false)}
        title="Choose a starter"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {STARTER_TEMPLATES.map(starter => (
            <button
              key={starter.name}
              onClick={() => handlePickStarter(starter)}
              style={{
                background: 'var(--color-white)',
                border: '1.5px solid var(--color-surface-mid)',
                borderRadius: 0,
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-punch)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-surface-mid)'}
            >
              <div style={{
                width: 32, height: 32,
                background: 'var(--color-shell)',
                borderRadius: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <Icon name={starter.icon} size={17} style={{ color: 'var(--color-hover-light)' }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
                {starter.name}
              </div>
              <div style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginTop: 4, lineHeight: 1.5 }}>
                {starter.description}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
