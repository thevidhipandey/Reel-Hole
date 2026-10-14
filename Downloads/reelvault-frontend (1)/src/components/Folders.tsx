import type { Library } from '../store'
import { Doodle, Icon, Sparkles, Tape, Torn } from './Scrap'

export default function Folders({ lib, onOpen }: { lib: Library; onOpen: (id: string) => void }) {
  const create = () => { const n = window.prompt('Name your new folder'); if (n && n.trim()) lib.addFolder(n) }
  return (
    <>
      <div className="hero"><Torn className="head"><Tape /><Sparkles /><div><h1>Folders</h1><p className="sub">Organise your reels into little folders.</p></div></Torn></div>
      <div className="grid folders">
        {lib.folders.map(f => { const n = lib.reels.filter(r => r.folderId === f.id).length; return (
          <button key={f.id} className="folder open" onClick={() => onOpen(f.id)} style={{ ['--c' as string]: `var(--${f.color})` }}>
            <div className="pols">{[-6, 2, 7].map(r => <div key={r} className="pol" style={{ transform: `rotate(${r}deg)` }} />)}</div>
            <div className="label"><h3 className="hand">{f.name}</h3><span className="meta">{n} {n === 1 ? 'reel' : 'reels'}</span><Doodle name={f.doodle} /></div>
          </button>) })}
        <button className="folder new" onClick={create}><Icon name="plus" size={36} /><span className="hand big">New folder</span></button>
      </div>
    </>
  )
}
