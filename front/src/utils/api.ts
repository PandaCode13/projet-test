const API_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "/api"
    : "http://localhost:3000/api";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<unknown> {
  console.log(API_URL);
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let errMsg = "Erreur serveur";
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(errMsg);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}
