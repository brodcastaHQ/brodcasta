import { Plus, Trash2, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import Loading from '../../components/ui/Loading';
import { createClient } from '../../utils/client';
import { formatDate } from '../../utils/formatters';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER',
  });
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const adminClient = createClient('/api/accounts/admin');
      const response = await adminClient.get('/users?page=1&per_page=200');
      setUsers(response.data.users || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const adminClient = createClient('/api/accounts/admin');

      if (editUser) {
        const payload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) payload.password = formData.password;
        await adminClient.put(`/users/${editUser.id}`, payload);
      } else {
        await adminClient.post('/users', formData);
      }

      setShowForm(false);
      setEditUser(null);
      setFormData({ name: '', email: '', password: '', role: 'MEMBER' });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to save user.');
    }
  };

  const handleDeleteUser = async (user) => {
    const shouldDelete = window.confirm(`Delete ${user.email}?`);
    if (!shouldDelete) return;

    try {
      const adminClient = createClient('/api/accounts/admin');
      await adminClient.delete(`/users/${user.id}`);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to delete user.');
    }
  };

  const openCreate = () => {
    setEditUser(null);
    setFormData({ name: '', email: '', password: '', role: 'MEMBER' });
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowForm(true);
  };

  if (loading) {
    return <Loading fullScreen label="Loading users" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-lg font-medium text-[var(--app-text)]">Users</h1>
        <button type="button" className="button-primary text-sm px-3 py-1.5" onClick={openCreate}>
          <Plus className="mr-1 inline h-4 w-4" />
          Add user
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : null}

      {showForm && (
        <div className="mb-6 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
          <h2 className="mb-4 text-base font-semibold text-[var(--app-text)]">
            {editUser ? 'Edit user' : 'Create user'}
          </h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
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
            <div>
              <label className="block text-sm font-medium text-[var(--app-text)]">
                Password {!editUser && '(required)'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, password: event.target.value }))
                }
                className="input-shell mt-1"
                placeholder={editUser ? 'Leave blank to keep current' : ''}
                required={!editUser}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--app-text)]">Role</label>
              <select
                value={formData.role}
                onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
                className="select-shell mt-1"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" className="button-secondary flex-1" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="button-primary flex-1">
                {editUser ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)]">
        {users.length === 0 ? (
          <div className="p-8 text-center text-[var(--app-muted)]">No users</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--app-border)] text-left">
                <th className="p-3 text-xs font-medium uppercase text-[var(--app-subtle)]">User</th>
                <th className="p-3 text-xs font-medium uppercase text-[var(--app-subtle)]">Role</th>
                <th className="p-3 text-xs font-medium uppercase text-[var(--app-subtle)]">Created</th>
                <th className="p-3 text-right text-xs font-medium uppercase text-[var(--app-subtle)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--app-border)]">
                  <td className="p-3">
                    <p className="text-sm font-medium text-[var(--app-text)]">{user.name}</p>
                    <p className="text-xs text-[var(--app-muted)]">{user.email}</p>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs ${
                        user.role === 'ADMIN'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[var(--app-muted)]'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-[var(--app-muted)]">{formatDate(user.created_at)}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      className="mr-2 text-sm text-[var(--app-muted)] hover:text-[var(--app-text)]"
                      onClick={() => openEdit(user)}
                    >
                      <UserCog className="inline h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-500"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash2 className="inline h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;