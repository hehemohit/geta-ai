import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus, AlertCircle, RefreshCw, X,
  Users as UsersIcon, Globe, Settings, Palette,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import useUsers from '../hooks/useUsers';
import SearchFilter from '../components/SearchFilter';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import UserDetailModal from '../components/UserDetailModal';
import ConfirmationModal from '../components/ConfirmationModal';
import ConfigModal from '../components/ConfigModal';
import PortfolioViewer from '../components/PortfolioViewer';

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
 * Users — Cyberpunk Dashboard with Portfolio Frame & Theme System.
 */
const Users = () => {
  const { activePreset } = useTheme();

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

  // ── View State (Users or Portfolio) ────────────────────────────────
  const [currentView, setCurrentView] = useState('users'); // 'users' | 'portfolio'

  // ── Modal state ───────────────────────────────────────────────────
  const [formModal, setFormModal] = useState({ open: false, user: null });
  const [detailModal, setDetailModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [configOpen, setConfigOpen] = useState(false);

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
    <div className="flex min-h-screen w-full bg-[#070709] text-zinc-100 antialiased overflow-x-hidden">
      
      {/* ── Left Sidebar Pinned to Screen Edge ─────────────────────── */}
      <aside className="hidden xl:flex w-20 shrink-0 flex-col justify-between items-center py-8 px-4 border-r border-zinc-900 bg-zinc-950/80 sticky top-0 h-screen">
        <div className="flex flex-col items-center gap-8">
          <span
            className="font-mono text-[11px] font-bold uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 transition-colors"
            style={{ color: activePreset.hex }}
          >
            {currentView === 'portfolio' ? 'PORTFOLIO' : 'DASHBOARD'}
          </span>
          <div
            className="w-2 h-2 rounded-full animate-pulse transition-colors"
            style={{
              backgroundColor: activePreset.hex,
              boxShadow: `0 0 10px ${activePreset.glow}`,
            }}
          />
        </div>

        {/* Icon Navigation */}
        <nav className="flex flex-col items-center gap-6 font-mono text-[10px] text-zinc-500" aria-label="System Rail">
          {/* Users View */}
          <button
            onClick={() => setCurrentView('users')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              currentView === 'users' ? 'font-bold' : 'hover:text-zinc-300'
            }`}
            style={{ color: currentView === 'users' ? activePreset.hex : undefined }}
            title="User Management Dashboard"
          >
            <UsersIcon size={18} />
            <span>USERS</span>
          </button>

          {/* Portfolio View (Replaces TEAMS) */}
          <button
            onClick={() => setCurrentView('portfolio')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              currentView === 'portfolio' ? 'font-bold' : 'hover:text-zinc-300'
            }`}
            style={{ color: currentView === 'portfolio' ? activePreset.hex : undefined }}
            title="Mohit Portfolio (hehemohit.vercel.app)"
          >
            <Globe size={18} />
            <span>PORTFOLIO</span>
          </button>

          {/* Config Modal */}
          <button
            onClick={() => setConfigOpen(true)}
            className="flex flex-col items-center gap-1 hover:text-zinc-200 transition-colors cursor-pointer group"
            title="Theme & System Configuration"
          >
            <Settings size={18} className="group-hover:rotate-45 transition-transform" />
            <span>CONFIG</span>
          </button>
        </nav>

        <span className="font-mono text-[10px] text-zinc-600 tracking-tighter">
          PANEL_V2.0
        </span>
      </aside>

      {/* ── Main Viewport Centered Evenly Vertically & Horizontally ──── */}
      <main className="flex-1 w-full min-w-0 min-h-screen px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-center items-center overflow-y-auto">
        
        {/* Dynamic View: Portfolio Iframe or User Dashboard */}
        {currentView === 'portfolio' ? (
          <PortfolioViewer onBack={() => setCurrentView('users')} />
        ) : (
          /* Centered Content Container */
          <div className="w-full max-w-[1200px] flex flex-col gap-6 my-auto">
            
            {/* 1. Header Section */}
            <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-6 border-b border-zinc-900">
              {/* Titles */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-extrabold text-2xl sm:text-3xl tracking-tight transition-colors"
                    style={{ color: activePreset.hex }}
                  >
                    UserSphere
                  </span>
                </div>
                <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase leading-none">
                  ADMIN DASHBOARD
                </h1>
              </div>

              {/* Stats & Actions */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                {/* Stat 1: Total Users */}
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                    TOTAL_USERS:
                  </span>
                  <span
                    className="font-mono text-3xl sm:text-4xl font-extrabold leading-none mt-1 transition-colors"
                    style={{ color: activePreset.hex }}
                  >
                    {users.length}
                  </span>
                </div>

                {/* Stat 2: Active Companies */}
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                    ACTIVE_COMPANIES:
                  </span>
                  <span
                    className="font-mono text-3xl sm:text-4xl font-extrabold leading-none mt-1 transition-colors"
                    style={{ color: activePreset.hex }}
                  >
                    {companies.length}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                  {/* Portfolio Quick Button on Mobile/Tablet */}
                  <button
                    onClick={() => setCurrentView('portfolio')}
                    aria-label="View Portfolio"
                    title="Open Portfolio (hehemohit.vercel.app)"
                    className="flex xl:hidden items-center justify-center p-2.5 sm:p-3 rounded-lg font-mono text-xs border border-zinc-800 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Globe size={16} style={{ color: activePreset.hex }} />
                  </button>

                  <button
                    onClick={() => setConfigOpen(true)}
                    aria-label="Theme Configuration"
                    title="Theme & System Calibration"
                    className="flex items-center justify-center p-2.5 sm:p-3 rounded-lg font-mono text-xs border border-zinc-800 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Palette size={16} style={{ color: activePreset.hex }} />
                  </button>

                  <button
                    id="add-user-btn"
                    onClick={openCreateForm}
                    aria-label="Add new user"
                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-md"
                    style={{
                      color: activePreset.hex,
                      borderColor: `${activePreset.hex}80`,
                      borderWidth: '1px',
                      backgroundColor: `rgba(${activePreset.rgb}, 0.12)`,
                      boxShadow: `0 0 12px rgba(${activePreset.rgb}, 0.2)`,
                    }}
                  >
                    <Plus size={16} className="shrink-0" />
                    <span>+ ADD NEW USER</span>
                  </button>
                </div>
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
        )}
      </main>

      {/* ── Modals with AnimatePresence ───────────────────────────── */}
      <AnimatePresence>
        {configOpen && (
          <ConfigModal
            key="system-config-modal"
            onClose={() => setConfigOpen(false)}
          />
        )}
      </AnimatePresence>

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
