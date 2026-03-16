import { useState, useCallback } from 'react';

const STORAGE_KEY = 'maildraft:recentFonts';
const MAX_RECENT  = 5;

/**
 * Tracks the top-N most recently used font names in localStorage.
 *
 * @returns {{ recent: string[], addRecent: (name: string) => void }}
 *
 * `recent`    — ordered list of font name strings (newest first, max 5)
 * `addRecent` — call with a font name to push it to the front;
 *               duplicates are deduped, list is capped at MAX_RECENT
 */
export function useRecentFonts() {
  const [recent, setRecent] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addRecent = useCallback((fontName) => {
    setRecent(prev => {
      // Dedup, push to front, cap length
      const next = [fontName, ...prev.filter(n => n !== fontName)].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — silent fail
      }
      return next;
    });
  }, []);

  return { recent, addRecent };
}
