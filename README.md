# UserSphere — Modern React User Management Dashboard

A high-performance, responsive User Management Dashboard built with **React 19**, **Vite**, **Tailwind CSS v4**, and **JSONPlaceholder REST API**. Engineered with clean component architecture, debounced filtering, multi-field sorting, pagination, optimistic CRUD operations, and accessible design.

---

## 🚀 Live Demo & Repository

- **Live Deployment:** [https://your-deployment-url.vercel.app](https://your-deployment-url.vercel.app) *(Replace with your deployed URL)*
- **GitHub Repository:** [https://github.com/your-username/User-Management-dashboard](https://github.com/your-username/User-Management-dashboard) *(Replace with your repository URL)*

---

## 🛠️ Tech Stack

- **Core:** React 19, JavaScript (ES6+)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4, Vanilla CSS Design System, Google Fonts (*Inter*)
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Architecture:** Custom React Hooks (`useUsers`, `useDebounce`), Memoization (`React.memo`, `useCallback`, `useMemo`)

---

## ✨ Key Features

### 1. Complete End-to-End CRUD Operations
- **Fetch Users:** Loads user profiles dynamically on startup with animated skeleton loaders.
- **Create User:** Modal-driven controlled form with real-time per-field validation and optimistic UI insertion.
- **Edit User:** Pre-populated edit modal allowing updates to personal details, company, and address.
- **Delete Flow:** Two-step confirmation modal before deleting a user, with optimistic removal and fallback error recovery.

### 2. Debounced Real-time Search & Filtering
- **Debounced Search (`useDebounce`):** Custom 350ms debouncing hook prevents excessive re-renders during fast keystrokes across names, emails, and usernames.
- **Company Filter:** Dynamically extracts unique company names for single-click dropdown filtering.
- **Combined Filters:** Seamlessly searches and filters simultaneously with live count badges and a single-click reset.

### 3. Multi-Field Sorting & Client-Side Pagination
- **Sorting Options:** Sort users by Name (A–Z / Z–A), Company (A–Z / Z–A), or User ID (Oldest / Newest).
- **Pagination:** Smooth 6-items-per-page pagination with numbered jump buttons, previous/next controls, and auto-reset to page 1 upon search/filter changes.

### 4. Dynamic Post Feed (User Details)
- **Nested API Integration:** Fetches `/posts?userId={id}` on demand when opening a user's details.
- **Skeleton State & Error Handling:** Displays post skeletons while loading and handles empty/error post states cleanly.

### 5. Toast Notifications & Optimistic UI
- **Instant Visual Feedback:** Integrated `react-hot-toast` with dark theme styling across all user actions (Create, Update, Delete, and Network Retry).
- **Optimistic State Management:** Immediate UI updates with automatic state rollback if the backend request fails.

### 6. Accessibility & UX Enhancements
- **Keyboard Navigation:** Full `Escape` key dismissal support for all dialogs and modals.
- **ARIA Standards:** `aria-label`, `role="dialog"`, `role="alertdialog"`, and `aria-modal="true"` attributes throughout.

---

## 📂 Architecture & Folder Structure

```
User-Management-dashboard/
├── public/                     # Static assets & favicon
├── src/
│   ├── components/             # Decoupled UI components
│   │   ├── ConfirmationModal.jsx # Accessible delete confirmation modal
│   │   ├── Loader.jsx            # Skeleton grid & button spinners
│   │   ├── Pagination.jsx        # Numbered pagination component
│   │   ├── SearchFilter.jsx      # Debounced search, company filter & sort
│   │   ├── UserCard.jsx          # Memoized user card with action buttons
│   │   ├── UserDetailModal.jsx   # Profile & user posts modal
│   │   ├── UserForm.jsx          # Validated controlled form for create/edit
│   │   └── UserList.jsx          # User cards grid layout with empty state
│   ├── hooks/                  # Custom reusable hooks
│   │   ├── useDebounce.js        # Debounce hook for input throttling
│   │   └── useUsers.js           # Central state, CRUD & pagination logic
│   ├── pages/                  # Page-level orchestrators
│   │   └── Users.jsx             # Main dashboard page
│   ├── services/               # API service layer
│   │   └── userApi.js            # Axios client & REST endpoints
│   ├── utils/                  # Helper utilities
│   │   └── helpers.js            # Avatar color hashing, initials, formatting
│   ├── App.css                 # Global CSS resets
│   ├── App.jsx                 # App root with react-hot-toast provider
│   ├── index.css               # Tailwind CSS v4 & typography tokens
│   └── main.jsx                # Application bootstrap
├── index.html                  # HTML entry point
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite & Tailwind CSS configuration
└── README.md                   # Project documentation
```

---

## 💻 Getting Started & Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/User-Management-dashboard.git
   cd User-Management-dashboard
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## ⚠️ Assumptions & Known Limitations

- **JSONPlaceholder Mock API:** JSONPlaceholder is a mock REST API. `POST`, `PUT`, and `DELETE` requests return simulated success responses (HTTP 200/201) with generated IDs, but do not persistently mutate server database records.
- **Client-Side State Persistence:** The application maintains mutations optimistically in local React state during the active browser session.
- **User Posts:** Posts fetched in the User Details modal are fetched directly from `/posts?userId={id}`.

---

## 🚢 Deployment Instructions (Vercel)

1. Push your code to a GitHub repository.
2. Visit [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build` | Output Directory: `dist`.
6. Click **Deploy**.
