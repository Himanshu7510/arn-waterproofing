export async function api(url, opts = {}) {
  const init = { ...opts, headers: { ...(opts.body && !(opts.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(opts.headers || {}) } };
  if (init.body && typeof init.body === 'object' && !(init.body instanceof FormData)) init.body = JSON.stringify(init.body);
  const res = await fetch(url, init);
  if (res.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Session expired');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}
