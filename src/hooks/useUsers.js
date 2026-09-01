import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/userApi';
import useDebounce from './useDebounce';

/**
 * useUsers — Complete state management hook with:
 * - Debounced search
 * - Multi-field sorting (Name, Company, ID)
 * - Dynamic pagination
 * - Optimistic CRUD updates with automatic rollback on error
 */
const useUsers = (initialItemsPerPage = 6) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc' | 'name-desc' | 'company-asc' | 'company-desc' | 'id-asc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Debounced query to prevent re-filtering on every single keystroke
  const debouncedSearch = useDebounce(searchQuery, 350);

  // ── 1. Fetch Users ─────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch users from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ── 2. Derived Company List ────────────────────────────────────────
  const companies = useMemo(
    () => [...new Set(users.map((u) => u.company?.name).filter(Boolean))].sort(),
    [users]
  );

  // ── 3. Filtered & Sorted Users (Memoized) ───────────────────────────
  const filteredUsers = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();

    // Filter by search & company
    let result = users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q);

      const matchesCompany =
        !companyFilter || u.company?.name === companyFilter;

      return matchesSearch && matchesCompany;
    });

    // Apply Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'company-asc':
          return (a.company?.name || '').localeCompare(b.company?.name || '');
        case 'company-desc':
          return (b.company?.name || '').localeCompare(a.company?.name || '');
        case 'id-asc':
          return a.id - b.id;
        case 'id-desc':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return result;
  }, [users, debouncedSearch, companyFilter, sortBy]);

  // Reset to page 1 whenever search, company filter, or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, companyFilter, sortBy]);

  // ── 4. Pagination Calculations ─────────────────────────────────────
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure current page doesn't exceed totalPages
  const validPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (validPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, validPage, itemsPerPage]);

  // ── 5. Optimistic CRUD Operations ──────────────────────────────────

  /**
   * Add a new user with optimistic UI and rollback.
   */
  const addUser = useCallback(async (formData) => {
    const tempId = Date.now();
    const optimisticUser = { ...formData, id: tempId };

    // Optimistic state update
    setUsers((prev) => [optimisticUser, ...prev]);

    try {
      const created = await createUser(formData);
      const finalizedUser = {
        ...formData,
        id: created.id ?? tempId,
      };

      // Replace optimistic temp item with API response
      setUsers((prev) =>
        prev.map((u) => (u.id === tempId ? finalizedUser : u))
      );
      return finalizedUser;
    } catch (err) {
      // Rollback on failure
      setUsers((prev) => prev.filter((u) => u.id !== tempId));
      throw new Error(err.message || 'Failed to create user. Changes rolled back.');
    }
  }, []);

  /**
   * Edit an existing user with optimistic UI and rollback.
   */
  const editUser = useCallback(async (id, formData) => {
    let originalUser = null;

    // Optimistic state update
    setUsers((prev) => {
      const target = prev.find((u) => u.id === id);
      if (target) originalUser = { ...target };
      return prev.map((u) => (u.id === id ? { ...u, ...formData, id } : u));
    });

    try {
      const updated = await updateUser(id, formData);
      const merged = { ...updated, ...formData, id };
      setUsers((prev) => prev.map((u) => (u.id === id ? merged : u)));
      return merged;
    } catch (err) {
      // Rollback on failure
      if (originalUser) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? originalUser : u))
        );
      }
      throw new Error(err.message || 'Failed to update user. Changes rolled back.');
    }
  }, []);

  /**
   * Remove a user with optimistic UI and rollback.
   */
  const removeUser = useCallback(async (id) => {
    let deletedUser = null;
    let deletedIndex = -1;

    // Optimistic state update
    setUsers((prev) => {
      deletedIndex = prev.findIndex((u) => u.id === id);
      if (deletedIndex !== -1) {
        deletedUser = prev[deletedIndex];
      }
      return prev.filter((u) => u.id !== id);
    });

    try {
      await deleteUser(id);
    } catch (err) {
      // Rollback on failure
      if (deletedUser && deletedIndex !== -1) {
        setUsers((prev) => {
          const copy = [...prev];
          copy.splice(deletedIndex, 0, deletedUser);
          return copy;
        });
      }
      throw new Error(err.message || 'Failed to delete user. Item restored.');
    }
  }, []);

  // ── Handlers (stable callbacks) ────────────────────────────────────
  const handleSearchChange = useCallback((val) => setSearchQuery(val), []);
  const handleCompanyChange = useCallback((val) => setCompanyFilter(val), []);
  const handleSortChange = useCallback((val) => setSortBy(val), []);
  const handlePageChange = useCallback((page) => setCurrentPage(page), []);

  return {
    users,
    filteredUsers,
    paginatedUsers,
    companies,
    loading,
    error,
    // Search & Filter
    searchQuery,
    setSearchQuery: handleSearchChange,
    companyFilter,
    setCompanyFilter: handleCompanyChange,
    sortBy,
    setSortBy: handleSortChange,
    // Pagination
    currentPage: validPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage: handlePageChange,
    // CRUD
    addUser,
    editUser,
    removeUser,
    retryLoad: loadUsers,
  };
};

export default useUsers;
