/**
 * Get initials from a name string.
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

/**
 * Validate an email address.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Generate a hue value from a string (for avatar colors).
 * @param {string} str
 * @returns {number}
 */
export const stringToHue = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

/**
 * Ensure a website URL has a protocol prefix.
 * @param {string} url
 * @returns {string}
 */
export const ensureProtocol = (url = '') =>
  url.startsWith('http') ? url : `https://${url}`;
