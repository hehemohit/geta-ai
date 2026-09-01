import React, { memo } from 'react';
import { Users2 } from 'lucide-react';
import UserCard from './UserCard';
import Pagination from './Pagination';
import { SkeletonGrid } from './Loader';

/**
 * UserList — Memoized grid renderer with integrated client-side pagination and skeleton states.
 */
const UserList = memo(({
  users,
  loading,
  onEdit,
  onDelete,
  onViewPosts,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (loading) return <SkeletonGrid />;

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-gray-900/40 border border-gray-800/80 my-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-800/80 flex items-center justify-center text-gray-500 mb-4 shadow-inner">
          <Users2 size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-200 mb-1">No users found</h3>
        <p className="text-sm text-gray-400 max-w-sm">
          We couldn't find any users matching your current search, filter, or sorting criteria.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="User directory">
      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewPosts={onViewPosts}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </section>
  );
});

UserList.displayName = 'UserList';
export default UserList;
