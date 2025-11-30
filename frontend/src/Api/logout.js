export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("tokenTime");
  localStorage.clear();
  window.location.href = "/login";
}
