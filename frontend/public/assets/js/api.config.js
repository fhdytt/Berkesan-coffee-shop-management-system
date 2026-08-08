/**
 * api.config.js — Konfigurasi URL backend terpusat
 *
 * Urutan prioritas pembacaan URL:
 * 1. Meta tag <meta name="api-url" content="..."> di HTML (untuk production/staging)
 * 2. window.__API_URL__ yang di-set manual (untuk testing)
 * 3. Fallback ke http://localhost:3000 (untuk development lokal)
 *
 * Cara pakai di HTML production:
 *   <meta name="api-url" content="https://berkesan.tail119566.ts.net">
 *
 * Cara pakai lokal (tidak perlu tambah apa-apa, otomatis pakai localhost):
 *   Cukup jalankan backend di port 3000
 */

(function () {
  // 1. Coba baca dari meta tag
  const metaTag = document.querySelector('meta[name="api-url"]');
  if (metaTag && metaTag.content && metaTag.content.trim() !== "") {
    window.API_URL = metaTag.content.trim().replace(/\/$/, "");
    console.log("[API Config] URL dari meta tag:", window.API_URL);
    return;
  }

  // 2. Coba baca dari window.__API_URL__ (set manual jika perlu)
  if (window.__API_URL__ && window.__API_URL__.trim() !== "") {
    window.API_URL = window.__API_URL__.trim().replace(/\/$/, "");
    console.log("[API Config] URL dari window.__API_URL__:", window.API_URL);
    return;
  }

  // 3. Fallback: development lokal
  window.API_URL = "http://localhost:3000";
  console.log("[API Config] URL fallback localhost:", window.API_URL);
})();

/**
 * Helper fetch dengan auto-inject Authorization header
 */
window.apiFetch = async function (path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  return fetch(`${window.API_URL}${path}`, { ...options, headers });
};
