// Ganti dengan URL Railway backend setelah deploy
// Contoh: https://berkesan-production.up.railway.app
const BACKEND_URL = "https://berkesan-production.up.railway.app";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...DEFAULT_HEADERS, ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BACKEND_URL}${path}`, { ...options, headers });
  return res;
}
