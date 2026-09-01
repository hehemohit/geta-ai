import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Users as UsersIcon, Plus, Building2, AlertCircle,
  RefreshCw, X,
} from 'lucide-react';
import useUsers from '../hooks/useUsers';
import SearchFilter from '../components/SearchFilter';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import UserDetailModal from '../components/UserDetailModal';
import ConfirmationModal from '../components/ConfirmationModal';

/* ── Error Banner ───────────────────────────────────────────────── */
const ErrorBanner = ({ message, onRetry, onDismiss }) => (
  <div className="flex items-center justify-between gap-4 p-4 mb-6 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300">
    <div className="flex items-center gap-3">
      <AlertCircle size={20} className="text-rose-400 shrink-0" />
      <div>
        <p className="text-sm font-medium text-rose-200">Failed to load users</p>
        <p className="text-xs text-rose-300/80">{message}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-900/60 hover:bg-rose-900 border border-rose-700 text-rose-200 transition-colors cursor-pointer"
      >
        <RefreshCw size={13} />
        <span>Retry</span>
      </button>
      <button
        onClick={onDismiss}
        className="p-1.5 rounded-lg hover:bg-rose-900/60 text-rose-300 transition-colors cursor-pointer"
        aria-label="Dismiss error banner"
      >
        <X size={14} />
      </button>
    </div>
  </div>
);

/**
 * Users — Main dashboard view orchestrating CRUD operations, toasts, search/filter, and pagination.
 */
const Users = () => {
  const {
    users,
    paginatedUsers,
    companies,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    companyFilter,
    setCompanyFilter,
    sortBy,
    setSortBy,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setCurrentPage,
    addUser,
    editUser,
    removeUser,
    retryLoad,
  } = useUsers(6);

  // ── Modal state ───────────────────────────────────────────────────
  const [formModal, setFormModal] = useState({ open: false, user: null });
  const [detailModal, setDetailModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);

  // ── Modal Openers & Closers ───────────────────────────────────────
  const openCreateForm = useCallback(() => setFormModal({ open: true, user: null }), []);
  const openEditForm = useCallback((user) => setFormModal({ open: true, user }), []);
  const closeForm = useCallback(() => setFormModal({ open: false, user: null }), []);

  const openDetail = useCallback((user) => setDetailModal({ open: true, user }), []);
  const closeDetail = useCallback(() => setDetailModal({ open: false, user: null }), []);

  const openDelete = useCallback((user) => setDeleteModal({ open: true, user }), []);
  const closeDelete = useCallback(() => setDeleteModal({ open: false, user: null }), []);

  // ── CRUD Handlers with react-hot-toast ────────────────────────────
  const handleFormSubmit = useCallback(
    async (formData) => {
      const isEditing = Boolean(formModal.user);
      const toastId = toast.loading(
        isEditing ? `Updating ${formData.name}...` : `Creating ${formData.name}...`
      );

      try {
        setIsSubmitting(true);
        if (isEditing) {
          await editUser(formModal.user.id, formData);
          toast.success(`${formData.name} updated successfully!`, { id: toastId });
        } else {
          await addUser(formData);
          toast.success(`${formData.name} created successfully!`, { id: toastId });
        }
        closeForm();
      } catch (err) {
        toast.error(err.message || 'Operation failed. Please try again.', { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formModal.user, editUser, addUser, closeForm]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.user) return;
    const { name, id } = deleteModal.user;
    const toastId = toast.loading(`Deleting ${name}...`);

    try {
      setIsDeleting(true);
      await removeUser(id);
      closeDelete();
      toast.success(`${name} deleted successfully!`, { id: toastId });
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteModal.user, removeUser, closeDelete]);

  const handleRetry = useCallback(() => {
    setErrorDismissed(false);
    const toastId = toast.loading('Reloading users...');
    retryLoad()
      .then(() => toast.success('Users loaded successfully!', { id: toastId }))
      .catch((err) => toast.error(err.message || 'Retry failed.', { id: toastId }));
  }, [retryLoad]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* ── Top Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
                <UsersIcon size={22} aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  UserSphere
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">User Management Dashboard</p>
              </div>
            </div>

            {/* Middle Badge Counters & Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {!loading && !error && (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-800/80 border border-gray-700/60 text-xs font-medium text-gray-300">
                    <span className="text-indigo-400 font-bold">{users.length}</span> Users
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-800/80 border border-gray-700/60 text-xs font-medium text-gray-300">
                    <Building2 size={13} className="text-purple-400" aria-hidden="true" />
                    <span className="text-purple-400 font-bold">{companies.length}</span> Companies
                  </div>
                </div>
              )}

              {/* Add User Button */}
              <button
                id="add-user-btn"
                onClick={openCreateForm}
                aria-label="Add new user"
                className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <Plus size={18} aria-hidden="true" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ──────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dismissible Error Banner */}
        {error && !errorDismissed && (
          <ErrorBanner
            message={error}
            onRetry={handleRetry}
            onDismiss={() => setErrorDismissed(true)}
          />
        )}

        {/* Search, Filter & Sort Bar */}
        {!error && (
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            companyFilter={companyFilter}
            onCompanyChange={setCompanyFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            companies={companies}
            totalCount={users.length}
            filteredCount={totalItems}
          />
        )}

        {/* User Cards Grid with Pagination */}
        <UserList
          users={paginatedUsers}
          loading={loading}
          onEdit={openEditForm}
          onDelete={openDelete}
          onViewPosts={openDetail}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      {formModal.open && (
        <UserForm
          user={formModal.user}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          isSubmitting={isSubmitting}
        />
      )}

      {detailModal.open && detailModal.user && (
        <UserDetailModal user={detailModal.user} onClose={closeDetail} />
      )}

      {deleteModal.open && deleteModal.user && (
        <ConfirmationModal
          title="Delete User"
          message={`Are you sure you want to permanently delete "${deleteModal.user.name}"? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={closeDelete}
          isLoading={isDeleting}
          danger
        />
      )}
    </div>
  );
};

export default Users;
