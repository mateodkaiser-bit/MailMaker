import GlobalStylePanel from './GlobalStylePanel.jsx';
import TextStylePanel from './TextStylePanel.jsx';
import ImageStylePanel from './ImageStylePanel.jsx';
import ButtonStylePanel from './ButtonStylePanel.jsx';
import DividerStylePanel from './DividerStylePanel.jsx';
import SpacerStylePanel from './SpacerStylePanel.jsx';
import ColumnsStylePanel from './ColumnsStylePanel.jsx';
import SharedBlockInfoPanel from './SharedBlockInfoPanel.jsx';

function detectPanel(editor) {
  if (!editor) return 'global';
  if (editor.isActive('sharedInstance')) return 'sharedInstance';
  if (editor.isActive('blockImage'))    return 'image';
  if (editor.isActive('blockButton'))   return 'button';
  if (editor.isActive('blockDivider'))  return 'divider';
  if (editor.isActive('blockSpacer'))   return 'spacer';
  if (editor.isActive('blockColumns'))  return 'columns';
  if (editor.isActive('heading') || editor.isActive('paragraph')) return 'text';
  return 'global';
}

export default function RightPanel({ editor, theme, onThemeChange }) {
  const panel = detectPanel(editor);

  return (
    <div style={{
      width: 'var(--panel-width)',
      height: '100%',
      overflowY: 'auto',
      borderLeft: '1.5px solid var(--color-surface-mid)',
      background: 'var(--color-white)',
      flexShrink: 0,
    }}>
      {panel === 'global'         && <GlobalStylePanel      theme={theme} onChange={onThemeChange} />}
      {panel === 'text'           && <TextStylePanel         editor={editor} />}
      {panel === 'image'          && <ImageStylePanel        editor={editor} />}
      {panel === 'button'         && <ButtonStylePanel       editor={editor} />}
      {panel === 'divider'        && <DividerStylePanel      editor={editor} />}
      {panel === 'spacer'         && <SpacerStylePanel       editor={editor} />}
      {panel === 'columns'        && <ColumnsStylePanel      editor={editor} />}
      {panel === 'sharedInstance' && <SharedBlockInfoPanel   editor={editor} />}
    </div>
  );
}
