# Workspace Instructions

This file contains the foundational context, conventions, and architectural patterns for the **jpcs-website** project. It helps AI assistants to provide accurate, consistent, and architecturally aligned suggestions.

## 1. Project Overview & Architecture

- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS.
- **Routing:** React Router v7 (`react-router-dom`), with nested routes mainly configured in `App.tsx` (e.g., `/tools/*`).
- **State Management:** Avoids heavy global state managers (like Redux). User data (schedules, grades, etc.) is persisted locally using the custom `useLocalStorage.ts` hook.
- **Theming:** Heavily relies on CSS custom properties for theming (e.g., `bg-[var(--background)]`, `text-[var(--primary)]`) via `ThemeContext.tsx` and `index.css`.

## 2. Component Structure & Conventions

- **Pages vs Components:** 
  - `src/pages/`: Contains the main routable views.
  - `src/components/`: Contains reusable pieces. Domain-specific components are grouped into subfolders (e.g., `src/components/Schedule/`, `src/components/ui/`).
- **Tool/Calculator Architecture (`src/pages/Tools/`):**
  - **Standard Layout:** Every tool page uses the `ToolHeader` component and typically defines an inline `<ToolGuide>` (e.g., `GWAGuide`) to explain rules/instructions to the user.
  - **Decoupled Logic:** Complex business logic is abstracted away from the UI into `src/utils/` (e.g., `gradeCalculations.ts`, `fileParsers.ts`).

## 3. Domain Knowledge (University Specifics)

- **Grading System:** Uses a 1.00 (highest) to 5.00 (failing) scale. Marks like 'D' (Dropped) and 'W' (Withdrawn) count as failing for honors.
- **Latin Honors vs. Scholarships:**
  - *Honors:* Includes PE, excludes NSTP. No failing grades allowed. Single source of truth is `getLatinHonors`.
  - *Scholarships:* Evaluated strictly per semester. Excludes BOTH PE and NSTP. Single source of truth is `checkUEScholarship`.

## 4. Coding Standards & Anti-Patterns

- **DO NOT alter business logic in UI:** When adding or editing calculators, always rely on `src/utils/gradeCalculations.ts` for calculations. Do not rewrite grading rules directly inside the `.tsx` components.
- **Strict Theming Variables:** ALWAYS use CSS variable classes (e.g., `border-[var(--border)]`, `text-[var(--foreground-muted)]`) instead of hardcoded standard Tailwind colors (like `text-blue-500`) to guarantee light/dark mode compatibility.
- **Icons:** Use `lucide-react` consistently for all iconography across the application.
- **Local Storage Hydration:** Ensure any new state that needs to survive a refresh utilizes the `useLocalStorage` hook rather than standard `useState`.
- **File Parsing Fragility:** The logic in `fileParsers.ts` relies on specific row/column shapes. When modifying parsers, preserve backward compatibility.

## 5. Build & Test Commands

- **Development:** `npm run dev` or `pnpm dev`
- **Build:** `npm run build` or `pnpm build`
- **Lint:** `npm run lint` or `pnpm lint`
