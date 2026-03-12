import NumberInput from '../ui/NumberInput.jsx';

export default function SpacerStylePanel({ editor }) {
  if (!editor) return null;
  if (!editor.isActive('blockSpacer')) return null;

  const attrs = editor.getAttributes('blockSpacer');
  function update(patch) { editor.chain().focus().updateAttributes('blockSpacer', patch).run(); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        SPACER
      </h3>
      <NumberInput label="Height" value={attrs.height} onChange={v => update({ height: v })} min={4} max={200} suffix="px" />
    </div>
  );
}
