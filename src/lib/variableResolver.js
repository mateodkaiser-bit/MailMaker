/**
 * Escape special regex metacharacters in a string so it can be used
 * safely inside a RegExp constructor.
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replace `{{ variableName }}` tokens in an HTML string with the
 * fallback values from the provided variables array.
 * Tokens that have no matching variable entry are left unchanged.
 *
 * @param {string} html
 * @param {Array<{name: string, fallback?: string}>} variables
 * @returns {string}
 */
export function resolveVariables(html, variables) {
  if (!html || !variables?.length) return html ?? '';
  let result = html;
  for (const v of variables) {
    if (!v?.name) continue;
    const pattern = new RegExp(
      `\\{\\{\\s*${escapeRegex(v.name)}\\s*\\}\\}`,
      'g'
    );
    result = result.replace(pattern, v.fallback ?? '');
  }
  return result;
}

/**
 * Merge global variables with template-level variables.
 * Template variables take priority: if both define the same name,
 * the template's version wins.
 *
 * @param {Array<{name: string, fallback?: string}>} templateVars
 * @param {Array<{name: string, fallback?: string}>} globalVars
 * @returns {Array<{name: string, fallback?: string}>}
 */
export function mergeVariables(templateVars, globalVars) {
  const map = new Map();
  for (const v of (globalVars ?? [])) {
    if (v?.name) map.set(v.name, v);
  }
  for (const v of (templateVars ?? [])) {
    if (v?.name) map.set(v.name, v);
  }
  return Array.from(map.values());
}
