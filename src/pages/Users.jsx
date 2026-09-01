import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus, AlertCircle, RefreshCw, X,
  Users as UsersIcon, Network, Settings,
} from 'lucide-react';
import useUsers from '../hooks/useUsers';
import SearchFilter from '../components/SearchFilter';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import UserDetailModal from '../components/UserDetailModal';
import ConfirmationModal from '../components/ConfirmationModal';

const USERS_PER_PAGE = 6;

/* ── Error Banner ───────────────────────────────────────────────── */
const ErrorBanner = ({ message, onRetry, onDismiss }) => (
  <div className="flex items-center justify-between gap-4 p-4 mb-6 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 font-mono text-xs">
    <div className="flex items-center gap-3">
      <AlertCircle size={18} className="text-red-400 shrink-0" />
      <div>
        <p className="font-bold text-red-200">[SYSTEM_ERROR] FAILED_TO_FETCH_RECORDS</p>
        <p className="text-red-400/80 mt-0.5">{message}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-semibold rounded-lg bg-red-900/60 hover:bg-red-900 border border-red-700 text-red-200 transition-colors cursor-pointer"
      >
        <RefreshCw size={12} />
        <span>RETRY</span>
      </button>
      <button
        onClick={onDismiss}
        className="p-1.5 rounded-lg hover:bg-red-900/60 text-red-300 transition-colors cursor-pointer"
        aria-label="Dismiss error banner"
      >
        <X size={14} />
      </button>
    </div>
  </div>
);

/**
 * Users — Pinned Sidebar + Centered 1200px Content Container with Framer Motion transitions.
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
  } = useUsers(USERS_PER_PAGE);

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
        isEditing ? `UPDATING [${formData.name}]...` : `CREATING [${formData.name}]...`
      );

      try {
        setIsSubmitting(true);
        if (isEditing) {
          await editUser(formModal.user.id, formData);
          toast.success(`[SUCCESS] Record ${formData.name} updated.`, { id: toastId });
        } else {
          await addUser(formData);
          toast.success(`[SUCCESS] Record ${formData.name} created.`, { id: toastId });
        }
        closeForm();
      } catch (err) {
        toast.error(err.message || 'Operation failed.', { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formModal.user, editUser, addUser, closeForm]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.user) return;
    const { name, id } = deleteModal.user;
    const toastId = toast.loading(`DELETING [${name}]...`);

    try {
      setIsDeleting(true);
      await removeUser(id);
      closeDelete();
      toast.success(`[SUCCESS] Record ${name} deleted.`, { id: toastId });
    } catch (err) {
      toast.error(err.message || 'Deletion failed.', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteModal.user, removeUser, closeDelete]);

  const handleRetry = useCallback(() => {
    setErrorDismissed(false);
    const toastId = toast.loading('FETCHING_DATA...');
    retryLoad()
      .then(() => toast.success('Records synchronized.', { id: toastId }))
      .catch((err) => toast.error(err.message || 'Retry failed.', { id: toastId }));
  }, [retryLoad]);

  return (
    <div className="flex min-h-screen w-full bg-[#070709] text-zinc-100 antialiased">
      
      {/* ── Left Sidebar Pinned to Screen Edge ─────────────────────── */}
      <aside className="hidden xl:flex w-20 shrink-0 flex-col justify-between items-center py-8 px-4 border-r border-zinc-900 bg-zinc-950/80 sticky top-0 h-screen">
        <div className="flex flex-col items-center gap-8">
          <span className="font-mono text-[11px] font-bold text-red-500 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
            DASHBOARD
          </span>
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-lg shadow-red-600/80" />
        </div>

        {/* Icon Navigation */}
        <nav className="flex flex-col items-center gap-6 font-mono text-[10px] text-zinc-500" aria-label="System Rail">
          <div className="flex flex-col items-center gap-1 text-red-400 group cursor-pointer">
            <UsersIcon size={18} />
            <span>USERS</span>
          </div>
          <div className="flex flex-col items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer">
            <Network size={18} />
            <span>TEAMS</span>
          </div>
          <div className="flex flex-col items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer">
            <Settings size={18} />
            <span>CONFIG</span>
          </div>
        </nav>

        <span className="font-mono text-[10px] text-zinc-600 tracking-tighter">
          PANEL_V2.0
        </span>
      </aside>

      {/* ── Main Viewport with Centered 1200px Content Container ──── */}
      <main className="flex-1 w-full min-w-0 px-4 sm:px-8 py-8 flex flex-col items-center overflow-y-auto">
        {/* Centered Content Container */}
        <div className="w-full max-w-[1200px] flex flex-col gap-6">
          
          {/* 1. Header Section */}
          <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-6 border-b border-zinc-900">
            {/* Titles */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-500 font-extrabold text-2xl sm:text-3xl tracking-tight">
                  UserSphere
                </span>
              </div>
              <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase leading-none">
                ADMIN DASHBOARD
              </h1>
            </div>

            {/* Stats & Add Button */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              {/* Stat 1: Total Users */}
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                  TOTAL_USERS:
                </span>
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-red-500 leading-none mt-1">
                  {users.length}
                </span>
              </div>

              {/* Stat 2: Active Companies */}
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                  ACTIVE_COMPANIES:
                </span>
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-red-500 leading-none mt-1">
                  {companies.length}
                </span>
              </div>

              {/* Add User Action Button */}
              <button
                id="add-user-btn"
                onClick={openCreateForm}
                aria-label="Add new user"
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/20 border border-red-600/70 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/30 transition-all duration-200 cursor-pointer active:scale-95 ml-auto sm:ml-0"
              >
                <Plus size={16} className="shrink-0" />
                <span>+ ADD NEW USER</span>
              </button>
            </div>
          </header>

          {/* Dismissible Error Banner */}
          {error && !errorDismissed && (
            <ErrorBanner
              message={error}
              onRetry={handleRetry}
              onDismiss={() => setErrorDismissed(true)}
            />
          )}

          {/* 2. Filters & Search Bar */}
          {!error && (
            <div className="w-full">
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
            </div>
          )}

          {/* 3. Cards Grid & 4. Footer Pagination */}
          <div className="w-full">
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
          </div>

        </div>
      </main>

      {/* ── Modals with AnimatePresence ───────────────────────────── */}
      <AnimatePresence>
        {formModal.open && (
          <UserForm
            key="user-form-modal"
            user={formModal.user}
            onSubmit={handleFormSubmit}
            onClose={closeForm}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailModal.open && detailModal.user && (
          <UserDetailModal
            key="user-detail-modal"
            user={detailModal.user}
            onClose={closeDetail}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModal.open && deleteModal.user && (
          <ConfirmationModal
            key="user-delete-modal"
            title="TERMINATE USER RECORD"
            message={`Are you sure you want to permanently delete record for "${deleteModal.user.name}"? This action cannot be reversed.`}
            confirmLabel="[CONFIRM_DELETE]"
            cancelLabel="[CANCEL]"
            onConfirm={handleDeleteConfirm}
            onCancel={closeDelete}
            isLoading={isDeleting}
            danger
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
