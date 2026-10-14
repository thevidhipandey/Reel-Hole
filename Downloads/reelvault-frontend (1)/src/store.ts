/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Folder, Reel, Resource, Tone } from './types'
import { parseInstagram } from './lib/url'

const REELS = '*, resources(*)'
const toResource = (x: any): Resource => ({ id: x.id, name: x.name, url: x.url, type: x.type, tried: x.tried })
const toFolder = (f: any): Folder => ({ id: f.id, name: f.name, color: f.color, doodle: f.doodle })
const toReel = (r: any): Reel => ({
  id: r.id, url: r.instagram_url, shortcode: r.shortcode, title: r.title, creator: r.creator, notes: r.notes,
  folderId: r.folder_id, favourite: r.favourite, savedAt: r.saved_at, thumbnailUrl: r.thumbnail_url ?? undefined,
  resources: ((r.resources ?? []) as any[]).sort((a, b) => String(a.created_at).localeCompare(String(b.created_at))).map(toResource),
})
export type NewReel = { url: string; title: string; creator: string; notes: string; folderId: string | null }
export type Result = { ok: true } | { ok: false; error: string }

// Screens update instantly; the database write follows. If a write fails we show a message and reload from the database.
export function useLibrary() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const timers = useRef<Record<string, number>>({})
  const pending = useRef<Record<string, Record<string, unknown>>>({})

  const load = async () => {
    const [f, r] = await Promise.all([
      supabase.from('folders').select('*').order('created_at'),
      supabase.from('reels').select(REELS).order('saved_at', { ascending: false }),
    ])
    if (f.error || r.error) setError("Couldn't load your library. Check your connection and refresh.")
    else { setFolders(f.data.map(toFolder)); setReels(r.data.map(toReel)) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])
  const fail = (msg: string) => { setError(msg); load() }

  const addReel = async (i: NewReel): Promise<Result> => {
    const p = parseInstagram(i.url)
    if (!p.ok) return p
    if (reels.some(x => x.shortcode === p.shortcode)) return { ok: false, error: 'You already saved this reel.' }
    const { data, error: e } = await supabase.from('reels').insert({
      instagram_url: p.url, shortcode: p.shortcode, title: i.title.trim(), creator: i.creator.trim().replace(/^@/, ''),
      notes: i.notes.trim(), folder_id: i.folderId,
    }).select(REELS).single()
    if (e) return { ok: false, error: e.code === '23505' ? 'You already saved this reel.' : "Couldn't save that. Check your connection and try again." }
    setReels(x => [toReel(data), ...x])
    return { ok: true }
  }
  const flush = async (id: string) => {
    const patch = pending.current[id]
    delete pending.current[id]; delete timers.current[id]
    if (!patch) return
    const { error: e } = await supabase.from('reels').update(patch).eq('id', id)
    if (e) fail("Couldn't save your changes. They may not have been kept.")
  }
  // Typing in notes/title would otherwise send a request per keystroke, so writes are batched for 0.6s.
  const updateReel = (id: string, p: Partial<Reel>) => {
    setReels(x => x.map(v => (v.id === id ? { ...v, ...p } : v)))
    const db: Record<string, unknown> = {}
    if (p.title !== undefined) db.title = p.title
    if (p.creator !== undefined) db.creator = p.creator
    if (p.notes !== undefined) db.notes = p.notes
    if (p.favourite !== undefined) db.favourite = p.favourite
    if (p.folderId !== undefined) db.folder_id = p.folderId
    if (!Object.keys(db).length) return
    pending.current[id] = { ...pending.current[id], ...db }
    window.clearTimeout(timers.current[id])
    timers.current[id] = window.setTimeout(() => flush(id), 600)
  }
  const toggleFav = (id: string) => { const cur = reels.find(r => r.id === id); if (cur) updateReel(id, { favourite: !cur.favourite }) }
  const deleteReel = async (id: string) => {
    setReels(x => x.filter(v => v.id !== id))
    const { error: e } = await supabase.from('reels').delete().eq('id', id)
    if (e) fail("Couldn't delete that reel.")
  }
  const addFolder = async (name: string) => {
    const tones: Tone[] = ['peach', 'pink', 'lilac', 'blue']
    const { data, error: e } = await supabase.from('folders').insert({ name: name.trim().slice(0, 60), color: tones[folders.length % 4] }).select().single()
    if (e) setError("Couldn't create that folder."); else setFolders(x => [...x, toFolder(data)])
  }
  const renameFolder = async (id: string, name: string) => {
    setFolders(x => x.map(f => (f.id === id ? { ...f, name: name.trim() } : f)))
    const { error: e } = await supabase.from('folders').update({ name: name.trim() }).eq('id', id)
    if (e) fail("Couldn't rename that folder.")
  }
  // The database sets folder_id to null for its reels, so deleting a folder never deletes reels.
  const deleteFolder = async (id: string) => {
    setFolders(x => x.filter(f => f.id !== id))
    setReels(x => x.map(v => (v.folderId === id ? { ...v, folderId: null } : v)))
    const { error: e } = await supabase.from('folders').delete().eq('id', id)
    if (e) fail("Couldn't delete that folder.")
  }
  const addResource = async (reelId: string, r: { name: string; url: string; type: string }): Promise<boolean> => {
    const { data, error: e } = await supabase.from('resources').insert({ reel_id: reelId, ...r }).select().single()
    if (e) return false
    setReels(x => x.map(v => (v.id === reelId ? { ...v, resources: [...v.resources, toResource(data)] } : v)))
    return true
  }
  const setResourceTried = async (reelId: string, rid: string, tried: boolean) => {
    setReels(x => x.map(v => (v.id === reelId ? { ...v, resources: v.resources.map(r => (r.id === rid ? { ...r, tried } : r)) } : v)))
    const { error: e } = await supabase.from('resources').update({ tried }).eq('id', rid)
    if (e) fail("Couldn't update that resource.")
  }
  const deleteResource = async (reelId: string, rid: string) => {
    setReels(x => x.map(v => (v.id === reelId ? { ...v, resources: v.resources.filter(r => r.id !== rid) } : v)))
    const { error: e } = await supabase.from('resources').delete().eq('id', rid)
    if (e) fail("Couldn't delete that resource.")
  }
  return { folders, reels, loading, error, clearError: () => setError(''), addReel, toggleFav, updateReel, deleteReel, addFolder, renameFolder, deleteFolder, addResource, setResourceTried, deleteResource }
}
export type Library = ReturnType<typeof useLibrary>
