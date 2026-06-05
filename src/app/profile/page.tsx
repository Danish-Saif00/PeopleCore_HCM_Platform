'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Eye, EyeOff, LockKeyhole, Printer, UserRound } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/formatters';
import { getRoleColor } from '@/lib/permissions';
import { validatePasswordStrength } from '@/lib/password';
import type { Employee } from '@/types/peoplecore';

interface ProfileManager {
  id: string;
  fullName: string;
  jobTitle: string;
}

interface ProfileData {
  employee: Employee;
  manager: ProfileManager | null;
}

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function roleBadgeVariant(role: string) {
  return getRoleColor(role).replace('pc-badge-', '') as
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'muted'
    | 'info';
}

function PasswordToggle({
  visible,
  onToggle,
  label,
}: {
  visible: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${visible ? 'Hide' : 'Show'} ${label}`}
      title={`${visible ? 'Hide' : 'Show'} ${label}`}
      className="flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)]"
    >
      {visible ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );
}

export default function ProfilePage() {
  const { session, loading, refreshSession } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!loading && !session) router.push('/login');
  }, [loading, session, router]);

  useEffect(() => {
    if (!session) return;

    const loadProfile = async () => {
      setDataLoading(true);
      setProfileError('');
      try {
        const res = await fetch('/api/profile');
        const json = await res.json();
        if (!res.ok || !json.success) {
          setProfileError(json.error ?? 'Unable to load profile.');
          return;
        }
        setProfile(json.data);
        setFullName(json.data.employee.fullName);
        setPhone(json.data.employee.phone);
      } catch {
        setProfileError('Unable to load profile.');
      } finally {
        setDataLoading(false);
      }
    };

    loadProfile();
  }, [session]);

  const updateProfile = async (updates: Record<string, string>) => {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error ?? 'Unable to update profile.');
    setProfile(json.data);
    setFullName(json.data.employee.fullName);
    setPhone(json.data.employee.phone);
    await refreshSession();
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    if (!fullName.trim()) {
      setProfileError('Full name is required.');
      return;
    }

    setProfileSaving(true);
    try {
      await updateProfile({ fullName: fullName.trim(), phone: phone.trim() });
      setProfileSuccess('Personal information updated.');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Unable to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setProfileError('');
    setProfileSuccess('');
    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setProfileError('Choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setProfileError('Avatar image must be 2 MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result !== 'string') {
        setProfileError('Unable to read the selected image.');
        return;
      }
      setAvatarSaving(true);
      try {
        await updateProfile({ avatarUrl: reader.result });
        setProfileSuccess('Profile image updated.');
      } catch (error) {
        setProfileError(error instanceof Error ? error.message : 'Unable to update profile image.');
      } finally {
        setAvatarSaving(false);
      }
    };
    reader.onerror = () => setProfileError('Unable to read the selected image.');
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const validation = validatePasswordStrength(newPassword);
    if (!validation.valid) {
      setPasswordError(validation.error ?? 'New password is too weak.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Unable to update password.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setPasswordSuccess('Password updated successfully.');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Unable to update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading || dataLoading || !session || !profile) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <div
            className="w-8 h-8 rounded-full border-t-transparent"
            style={{
              animation: 'spin var(--motion-loading-spin) linear infinite',
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: 'var(--primary)',
              borderTopColor: 'transparent',
            }}
          />
          {profileError && <p className="ml-3 text-sm text-[color:var(--danger)]">{profileError}</p>}
        </div>
      </AppShell>
    );
  }

  const { employee, manager } = profile;

  return (
    <AppShell>
      <div className="profile-print-root">
        <PageHeader
          title="My Profile"
          subtitle="Review your employment details and manage your personal information."
          action={
            <Button
              variant="secondary"
              icon={<Printer size={16} />}
              onClick={() => window.print()}
              className="profile-print-hidden"
            >
              Print Profile
            </Button>
          }
        />

        <div className="space-y-6">
          <section className="pc-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative self-start">
                <Avatar name={employee.fullName} avatarUrl={employee.avatarUrl} size="xl" />
                <button
                  type="button"
                  aria-label="Change profile image"
                  title="Change profile image"
                  disabled={avatarSaving}
                  onClick={() => fileInputRef.current?.click()}
                  className="profile-print-hidden absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[color:var(--card)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-sm disabled:opacity-60"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-[color:var(--foreground)]">{employee.fullName}</h2>
                <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                  {employee.jobTitle} · {employee.department}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={roleBadgeVariant(employee.role)}>{employee.role}</Badge>
                  <StatusBadge status={employee.status} />
                </div>
              </div>
            </div>
            {(profileError || profileSuccess) && (
              <p
                className={`profile-print-hidden mt-4 rounded-lg p-3 text-sm font-medium ${
                  profileError
                    ? 'bg-[color:var(--danger-soft)] text-[color:var(--danger)]'
                    : 'bg-[color:var(--success-soft)] text-[color:var(--success)]'
                }`}
              >
                {profileError || profileSuccess}
              </p>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="pc-card p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-[color:var(--border)] pb-4">
                <UserRound size={18} className="text-[color:var(--primary)]" />
                <h2 className="card-title">Personal Information</h2>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  maxLength={100}
                  required
                />
                <Input
                  label="Phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  maxLength={30}
                />
                <Input label="Email" value={employee.email} readOnly disabled />
                <Button type="submit" loading={profileSaving} className="profile-print-hidden">
                  Save Personal Information
                </Button>
              </form>
            </section>

            <section className="pc-card p-6">
              <h2 className="card-title border-b border-[color:var(--border)] pb-4">Employment Details</h2>
              <dl className="mt-2 divide-y divide-[color:var(--border)]">
                {[
                  ['Job Title', employee.jobTitle],
                  ['Department', employee.department],
                  ['Employment Type', employee.employmentType],
                  ['Manager', manager ? `${manager.fullName} · ${manager.jobTitle}` : 'No manager assigned'],
                  ['Start Date', formatDate(employee.startDate)],
                  ['Role', employee.role],
                  ['Status', employee.status],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[minmax(110px,0.45fr)_1fr] gap-4 py-3 text-sm">
                    <dt className="text-[color:var(--muted-foreground)]">{label}</dt>
                    <dd className="font-medium text-[color:var(--foreground)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <section className="profile-print-hidden pc-card p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-[color:var(--border)] pb-4">
              <LockKeyhole size={18} className="text-[color:var(--primary)]" />
              <div>
                <h2 className="card-title">Security</h2>
                <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                  Use at least 8 characters with uppercase, lowercase, number, and special character.
                </p>
              </div>
            </div>
            <form onSubmit={handlePasswordSubmit} className="grid gap-4 md:grid-cols-3">
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                label="Current Password"
                className="pr-14"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                rightIcon={
                  <PasswordToggle
                    visible={showCurrentPassword}
                    onToggle={() => setShowCurrentPassword((visible) => !visible)}
                    label="current password"
                  />
                }
                required
              />
              <Input
                type={showNewPassword ? 'text' : 'password'}
                label="New Password"
                className="pr-14"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                rightIcon={
                  <PasswordToggle
                    visible={showNewPassword}
                    onToggle={() => setShowNewPassword((visible) => !visible)}
                    label="new password"
                  />
                }
                required
              />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm New Password"
                className="pr-14"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                rightIcon={
                  <PasswordToggle
                    visible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((visible) => !visible)}
                    label="password confirmation"
                  />
                }
                required
              />
              <div className="md:col-span-3">
                {(passwordError || passwordSuccess) && (
                  <p
                    className={`mb-4 rounded-lg p-3 text-sm font-medium ${
                      passwordError
                        ? 'bg-[color:var(--danger-soft)] text-[color:var(--danger)]'
                        : 'bg-[color:var(--success-soft)] text-[color:var(--success)]'
                    }`}
                  >
                    {passwordError || passwordSuccess}
                  </p>
                )}
                <Button type="submit" loading={passwordSaving}>
                  Update Password
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
