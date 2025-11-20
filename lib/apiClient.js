const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ;


// ---------- Public requests (no auth) ----------

export async function publicRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // you can add better error handling later
  return res.json();
}

// Convenience helpers if you want:
export function publicGet(path) {
  return publicRequest(path, { method: "GET" });
}

export function publicPost(path, body) {
  return publicRequest(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ---------- Admin (Basic Auth) helpers ----------

function getAdminAuthHeader(username, password) {
  const token = typeof window !== "undefined"
    ? window.btoa(`${username}:${password}`)
    : Buffer.from(`${username}:${password}`).toString("base64");

  return {
    Authorization: `Basic ${token}`,
  };
}

// You will call these only from client components (browser side)
export async function adminGet(path, { username, password }) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeader(username, password),
    },
  });

  return res.json();
}

export async function adminPost(path, { username, password, body }) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeader(username, password),
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function adminPatch(path, { username, password, body }) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeader(username, password),
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function adminDelete(path, { username, password }) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      ...getAdminAuthHeader(username, password),
    },
  });

  return res.json();
}

// ---------- Admin logo upload (multipart) ----------

export async function adminUploadLogo({ username, password, file }) {
  const formData = new FormData();
  formData.append("logo", file);

  const res = await fetch(`${API_BASE_URL}/admin/upload-logo`, {
    method: "POST",
    headers: {
      // don't set Content-Type here, browser will set the multipart boundary
      ...getAdminAuthHeader(username, password),
    },
    body: formData,
  });

  return res.json();
}

// ---------- Small helper to read creds from localStorage ----------

export function getAdminCreds() {
  if (typeof window === "undefined") return { username: "", password: "" };

  return {
    username: window.localStorage.getItem("adminUser") || "",
    password: window.localStorage.getItem("adminPass") || "",
  };
}

export function saveAdminCreds(username, password) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("adminUser", username);
  window.localStorage.setItem("adminPass", password);
}

export function clearAdminCreds() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("adminUser");
  window.localStorage.removeItem("adminPass");
}
