import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Library } from '../store'
import type { Reel } from '../types'
import { Doodle, Tape, Torn } from './Scrap'

const TYPES = ['Tool', 'App', 'Article', 'Video', 'Other']
export default function ReelDetail({ lib, id, onBack }: { lib: Library; id: string; onBack: () => void }) {
  const reel = lib.reels.find(r => r.id === id)
  const [play, setPlay] = useState(false)
  const [sure, setSure] = useState(false)
  const [res, setRes] = useState({ name: '', url: '', type: 'Tool' })
  const [err, setErr] = useState('')
  if (!reel) return <Torn className="empty"><p className="hand big">That reel is gone.</p><button className="btn" onClick={onBack}>Go back</button></Torn>
  const folder = lib.folders.find(f => f.id === reel.folderId)
  const set = (p: Partial<Reel>) => lib.updateReel(reel.id, p)
  const addRes = async (e: FormEvent) => {
    e.preventDefault()
    if (!res.name.trim()) { setErr('Give the resource a name.'); return }
    let url = res.url.trim()
    if (url) { if (!/^https?:\/\//i.test(url)) url = 'https://' + url; try { new URL(url) } catch { setErr("That link doesn't look right."); return } }
    const ok = await lib.addResource(reel.id, { name: res.name.trim(), url, type: res.type })
    if (!ok) { setErr("Couldn't add that. Check your connection and try again."); return }
    setRes({ name: '', url: '', type: 'Tool' }); setErr('')
  }
  const patchRes = (rid: string, tried: boolean) => lib.setResourceTried(reel.id, rid, tried)
  return (
    <>
      <button className="btn ghost back" onClick={onBack}>Back</button>
      <div className="hero"><Torn className="head"><Tape /><h1>{reel.title || (reel.creator ? `Reel by @${reel.creator}` : 'Untitled Reel')}</h1></Torn></div>
      <div className="detail">
        <div>
          <div className="card" style={{ ['--r' as string]: '-1deg' }}>
            {play ? <iframe title="Instagram reel" className="embed" src={reel.url + 'embed'} allowFullScreen />
              : <div className="cover tall" style={{ ['--bg' as string]: `var(--${folder?.color ?? 'peach'})` }}>
                {reel.thumbnailUrl ? <img src={reel.thumbnailUrl} alt="" /> : <><Doodle name={folder?.doodle ?? 'mark'} size={56} /><span className="hand">thumbnail on holiday</span></>}</div>}
            <div className="actions pad"><button className="btn ghost" onClick={() => setPlay(!play)}>{play ? 'Hide player' : 'Play here'}</button>
              <a className="btn" href={reel.url} target="_blank" rel="noreferrer">Open on Instagram</a></div>
          </div>
          <p className="meta">Saved {new Date(reel.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}. If the creator removes this reel, your notes and resources stay.</p>
        </div>
        <div className="form">
          <label>Title<input value={reel.title} onChange={e => set({ title: e.target.value })} placeholder="Untitled Reel" maxLength={200} /></label>
          <label>Creator<input value={reel.creator} onChange={e => set({ creator: e.target.value.replace(/^@/, '') })} placeholder="username" maxLength={60} /></label>
          <label>Folder<select value={reel.folderId ?? ''} onChange={e => set({ folderId: e.target.value || null })}>
            <option value="">Unsorted</option>{lib.folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
          <label>Notes<textarea rows={5} maxLength={1000} value={reel.notes} onChange={e => set({ notes: e.target.value })} placeholder="What's worth remembering?" /><span className="meta">Saves as you type</span></label>
          <h2>Resources</h2>
          {reel.resources.length === 0 && <p className="meta">Add the tools, apps or links this reel mentions.</p>}
          <ul className="res">{reel.resources.map(x => (
            <li key={x.id}><label className="check"><input type="checkbox" checked={x.tried} onChange={e => patchRes(x.id, e.target.checked)} /><span className={x.tried ? 'done' : ''}>{x.name}</span></label>
              <span className="tag">{x.type}</span>{x.url && <a href={x.url} target="_blank" rel="noreferrer">Open</a>}
              <button className="linklike" aria-label={`Delete ${x.name}`} onClick={() => lib.deleteResource(reel.id, x.id)}>Delete</button></li>))}</ul>
          <form className="resform" onSubmit={addRes} noValidate>
            <input aria-label="Resource name" value={res.name} onChange={e => setRes({ ...res, name: e.target.value })} placeholder="Name" maxLength={120} />
            <input aria-label="Resource link" value={res.url} onChange={e => setRes({ ...res, url: e.target.value })} placeholder="Link (optional)" />
            <select aria-label="Type" value={res.type} onChange={e => setRes({ ...res, type: e.target.value })}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
            <button className="btn">Add resource</button>
          </form>
          <p className="error" role="alert">{err}</p>
          {sure ? <div className="actions"><span>Delete this reel and its notes?</span><button className="btn" onClick={() => { lib.deleteReel(reel.id); onBack() }}>Yes, delete</button><button className="btn ghost" onClick={() => setSure(false)}>Keep it</button></div>
            : <button className="link" onClick={() => setSure(true)}>Delete this reel</button>}
        </div>
      </div>
    </>
  )
}
