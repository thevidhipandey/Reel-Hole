import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Library as Lib } from '../store'
import type { Reel } from '../types'
import ReelCard from './ReelCard'
import { Doodle, Icon, Sparkles, Tape, Torn } from './Scrap'

export default function Library({ lib, title, reels, hero, onAdd, onOpen, onFolder, top }: { lib: Lib; title: string; reels: Reel[]; hero?: boolean; onAdd: () => void; onOpen: (id: string) => void; onFolder?: (id: string) => void; top?: ReactNode }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'new' | 'old' | 'title'>('new')
  const folder = (id: string | null) => lib.folders.find(f => f.id === id)
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  const shown = reels.filter(r => { const h = `${r.title} ${r.creator} ${r.notes} ${folder(r.folderId)?.name ?? 'unsorted'}`.toLowerCase(); return words.every(w => h.includes(w)) })
    .sort((a, b) => sort === 'title' ? (a.title || 'zz').localeCompare(b.title || 'zz') : (sort === 'new' ? 1 : -1) * (+new Date(b.savedAt) - +new Date(a.savedAt)))
  return (
    <>
      <div className="hero">
        <Torn className="head"><Tape /><Sparkles />
          <div><h1>{hero ? 'Your little corner of the internet.' : title}</h1>
            <p className="sub">{hero ? 'Fall into the scroll. Keep the good stuff.' : `${reels.length} saved`}</p></div></Torn>
        {hero && <section className="panel card" aria-label="Folders"><h2>Your folders</h2>
          <div className="mini">{lib.folders.slice(0, 3).map(f => (
            <button key={f.id} type="button" onClick={() => onFolder?.(f.id)} className="folder sm" style={{ ['--c' as string]: `var(--${f.color})` }}><Doodle name={f.doodle} size={22} /><b className="hand">{f.name}</b>
              <span className="meta">{lib.reels.filter(r => r.folderId === f.id).length} reels</span></button>))}</div></section>}
      </div>
      {top}
      <div className="toolbar">
        <label className="search"><Icon name="search" /><input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search titles, notes, creators or folders" aria-label="Search your reels" /></label>
        <select value={sort} onChange={e => setSort(e.target.value as typeof sort)} aria-label="Sort"><option value="new">Newest first</option><option value="old">Oldest first</option><option value="title">Title</option></select>
        <button className="btn" onClick={onAdd}><Icon name="plus" />Add Reel</button>
      </div>
      {shown.length ? <div className="grid">{shown.map((r, i) => <ReelCard key={r.id} reel={r} folder={folder(r.folderId)} i={i} onOpen={() => onOpen(r.id)} onFav={() => lib.toggleFav(r.id)} />)}</div>
        : <Torn className="empty"><p className="hand big">{q ? 'Nothing matches that search.' : "A little space for all the things you don't want to lose."}</p>
          {q ? <button className="btn ghost" onClick={() => setQ('')}>Back to the full library</button> : <button className="btn" onClick={onAdd}>Save your first Reel</button>}</Torn>}
    </>
  )
}
