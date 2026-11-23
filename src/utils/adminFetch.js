export async function adminFetch(url, options = {}) {
  const token = sessionStorage.getItem("adminToken");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    sessionStorage.removeItem("adminToken");
    window.location.href = "/admin";
    throw new Error("Your session expired. Please log in again.");
  }

  return response;
}
