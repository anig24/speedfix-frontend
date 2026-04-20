export function setLoginSession() {
  localStorage.setItem("loginTime", Date.now().toString());
}

export function isSessionValid() {
  const loginTime = localStorage.getItem("loginTime");
  if (!loginTime) return false;

  const diff = Date.now() - parseInt(loginTime);
  return diff < 24 * 60 * 60 * 1000; // 24 hours
}

export function clearSession() {
  localStorage.removeItem("loginTime");
}