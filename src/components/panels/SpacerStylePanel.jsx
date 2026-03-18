import NumberInput from '../ui/NumberInput.jsx';

export default function SpacerStylePanel({ block, onUpdate }) {
  if (!block || block.type !== 'spacer') return null;

  const attrs = block.attrs;
  function update(patch) { onUpdate(block.id, { attrs: { ...block.attrs, ...patch } }); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        SPACER
      </h3>
      <NumberInput label="Height" value={attrs.height} onChange={v => update({ height: v })} min={4} max={200} suffix="px" />
    </div>
  );
}
