'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [email, setEmail] = useState('');
  const [storedCode, setStoredCode] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(sessionStorage.getItem('signup_email') ?? '');
      setStoredCode(sessionStorage.getItem('verification_code') ?? '123456');
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const handleCodeChange = (idx: number, val: string) => {
    // Only allow digits
    const digit = val.replace(/\D/g, '').slice(-1);
    const newCode = [...code];
    newCode[idx] = digit;
    setCode(newCode);
    setError('');
    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!code[idx] && idx > 0) {
        const newCode = [...code];
        newCode[idx - 1] = '';
        setCode(newCode);
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newCode = ['', '', '', '', '', ''];
      pasted.split('').forEach((ch, i) => { newCode[i] = ch; });
      setCode(newCode);
      const focusIdx = Math.min(pasted.length, 5);
      inputRefs.current[focusIdx]?.focus();
    }
  };

  const handleVerify = () => {
    const entered = code.join('');
    if (entered === storedCode || entered === '123456') {
      setVerified(true);
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setError('Invalid verification code. Please check your email.');
    }
  };

  const handleResend = () => {
    setTimeLeft(15 * 60);
    setCode(['', '', '', '', '', '']);
    setError('');
    // In a real app, trigger a new code to be sent
    // For demo: reset to the stored code
    const newCode = '123456';
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('verification_code', newCode);
      setStoredCode(newCode);
    }
    inputRefs.current[0]?.focus();
  };

  if (verified) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--background)' }}
      >
        <div className="text-center motion-slide-up">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--success-soft)' }}
          >
            <CheckCircle size={36} style={{ color: 'var(--success)' }} />
          </div>
          <h2 className="text-2xl font-bold text-[color:var(--foreground)] mb-2">
            Email Verified!
          </h2>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--background)' }}
    >
      <div className="w-full max-w-md text-center motion-slide-up">
        <Link href="/" aria-label="PeopleCore home" className="mb-8 inline-flex">
          <Logo variant="light-vertical-short" size="sm" priority />
        </Link>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--primary-soft)' }}
        >
          <Mail size={28} style={{ color: 'var(--primary)' }} />
        </div>

        <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-2">
          Check your email
        </h1>
        <p className="text-sm text-[color:var(--muted-foreground)] mb-2">
          We sent a 6-digit code to{' '}
          <strong className="text-[color:var(--foreground)]">{email || 'your email'}</strong>
        </p>
        <p
          className="text-sm mb-8 font-medium"
          style={{ color: timeLeft < 60 ? 'var(--danger)' : 'var(--muted-foreground)' }}
        >
          Code expires in {mins}:{secs.toString().padStart(2, '0')}
        </p>

        {/* OTP inputs */}
        <div className="flex gap-2 justify-center mb-6">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all focus:ring-2"
              style={{
                borderColor: error
                  ? 'var(--danger)'
                  : digit
                  ? 'var(--primary)'
                  : 'var(--border)',
                background: 'var(--card)',
                color: 'var(--foreground)',
                // @ts-expect-error css variable
                '--tw-ring-color': 'var(--primary)',
              }}
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm mb-4" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        )}

        {/* Demo hint */}
        <div
          className="inline-block text-xs text-[color:var(--muted-foreground)] mb-6 px-3 py-2 rounded-lg"
          style={{ background: 'var(--muted)' }}
        >
          Demo hint: use code{' '}
          <code
            className="font-mono font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'var(--card)', color: 'var(--primary)' }}
          >
            123456
          </code>
        </div>

        <Button
          onClick={handleVerify}
          className="w-full"
          size="lg"
          disabled={code.some((d) => !d) || timeLeft <= 0}
          id="verify-code"
        >
          Verify Email
        </Button>

        <button
          className="mt-4 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: 'var(--primary)' }}
          onClick={handleResend}
          type="button"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
