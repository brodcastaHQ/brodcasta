import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Loading from '../../components/ui/Loading';
import { createClient } from '../../utils/client';

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
        setError('Failed to load account.');
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
          setError('Current password required.');
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        updateData.password = formData.newPassword;
      }

      const response = await client.put('/account', updateData);
      setUser(response.data);
      setSuccess('Saved.');
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
      setError(err.response?.data?.detail || 'Failed to update.');
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
    return <Loading fullScreen label="Loading" />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--app-muted)]">{error || 'Account unavailable'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-[var(--app-text)]">Settings</h1>
      <p className="text-sm text-[var(--app-muted)]">{user.role}</p>

      <form className="mt-6 space-y-4" onSubmit={handleUpdateProfile}>
        {success ? (
          <div className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-600 dark:text-green-400">
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-[var(--app-text)]">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            className="input-shell mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--app-text)]">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            className="input-shell mt-1"
            required
          />
        </div>

        <div className="border-t border-[var(--app-border)] pt-4">
          <p className="mb-3 text-sm font-medium text-[var(--app-text)]">Change password</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[var(--app-text)]">Current password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, currentPassword: event.target.value }))
                  }
                  className="input-shell mt-1 pr-10"
                  placeholder="Required to change password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 translate-y-1 text-[var(--app-muted)]"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[var(--app-text)]">New password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, newPassword: event.target.value }))
                  }
                  className="input-shell mt-1"
                  placeholder="New password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--app-text)]">Confirm</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  className="input-shell mt-1"
                  placeholder="Confirm"
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="button-primary w-full">
          Save
        </button>
      </form>

      <div className="mt-8 border-t border-[var(--app-border)] pt-6">
        <p className="mb-3 text-sm font-medium text-[var(--app-text)]">Danger zone</p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            className="button-secondary w-full text-red-600"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="mr-2 inline h-4 w-4" />
            Delete account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-[var(--app-muted)]">
              Type <span className="font-medium">{user.email}</span> to confirm.
            </p>
            <input
              type="text"
              value={confirmDeleteValue}
              onChange={(event) => setConfirmDeleteValue(event.target.value)}
              className="input-shell"
              placeholder={user.email}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="button-secondary flex-1"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmDeleteValue('');
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button-primary flex-1"
                onClick={handleDeleteAccount}
                disabled={confirmDeleteValue !== user.email}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;