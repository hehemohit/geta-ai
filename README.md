# UserSphere — React.js User Management Dashboard

[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Axios](https://img.shields.io/badge/Axios-1.7-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

A high-performance, dark-themed, cyberpunk-inspired **User Management Dashboard** built with **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, and the **JSONPlaceholder REST API**. Engineered with clean modular architecture, custom state hooks, debounced search, multi-field sorting, client-side pagination, optimistic CRUD operations, dynamic theme calibration, and embedded portfolio HUD uplink.

---

## 🔗 Live Deployment & Repository Links

- **Live Deployment URL:** [https://geta-ai-user-management.vercel.app](https://hehemohit.vercel.app) *(or your Vercel deployment)*
- **GitHub Repository:** [https://github.com/hehemohit/geta-ai](https://github.com/hehemohit/geta-ai)
- **Embedded Portfolio:** [https://hehemohit.vercel.app](https://hehemohit.vercel.app)

---

## 📋 Comprehensive Requirements & Deliverables Checklist

### 1. API Integration (`JSONPlaceholder`)
- [x] **Dynamic Fetching:** User records fetched asynchronously on mount via `GET /users`.
- [x] **Mandatory Card Fields:** Displays Full Name, Email, Phone, Company Name, and interactive Website URL.
- [x] **Loading Skeletons:** Animated `SkeletonGrid` placeholders render while fetching initial records.
- [x] **Error Handling & Retry:** Non-blocking `ErrorBanner` displays unambiguous network failure messages with an interactive **`[RETRY]`** button.
- [x] **Zero Hardcoded Data:** 100% dynamic data integration via dedicated service layer (`src/services/userApi.js`).

### 2. Search & Filtering
- [x] **Multi-Field Search:** Searches both `name`, `email`, and `username` simultaneously in real time.
- [x] **Company Filter:** Dedicated select dropdown dynamically populated with unique company names.
- [x] **Debounced Input:** Custom `useDebounce` hook throttles search queries (350ms) to eliminate jitter and prevent redundant state recalculations.
- [x] **Zero Results State:** Dedicated `[!] NO_USERS_FOUND` alert card with guidance message and search reset triggers.
- [x] **Single-Click Reset:** Dedicated **`[RESET]`** button resets all filters, search terms, and sort orders.

### 3. User Details & Dispatches Feed
- [x] **Dedicated Dossier Modal:** Clicking on any user card opens an accessible modal with complete user information.
- [x] **Rich Profile Data:** Displays contact channels, corporate affiliation, business tagline (`company.catchPhrase`), business model (`company.bs`), full address, and satellite GPS coordinates (`geo.lat`, `geo.lng`).
- [x] **Isolated Post Fetching:** Fetches user-specific dispatches on demand via `GET /posts?userId={id}`.
- [x] **Isolated Loaders & Local Search:** Dedicated `PostSkeleton` loaders and in-modal search filter to search within user dispatches.

### 4. Create User Flow
- [x] **Modal Form:** Controlled modal dialog with inputs for Full Name, Username, Email, Phone, Company Name, Website, Street, and City.
- [x] **API Mutation:** Submits new records via `POST /users`.
- [x] **Inline Validation:** Validates required fields and email formats on blur and submit with visual `AlertCircle` indicators.
- [x] **Asynchronous Feedback:** Action button lockout (`disabled`), inline `ButtonSpinner`, and dark toast notifications.
- [x] **Zero Page Reloads:** Handled seamlessly in React state with `e.preventDefault()`.

### 5. Edit User Flow
- [x] **Edit Trigger:** Dedicated `[EDIT]` action button on each card.
- [x] **Pre-populated Fields:** Pre-fills all existing user details automatically via `toForm(user)`.
- [x] **API Mutation:** Submits updates via `PUT /users/{id}`.
- [x] **Optimistic UI:** Updates local state immediately with rollback on network failure.

### 6. Delete User Flow
- [x] **Explicit Confirmation Dialog:** `ConfirmationModal` requires explicit user confirmation before deletion.
- [x] **Destructive Visual Friction:** Distinct crimson warning icon, danger copy, and highlighted delete button.
- [x] **API Mutation:** Calls `DELETE /users/{id}`.
- [x] **Instant State Removal:** Optimistically purges record from UI state with `react-hot-toast` confirmation.

### 7. React Engineering & Architecture
- [x] **Functional Components & Hooks:** Pure functional component architecture using React 19 hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`).
- [x] **Separation of Concerns:** Isolated API service layer (`userApi.js`), custom state logic (`useUsers.js`), and pure UI components.
- [x] **Performance Optimization:** Component memoization with `React.memo` and throttled search calculations.
- [x] **Clean Async Handling:** Robust `try/catch/finally` blocks with optimistic rollback mechanisms.

### 8. UI/UX Design System
- [x] **Centered Viewport:** Structured within a responsive `max-w-[1200px]` container, vertically and horizontally centered with equal spacing.
- [x] **Fluid 3-Column Grid:** Responsive layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`).
- [x] **Hover Scale & Elevation:** Cards smoothly grow (`scale: 1.03`, `y: -4`) on hover and elevate stacking order (`hover:z-10`).
- [x] **Accessible Micro-Interactions:** Full keyboard `Escape` dismissal, modal focus isolation, and `target="_blank" rel="noreferrer"` links.

### 9. Bonus Points Implemented
- [x] **Client-Side Pagination:** 6 users per page with numbered page jumps, prev/next buttons, and auto-reset.
- [x] **Debounced Search:** Custom `useDebounce` hook (350ms delay).
- [x] **Multi-Field Sorting:** Sort by Name (A-Z / Z-A), Company (A-Z / Z-A), and ID (Asc / Desc).
- [x] **Toast Notifications:** Dark theme `react-hot-toast` across all lifecycle operations.
- [x] **Optimistic UI Updates:** Immediate local state mutations with fallback rollbacks.
- [x] **Framer Motion Animations:** Staggered card entry, fluid tab slide indicators, and spring modal transitions.
- [x] **Dynamic Theme System (`[CONFIG]`):** Switch between 6 cyberpunk neon presets (Cobalt Cyan, Crimson, Matrix Green, Hyper Violet, Solar Amber, Magenta) or choose **ANY** custom hex color via native color picker with `localStorage` persistence.
- [x] **Portfolio HUD Iframe Viewer:** Embedded live iframe uplink for `hehemohit.vercel.app` with reload and external tab navigation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Core Library** | React 19 (Functional Components, Hooks) |
| **Build Tool** | Vite 6 (Fast HMR & Optimized Bundling) |
| **Styling & HUD** | Tailwind CSS v4, Vanilla CSS Custom Properties, JetBrains Mono |
| **Motion & Animation** | Framer Motion 12 (Spring Physics, Staggered Grids, Layout FLIP) |
| **HTTP Client** | Axios (REST Service Layer) |
| **Icons** | Lucide React |
| **Toasts** | React Hot Toast |
| **Theme Engine** | React Context API + CSS Custom Properties (`--accent-hex`, `--accent-glow`) |

---

## 📂 Project Architecture & Directory Layout

```
User-Management-dashboard/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ConfigModal.jsx          # Theme customizer & hex color picker
│   │   ├── ConfirmationModal.jsx    # Destructive action alertdialog
│   │   ├── Loader.jsx               # Skeleton cards & button spinners
│   │   ├── Pagination.jsx           # 6-item client-side pagination
│   │   ├── PortfolioViewer.jsx      # Embedded iframe for hehemohit.vercel.app
│   │   ├── SearchFilter.jsx         # Debounced search & company dropdown
│   │   ├── UserCard.jsx             # Interactive user card with layoutId
│   │   ├── UserDetailModal.jsx      # Profile dossier & posts viewer
│   │   ├── UserForm.jsx             # Controlled create/edit user form
│   │   └── UserList.jsx             # Animated 3-column user grid
│   ├── context/
│   │   └── ThemeContext.jsx         # Theme state, presets & CSS variable sync
│   ├── hooks/
│   │   ├── useDebounce.js           # 350ms search debounce throttle hook
│   │   └── useUsers.js              # Centralized user state & CRUD operations
│   ├── pages/
│   │   └── Users.jsx                # Main dashboard page & navigation rail
│   ├── services/
│   │   └── userApi.js               # Axios REST endpoints against JSONPlaceholder
│   ├── utils/
│   │   └── helpers.js               # Initials, email validator, URL protocol helper
│   ├── App.css
│   ├── App.jsx                      # App root with ThemeProvider & Toaster
│   ├── index.css                    # Tailwind v4 import & custom scrollbars
│   └── main.jsx                     # Vite entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `yarn` / `pnpm`)

### 1. Clone the Repository
```bash
git clone https://github.com/hehemohit/geta-ai.git
cd geta-ai/User-Management-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deploying to Vercel

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy UserSphere Dashboard"
   git push origin master
   ```
2. **Deploy on Vercel:**
   - Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
   - Import the `hehemohit/geta-ai` repository.
   - Set the **Root Directory** to `User-Management-dashboard`.
   - Ensure the build command is `npm run build` and output directory is `dist`.
   - Click **Deploy**.

---

## 💡 Assumptions & Known Limitations

1. **JSONPlaceholder Mock REST API:**
   - JSONPlaceholder simulates `POST /users`, `PUT /users/{id}`, and `DELETE /users/{id}` calls with mock responses (`status: 200/201`), but **does not persist mutations** on remote servers.
   - **Handling:** Our architecture implements **Optimistic Local State Updates** in `useUsers.js`, ensuring all created, updated, and deleted records reflect immediately in the UI session.
2. **Created Users ID Assignment:**
   - Newly created records receive a dynamic generated ID (`Date.now()`) to ensure no ID collisions occur with existing JSONPlaceholder items.
3. **Iframe Security & Sandboxing:**
   - The embedded portfolio frame in `PortfolioViewer.jsx` uses standard `sandbox` flags (`allow-scripts allow-same-origin allow-popups allow-forms`) for security and seamless rendering.

---

## 👨‍💻 Author

- **Developer:** Mohit ([@hehemohit](https://github.com/hehemohit))
- **Portfolio:** [https://hehemohit.vercel.app](https://hehemohit.vercel.app)
- **GitHub:** [https://github.com/hehemohit](https://github.com/hehemohit)

---

*Built with passion for the React + API Integration Technical Assessment.*
