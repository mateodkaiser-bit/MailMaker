import { useBlockEditorContext } from '../../context/BlockEditorContext.jsx';
import GlobalStylePanel from './GlobalStylePanel.jsx';
import TextStylePanel from './TextStylePanel.jsx';
import ImageStylePanel from './ImageStylePanel.jsx';
import ButtonStylePanel from './ButtonStylePanel.jsx';
import DividerStylePanel from './DividerStylePanel.jsx';
import SpacerStylePanel from './SpacerStylePanel.jsx';
import ColumnsStylePanel from './ColumnsStylePanel.jsx';
import SharedBlockInfoPanel from './SharedBlockInfoPanel.jsx';

const TYPE_TO_PANEL = {
  paragraph: 'text',
  heading: 'text',
  image: 'image',
  button: 'button',
  divider: 'divider',
  spacer: 'spacer',
  columns: 'columns',
  sharedInstance: 'sharedInstance',
  socialIcons: 'global',
};

export default function RightPanel({ theme, onThemeChange }) {
  const { selectedBlock, updateBlock } = useBlockEditorContext();
  const panel = selectedBlock ? (TYPE_TO_PANEL[selectedBlock.type] || 'global') : 'global';

  return (
    <div style={{
      width: 'var(--panel-width)',
      height: '100%',
      overflowY: 'auto',
      borderLeft: '1.5px solid var(--color-surface-mid)',
      background: 'var(--color-white)',
      flexShrink: 0,
    }}>
      {panel === 'global'         && <GlobalStylePanel theme={theme} onChange={onThemeChange} />}
      {panel === 'text'           && <TextStylePanel block={selectedBlock} onUpdate={updateBlock} />}
      {panel === 'image'          && <ImageStylePanel block={selectedBlock} onUpdate={updateBlock} />}
      {panel === 'button'         && <ButtonStylePanel block={selectedBlock} onUpdate={updateBlock} />}
      {panel === 'divider'        && <DividerStylePanel block={selectedBlock} onUpdate={updateBlock} />}
      {panel === 'spacer'         && <SpacerStylePanel block={selectedBlock} onUpdate={updateBlock} />}
      {panel === 'columns'        && <ColumnsStylePanel block={selectedBlock} onUpdate={updateBlock} />}
      {panel === 'sharedInstance' && <SharedBlockInfoPanel block={selectedBlock} onUpdate={updateBlock} />}
    </div>
  );
}
