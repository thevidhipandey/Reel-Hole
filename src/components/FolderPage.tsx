import { useState } from 'react'
import type { Library } from '../store'
import LibraryView from './Library'

export default function FolderPage({ lib, id, onOpenReel, onAdd, onGone }: { lib: Library; id: string; onOpenReel: (id: string) => void; onAdd: () => void; onGone: () => void }) {
  const folder = lib.folders.find(f => f.id === id)
  const [name, setName] = useState(folder?.name ?? '')
  const [sure, setSure] = useState(false)
  if (!folder) return null
  const reels = lib.reels.filter(r => r.folderId === id)
  const top = (
    <div className="foldertools">
      <input aria-label="Folder name" maxLength={60} value={name} onChange={e => setName(e.target.value)} />
      <button className="btn ghost" disabled={!name.trim() || name.trim() === folder.name} onClick={() => lib.renameFolder(id, name)}>Rename</button>
      {sure ? <><span>Delete this folder? Its {reels.length} reels move to Unsorted.</span>
        <button className="btn" onClick={() => { lib.deleteFolder(id); onGone() }}>Yes, delete folder</button><button className="btn ghost" onClick={() => setSure(false)}>Keep it</button></>
        : <button className="link" onClick={() => setSure(true)}>Delete folder</button>}
    </div>
  )
  return <LibraryView lib={lib} title={folder.name} reels={reels} onAdd={onAdd} onOpen={onOpenReel} top={top} />
}
