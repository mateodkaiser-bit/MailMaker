import { useCallback, useState, useRef, useEffect } from 'react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useBlockEditorContext } from '../../context/BlockEditorContext.jsx';
import BlockWrapper from './BlockWrapper.jsx';
import { BlockMenu, SixDotIcon } from './BlockWrapper.jsx';
import TextBlock from './blocks/TextBlock.jsx';
import ImageBlock from './blocks/ImageBlock.jsx';
import ButtonBlock from './blocks/ButtonBlock.jsx';
import DividerBlock from './blocks/DividerBlock.jsx';
import SpacerBlock from './blocks/SpacerBlock.jsx';
import ColumnsBlock from './blocks/ColumnsBlock.jsx';
import SocialIconsBlock from './blocks/SocialIconsBlock.jsx';
import SharedInstanceBlock from './blocks/SharedInstanceBlock.jsx';
import SlashMenu from './SlashMenu.jsx';
import Icon from '../ui/Icon.jsx';

/**
 * BlockEditor — the main Notion-style block editor.
 *
 * Renders all blocks in a sortable list via @dnd-kit.
 * Each block is wrapped in BlockWrapper (drag handle + selection chrome).
 * When multiple blocks are selected, a single group handle appears.
 */
export default function BlockEditor({ theme }) {
  const ctx = useBlockEditorContext();
  const { blocks, selectedIds, focusedId } = ctx;
  const [activeId, setActiveId] = useState(null);
  const [slashMenu, setSlashMenu] = useState(null); // { blockId, rect }

  // ─── Lasso (rubber-band) selection state ───────────────────────────────────
  const containerRef = useRef(null);
  const lassoRef = useRef(null); // { startX, startY, active }
  const [lassoRect, setLassoRect] = useState(null); // { x, y, w, h } in page coords
  // Flag: when true, the next click event should be swallowed (prevents
  // the click-after-lasso from overwriting the multi-select)
  const eatNextClickRef = useRef(false);

  const isMulti = selectedIds.size > 1;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ─── Capture-phase click blocker ──────────────────────────────────────────
  // After a successful lasso we set eatNextClickRef = true.  A capture-phase
  // listener on the container eats the very next click so it never reaches
  // BlockWrapper's onClick (which would overwrite the multi-selection).
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const handler = (e) => {
      if (eatNextClickRef.current) {
        eatNextClickRef.current = false;
        e.stopPropagation();
        e.preventDefault();
      }
    };
    node.addEventListener('click', handler, true); // capture phase
    return () => node.removeEventListener('click', handler, true);
  }, []);

  // ─── Drag handlers ─────────────────────────────────────────────────────────

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
    if (!selectedIds.has(event.active.id)) {
      ctx.selectBlock(event.active.id);
    }
  }, [ctx, selectedIds]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveId(null);
    if (active && over && active.id !== over.id) {
      ctx.moveBlock(active.id, over.id);
    }
  }, [ctx]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  // ─── Click on canvas background → clear selection ──────────────────────────

  const handleCanvasClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      ctx.clearSelection();
    }
  }, [ctx]);

  // ─── Text block key events ────────────────────────────────────────────────

  const handleTextKeyDown = useCallback((blockId, action, e) => {
    const idx = blocks.findIndex(b => b.id === blockId);

    switch (action) {
      case 'enter': {
        const newId = ctx.addBlock('paragraph', blockId);
        requestAnimationFrame(() => {
          const el = document.querySelector(`[data-block-id="${newId}"] [contenteditable]`);
          el?.focus();
        });
        break;
      }
      case 'backspace-empty': {
        if (blocks.length <= 1) break;
        const prevBlock = blocks[idx - 1];
        ctx.deleteBlocks([blockId]);
        if (prevBlock) {
          requestAnimationFrame(() => {
            const el = document.querySelector(`[data-block-id="${prevBlock.id}"] [contenteditable]`);
            if (el) {
              el.focus();
              const range = document.createRange();
              range.selectNodeContents(el);
              range.collapse(false);
              const sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            }
          });
        }
        break;
      }
      case 'slash': {
        const el = document.querySelector(`[data-block-id="${blockId}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          setSlashMenu({ blockId, rect });
        }
        break;
      }
      case 'arrow-up': {
        const prevBlock = blocks[idx - 1];
        if (prevBlock && (prevBlock.type === 'paragraph' || prevBlock.type === 'heading')) {
          const el = document.querySelector(`[data-block-id="${prevBlock.id}"] [contenteditable]`);
          if (el) {
            el.focus();
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
          }
        }
        break;
      }
      case 'arrow-down': {
        const nextBlock = blocks[idx + 1];
        if (nextBlock && (nextBlock.type === 'paragraph' || nextBlock.type === 'heading')) {
          const el = document.querySelector(`[data-block-id="${nextBlock.id}"] [contenteditable]`);
          if (el) {
            el.focus();
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(true);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
          }
        }
        break;
      }
    }
  }, [blocks, ctx]);

  // ─── Slash menu handler ───────────────────────────────────────────────────

  const handleSlashSelect = useCallback((type, meta) => {
    if (!slashMenu) return;
    const { blockId } = slashMenu;

    const actualType = type === 'columns-3' ? 'columns' : type;
    const overrides = type === 'columns-3' ? { ratio: '33-33-33' } : {};

    if (actualType === 'paragraph' || actualType === 'heading') {
      const level = meta?.level ?? 1;
      ctx.updateBlock(blockId, {
        type: actualType,
        attrs: actualType === 'heading'
          ? { level, textAlign: 'left' }
          : { textAlign: 'left' },
      });
    } else {
      ctx.addBlock(actualType, blockId, overrides);
      const triggerBlock = ctx.getBlock(blockId);
      if (triggerBlock && (triggerBlock.type === 'paragraph' || triggerBlock.type === 'heading') && !triggerBlock.html) {
        ctx.deleteBlocks([blockId]);
      }
    }
    setSlashMenu(null);
  }, [slashMenu, ctx]);

  // ─── Lasso selection ─────────────────────────────────────────────────────
  //
  // Mousedown on a non-interactive area starts tracking.  After moving 6 px
  // the lasso rectangle appears and text selection is killed.  On mouseup we
  // intersect the rectangle with all [data-block-id] elements and multi-select
  // the overlapping blocks.  A capture-phase click blocker (above) prevents
  // the subsequent click event from overwriting the selection.

  const handleLassoMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const target = e.target;
    // Don't start lasso from interactive / special elements
    if (target.closest('[contenteditable]')) return;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') return;
    if (target.closest('[data-block-menu]')) return;
    if (target.closest('[data-drag-handle]')) return;
    if (target.closest('[data-resize-handle]')) return;
    if (target.closest('[data-group-handle]')) return;

    // Prevent the browser from starting native text selection
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    lassoRef.current = { startX, startY, active: false };

    const THRESHOLD = 6; // px before lasso visual activates

    const onMouseMove = (me) => {
      if (!lassoRef.current) return;
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;

      if (!lassoRef.current.active) {
        if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
        lassoRef.current.active = true;
        window.getSelection()?.removeAllRanges();
        document.body.style.userSelect = 'none';
        document.body.style.WebkitUserSelect = 'none';
      }

      me.preventDefault();

      setLassoRect({
        x: Math.min(me.clientX, startX),
        y: Math.min(me.clientY, startY),
        w: Math.abs(me.clientX - startX),
        h: Math.abs(me.clientY - startY),
      });
    };

    const onMouseUp = (me) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      document.body.style.userSelect = '';
      document.body.style.WebkitUserSelect = '';

      const wasActive = lassoRef.current?.active;
      lassoRef.current = null;
      setLassoRect(null);

      if (!wasActive) return;

      // Tell the capture-phase click blocker to eat the next click event,
      // which would otherwise land on a BlockWrapper and overwrite our
      // multi-selection with a single-block select.
      eatNextClickRef.current = true;

      const endX = me.clientX;
      const endY = me.clientY;
      const selLeft   = Math.min(endX, startX);
      const selTop    = Math.min(endY, startY);
      const selRight  = Math.max(endX, startX);
      const selBottom = Math.max(endY, startY);

      const blockEls = document.querySelectorAll('[data-block-id]');
      const matched = [];
      blockEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        const overlaps = r.left < selRight && r.right > selLeft &&
                         r.top  < selBottom && r.bottom > selTop;
        if (overlaps) matched.push(el.getAttribute('data-block-id'));
      });

      if (matched.length >= 2) {
        matched.forEach((blockId, i) => {
          ctx.selectBlock(blockId, i > 0);
        });
      } else if (matched.length === 1) {
        ctx.selectBlock(matched[0]);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [ctx]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const activeBlock = activeId ? blocks.find(b => b.id === activeId) : null;

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      onMouseDown={handleLassoMouseDown}
      style={{ position: 'relative', userSelect: lassoRect ? 'none' : undefined }}
    >
      {/* Lasso selection rectangle */}
      {lassoRect && lassoRect.w > 2 && lassoRect.h > 2 && (
        <div
          style={{
            position: 'fixed',
            left: lassoRect.x,
            top: lassoRect.y,
            width: lassoRect.w,
            height: lassoRect.h,
            background: 'rgba(64,78,89,0.07)',
            border: '1.5px solid var(--color-shell)',
            borderRadius: 2,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map(block => (
            <div key={block.id} data-block-id={block.id}>
              <BlockWrapper
                id={block.id}
                isSelected={selectedIds.has(block.id)}
                isMultiSelected={isMulti && selectedIds.has(block.id)}
              >
                {renderBlock(block, ctx, handleTextKeyDown, theme)}
              </BlockWrapper>
            </div>
          ))}
        </SortableContext>

        <DragOverlay>
          {activeBlock && (
            <div style={{
              padding: '8px 16px',
              background: '#fff',
              borderRadius: '6px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              opacity: 0.9,
              maxWidth: '400px',
              overflow: 'hidden',
            }}>
              <div style={{ fontSize: '13px', color: '#1a1a2e', pointerEvents: 'none' }}>
                {selectedIds.size > 1
                  ? `Moving ${selectedIds.size} blocks`
                  : `${activeBlock.type} block`}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* ─── Multi-select group handle ─── */}
      {isMulti && (
        <MultiSelectHandle
          blocks={blocks}
          selectedIds={selectedIds}
          ctx={ctx}
        />
      )}

      {/* Slash menu */}
      {slashMenu && (
        <SlashMenu
          rect={slashMenu.rect}
          onSelect={handleSlashSelect}
          onClose={() => setSlashMenu(null)}
        />
      )}
    </div>
  );
}

// ─── Multi-select group handle ───────────────────────────────────────────────

function MultiSelectHandle({ blocks, selectedIds, ctx }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const handleRef = useRef(null);

  // Find the first selected block's DOM position to anchor the handle
  useEffect(() => {
    const firstSelectedId = blocks.find(b => selectedIds.has(b.id))?.id;
    if (!firstSelectedId) return;

    const updatePos = () => {
      const el = document.querySelector(`[data-block-id="${firstSelectedId}"]`);
      if (!el) return;
      const elRect = el.getBoundingClientRect();
      setPos({ top: elRect.top, left: elRect.left });
    };

    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [blocks, selectedIds]);

  // Close menu when selection changes
  useEffect(() => {
    setMenuOpen(false);
  }, [selectedIds]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  }, []);

  const handleDelete = useCallback(() => {
    ctx.deleteBlocks([...selectedIds]);
    setMenuOpen(false);
  }, [ctx, selectedIds]);

  const handleAlign = useCallback((alignment) => {
    for (const id of selectedIds) {
      const block = ctx.getBlock(id);
      if (!block) continue;
      const isText = block.type === 'paragraph' || block.type === 'heading';
      if (isText) {
        ctx.updateBlock(id, { attrs: { textAlign: alignment } });
      } else {
        ctx.updateBlock(id, { attrs: { align: alignment } });
      }
    }
    setMenuOpen(false);
  }, [ctx, selectedIds]);

  if (!pos) return null;

  return (
    <div
      data-group-handle
      ref={handleRef}
      style={{
        position: 'fixed',
        top: pos.top + 2,
        left: pos.left - 34,
        zIndex: 100,
      }}
    >
      <div
        onClick={handleClick}
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          cursor: 'pointer',
          color: 'rgba(55,53,47,0.65)',
          background: menuOpen ? 'rgba(55,53,47,0.08)' : 'transparent',
          transition: 'background 0.1s, color 0.1s',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(55,53,47,0.08)';
          e.currentTarget.style.color = 'rgba(55,53,47,0.8)';
        }}
        onMouseLeave={(e) => {
          if (!menuOpen) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(55,53,47,0.65)';
          }
        }}
        title={`${selectedIds.size} blocks selected — Click for options`}
      >
        <SixDotIcon />
      </div>

      {menuOpen && (
        <BlockMenu
          isText={false}
          isColumns={false}
          currentType={null}
          currentLevel={null}
          currentAlign={null}
          supportsAlign={false}
          onTurnInto={() => {}}
          onWrapColumns={() => {}}
          onAlign={handleAlign}
          onDelete={handleDelete}
          onDuplicate={() => {}}
          onClose={() => setMenuOpen(false)}
          multiCount={selectedIds.size}
        />
      )}
    </div>
  );
}

// ─── Block renderer ─────────────────────────────────────────────────────────

function renderBlock(block, ctx, handleTextKeyDown, theme) {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
      return (
        <TextBlock
          block={block}
          onUpdate={(patch) => ctx.updateBlockSilent(block.id, patch)}
          onFocus={() => ctx.selectBlock(block.id)}
          onKeyDown={(action, e) => handleTextKeyDown(block.id, action, e)}
        />
      );
    case 'image':
      return <ImageBlock block={block} />;
    case 'button':
      return <ButtonBlock block={block} />;
    case 'divider':
      return <DividerBlock block={block} />;
    case 'spacer':
      return <SpacerBlock block={block} />;
    case 'columns':
      return <ColumnsBlock block={block} />;
    case 'socialIcons':
      return <SocialIconsBlock block={block} />;
    case 'sharedInstance':
      return <SharedInstanceBlock block={block} />;
    default:
      return <div style={{ color: 'red' }}>Unknown: {block.type}</div>;
  }
}
