// Rendering order is fixed so the ISI/legal band always reads
// footnote -> references -> legal copy -> brand logo, as in the source email.
const FIELD_ORDER = ['footnote', 'references', 'legal', 'logo'];

/**
 * Reads the authored "field name | content" rows into a map, keeping the
 * original content elements so rich formatting (links, lists) survives.
 * @param {Element} block The legal block element
 * @returns {Object<string, Element>} field name -> value cell element
 */
function readFields(block) {
  const fields = {};
  [...block.children].forEach((row) => {
    const [label, value] = row.children;
    if (!label || !value) return;
    fields[label.textContent.trim().toLowerCase()] = value;
  });
  return fields;
}

/**
 * loads and decorates the legal (ISI/citations/legal copy) block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const fields = readFields(block);
  const content = document.createElement('div');
  content.className = 'legal-content';

  FIELD_ORDER.forEach((name) => {
    const value = fields[name];
    if (!value || (!value.textContent.trim() && !value.querySelector('img'))) return;
    const part = document.createElement('div');
    part.className = `legal-${name}`;
    part.append(...value.childNodes);
    content.append(part);
  });

  block.textContent = '';
  block.append(content);
}
