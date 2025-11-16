export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("tokenTime");
  window.location.href = "/login";
}
