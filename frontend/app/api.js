const BASE = process.env.NEXT_PUBLIC_PARSE_SERVER_URL || "https://parseapi.back4app.com";
const APP_ID = process.env.NEXT_PUBLIC_PARSE_APP_ID;
const JS_KEY = process.env.NEXT_PUBLIC_PARSE_JS_KEY;

export async function api(fn, params = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${BASE}/functions/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-Javascript-Key": JS_KEY,
      ...(token && { "X-Parse-Session-Token": token }),
    },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    let e = { erro: data.error || "Erro ao comunicar com o servidor" };
    try { e = JSON.parse(data.error); } catch {}
    if (data.code === 209 && token) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    throw Object.assign(new Error(e.erro), { campos: e.campos });
  }
  return data.result;
}
