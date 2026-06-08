'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';

export default function InvitePage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token') ?? '');
  }, []);

  const validate = () => {
    const errs: typeof errors = {};
    if (!password || password.length < 8)
      errs.password = 'Password must be at least 8 characters.';
    if (password !== confirm) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json();
      setLoading(false);
      if (result.success) router.push('/dashboard');
      else setErrors({ password: result.error ?? 'Unable to accept invitation.' });
    } catch {
      setLoading(false);
      setErrors({ password: 'Network error. Please try again.' });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--background)' }}
    >
      <div className="w-full max-w-md motion-slide-up">
        <div className="mb-8 flex items-center">
          <Link href="/" aria-label="PeopleCore home">
            <Logo variant="light-horizontal-short" size="sm" priority />
          </Link>
        </div>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'var(--primary-soft)' }}
        >
          <UserPlus size={26} style={{ color: 'var(--primary)' }} />
        </div>

        <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-1">
          Accept Invitation
        </h1>
        <p className="text-sm text-[color:var(--muted-foreground)] mb-8">
          You&apos;ve been invited to join{' '}
          <strong className="text-[color:var(--foreground)]">PeopleCore Demo Inc.</strong>
          <br />
          Set your password to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="invite-password"
            type={showPwd ? 'text' : 'password'}
            label="New Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((p) => ({ ...p, password: '' }));
            }}
            error={errors.password}
            placeholder="Min 8 characters"
            autoComplete="new-password"
            autoFocus
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
          <Input
            id="invite-confirm"
            type={showConfirm ? 'text' : 'password'}
            label="Confirm Password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setErrors((p) => ({ ...p, confirm: '' }));
            }}
            error={errors.confirm}
            placeholder="Repeat password"
            autoComplete="new-password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="hover:opacity-70 text-[color:var(--muted-foreground)]"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {/* Password strength hint */}
          <div
            className="text-xs text-[color:var(--muted-foreground)] px-1 space-y-1"
          >
            <p className={password.length >= 8 ? 'text-[color:var(--success)]' : ''}>
              {password.length >= 8 ? '✓' : '○'} At least 8 characters
            </p>
            <p className={/[A-Z]/.test(password) ? 'text-[color:var(--success)]' : ''}>
              {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
            </p>
            <p className={/[0-9]/.test(password) ? 'text-[color:var(--success)]' : ''}>
              {/[0-9]/.test(password) ? '✓' : '○'} One number
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            id="accept-invite"
          >
            Set Password &amp; Join
          </Button>
        </form>
      </div>
    </div>
  );
}
