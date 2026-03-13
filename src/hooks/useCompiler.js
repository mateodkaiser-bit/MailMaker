import { useState, useEffect, useRef } from 'react';
import { wrap } from 'comlink';
import { getSharedBlocks } from '../lib/storage.js';

let _worker = null;
let _api    = null;

function getCompilerApi() {
  if (!_api) {
    _worker = new Worker(
      new URL('../workers/compiler.worker.js', import.meta.url),
      { type: 'module' },
    );
    _api = wrap(_worker);
  }
  return _api;
}

export function useCompiler(doc, theme, enabled = true) {
  const [html,        setHtml]        = useState('');
  const [error,       setError]       = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const lastGoodHtml = useRef('');
  const timer        = useRef(null);

  useEffect(() => {
    if (!enabled || !doc) { setIsCompiling(false); return; }
    clearTimeout(timer.current);
    setIsCompiling(true);
    timer.current = setTimeout(async () => {
      try {
        const sharedBlocks = getSharedBlocks();
        const api          = getCompilerApi();
        const result       = await api.compile(doc, theme, sharedBlocks);
        lastGoodHtml.current = result;
        setHtml(result);
        setError(null);
      } catch (e) {
        setError(e.message ?? String(e));
        setHtml(lastGoodHtml.current);
      } finally {
        setIsCompiling(false);
      }
    }, 300);
    return () => clearTimeout(timer.current);
  }, [doc, theme, enabled]);

  return { html, mjml: '', error, isCompiling };
}
