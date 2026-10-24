import type { View } from '../types'
import { Icon } from './Scrap'

const NAV: { v: View; label: string; icon: string; c: string }[] = [
  { v: 'home', label: 'Home', icon: 'home', c: 'var(--pink)' }, { v: 'all', label: 'All Reels', icon: 'play', c: 'var(--blue)' },
  { v: 'folders', label: 'Folders', icon: 'folder', c: 'var(--lilac)' }, { v: 'unsorted', label: 'Unsorted', icon: 'inbox', c: 'var(--pink)' },
  { v: 'favourites', label: 'Favourites', icon: 'heart', c: 'var(--blue)' }, { v: 'settings', label: 'Settings', icon: 'gear', c: 'var(--lilac)' },
]
export default function Sidebar({ view, setView, onAdd }: { view: View; setView: (v: View) => void; onAdd: () => void }) {
  return (
    <nav className="side" aria-label="Main">
      <div className="logo">REEL HOLE</div>
      <p className="hand tagline">Fall into the scroll.<br />Keep the good stuff.</p>
      {NAV.map(n => (
        <button key={n.v} className="tab" style={{ ['--c' as string]: n.c }} aria-current={view === n.v ? 'page' : undefined} onClick={() => setView(n.v)}>
          <Icon name={n.icon} /><span>{n.label}</span>
        </button>
      ))}
      <button className="btn addbtn" onClick={onAdd}><Icon name="plus" /><span>Add Reel</span></button>
    </nav>
  )
}
