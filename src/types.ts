export type Tone = 'peach' | 'pink' | 'lilac' | 'blue'
export type DoodleName = 'cup' | 'bow' | 'plane' | 'laptop' | 'smile' | 'mark'
export type Folder = { id: string; name: string; color: Tone; doodle: DoodleName }
export type Resource = { id: string; name: string; url: string; type: string; tried: boolean }
export type Reel = {
  id: string; url: string; shortcode: string; title: string; creator: string
  notes: string; folderId: string | null; favourite: boolean; savedAt: string
  resources: Resource[]
  coverPath?: string // storage path of the optional cover image the user added
  thumbnailUrl?: string // short-lived signed link to that image, created when the library loads
}
export type View = 'home' | 'all' | 'folders' | 'unsorted' | 'favourites' | 'settings'
export type Route = { name: View } | { name: 'reel'; id: string } | { name: 'folder'; id: string }
