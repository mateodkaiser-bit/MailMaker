/**
 * FontPicker — searchable, categorized, Google-Fonts-previewed font selector.
 *
 * Props:
 *   label?    string        — field label rendered above the trigger
 *   value     string        — currently selected font NAME (e.g. "Roboto")
 *   onChange  (font) => void — called with the full font object:
 *               { name, fontStack, isCustom, category }
 *
 * Behaviour:
 *   • Dropdown groups fonts as: Recently Used → Web Safe → Google Sans → Google Serif
 *   • Search filters across all groups
 *   • Each font name is rendered in its own typeface for at-a-glance preview
 *   • Google Fonts are loaded lazily (only when the dropdown opens)
 *   • A small "G" badge marks Google Fonts so the user knows they require
 *     the font injection in the exported email
 *   • Recent fonts (top 5) are stored in localStorage via useRecentFonts()
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { FONTS, getFontByName, ensureFontLoaded } from '../../lib/fonts.js';
import { useRecentFonts } from '../../hooks/useRecentFonts.js';
import Icon from './Icon.jsx';

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'web-safe',     label: 'Web Safe' },
  { key: 'google-sans',  label: 'Google Sans' },
  { key: 'google-serif', label: 'Google Serif' },
];

// ── Styles (inline, matching the Swiss / sharp design system) ─────────────────

const fieldLabel = {
  display:       'block',
  fontSize:      10,
  fontWeight:    700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color:         'var(--color-muted)',
  marginBottom:  6,
  fontFamily:    'var(--font-sans)',
};

const triggerBase = {
  width:           '100%',
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'space-between',
  gap:             6,
  padding:         '6px 8px',
  background:      'var(--color-white)',
  border:          '1.5px solid var(--color-surface-mid)',
  borderRadius:    0,
  cursor:          'pointer',
  textAlign:       'left',
  color:           'var(--color-ink)',
  fontSize:        13,
  lineHeight:      1.4,
};

const dropdownShell = {
  position:        'absolute',
  top:             'calc(100% + 2px)',
  left:            0,
  right:           0,
  background:      'var(--color-white)',
  border:          '1.5px solid var(--color-surface-mid)',
  borderRadius:    0,
  zIndex:          1000,
  display:         'flex',
  flexDirection:   'column',
  maxHeight:       316,
  overflow:        'hidden',
  // Subtle depth — keeps the Swiss flat aesthetic while still lifting the panel
  boxShadow:       '0 4px 16px rgba(0,0,0,0.10)',
};

const searchWrap = {
  padding:         '7px 7px 5px',
  borderBottom:    '1px solid var(--color-ghost)',
  flexShrink:      0,
};

const searchInput = {
  width:           '100%',
  padding:         '5px 8px',
  border:          '1.5px solid var(--color-surface-mid)',
  borderRadius:    0,
  fontSize:        12,
  outline:         'none',
  background:      'var(--color-ghost)',
  color:           'var(--color-ink)',
  boxSizing:       'border-box',
  fontFamily:      'var(--font-sans)',
};

const scrollList = {
  overflowY:       'auto',
  flex:            1,
};

const categoryHeader = {
  fontSize:        9,
  fontWeight:      700,
  textTransform:   'uppercase',
  letterSpacing:   '0.09em',
  color:           'var(--color-muted)',
  padding:         '9px 10px 3px',
  borderTop:       '1px solid var(--color-ghost)',
  fontFamily:      'var(--font-sans)',
};

const emptyMsg = {
  padding:         '14px 12px',
  fontSize:        12,
  color:           'var(--color-muted)',
  fontFamily:      'var(--font-sans)',
};

// ── Sub-component: a single font row ──────────────────────────────────────────

function FontRow({ font, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);

  const bg = selected
    ? 'var(--color-ghost)'
    : hovered
    ? 'rgba(55,53,47,0.05)'
    : 'transparent';

  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(font)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         '7px 10px',
        cursor:          'pointer',
        background:      bg,
        transition:      'background 0.08s',
      }}
    >
      {/* Font name rendered in its own typeface */}
      <span style={{ fontFamily: font.fontStack, fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.4 }}>
        {font.name}
      </span>

      <span style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        {/* Google badge */}
        {font.isCustom && (
          <span style={{
            fontSize:      8,
            fontWeight:    700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color:         'var(--color-muted)',
            background:    'var(--color-ghost)',
            padding:       '1px 4px',
            fontFamily:    'var(--font-sans)',
            lineHeight:    1.6,
          }}>
            G
          </span>
        )}
        {/* Selection tick */}
        {selected && (
          <Icon name="check" size={12} style={{ color: 'var(--color-shell)' }} />
        )}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function FontPicker({ label, value, onChange }) {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const containerRef      = useRef(null);
  const searchRef         = useRef(null);
  const { recent, addRecent } = useRecentFonts();

  // Resolve the current font object (fall back to Inter gracefully)
  const currentFont = getFontByName(value) ?? FONTS.find(f => f.name === 'Inter') ?? FONTS[0];

  // ── Side-effects ─────────────────────────────────────────────────────────

  // When the dropdown opens: load all Google Fonts for preview, focus search
  useEffect(() => {
    if (!open) return;
    FONTS.forEach(f => { if (f.isCustom) ensureFontLoaded(f.name); });
    requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]);

  // Ensure the currently selected Google Font is loaded for the canvas preview
  useEffect(() => {
    if (currentFont.isCustom) ensureFontLoaded(currentFont.name);
  }, [currentFont]);

  // Click-outside closes the dropdown
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Keyboard: Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const select = useCallback((font) => {
    addRecent(font.name);
    onChange(font);
    setOpen(false);
    setQuery('');
  }, [addRecent, onChange]);

  // ── Filtered list (search mode) ───────────────────────────────────────────

  const q        = query.trim().toLowerCase();
  const filtered = q ? FONTS.filter(f => f.name.toLowerCase().includes(q)) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && <div style={fieldLabel}>{label}</div>}

      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          ...triggerBase,
          // Render font name in its own face so the trigger is self-previewing
          fontFamily: currentFont.fontStack,
        }}
      >
        <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}>
          {currentFont.name}
        </span>
        <Icon
          name={open ? 'expand_less' : 'expand_more'}
          size={14}
          style={{ color: 'var(--color-muted)', flexShrink: 0 }}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div style={dropdownShell} role="listbox">

          {/* Search */}
          <div style={searchWrap}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search fonts…"
              style={searchInput}
            />
          </div>

          {/* List */}
          <div style={scrollList}>
            {filtered ? (
              // ── Search results ──────────────────────────────────────────
              filtered.length === 0
                ? <div style={emptyMsg}>No fonts match "{query}"</div>
                : filtered.map(font => (
                    <FontRow
                      key={font.name}
                      font={font}
                      selected={font.name === value}
                      onSelect={select}
                    />
                  ))
            ) : (
              // ── Categorised list ────────────────────────────────────────
              <>
                {/* Recently Used */}
                {recent.length > 0 && (
                  <div>
                    <div style={{ ...categoryHeader, borderTop: 'none', paddingTop: 8 }}>
                      Recently Used
                    </div>
                    {recent.map(name => {
                      const font = getFontByName(name);
                      return font
                        ? <FontRow key={name} font={font} selected={font.name === value} onSelect={select} />
                        : null;
                    })}
                  </div>
                )}

                {/* Web Safe + Google groups */}
                {CATEGORIES.map(cat => (
                  <div key={cat.key}>
                    <div style={categoryHeader}>{cat.label}</div>
                    {FONTS
                      .filter(f => f.category === cat.key)
                      .map(font => (
                        <FontRow
                          key={font.name}
                          font={font}
                          selected={font.name === value}
                          onSelect={select}
                        />
                      ))
                    }
                  </div>
                ))}
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
