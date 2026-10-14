import type { CSSProperties } from 'react'
import type { Folder, Reel } from '../types'
import { Clip, Doodle, Icon, Tape } from './Scrap'

const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export default function ReelCard({ reel, folder, onFav, onOpen, i = 0 }: { reel: Reel; folder?: Folder; onFav: () => void; onOpen: () => void; i?: number }) {
  const title = reel.title || (reel.creator ? `Reel by @${reel.creator}` : 'Untitled Reel')
  const tilt = [-1.2, 1, -0.8, 1.3][i % 4]
  return (
    <article className="card" style={{ ['--r' as string]: `${tilt}deg` } as CSSProperties}>
      {reel.favourite && <Clip />}
      {i % 5 === 1 && <Tape color={(['pink', 'lilac', 'blue'] as const)[i % 3]} />}
      <button className="cover" onClick={onOpen} aria-label={`Open details for ${title}`} style={{ ['--bg' as string]: `var(--${folder?.color ?? 'peach'})` } as CSSProperties}>
        {reel.thumbnailUrl ? <img src={reel.thumbnailUrl} alt="" /> : <><Doodle name={folder?.doodle ?? 'mark'} size={44} /><span className="hand">thumbnail on holiday</span></>}
        <span className="playdot"><Icon name="play" size={16} fill /></span>
      </button>
      {reel.notes && <p className="hand caption">{reel.notes}</p>}
      <h3 className="title"><button className="linklike" onClick={onOpen}>{title}</button></h3>
      {reel.creator && <p className="meta">@{reel.creator}</p>}
      <div className="row">
        <span className={`tag tag-${folder?.color ?? 'none'}`}>{folder?.name ?? 'Unsorted'}</span>
        <span className="meta">{fmt(reel.savedAt)}</span>
        <button className={`heart ${reel.favourite ? 'on' : ''}`} aria-pressed={reel.favourite} aria-label={reel.favourite ? 'Remove from favourites' : 'Add to favourites'} onClick={onFav}><Icon name="heart" fill={reel.favourite} /></button>
      </div>
    </article>
  )
}
