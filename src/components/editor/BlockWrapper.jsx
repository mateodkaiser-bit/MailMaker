import { useCallback, useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBlockEditorContext } from '../../context/BlockEditorContext.jsx';
import Icon from '../ui/Icon.jsx';

/**
 * BlockWrapper — Notion-style wrapper around every top-level block.
 *
 * Provides:
 * - Six-dot drag handle (drag) + click to open block menu (single-select only)
 * - Click → select, Shift+click → multi-select
 * - Soft highlight on selected blocks
 * - Hover → handle fades in
 * - "+" button between blocks (add block after)
 *
 * When multiple blocks are selected, individual handles are hidden —
 * BlockEditor renders a single group handle instead.
 */
export default function BlockWrapper({ id, isSelected, isMultiSelected, children }) {
  const ctx = useBlockEditorContext();
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  const handleRef = useRef(null);

  // Hide per-block menu when multi-selection starts
  useEffect(() => {
    if (isMultiSelected) setMenuOpen(false);
  }, [isMultiSelected]);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: menuOpen });

  const style = {
    transform: menuOpen ? undefined : CSS.Transform.toString(transform),
    transition: menuOpen ? undefined : transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleClick = useCallback((e) => {
    if (e.target.contentEditable === 'true' || e.target.closest('[contenteditable]')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    if (e.target.closest('[data-block-menu]')) return;
    if (e.target.closest('[data-drag-handle]')) return;
    ctx.selectBlock(id, e.shiftKey || e.metaKey || e.ctrlKey);
  }, [ctx, id]);

  const handleAddAfter = useCallback((e) => {
    e.stopPropagation();
    ctx.addBlock('paragraph', id);
  }, [ctx, id]);

  // Six-dot handle: click → toggle menu. Drag handled by @dnd-kit via listeners.
  const handleHandleClick = useCallback((e) => {
    if (!isDragging) {
      e.stopPropagation();
      ctx.selectBlock(id);
      setMenuOpen(prev => !prev);
    }
  }, [ctx, id, isDragging]);

  // ─── Block menu actions ───────────────────────────────────────────────────

  const block = ctx.getBlock(id);
  const isText = block?.type === 'paragraph' || block?.type === 'heading';
  const isColumns = block?.type === 'columns';

  const currentAlign = isText
    ? (block?.attrs?.textAlign || 'left')
    : (block?.attrs?.align || (block?.type === 'image' || block?.type === 'button' ? 'center' : 'left'));

  const supportsAlign = ['paragraph', 'heading', 'image', 'button', 'divider', 'socialIcons'].includes(block?.type);

  const handleTurnInto = useCallback((type, attrs = {}) => {
    ctx.turnBlockInto(id, type, attrs);
    setMenuOpen(false);
  }, [ctx, id]);

  const handleWrapColumns = useCallback((numCols) => {
    ctx.wrapInColumns(id, numCols);
    setMenuOpen(false);
  }, [ctx, id]);

  const handleDelete = useCallback(() => {
    ctx.deleteBlocks([id]);
    setMenuOpen(false);
  }, [ctx, id]);

  const handleDuplicate = useCallback(() => {
    ctx.duplicateBlock(id);
    setMenuOpen(false);
  }, [ctx, id]);

  const handleAlign = useCallback((alignment) => {
    if (isText) {
      ctx.updateBlock(id, { attrs: { textAlign: alignment } });
    } else {
      ctx.updateBlock(id, { attrs: { align: alignment } });
    }
    setMenuOpen(false);
  }, [ctx, id, isText]);

  // Show handle only for single-select or when hovered (but NOT during multi-select)
  const showHandle = !isMultiSelected && (hovered || isDragging || menuOpen);

  return (
    <div
      ref={(node) => { setNodeRef(node); wrapperRef.current = node; }}
      style={style}
      {...attributes}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); }}
      onClick={handleClick}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        borderRadius: '6px',
        transition: 'background 0.12s',
        background: isSelected ? 'rgba(55, 53, 47, 0.04)' : 'transparent',
      }}>
        {/* ─── Six-dot drag handle + click → menu (single-select only) ─── */}
        {!isMultiSelected && (
          <div
            data-drag-handle
            ref={(node) => { setActivatorNodeRef(node); handleRef.current = node; }}
            {...(menuOpen ? {} : listeners)}
            onClick={handleHandleClick}
            style={{
              position: 'absolute',
              left: '-32px',
              top: '2px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              cursor: menuOpen ? 'pointer' : 'grab',
              color: 'rgba(55,53,47,0.35)',
              opacity: showHandle ? 1 : 0,
              transition: 'opacity 0.12s, background 0.1s, color 0.1s',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(55,53,47,0.08)';
              e.currentTarget.style.color = 'rgba(55,53,47,0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(55,53,47,0.35)';
            }}
            title="Drag to move / Click for options"
          >
            <SixDotIcon />
          </div>
        )}

        {/* ─── Block menu (single-select only) ─── */}
        {menuOpen && !isMultiSelected && (
          <BlockMenu
            isText={isText}
            isColumns={isColumns}
            currentType={block?.type}
            currentLevel={block?.attrs?.level}
            currentAlign={currentAlign}
            supportsAlign={supportsAlign}
            onTurnInto={handleTurnInto}
            onWrapColumns={handleWrapColumns}
            onAlign={handleAlign}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onClose={() => setMenuOpen(false)}
          />
        )}

        {/* ─── Block content ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
      </div>

      {/* ─── "+" button between blocks ─── */}
      <div
        style={{
          height: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s',
        }}
      >
        <button
          onClick={handleAddAfter}
          style={{
            background: 'none',
            border: '1px dashed transparent',
            width: '100%',
            height: '1px',
            position: 'relative',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-shell)';
            e.currentTarget.style.height = '2px';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.height = '1px';
          }}
          title="Add block"
        />
      </div>
    </div>
  );
}

// ─── Block action menu (reused by both BlockWrapper and MultiSelectHandle) ───

export function BlockMenu({ isText, isColumns, currentType, currentLevel, currentAlign, supportsAlign, onTurnInto, onWrapColumns, onAlign, onDelete, onDuplicate, onClose, multiCount }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handle);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handle);
    };
  }, [onClose]);

  const menuItem = (label, icon, action, opts = {}) => (
    <button
      key={label}
      onClick={(e) => { e.stopPropagation(); action(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', padding: '7px 12px', border: 'none', borderRadius: '4px',
        background: 'transparent', cursor: 'pointer', textAlign: 'left',
        fontSize: '13px', color: opts.danger ? '#DC2626' : 'var(--color-ink)',
        fontWeight: opts.active ? 600 : 400,
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-ghost)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <Icon name={icon} size={16} style={{ color: opts.danger ? '#DC2626' : opts.active ? 'var(--color-shell)' : 'var(--color-muted)', flexShrink: 0 }} />
      {label}
    </button>
  );

  return (
    <div
      ref={menuRef}
      data-block-menu
      style={{
        position: 'absolute',
        left: '-36px',
        top: '28px',
        zIndex: 1000,
        width: '220px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        border: '1px solid var(--color-border)',
        padding: '4px',
        overflow: 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Multi-select badge */}
      {multiCount > 1 && (
        <div style={{
          fontSize: 11, fontWeight: 600, color: 'var(--color-slate)',
          padding: '6px 12px 4px', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="select_all" size={14} style={{ color: 'var(--color-muted)' }} />
          {multiCount} blocks selected
        </div>
      )}

      {/* Turn into — text types (single-select only) */}
      {isText && !multiCount && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)', padding: '6px 12px 4px' }}>
            Turn into
          </div>
          {menuItem('Paragraph', 'notes', () => onTurnInto('paragraph', { textAlign: 'left' }), { active: currentType === 'paragraph' })}
          {menuItem('Heading 1', 'title', () => onTurnInto('heading', { level: 1, textAlign: 'left' }), { active: currentType === 'heading' && currentLevel === 1 })}
          {menuItem('Heading 2', 'title', () => onTurnInto('heading', { level: 2, textAlign: 'left' }), { active: currentType === 'heading' && currentLevel === 2 })}
          {menuItem('Heading 3', 'title', () => onTurnInto('heading', { level: 3, textAlign: 'left' }), { active: currentType === 'heading' && currentLevel === 3 })}
          <div style={{ height: 1, background: 'var(--color-ghost)', margin: '4px 0' }} />
        </>
      )}

      {/* Alignment — for blocks that support it (single-select) or multi-select */}
      {(supportsAlign || multiCount > 1) && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)', padding: '6px 12px 4px' }}>
            Align
          </div>
          <div style={{ display: 'flex', gap: 2, padding: '2px 8px 6px' }}>
            {[
              { value: 'left', icon: 'format_align_left' },
              { value: 'center', icon: 'format_align_center' },
              { value: 'right', icon: 'format_align_right' },
            ].map(({ value, icon }) => (
              <button
                key={value}
                onClick={(e) => { e.stopPropagation(); onAlign(value); }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px 0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: currentAlign === value && !multiCount ? 'var(--color-accent-soft, rgba(99,102,241,0.1))' : 'transparent',
                  color: currentAlign === value && !multiCount ? 'var(--color-shell)' : 'var(--color-muted)',
                  transition: 'background 0.1s, color 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (currentAlign !== value || multiCount) e.currentTarget.style.background = 'var(--color-ghost)';
                }}
                onMouseLeave={(e) => {
                  if (currentAlign !== value || multiCount) e.currentTarget.style.background = 'transparent';
                }}
                title={`Align ${value}`}
              >
                <Icon name={icon} size={18} />
              </button>
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--color-ghost)', margin: '4px 0' }} />
        </>
      )}

      {/* Wrap in columns — single-select, non-column blocks only */}
      {!isColumns && !multiCount && (
        <>
          {menuItem('2 Columns', 'view_column_2', () => onWrapColumns(2))}
          {menuItem('3 Columns', 'view_column', () => onWrapColumns(3))}
          <div style={{ height: 1, background: 'var(--color-ghost)', margin: '4px 0' }} />
        </>
      )}

      {/* Actions */}
      {!multiCount && menuItem('Duplicate', 'content_copy', onDuplicate)}
      {menuItem('Delete', 'delete', onDelete, { danger: true })}
    </div>
  );
}

export function SixDotIcon() {
  return (
    <svg viewBox="0 0 8 14" width="8" height="14" fill="currentColor">
      <circle cx="2" cy="2" r="1.4" />
      <circle cx="6" cy="2" r="1.4" />
      <circle cx="2" cy="7" r="1.4" />
      <circle cx="6" cy="7" r="1.4" />
      <circle cx="2" cy="12" r="1.4" />
      <circle cx="6" cy="12" r="1.4" />
    </svg>
  );
}
