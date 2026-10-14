const HOSTS = ['instagram.com', 'www.instagram.com', 'instagr.am']
export type Parsed = { ok: true; url: string; shortcode: string } | { ok: false; error: string }

// Mirrors the blueprint: Instagram hosts only, /reel /reels /p /tv, identity = shortcode.
// Repeat this check on the backend (Supabase) later; client checks can be bypassed.
export function parseInstagram(input: string): Parsed {
  let u: URL
  try { u = new URL(input.trim()) } catch { return { ok: false, error: "That doesn't look like a link." } }
  if (!HOSTS.includes(u.hostname)) return { ok: false, error: 'Only Instagram links can be saved.' }
  const m = u.pathname.match(/\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/)
  if (!m) return { ok: false, error: 'Paste a link to a reel or post.' }
  const kind = m[1] === 'reels' ? 'reel' : m[1]
  return { ok: true, url: `https://www.instagram.com/${kind}/${m[2]}/`, shortcode: m[2] }
}
