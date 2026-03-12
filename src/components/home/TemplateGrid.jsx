import TemplateCard from './TemplateCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function TemplateGrid({ templates, onCreateBlank, onCreateFromTemplate, onDuplicate, onDelete }) {
  if (templates.length === 0) {
    return (
      <EmptyState
        onCreateBlank={onCreateBlank}
        onCreateFromTemplate={onCreateFromTemplate}
      />
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 20,
      padding: '24px',
    }}>
      {templates.map(t => (
        <TemplateCard
          key={t.id}
          template={t}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
