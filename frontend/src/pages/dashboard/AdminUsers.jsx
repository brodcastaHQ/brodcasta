import { Plus, Search, ShieldCheck, Trash2, UserCog } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react';
import Loading from '../../components/ui/Loading';
import { Field, PageHeader, SectionHeader, StatusBadge, Surface } from '../../components/ui/System';
import { createClient } from '../../utils/client';
import { formatDate } from '../../utils/formatters';

const USERS_PER_PAGE = 8;

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'MEMBER',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState('create');
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const deferredSearch = useDeferredValue(searchTerm.trim().toLowerCase());

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const adminClient = createClient('/api/accounts/admin');
      const response = await adminClient.get('/users?page=1&per_page=200');
      setUsers(response.data.users || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = !deferredSearch
    ? users
    : users.filter((user) =>
        [user.name, user.email, user.role].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(deferredSearch),
        ),
      );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearch]);

  const openCreatePanel = () => {
    setMode('create');
    setSelectedUser(null);
    setFormData(initialForm);
    setPanelOpen(true);
  };

  const openEditPanel = (user) => {
    setMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setPanelOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const adminClient = createClient('/api/accounts/admin');

      if (mode === 'create') {
        await adminClient.post('/users', formData);
      } else if (selectedUser) {
        const payload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };

        if (formData.password) payload.password = formData.password;
        await adminClient.put(`/users/${selectedUser.id}`, payload);
      }

      setPanelOpen(false);
      setFormData(initialForm);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to save user.');
    }
  };

  const handleDeleteUser = async (user) => {
    const shouldDelete = window.confirm(`Delete ${user.email}? This cannot be undone.`);
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

  if (loading) {
    return <Loading fullScreen label="Loading users" />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="User management without the visual clutter."
        description="This redesign replaces the old dense table-and-modal flow with a searchable, cleaner admin surface and a focused side editor."
        actions={
          <button type="button" className="button-primary" onClick={openCreatePanel}>
            <Plus className="h-4 w-4" />
            Add user
          </button>
        }
      />

      {error ? (
        <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface className="rounded-[2rem] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              eyebrow="Directory"
              title="Workspace users"
              description="Search current members and adjust their roles from the editor panel."
            />

            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-subtle)]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="input-shell pl-11"
                placeholder="Search users"
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/8">
            <div className="overflow-x-auto">
              <table className="table-shell min-w-full bg-transparent">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="space-y-1">
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-sm text-[var(--app-muted)]">{user.email}</p>
                        </div>
                      </td>
                      <td>
                        <StatusBadge tone={user.role === 'ADMIN' ? 'warning' : 'info'}>
                          {user.role}
                        </StatusBadge>
                      </td>
                      <td className="text-sm text-[var(--app-muted)]">{formatDate(user.created_at)}</td>
                      <td>
                        <div className="flex justify-end gap-3">
                          <button type="button" className="button-secondary" onClick={() => openEditPanel(user)}>
                            <UserCog className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="button-ghost text-rose-200 hover:bg-rose-400/10 hover:text-rose-100"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-[var(--app-muted)]">
                        No users match the current search.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--app-muted)]">
              Showing {paginatedUsers.length} of {filteredUsers.length} users
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="button-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="button-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </Surface>

        <Surface tone={panelOpen ? 'highlight' : 'muted'} className="rounded-[2rem] p-6">
          <SectionHeader
            eyebrow="Editor"
            title={panelOpen ? (mode === 'create' ? 'Create user' : 'Edit user') : 'Select an action'}
            description={
              panelOpen
                ? 'Use controlled fields so role changes and credential updates stay explicit.'
                : 'Open the panel to create a new user or edit an existing account.'
            }
          />

          {panelOpen ? (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <Field htmlFor="admin-name" label="Name">
                <input
                  id="admin-name"
                  type="text"
                  className="input-shell"
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </Field>

              <Field htmlFor="admin-email" label="Email address">
                <input
                  id="admin-email"
                  type="email"
                  className="input-shell"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </Field>

              <Field
                htmlFor="admin-password"
                label={mode === 'create' ? 'Password' : 'New password'}
                hint={mode === 'edit' ? 'Leave blank to keep the current password.' : null}
              >
                <input
                  id="admin-password"
                  type="password"
                  className="input-shell"
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  required={mode === 'create'}
                />
              </Field>

              <Field htmlFor="admin-role" label="Role">
                <select
                  id="admin-role"
                  className="select-shell"
                  value={formData.role}
                  onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" className="button-secondary" onClick={() => setPanelOpen(false)}>
                  Close
                </button>
                <button type="submit" className="button-primary">
                  {mode === 'create' ? 'Create user' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/18 bg-emerald-400/10 text-emerald-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Admin safety</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">
                      Role changes are visible inline and destructive actions stay separate from form submission.
                    </p>
                  </div>
                </div>
              </div>
              <button type="button" className="button-primary w-full" onClick={openCreatePanel}>
                <Plus className="h-4 w-4" />
                Create user
              </button>
            </div>
          )}
        </Surface>
      </div>
    </div>
  );
};

export default AdminUsers;
