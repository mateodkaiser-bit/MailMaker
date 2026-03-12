import { useState, useEffect, useRef } from 'react';
import mjml2html from 'mjml-browser';
import { serializeToMjml } from '../lib/serializer.js';

export function useCompiler(doc, theme, enabled = true) {
  const [html, setHtml] = useState('');
  const [mjml, setMjml] = useState('');
  const [error, setError] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    if (!enabled || !doc) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        const mjmlStr = serializeToMjml(doc, theme);
        setMjml(mjmlStr);
        const result = mjml2html(mjmlStr, { validationLevel: 'skip' });
        setHtml(result.html);
        setError(null);
      } catch (e) {
        setError(e.message);
      }
    }, 300);
    return () => clearTimeout(timer.current);
  }, [doc, theme, enabled]);

  return { html, mjml, error };
}
