import type { ReactNode } from 'react'
import type { DoodleName } from '../types'

const P: Record<string, string> = {
  home: 'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z', play: 'M7 4l13 8-13 8z',
  folder: 'M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  heart: 'M12 21s-8-5.2-8-11a4.6 4.6 0 018-3 4.6 4.6 0 018 3c0 5.8-8 11-8 11z',
  gear: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
  plus: 'M12 5v14M5 12h14', search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4', inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5',
  cup: 'M5 8h11v6a5 5 0 01-5 5h-1a5 5 0 01-5-5zM16 10h2a2 2 0 010 4h-2M8 3v2M12 3v2', bow: 'M12 12L4 7v10zM12 12l8-5v10z',
  plane: 'M21 3L3 11l7 3 3 7zM10 14L21 3', laptop: 'M5 5h14v10H5zM2 19h20',
  smile: 'M12 3a9 9 0 100 18 9 9 0 000-18zM8 10h.01M16 10h.01M8 14c1 2 7 2 8 0', mark: 'M6 3h12v18l-6-4-6 4z',
}
export const Icon = ({ name, size = 20, fill = false }: { name: string; size?: number; fill?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[name]} /></svg>
)
export const Doodle = ({ name, size = 28 }: { name: DoodleName; size?: number }) => <Icon name={name} size={size} />
export const Tape = ({ color = 'pink' }: { color?: 'pink' | 'blue' | 'lilac' | 'peach' }) => <span className={`tape tape-${color}`} aria-hidden="true" />
export const Clip = () => (
  <svg className="clip" width="22" height="46" viewBox="0 0 22 46" aria-hidden="true"><path d="M7 30V10a4 4 0 018 0v26a7 7 0 01-14 0V14" fill="none" stroke="#817BA8" strokeWidth="2.2" /></svg>
)
export const Sparkles = () => (
  <svg width="34" height="56" viewBox="0 0 44 70" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M16 2l3 11 11 3-11 3-3 11-3-11-11-3 11-3z" /><path d="M34 34l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" /><path d="M14 46l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" />
  </svg>
)
// Torn-paper surface: the ragged edge is a clipped layer behind the content.
export const Torn = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`wrap ${className}`}><div className="paper" />{children}</div>
)
