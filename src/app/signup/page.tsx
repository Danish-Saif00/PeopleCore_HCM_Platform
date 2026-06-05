'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = 'Company name is required.';
    if (!form.email.trim()) e.email = 'Work email is required.';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        sessionStorage.setItem('verification_code', data.verificationCode ?? '123456');
        sessionStorage.setItem('signup_email', form.email);
        router.push('/verify-email');
      } else {
        setErrors({ email: data.error ?? 'Signup failed.' });
      }
    } catch {
      setLoading(false);
      setErrors({ email: 'Network error. Please try again.' });
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
            <Logo variant="dark-horizontal-short" size="md" priority />
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-1">
          Start your free trial
        </h1>
        <p className="text-sm text-[color:var(--muted-foreground)] mb-8">
          No credit card required. Up and running in minutes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="company-name"
            label="Company Name"
            value={form.companyName}
            onChange={(e) => {
              set('companyName', e.target.value);
              setErrors((p) => ({ ...p, companyName: '' }));
            }}
            error={errors.companyName}
            placeholder="Acme Corp"
            autoFocus
          />
          <Input
            id="signup-email"
            type="email"
            label="Work Email"
            value={form.email}
            onChange={(e) => {
              set('email', e.target.value);
              setErrors((p) => ({ ...p, email: '' }));
            }}
            error={errors.email}
            placeholder="you@company.com"
            autoComplete="email"
          />
          <Input
            id="signup-password"
            type={showPwd ? 'text' : 'password'}
            label="Password"
            value={form.password}
            onChange={(e) => {
              set('password', e.target.value);
              setErrors((p) => ({ ...p, password: '' }));
            }}
            error={errors.password}
            placeholder="Min 8 characters"
            autoComplete="new-password"
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
            id="confirm-password"
            type="password"
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => {
              set('confirmPassword', e.target.value);
              setErrors((p) => ({ ...p, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
            placeholder="Repeat password"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            id="signup-submit"
          >
            Create Account
          </Button>
        </form>

        <p className="text-xs text-[color:var(--muted-foreground)] text-center mt-4 leading-relaxed">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="underline" style={{ color: 'var(--primary)' }}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline" style={{ color: 'var(--primary)' }}>
            Privacy Policy
          </Link>
          .
        </p>

        <p className="text-center text-sm text-[color:var(--muted-foreground)] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: 'var(--primary)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
