import { useCallback, useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBlockEditorContext } from '../../../context/BlockEditorContext.jsx';
import TextBlock from './TextBlock.jsx';
import ImageBlock from './ImageBlock.jsx';
import ButtonBlock from './ButtonBlock.jsx';
import DividerBlock from './DividerBlock.jsx';
import SpacerBlock from './SpacerBlock.jsx';

// Each column gets calc(X% - gap_share) so total = 100%.
// 2 cols: gap_share = 8px (half of 16px gap)
// 3 cols: gap_share = 10.67px (2 gaps * 16px / 3)
const RATIO_MAP = {
  '50-50':    ['calc(50% - 8px)', 'calc(50% - 8px)'],
  '33-66':    ['calc(33% - 8px)', 'calc(67% - 8px)'],
  '66-33':    ['calc(67% - 8px)', 'calc(33% - 8px)'],
  '33-33-33': ['calc(33.333% - 10.667px)', 'calc(33.333% - 10.667px)', 'calc(33.333% - 10.667px)'],
};

export default function ColumnsBlock({ block }) {
  const { ratio = '50-50' } = block.attrs || {};
  const columns = block.columns || [[], []];
  const widths = RATIO_MAP[ratio] || RATIO_MAP['50-50'];

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      {columns.map((col, colIndex) => (
        <ColumnDropZone
          key={colIndex}
          columnsBlockId={block.id}
          colIndex={colIndex}
          blocks={col}
          width={widths[colIndex]}
        />
      ))}
    </div>
  );
}

function ColumnDropZone({ columnsBlockId, colIndex, blocks, width }) {
  const ctx = useBlockEditorContext();
  const [hovered, setHovered] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      ctx.moveColumnBlock(columnsBlockId, colIndex, active.id, over.id);
    }
  }, [ctx, columnsBlockId, colIndex]);

  const handleAddBlock = useCallback(() => {
    const lastId = blocks.length > 0 ? blocks[blocks.length - 1].id : null;
    ctx.addBlockToColumn(columnsBlockId, colIndex, 'paragraph', lastId);
    // Also select the parent columns block so right panel stays on ColumnsStylePanel
    ctx.selectBlock(columnsBlockId);
  }, [ctx, columnsBlockId, colIndex, blocks]);

  // Clicking anywhere in the column zone selects the parent columns block
  const handleZoneClick = useCallback((e) => {
    // Don't intercept clicks on contenteditable or buttons
    if (e.target.closest('[contenteditable]')) return;
    if (e.target.tagName === 'BUTTON') return;
    ctx.selectBlock(columnsBlockId);
  }, [ctx, columnsBlockId]);

  return (
    <div
      style={{
        width,
        flexShrink: 0,
        minHeight: 48,
        borderRadius: 'var(--radius-sm)',
        border: hovered
          ? '1.5px dashed var(--color-hover-light)'
          : '1.5px dashed transparent',
        padding: '4px',
        boxSizing: 'border-box',
        transition: 'border-color 0.1s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleZoneClick}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map(b => (
            <ColumnBlockItem
              key={b.id}
              block={b}
              columnsBlockId={columnsBlockId}
              colIndex={colIndex}
              allColBlocks={blocks}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add block button */}
      <button
        onClick={handleAddBlock}
        style={{
          width: '100%',
          padding: '4px 0',
          background: 'none',
          border: 'none',
          color: 'var(--color-muted)',
          fontSize: '16px',
          lineHeight: 1,
          cursor: 'pointer',
          opacity: hovered ? 0.7 : 0.3,
          transition: 'opacity 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = hovered ? '0.7' : '0.3'}
        title="Add block to column"
      >
        +
      </button>
    </div>
  );
}

function ColumnBlockItem({ block, columnsBlockId, colIndex, allColBlocks }) {
  const ctx = useBlockEditorContext();
  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: block.id });
  const [hovered, setHovered] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
  };

  const handleUpdate = useCallback((patch) => {
    ctx.updateColumnBlock(columnsBlockId, block.id, patch);
  }, [ctx, columnsBlockId, block.id]);

  const handleFocus = useCallback(() => {
    // Select the parent columns block so right panel shows ColumnsStylePanel
    ctx.selectBlock(columnsBlockId);
  }, [ctx, columnsBlockId]);

  const handleKeyDown = useCallback((action) => {
    const idx = allColBlocks.findIndex(b => b.id === block.id);
    switch (action) {
      case 'enter': {
        const newId = ctx.addBlockToColumn(columnsBlockId, colIndex, 'paragraph', block.id);
        requestAnimationFrame(() => {
          const el = document.querySelector(
            `[data-col-block-id="${newId}"] [contenteditable]`
          );
          el?.focus();
        });
        break;
      }
      case 'backspace-empty': {
        if (allColBlocks.length <= 1) break;
        const prevBlock = allColBlocks[idx - 1];
        ctx.deleteColumnBlock(columnsBlockId, block.id);
        if (prevBlock) {
          requestAnimationFrame(() => {
            const el = document.querySelector(
              `[data-col-block-id="${prevBlock.id}"] [contenteditable]`
            );
            if (el) {
              el.focus();
              const range = document.createRange();
              range.selectNodeContents(el);
              range.collapse(false);
              window.getSelection().removeAllRanges();
              window.getSelection().addRange(range);
            }
          });
        }
        break;
      }
      case 'arrow-up': {
        const prevBlock = allColBlocks[idx - 1];
        if (prevBlock) {
          const el = document.querySelector(
            `[data-col-block-id="${prevBlock.id}"] [contenteditable]`
          );
          el?.focus();
        }
        break;
      }
      case 'arrow-down': {
        const nextBlock = allColBlocks[idx + 1];
        if (nextBlock) {
          const el = document.querySelector(
            `[data-col-block-id="${nextBlock.id}"] [contenteditable]`
          );
          el?.focus();
        }
        break;
      }
    }
  }, [ctx, columnsBlockId, colIndex, block.id, allColBlocks]);

  const renderBlock = () => {
    switch (block.type) {
      case 'paragraph':
      case 'heading':
        return (
          <TextBlock
            block={block}
            onUpdate={handleUpdate}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
          />
        );
      case 'image':    return <ImageBlock block={block} />;
      case 'button':   return <ButtonBlock block={block} />;
      case 'divider':  return <DividerBlock block={block} />;
      case 'spacer':   return <SpacerBlock block={block} />;
      default:         return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      data-col-block-id={block.id}
      style={style}
      {...attributes}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', padding: '2px 0' }}>
        {/* Mini six-dot drag handle */}
        <div
          ref={setActivatorNodeRef}
          {...listeners}
          style={{
            cursor: 'grab',
            color: 'var(--color-muted)',
            opacity: hovered || isDragging ? 0.6 : 0,
            paddingTop: '3px',
            userSelect: 'none',
            flexShrink: 0,
            transition: 'opacity 0.1s',
            lineHeight: 1,
          }}
          title="Drag to reorder"
        >
          <SixDotMini />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {renderBlock()}
        </div>
      </div>
    </div>
  );
}

function SixDotMini() {
  return (
    <svg viewBox="0 0 6 10" width="6" height="10" fill="currentColor">
      <circle cx="1.5" cy="1.5" r="1" />
      <circle cx="4.5" cy="1.5" r="1" />
      <circle cx="1.5" cy="5"   r="1" />
      <circle cx="4.5" cy="5"   r="1" />
      <circle cx="1.5" cy="8.5" r="1" />
      <circle cx="4.5" cy="8.5" r="1" />
    </svg>
  );
}
