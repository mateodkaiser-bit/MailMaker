/**
 * Format a date as a relative timestamp (e.g. "2 hours ago").
 * @param {string} isoString
 * @returns {string}
 */
export function relativeTime(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(isoString).toLocaleDateString();
}

/**
 * Count shared block instances referenced in a template doc.
 * @param {object} doc - TipTap doc JSON
 * @returns {number}
 */
export function countSharedInstances(doc) {
  if (!doc?.content) return 0;
  const str = JSON.stringify(doc);
  const matches = str.match(/"type":"sharedInstance"/g);
  return matches ? matches.length : 0;
}

/**
 * Replace {{ variable }} tokens with fallback values for preview.
 * @param {string} html
 * @param {Array<{name: string, fallback: string}>} variables
 * @returns {string}
 */
export function applyVariableFallbacks(html, variables) {
  let result = html;
  for (const v of variables) {
    const re = new RegExp(`\\{\\{\\s*${v.name}\\s*\\}\\}`, 'g');
    result = result.replace(re, v.fallback);
  }
  return result;
}
