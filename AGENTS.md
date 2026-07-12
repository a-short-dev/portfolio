# Workspace Customization Rules

These instructions must be followed by all development agents working on this project.

## Directory Structure Standards
*   **Routing Directory (`src/app`)**: Must remain strictly dedicated to routing and Next.js page definitions (`page.tsx`, `layout.tsx`, `route.ts`, etc.).
*   **No Components in App**: Never create custom React components inside `src/app`. Relocate or create them under `src/components/layout/`, `src/components/sections/`, or `src/components/widgets/`.
*   **Absolute Imports**: Always use absolute `@/` path aliases for importing modules across directories.

## Component Organization
*   **`src/components/layout/`**: Shell elements (e.g. Navbar, Footer, page client wrappers).
*   **`src/components/sections/`**: Segmented static/dynamic layout sections for the landing page (e.g. Hero, About, Projects, Skills).
*   **`src/components/widgets/`**: Contextual overlays, floating buttons, forms, and tools (e.g. Spotify HUD, Chat, Forms).
*   **`src/components/ui/`**: Core reusable atomic visual styling blocks.

## Performance & Hydration
*   Keep route files free of `"use client"` directives to leverage React Server Components (RSC) for maximum first-paint performance.
*   Dynamically load client-only widget components with `{ ssr: false }` or wrap window-specific events inside client-side mount hooks.
