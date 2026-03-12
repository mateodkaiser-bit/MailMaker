import ColorPicker from '../ui/ColorPicker.jsx';
import NumberInput from '../ui/NumberInput.jsx';

export default function DividerStylePanel({ editor }) {
  if (!editor) return null;
  if (!editor.isActive('blockDivider')) return null;

  const attrs = editor.getAttributes('blockDivider');
  function update(patch) { editor.chain().focus().updateAttributes('blockDivider', patch).run(); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
        DIVIDER
      </h3>
      <ColorPicker  label="Color"     value={attrs.color}     onChange={v => update({ color: v })} />
      <NumberInput  label="Thickness" value={attrs.thickness} onChange={v => update({ thickness: v })} min={1} max={16} suffix="px" />
      <NumberInput  label="Width"     value={attrs.width}     onChange={v => update({ width: v })}     min={10} max={100} suffix="%" />
    </div>
  );
}
