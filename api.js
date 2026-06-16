/* =====================================================
   api.js  (goes in your site folder alongside index.html)
   Shared helper for all frontend-to-backend API calls.

   IMPORTANT: Change API_BASE to your live server URL
   when you deploy. During local development it points
   to localhost:4000 where your Node server runs.
===================================================== */

const API_BASE = "http://localhost:4000/api";

/* ================= GET TOKEN ================= */
// Retrieves the Firebase ID token for the logged-in user.
// Returns null if no user is signed in.
async function getAuthToken() {
  return new Promise(resolve => {
    if (!auth) return resolve(null);
    auth.onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        resolve(token);
      } else {
        resolve(null);
      }
    });
  });
}

/* ================= BASE FETCH ================= */
async function apiFetch(endpoint, options = {}) {
  const token = await getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

/* ================= ORDERS ================= */
async function placeOrder(orderData) {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

async function getMyOrders() {
  return apiFetch("/orders");
}

/* ================= DESIGNS ================= */
async function submitDesign(designData) {
  return apiFetch("/designs", {
    method: "POST",
    body: JSON.stringify(designData),
  });
}

/* ================= CONTACT ================= */
async function sendContactForm(formData) {
  return apiFetch("/contact", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

/* ================= PRODUCTS ================= */
async function getProducts() {
  return apiFetch("/products");
}
