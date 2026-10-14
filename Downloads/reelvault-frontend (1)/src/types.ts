export type Tone = 'peach' | 'pink' | 'lilac' | 'blue'
export type DoodleName = 'cup' | 'bow' | 'plane' | 'laptop' | 'smile' | 'mark'
export type Folder = { id: string; name: string; color: Tone; doodle: DoodleName }
export type Resource = { id: string; name: string; url: string; type: string; tried: boolean }
export type Reel = {
  id: string; url: string; shortcode: string; title: string; creator: string
  notes: string; folderId: string | null; favourite: boolean; savedAt: string
  resources: Resource[]
  thumbnailUrl?: string // filled automatically later (never typed in by the user)
}
export type View = 'home' | 'all' | 'folders' | 'unsorted' | 'favourites' | 'settings'
export type Route = { name: View } | { name: 'reel'; id: string } | { name: 'folder'; id: string }
