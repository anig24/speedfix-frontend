/**
 * 🔐 Permission checker
 */
export function hasPermission(user, section, action) {
  if (!user) return false;

  // Founder full access
  if (user.isSuperAdmin) return true;

  return user?.permissions?.[section]?.[action] === true;
}