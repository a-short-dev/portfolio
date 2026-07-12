# Project Architecture & Guidelines

This document outlines the organization, routing boundary rules, and file standards of the codebase.

## 📂 Project Directory Structure

```
src/
├── app/                  # ROUTING ONLY
│   ├── (auth)/           # Authentication layout and route pages
│   ├── (public)/         # Public layout and main landing page
│   ├── api/              # API endpoints / backend logic
│   ├── dev/              # Development testing views
│   ├── get-token/        # API key retrieval tool
│   ├── globals.css       # Core styling & theme variables
│   └── layout.tsx        # Global page shell
├── components/           # REUSABLE UI ASSETS (Zero direct routing)
│   ├── chat/             # Internal components for the AI Chat interface
│   ├── layout/           # Shared wrap elements (Navbar, Footer, HomeClient)
│   ├── sections/         # Main landing page content blocks (Hero, About, Projects)
│   ├── widgets/          # Decoupled HUD cards and modals (Spotify, Forms)
│   └── ui/               # Atomic core primitives (Buttons, Forms, Inputs)
├── data/                 # Static data payloads (projects data)
├── lib/                  # Utilities, rate-limiters, redis configuration, validation schemas
└── proxy.ts              # Security Gateway (CSP, HSTS, CORS configuration)
```

---

## 🛠️ Key Architectural Guidelines

### 1. App Router Boundaries
*   **Routing Only**: The `src/app` directory is reserved solely for Next.js route boundaries (i.e., `layout.tsx`, `page.tsx`, `route.ts`, `error.tsx`, `sitemap.ts`, `robots.ts`).
*   **No Components in App**: Do not store any React component files inside routing folders. Custom sub-pages or client page shells (like `home-client.tsx`) must reside in `src/components/layout/` or a related subdirectory, keeping the routing structure clean and uncluttered.
*   **Keep Server Components Clean**: Do not place `"use client"` directives in the root layout or root page unless absolutely unavoidable. Maintain clean React Server Component (RSC) environments at route boundaries to guarantee maximum speed and pre-rendering capability.

### 2. Component Categorization
*   **layout/**: Shell frameworks that are shared globally or govern main layout wrapper states.
*   **sections/**: Segmented content modules rendered as part of the homepage flow.
*   **widgets/**: Rich, interactive client modules overlaying pages or presenting dynamic context.
*   **ui/**: Generic, highly reusable styling blocks conforming to the design system.

### 3. Absolute Path Aliases
*   Always use absolute path aliases (e.g. `@/components/layout/navbar` instead of `../../components/layout/navbar`) to import files across directories. This maintains refactoring resilience and prevents relative path complexity.

### 4. Hydration Safety
*   Interactive browser-only scripts, telemetry trackers, and widget overlays should be dynamically loaded with `{ ssr: false }` or check `typeof window !== "undefined"` in their mount lifecycles to avoid hydration mismatches between Server and Client paints.
