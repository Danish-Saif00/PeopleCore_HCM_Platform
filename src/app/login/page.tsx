'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const demoCredentials = [
    { label: 'Super Admin', email: 'aaron.loeb@peoplecore-demo.com', password: 'Demo@12345' },
    { label: 'HR Admin', email: 'halima.fayed@peoplecore-demo.com', password: 'Demo@12345' },
    { label: 'Manager', email: 'jane.cooper@peoplecore-demo.com', password: 'Demo@12345' },
    { label: 'Employee', email: 'john.doe@peoplecore-demo.com', password: 'Demo@12345' },
  ];

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = 'Email is required.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      if (result.locked) setLocked(true);
      if (result.remainingAttempts !== undefined) setRemaining(result.remainingAttempts);
      setError(result.error ?? 'Login failed.');
    }
  };

  const fillDemo = (cred: { email: string; password: string }) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
    setErrors({});
    setLocked(false);
    setRemaining(null);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Left panel - branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1f19 0%, #1a3a2a 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 70%, rgba(24,166,109,0.2) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(47,128,237,0.1) 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 flex flex-col p-12 justify-between w-full motion-fade-in">
          <div className="flex items-center gap-3">
            <Logo variant="dark-horizontal-short" size="md" priority />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Welcome back to
              <br />
              <span style={{ color: '#34c987' }}>PeopleCore HCM</span>
            </h1>
            <p className="text-white/60 text-lg">
              The modern HR platform that actually works for your team.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { n: '8', l: 'Employees' },
                { n: '3', l: 'Departments' },
                { n: '5', l: 'Roles' },
                { n: '100%', l: 'Cloud-based' },
              ].map((s) => (
                <div
                  key={s.l}
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <p className="text-2xl font-bold" style={{ color: '#34c987' }}>
                    {s.n}
                  </p>
                  <p className="text-white/50 text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md motion-slide-up">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center lg:hidden">
            <Link href="/" aria-label="PeopleCore home">
              <Logo
                variant="light-horizontal-short"
                size="sm"
                priority
                className="theme-logo-light"
              />
              <Logo
                variant="dark-horizontal-short"
                size="sm"
                priority
                className="theme-logo-dark"
              />
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-[color:var(--foreground)] mb-1">
            Sign in to your account
          </h2>
          <p className="text-sm text-[color:var(--muted-foreground)] mb-8">
            Use the demo credentials below to explore any role.
          </p>

          {/* Demo credentials */}
          <div
            className="mb-6 p-4 rounded-xl border border-[color:var(--border)]"
            style={{ background: 'var(--muted)' }}
          >
            <p className="text-xs font-semibold text-[color:var(--muted-foreground)] mb-3 uppercase tracking-wide">
              Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.label}
                  type="button"
                  onClick={() => fillDemo(cred)}
                  className="text-left p-2.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] hover:border-[color:var(--primary)] hover:bg-[color:var(--primary-soft)] transition-all text-xs"
                >
                  <span className="font-semibold block" style={{ color: 'var(--primary)' }}>
                    {cred.label}
                  </span>
                  <span className="text-[color:var(--muted-foreground)] truncate block">
                    {cred.email.split('@')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="login-email"
              type="email"
              label="Work Email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: '' }));
              }}
              error={errors.email}
              autoComplete="email"
              autoFocus
            />

            <Input
              id="login-password"
              type={showPwd ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: '' }));
              }}
              error={errors.password}
              autoComplete="current-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="hover:opacity-70 text-[color:var(--muted-foreground)]"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {error && (
              <div
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: locked ? 'var(--danger-soft)' : 'var(--warning-soft)' }}
              >
                {locked ? (
                  <Lock
                    size={16}
                    style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }}
                  />
                ) : (
                  <AlertCircle
                    size={16}
                    style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }}
                  />
                )}
                <div>
                  <p
                    className="text-sm"
                    style={{ color: locked ? 'var(--danger)' : 'var(--warning)' }}
                  >
                    {error}
                  </p>
                  {remaining !== null && remaining > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {remaining} attempt{remaining !== 1 ? 's' : ''} remaining.
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
              disabled={locked}
              id="login-submit"
            >
              Sign In
            </Button>
          </form>

          {/* Google SSO */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs text-[color:var(--muted-foreground)]">or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] text-sm font-medium text-[color:var(--foreground)] hover:bg-[color:var(--muted)] transition-colors"
            onClick={() => alert('Google Workspace SSO is mocked in this demo.')}
            id="google-sso"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google Workspace
          </button>

          <p className="text-center text-sm text-[color:var(--muted-foreground)] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium" style={{ color: 'var(--primary)' }}>
              Start free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
