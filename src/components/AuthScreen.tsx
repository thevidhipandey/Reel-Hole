import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Sparkles, Tape, Torn } from './Scrap'

type Mode = 'login' | 'signup' | 'forgot' | 'recover'
const TITLE: Record<Mode, string> = { login: 'Welcome back', signup: 'Start your library', forgot: 'Reset your password', recover: 'Choose a new password' }

export default function AuthScreen({ recover = false }: { recover?: boolean }) {
  const [mode, setMode] = useState<Mode>(recover ? 'recover' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const go = (m: Mode) => { setMode(m); setErr(''); setMsg('') }
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setMsg('')
    if (mode !== 'recover' && !email.trim()) { setErr('Enter your email.'); return }
    if (mode !== 'forgot' && password.length < 8) { setErr('Use at least 8 characters for the password.'); return }
    setBusy(true)
    let error: { message: string } | null = null
    if (mode === 'login') ({ error } = await supabase.auth.signInWithPassword({ email: email.trim(), password }))
    else if (mode === 'signup') {
      const r = await supabase.auth.signUp({ email: email.trim(), password }); error = r.error
      if (!error && !r.data.session) setMsg('Check your email to confirm your account, then log in.')
    } else if (mode === 'forgot') {
      ;({ error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin }))
      if (!error) setMsg('If that email has an account, a reset link is on its way.')
    } else {
      ;({ error } = await supabase.auth.updateUser({ password }))
      if (!error) { window.location.replace(window.location.pathname); return }
    }
    setBusy(false)
    if (error) setErr(error.message)
  }
  return (
    <div className="auth">
      <Torn className="authcard"><Tape /><Sparkles />
        <div className="brand">REEL HOLE</div>
        <p className="hand big tag">Fall into the scroll. Keep the good stuff.</p>
        <h1>{TITLE[mode]}</h1>
        <form onSubmit={submit} noValidate>
          {mode !== 'recover' && <label>Email<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label>}
          {mode !== 'forgot' && <label>{mode === 'recover' ? 'New password' : 'Password'}<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} /></label>}
          <p className="error" role="alert">{err}</p>{msg && <p className="ok" role="status">{msg}</p>}
          <button className="btn" disabled={busy}>{busy ? 'One moment…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Save new password'}</button>
        </form>
        {mode !== 'recover' && <div className="linkrow">
          {mode !== 'login' && <button className="link" onClick={() => go('login')}>Log in</button>}
          {mode !== 'signup' && <button className="link" onClick={() => go('signup')}>Create an account</button>}
          {mode === 'login' && <button className="link" onClick={() => go('forgot')}>Forgot password?</button>}
        </div>}
      </Torn>
    </div>
  )
}
