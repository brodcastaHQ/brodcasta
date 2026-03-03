import { AlertTriangle, Check, Eye, EyeOff, Key, Mail, Save, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '../../utils/client';

const AccountSettings = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Create client once
    const client = createClient('/api/accounts');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await client.get('/me');
            setUser(response.data);
            setFormData({
                name: response.data.name,
                email: response.data.email,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error(err);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const updateData = {
                name: formData.name,
                email: formData.email
            };

            // Only include password if new password is provided
            if (formData.newPassword) {
                if (!formData.currentPassword) {
                    setError('Current password is required to change password');
                    return;
                }
                if (formData.newPassword !== formData.confirmPassword) {
                    setError('New passwords do not match');
                    return;
                }
                updateData.password = formData.newPassword;
            }

            const response = await client.put('/account', updateData);
            setUser(response);
            setSuccess('Profile updated successfully!');
            
            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to update profile');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await client.delete('/account');
            // Redirect to login page after successful deletion
            window.location.href = '/login';
        } catch (err) {
            console.error(err);
            setError('Failed to delete account');
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200">
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error && !user) {
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Account Settings</h1>
                        <p className="text-base-content/60 mt-2">
                            Manage your personal account information and security settings
                        </p>
                    </div>

                    {/* Success/Error Messages */}
                    {success && (
                        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Check className="h-5 w-5 text-success" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm text-success">{success}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-error" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm text-error">{error}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Information */}
                    <div className="bg-base-100 rounded-xl border border-base-300 p-6">
                        <div className="flex items-center mb-6">
                            <User className="w-5 h-5 text-primary mr-2" />
                            <h2 className="text-lg font-semibold text-base-content">Profile Information</h2>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6" autoComplete="off">
                            <div>
                                <label className="block text-sm font-medium text-base-content mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-base-content mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="border-t border-base-300 pt-6">
                                <div className="flex items-center mb-4">
                                    <Key className="w-5 h-5 text-primary mr-2" />
                                    <h3 className="text-md font-medium text-base-content">Change Password</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-base-content mb-1">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.currentPassword}
                                                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                                className="w-full px-3 py-2 pr-10 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                placeholder="Required to change password"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-base-content/40" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-base-content/40" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-base-content mb-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                                className="w-full px-3 py-2 pr-10 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                placeholder="Leave empty to keep current"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-4 w-4 text-base-content/40" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-base-content/40" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-base-content mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                            className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="Confirm new password"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Account Information */}
                    <div className="bg-base-100 rounded-xl border border-base-300 p-6">
                        <div className="flex items-center mb-6">
                            <Mail className="w-5 h-5 text-primary mr-2" />
                            <h2 className="text-lg font-semibold text-base-content">Account Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-base-300">
                                <div>
                                    <div className="text-sm font-medium text-base-content">Account Type</div>
                                    <div className="text-sm text-base-content/60">Your role in the system</div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user?.role === 'ADMIN' 
                                        ? 'bg-warning/10 text-warning' 
                                        : 'bg-success/10 text-success'
                                }`}>
                                    {user?.role}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-base-300">
                                <div>
                                    <div className="text-sm font-medium text-base-content">Member Since</div>
                                    <div className="text-sm text-base-content/60">When you joined the platform</div>
                                </div>
                                <div className="text-sm text-base-content">
                                    {user ? new Date(user.created_at).toLocaleDateString() : '—'}
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <div>
                                    <div className="text-sm font-medium text-base-content">Account Status</div>
                                    <div className="text-sm text-base-content/60">Current status of your account</div>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-base-100 rounded-xl border border-error/20 p-6">
                        <div className="flex items-center mb-4">
                            <Trash2 className="w-5 h-5 text-error mr-2" />
                            <h2 className="text-lg font-semibold text-base-content">Danger Zone</h2>
                        </div>
                        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                            <p className="text-sm text-base-content/80 mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-error rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Delete Account Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-base-100 rounded-xl border border-base-300 p-6 max-w-md w-full mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-base-content">Delete Account</h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-base-content/60 hover:text-base-content"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                                    <p className="text-sm text-base-content/80">
                                        Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-2 border border-base-300 rounded-lg text-sm font-medium text-base-content bg-base-100 hover:bg-base-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-primary-content bg-error hover:bg-error/90 transition-colors"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;
