/* ── Utility helpers shared across pages ── */

/** Get 2 uppercase initials from a name */
export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

/** Pick a color class (0-5) based on name hash */
export const getAvatarColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `c${Math.abs(hash) % 6}`;
};

/** Map department name → badge class */
export const getDeptClass = (dept = '') => {
  const d = dept.toLowerCase();
  if (d.includes('eng') || d.includes('dev') || d.includes('tech')) return 'eng';
  if (d.includes('design') || d.includes('ui') || d.includes('ux')) return 'design';
  if (d.includes('hr') || d.includes('human') || d.includes('people')) return 'hr';
  if (d.includes('finance') || d.includes('account')) return 'finance';
  if (d.includes('sales') || d.includes('market')) return 'sales';
  if (d.includes('ops') || d.includes('operation')) return 'ops';
  return 'default';
};

/** Format a date string */
export const formatDate = (iso) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/** Format time ago */
export const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};
