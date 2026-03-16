import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useTemplateStore } from '../store/templates.js';
import TemplateGrid from '../components/home/TemplateGrid.jsx';
import Modal from '../components/ui/Modal.jsx';
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
    const id = createTemplate({
      name: starter.name,
      doc: starter.doc,
    });
    setStarterOpen(false);
    navigate(`/editor/${id}`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-white)',
        flexShrink: 0,
      }}>
        <h1 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700 }}>Templates</h1>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '7px 12px',
              fontSize: 'var(--text-sm)',
              width: 200,
              outline: 'none',
              background: 'var(--color-ghost)',
            }}
          />
          <button
            onClick={() => setStarterOpen(true)}
            style={{
              padding: '8px 16px',
              background: 'transparent', color: 'var(--color-slate)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
              fontWeight: 500, fontSize: 'var(--text-sm)', cursor: 'pointer',
            }}
          >
            Use starter
          </button>
          <button
            onClick={handleCreateBlank}
            style={{
              padding: '8px 16px',
              background: 'var(--color-accent)', color: 'var(--color-white)',
              border: 'none', borderRadius: 'var(--radius-md)',
              fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}
          >
            + New template
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-ghost)' }}>
        <TemplateGrid
          templates={filtered}
          onCreateBlank={handleCreateBlank}
          onCreateFromTemplate={() => setStarterOpen(true)}
          onDuplicate={duplicateTemplate}
          onDelete={deleteTemplate}
        />
      </div>

      {/* Starter modal */}
      <Modal
        open={starterOpen}
        onClose={() => setStarterOpen(false)}
        title="Choose a starter template"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {STARTER_TEMPLATES.map(starter => (
            <button
              key={starter.id}
              onClick={() => handlePickStarter(starter)}
              style={{
                background: 'var(--color-ghost)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{starter.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{starter.name}</div>
              <div style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
                {starter.description}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
