const KEYS = {
  TEMPLATES:     'md:templates',
  SHARED_BLOCKS: 'md:sharedBlocks',
  SETTINGS:      'md:settings',
};

export function getTemplates() {
  try { return JSON.parse(localStorage.getItem(KEYS.TEMPLATES)) || []; }
  catch { return []; }
}

export function saveTemplate(template) {
  const all = getTemplates();
  const idx = all.findIndex(t => t.id === template.id);
  if (idx >= 0) all[idx] = template;
  else all.unshift(template);
  localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(all));
}

export function deleteTemplate(id) {
  const all = getTemplates().filter(t => t.id !== id);
  localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(all));
}

export function getSharedBlocks() {
  try { return JSON.parse(localStorage.getItem(KEYS.SHARED_BLOCKS)) || []; }
  catch { return []; }
}

export function saveSharedBlock(block) {
  const all = getSharedBlocks();
  const idx = all.findIndex(b => b.id === block.id);
  if (idx >= 0) all[idx] = block;
  else all.unshift(block);
  localStorage.setItem(KEYS.SHARED_BLOCKS, JSON.stringify(all));
}

export function deleteSharedBlock(id) {
  const all = getSharedBlocks().filter(b => b.id !== id);
  localStorage.setItem(KEYS.SHARED_BLOCKS, JSON.stringify(all));
}

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || getDefaultSettings();
  } catch { return getDefaultSettings(); }
}

export function saveSettings(settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

function getDefaultSettings() {
  return {
    defaultTheme: {
      maxWidth: 680,
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      bodyFontSize: 16,
      linkColor: '#D97706',
    },
    variables: [{ name: 'first_name', fallback: 'there' }],
  };
}
