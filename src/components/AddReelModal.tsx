import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Library } from '../store'
import { Tape, Torn } from './Scrap'

export default function AddReelModal({ lib, defaultFolder, onClose, onSaved }: { lib: Library; defaultFolder: string | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ url: '', title: '', creator: '', notes: '' })
  const [folderId, setFolderId] = useState<string | null>(defaultFolder)
  const [more, setMore] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current?.focus()
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [onClose])
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    const res = await lib.addReel({ ...f, folderId })
    setSaving(false)
    if (res.ok) onSaved(); else setError(res.error)
  }
  return (
    <div className="scrim" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="modal wrap" role="dialog" aria-modal="true" aria-labelledby="mt" onSubmit={submit} noValidate>
        <div className="paper" /><Tape />
        <h2 id="mt">Save a Reel <span className="hand">a new keepsake</span></h2>
        <label>Reel link <b className="req">Required</b>
          <input ref={ref} value={f.url} onChange={set('url')} placeholder="https://www.instagram.com/reel/..." aria-invalid={!!error} aria-describedby="err" /></label>
        <label>Title <i>Optional</i><input value={f.title} onChange={set('title')} placeholder="What is it?" maxLength={200} /></label>
        <fieldset><legend>Folder</legend>
          <div className="chips">
            <button type="button" className="chip" aria-pressed={folderId === null} onClick={() => setFolderId(null)}>Unsorted</button>
            {lib.folders.map(x => <button type="button" key={x.id} className="chip" style={{ ['--c' as string]: `var(--${x.color})` }} aria-pressed={folderId === x.id} onClick={() => setFolderId(x.id)}>{x.name}</button>)}
          </div></fieldset>
        {more ? <>
          <label>Creator <i>Optional</i><input value={f.creator} onChange={set('creator')} placeholder="@username" maxLength={60} /></label>
          <label>Your note <i>Optional</i><textarea rows={3} maxLength={300} value={f.notes} onChange={set('notes')} placeholder="Why did you save this?" /></label>
        </> : <button type="button" className="link" onClick={() => setMore(true)}>Add more details</button>}
        <p id="err" className="error" role="alert">{error}</p>
        <div className="actions"><button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save Reel'}</button><button type="button" className="btn ghost" onClick={onClose}>Cancel</button></div>
      </form>
    </div>
  )
}
