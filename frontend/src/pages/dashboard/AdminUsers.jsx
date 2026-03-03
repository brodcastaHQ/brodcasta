import { AlertTriangle, Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '../../utils/client';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER'
    });

    // Create client once
    const client = createClient('/api/accounts');
    const adminClient = createClient('/api/accounts/admin');

    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                per_page: usersPerPage,
                ...(searchTerm && { search: searchTerm })
            });
            
            const response = await adminClient.get(`/users?${params}`);
            setUsers(response.data.users);
            setTotalUsers(response.data.total);
        } catch (err) {
            console.error(err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await adminClient.post('/users', formData);
            setShowCreateModal(false);
            resetForm();
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError('Failed to create user');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await adminClient.put(`/users/${selectedUser.id}`, formData);
            setShowEditModal(false);
            resetForm();
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await adminClient.delete(`/users/${userId}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError('Failed to delete user');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'MEMBER'
        });
        setSelectedUser(null);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        });
        setShowEditModal(true);
    };

    const totalPages = Math.ceil(totalUsers / usersPerPage);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200">
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-200">
                <div className="flex items-center justify-center h-screen">
                    <div className="bg-error/10 border border-error/20 rounded-lg p-4 max-w-md mx-auto">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-error" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-error">Error</h3>
                                <div className="mt-2 text-sm text-error/80">{error}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-base-content">User Management</h1>
                            <p className="text-base-content/60 mt-2">
                                Manage system users and their roles
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowCreateModal(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-base-100 rounded-xl border border-base-300 p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-base-200 border-b border-base-300">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-base-content/60 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-300">
                                    {users?.map((user) => (
                                        <tr key={user.id} className="hover:bg-base-200/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-base-content">{user.name}</div>
                                                    <div className="text-sm text-base-content/60">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    user.role === 'ADMIN' 
                                                        ? 'bg-warning/10 text-warning' 
                                                        : 'bg-success/10 text-success'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/60">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="text-base-content/60 hover:text-base-content mr-3"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-error/60 hover:text-error"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-base-200 px-4 py-3 border-t border-base-300">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-base-content/60">
                                        Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} results
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 border border-base-300 rounded-md text-sm text-base-content/60 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 border border-base-300 rounded-md text-sm text-base-content/60 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Create User Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-base-100 rounded-xl border border-base-300 p-6 max-w-md w-full mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-base-content">Create New User</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-base-content/60 hover:text-base-content"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="MEMBER">Member</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 border border-base-300 rounded-lg text-sm font-medium text-base-content bg-base-100 hover:bg-base-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors"
                                    >
                                        Create User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-base-100 rounded-xl border border-base-300 p-6 max-w-md w-full mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-base-content">Edit User</h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-base-content/60 hover:text-base-content"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">New Password (leave empty to keep current)</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="MEMBER">Member</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 border border-base-300 rounded-lg text-sm font-medium text-base-content bg-base-100 hover:bg-base-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors"
                                    >
                                        Update User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
