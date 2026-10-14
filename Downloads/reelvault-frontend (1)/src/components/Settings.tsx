import { supabase } from '../lib/supabase'
import type { Library } from '../store'
import { Torn } from './Scrap'

export default function Settings({ lib, email }: { lib: Library; email: string }) {
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), folders: lib.folders, reels: lib.reels }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'reelvault-export.json'; a.click(); URL.revokeObjectURL(a.href)
  }
  return (
    <Torn className="settings">
      <h1>Settings</h1>
      <p>Signed in as <b>{email}</b></p>
      <div className="actions"><button className="btn" onClick={exportData}>Export my data</button><button className="btn ghost" onClick={() => supabase.auth.signOut()}>Log out</button></div>
      <p className="meta">Account deletion arrives with a server-side function.</p>
    </Torn>
  )
}
