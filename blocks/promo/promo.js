
// Rendering order is fixed regardless of the order rows are authored in,
// so every promo instance (eyebrow+image+cta, statement-only, body-only, etc.)
// lines up the same way the source campaign email did.
// "headline" is the large emphasized line (e.g. "One-click registration:"),
// "statement" is a smaller bold centered line (e.g. intro/announcement text).
const FIELD_ORDER = ['eyebrow', 'headline', 'statement', 'image', 'body', 'cta'];

/**
 * Reads the authored "field name | content" rows into a map, keeping the
 * original content elements so rich formatting (links, sup, bold) survives.
 * @param {Element} block The promo block element
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
 * loads and decorates the promo block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const fields = readFields(block);
  const content = document.createElement('div');
  content.className = 'promo-content';

  FIELD_ORDER.forEach((name) => {
    const value = fields[name];
    if (!value || (!value.textContent.trim() && !value.querySelector('img, a'))) return;
    const part = document.createElement('div');
    part.className = `promo-${name}`;
    part.append(...value.childNodes);
    content.append(part);
  });

  block.textContent = '';
  block.append(content);
}
