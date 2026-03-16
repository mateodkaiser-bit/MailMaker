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
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-white)',
          flexShrink: 0,
          gap: 12,
        }}>
          <h1 style={{
            margin: 0,
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--color-ink)',
          }}>
            Templates
          </h1>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Icon
                name="search"
                size={15}
                style={{
                  position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-muted)', pointerEvents: 'none',
                }}
              />
              <input
                type="search"
                placeholder="Search templates…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 12px 6px 30px',
                  fontSize: 'var(--text-sm)',
                  width: 200,
                  outline: 'none',
                  background: 'var(--color-ghost)',
                  color: 'var(--color-ink)',
                }}
              />
            </div>

            <button
              onClick={() => setStarterOpen(true)}
              style={{
                padding: '6px 14px',
                background: 'transparent',
                color: 'var(--color-slate)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500, fontSize: 'var(--text-sm)', cursor: 'pointer',
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ghost)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-slate)'; }}
            >
              Starter templates
            </button>

            <button
              onClick={handleCreateBlank}
              style={{
                padding: '6px 14px',
                background: 'var(--color-ink)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'opacity 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Icon name="add" size={16} style={{ color: 'inherit' }} />
              New template
            </button>
          </div>
        </div>

        {/* Content */}
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
        title="Choose a starter template"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {STARTER_TEMPLATES.map(starter => (
            <button
              key={starter.name}
              onClick={() => handlePickStarter(starter)}
              style={{
                background: 'var(--color-white)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-ink)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: 32, height: 32,
                background: 'var(--color-ghost)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <Icon name={starter.icon} size={17} style={{ color: 'var(--color-slate)' }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
                {starter.name}
              </div>
              <div style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginTop: 3, lineHeight: 1.5 }}>
                {starter.description}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
