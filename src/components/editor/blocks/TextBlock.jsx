import { useRef, useCallback, useEffect } from 'react';

/**
 * TextBlock — contenteditable paragraph or heading.
 *
 * Renders an editable div with the block's HTML content.
 * Formatting (bold/italic/underline) is applied via document.execCommand
 * from the TextStylePanel (which prevents focus loss with onMouseDown).
 */
export default function TextBlock({ block, onUpdate, onFocus, onKeyDown }) {
  const ref = useRef(null);
  const isHeading = block.type === 'heading';
  const level = block.attrs?.level || 1;

  // Sync HTML from state → DOM only when block.id changes (mount)
  const lastIdRef = useRef(null);
  useEffect(() => {
    if (ref.current && block.id !== lastIdRef.current) {
      ref.current.innerHTML = block.html || '';
      lastIdRef.current = block.id;
    }
  }, [block.id, block.html]);

  const handleInput = useCallback(() => {
    if (ref.current) {
      onUpdate({ html: ref.current.innerHTML });
    }
  }, [onUpdate]);

  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  const handleKeyDown = useCallback((e) => {
    // Enter at end of block → create new paragraph after
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onKeyDown?.('enter', e);
      return;
    }
    // Backspace on empty block → delete and focus previous
    if (e.key === 'Backspace' && ref.current?.textContent === '') {
      e.preventDefault();
      onKeyDown?.('backspace-empty', e);
      return;
    }
    // Forward slash at start of empty block → trigger slash menu
    if (e.key === '/' && ref.current?.textContent === '') {
      e.preventDefault();
      onKeyDown?.('slash', e);
      return;
    }
    // Arrow keys for block navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const sel = window.getSelection();
      if (!sel?.rangeCount) return;
      const range = sel.getRangeAt(0);
      const rects = ref.current.getClientRects();
      if (rects.length === 0) return;

      if (e.key === 'ArrowUp') {
        const cursorRect = range.getBoundingClientRect();
        const firstLineTop = rects[0].top;
        if (Math.abs(cursorRect.top - firstLineTop) < 2) {
          e.preventDefault();
          onKeyDown?.('arrow-up', e);
        }
      } else {
        const cursorRect = range.getBoundingClientRect();
        const lastLineBottom = rects[rects.length - 1].bottom;
        if (Math.abs(cursorRect.bottom - lastLineBottom) < 2) {
          e.preventDefault();
          onKeyDown?.('arrow-down', e);
        }
      }
    }
  }, [onKeyDown]);

  const fontSize = isHeading
    ? { 1: 'var(--text-2xl)', 2: 'var(--text-xl)', 3: 'var(--text-lg)' }[level]
    : undefined;
  const fontWeight = isHeading
    ? (level <= 2 ? 700 : 600)
    : undefined;

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-block-type={block.type}
      data-placeholder={isHeading ? `Heading ${level}` : 'Type / to start…'}
      onInput={handleInput}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      style={{
        outline: 'none',
        minHeight: '1.6em',
        lineHeight: isHeading ? 1.3 : 1.6,
        fontSize,
        fontWeight,
        textAlign: block.attrs?.textAlign || 'left',
        letterSpacing: isHeading ? '-0.01em' : undefined,
        wordBreak: 'break-word',
      }}
    />
  );
}
