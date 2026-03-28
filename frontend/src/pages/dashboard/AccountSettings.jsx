import { Eye, EyeOff, KeyRound, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import Loading from '../../components/ui/Loading';
import { Field, KeyValue, PageHeader, SectionHeader, StatusBadge, Surface } from '../../components/ui/System';
import { createClient } from '../../utils/client';
import { formatDate } from '../../utils/formatters';

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmDeleteValue, setConfirmDeleteValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const client = createClient('/api/accounts');
        const response = await client.get('/me');
        setUser(response.data);
        setFormData((current) => ({
          ...current,
          name: response.data.name,
          email: response.data.email,
        }));
      } catch (err) {
        console.error(err);
        setError('Failed to load account details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const client = createClient('/api/accounts');
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setError('Current password is required before you can set a new one.');
          return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
          setError('The new password and confirmation do not match.');
          return;
        }

        updateData.password = formData.newPassword;
      }

      const response = await client.put('/account', updateData);
      setUser(response.data);
      setSuccess('Account settings saved.');
      setFormData((current) => ({
        ...current,
        name: response.data.name,
        email: response.data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to update your account.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const client = createClient('/api/accounts');
      await client.delete('/account');
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      setError('Failed to delete account.');
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <Loading fullScreen label="Loading account settings" />;
  }

  if (!user) {
    return (
      <Surface className="rounded-[2rem] p-8">
        <p className="text-lg font-semibold text-white">Account data unavailable</p>
        <p className="mt-2 text-[var(--app-muted)]">{error || 'Please try again in a moment.'}</p>
      </Surface>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account Settings"
        title="Personal details, passwords, and destructive actions."
        description="This page now keeps profile updates, password changes, and account deletion in one cleaner flow with better visual separation."
        meta={
          <>
            <StatusBadge tone="info">{user.role}</StatusBadge>
            <StatusBadge tone="neutral">Joined {formatDate(user.created_at)}</StatusBadge>
          </>
        }
      />

      {success ? (
        <div className="rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-50">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="rounded-[2rem] p-6 sm:p-8">
          <form className="space-y-8" onSubmit={handleUpdateProfile}>
            <SectionHeader
              eyebrow="Profile"
              title="Identity and login details"
              description="Keep your name and email current so project ownership and audit trails stay readable."
            />

            <Field htmlFor="account-name" label="Name">
              <input
                id="account-name"
                type="text"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                className="input-shell"
                required
              />
            </Field>

            <Field htmlFor="account-email" label="Email address">
              <input
                id="account-email"
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                className="input-shell"
                required
              />
            </Field>

            <div className="space-y-5 rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
              <SectionHeader
                eyebrow="Password"
                title="Update your password"
                description="Leave these fields blank if you only want to update profile details."
              />

              <Field htmlFor="account-current-password" label="Current password">
                <div className="relative">
                  <input
                    id="account-current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, currentPassword: event.target.value }))
                    }
                    className="input-shell pr-12"
                    placeholder="Required to change password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--app-muted)]"
                    onClick={() => setShowCurrentPassword((value) => !value)}
                    aria-label="Toggle current password visibility"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field htmlFor="account-new-password" label="New password">
                  <div className="relative">
                    <input
                      id="account-new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, newPassword: event.target.value }))
                      }
                      className="input-shell pr-12"
                      placeholder="Set a new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--app-muted)]"
                      onClick={() => setShowNewPassword((value) => !value)}
                      aria-label="Toggle new password visibility"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                <Field htmlFor="account-confirm-password" label="Confirm new password">
                  <input
                    id="account-confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                    className="input-shell"
                    placeholder="Repeat the new password"
                  />
                </Field>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="button-primary">
                Save account settings
              </button>
            </div>
          </form>
        </Surface>

        <div className="space-y-6">
          <Surface tone="highlight" className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Account Summary"
              title="Context for this identity"
              description="Quick metadata so you can sanity-check which account is currently active."
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/18 bg-cyan-400/10 text-cyan-200">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <KeyValue label="Name" value={user.name} />
                  <KeyValue label="Email" value={user.email} />
                  <KeyValue label="Role" value={user.role} />
                  <KeyValue label="Created" value={formatDate(user.created_at)} />
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/18 bg-emerald-400/10 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Credential hygiene</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                    Use a unique password for this control panel. If you suspect exposure, update it here
                    before rotating project secrets.
                  </p>
                </div>
              </div>
            </div>
          </Surface>

          <Surface tone="danger" className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Danger Zone"
              title="Delete this account"
              description="This removes the current account and clears the active session."
            />

            <div className="mt-6 space-y-4">
              <p className="text-sm leading-7 text-[var(--app-muted)]">
                Type <span className="font-semibold text-white">{user.email}</span> to confirm the
                deletion of this account.
              </p>

              {!showDeleteConfirm ? (
                <button type="button" className="button-secondary" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="h-4 w-4" />
                  Reveal delete confirmation
                </button>
              ) : (
                <div className="space-y-4">
                  <Field htmlFor="delete-account-email" label="Confirm email">
                    <input
                      id="delete-account-email"
                      type="text"
                      value={confirmDeleteValue}
                      onChange={(event) => setConfirmDeleteValue(event.target.value)}
                      className="input-shell"
                      placeholder={user.email}
                    />
                  </Field>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setConfirmDeleteValue('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button-primary"
                      onClick={handleDeleteAccount}
                      disabled={confirmDeleteValue !== user.email}
                    >
                      Permanently delete account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
