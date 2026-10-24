import { useState } from 'react'
import type { Route, View } from './types'
import { useSession } from './auth'
import { useLibrary } from './store'
import Sidebar from './components/Sidebar'
import LibraryView from './components/Library'
import Folders from './components/Folders'
import FolderPage from './components/FolderPage'
import ReelDetail from './components/ReelDetail'
import AddReelModal from './components/AddReelModal'
import AuthScreen from './components/AuthScreen'
import Settings from './components/Settings'

export default function App() {
  const { session, loading, recovery } = useSession()
  if (loading) return <div className="boot hand big">Opening REEL HOLE…</div>
  if (recovery) return <AuthScreen recover />
  return session ? <Shell email={session.user.email ?? ''} userId={session.user.id} /> : <AuthScreen />
}

function Shell({ email, userId }: { email: string; userId: string }) {
  const lib = useLibrary(userId)
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }])
  const [adding, setAdding] = useState<{ folderId: string | null } | null>(null)
  const [toast, setToast] = useState('')
  const route = stack[stack.length - 1]
  const go = (r: Route) => setStack(s => [...s, r])
  const back = () => setStack(s => (s.length > 1 ? s.slice(0, -1) : [{ name: 'home' }]))
  const nav = (v: View) => setStack([{ name: v }])
  const add = (folderId: string | null = null) => setAdding({ folderId })
  const saved = () => { setAdding(null); setToast('Tucked away safely.'); setTimeout(() => setToast(''), 2600) }
  const openReel = (id: string) => go({ name: 'reel', id })
  const openFolder = (id: string) => go({ name: 'folder', id })
  const lists = {
    home: { title: 'Home', reels: lib.reels }, all: { title: 'All Reels', reels: lib.reels },
    unsorted: { title: 'Unsorted', reels: lib.reels.filter(r => !r.folderId) }, favourites: { title: 'Favourites', reels: lib.reels.filter(r => r.favourite) },
  }
  let screen
  if (lib.loading) screen = <div className="boot hand big">Opening your library…</div>
  else if (route.name === 'reel') screen = <ReelDetail key={route.id} lib={lib} id={route.id} onBack={back} />
  else if (route.name === 'folder') screen = <FolderPage key={route.id} lib={lib} id={route.id} onOpenReel={openReel} onAdd={() => add(route.id)} onGone={back} />
  else if (route.name === 'folders') screen = <Folders lib={lib} onOpen={openFolder} />
  else if (route.name === 'settings') screen = <Settings lib={lib} email={email} />
  else screen = <LibraryView key={route.name} lib={lib} hero={route.name === 'home'} onAdd={() => add()} onOpen={openReel} onFolder={openFolder} {...lists[route.name]} />
  const active: View = route.name === 'reel' ? 'all' : route.name === 'folder' ? 'folders' : route.name
  return (
    <div className="app">
      <Sidebar view={active} setView={nav} onAdd={() => add()} />
      <main className="content">
        {lib.error && <div className="banner" role="alert"><span>{lib.error}</span><button className="linklike" onClick={lib.clearError}>Dismiss</button></div>}
        {screen}
      </main>
      {adding && <AddReelModal lib={lib} defaultFolder={adding.folderId} onClose={() => setAdding(null)} onSaved={saved} />}
      {toast && <div className="toast card" role="status"><span className="hand big">{toast}</span></div>}
    </div>
  )
}
