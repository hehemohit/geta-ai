import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon } from 'lucide-react';
import UserCard from './UserCard';
import Pagination from './Pagination';
import { SkeletonGrid } from './Loader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
  },
};

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

/**
 * UserList — Animated 3-column cyberpunk grid with hover scale/lift animations.
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

  if (!users || users.length === 0) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="empty-state"
          variants={emptyVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center justify-center rounded-xl border border-red-950/60 bg-zinc-950/60 p-12 text-center my-4 backdrop-blur-md"
        >
          <AlertOctagon className="w-8 h-8 text-red-500 mb-3 animate-pulse" />
          <p className="font-mono text-sm tracking-wider text-red-500 font-bold">
            [!] NO_USERS_FOUND
          </p>
          <p className="font-mono text-xs text-zinc-500 mt-1 max-w-sm">
            No records match the requested search query or filter parameters.
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <section aria-label="User directory" className="space-y-6">
      {/* Animated 3-Column Grid Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {users.map((user) => (
            <motion.div
              key={user.id}
              variants={cardVariants}
              layout
              whileHover={{
                scale: 1.03,
                y: -4,
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
              whileTap={{ scale: 0.98 }}
              className="h-full relative z-0 hover:z-10"
            >
              <UserCard
                user={user}
                onViewPosts={onViewPosts}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

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
