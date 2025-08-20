# Website Development Blueprint

## 1. Project Setup and Initialization
- [ ] Set up Next.js project.
- [ ] Configure Tailwind CSS.
- [ ] Initialize Git repository.
- [ ] Set up ESLint and Prettier.

## 2. Component Development
- [ ] Create `LayoutClient` component for consistent page structure.
- [ ] Develop `SandwichMenu` component for mobile navigation.
- [ ] Implement `ThemeProvider` for consistent application wrapping.

## 3. Page Development
- [ ] Create `Home` page (`page.tsx`).
- [ ] Create `About` page (`about/page.tsx`).
- [ ] Create `Portfolio` page (`portfolio/page.tsx`).
- [ ] Create `Services` page (`services/page.tsx`).
- [ ] Create `Project Detail` page (`portfolio/[projectId]/page.tsx`).

## 4. Styling and Theming
- [ ] Apply global styles in `globals.css`.
- [ ] Implement dark mode styling.
- [ ] Implement a more radical color scheme change for light and dark modes (white/light grey in light mode, black/dark grey in dark mode). (Removed)
- [ ] Style the application in light mode only, removing all dark mode specific styles and logic.

## 6. Navigation and Routing
- [ ] Implement main navigation links.
- [ ] Ensure proper routing between pages.
- [ ] Make the sandwich menu icon always visible and control the display of the navigation menu on all screen sizes.
- [x] Add admin login link to header.

## 5. Header Animation
- [x] Implement animated header navigation based on provided example (HTML/CSS/JS). Use React state to toggle an 'active' class for CSS transitions.
- [x] Fix missing navigation links in the header.
## 5. Header Animation
- [ ] Implement animated header navigation based on provided example (HTML/CSS/JS). Use React state to toggle an 'active' class for CSS transitions.

## 7. Content Integration
- [ ] Add content to each page.
- [ ] Integrate project details into the portfolio pages.

## 8. Footer Implementation
- [ ] Add a footer component.
- [ ] Clone the style and content of the footer from http://127.0.0.1:5500/serendipity-inspire-v1/main/index.html.
- [ ] Update footer links to correspond to site navigation: Inicio, Portafolio, Servicios, Sobre Nosotros, and Contacto.
- [ ] Add Font Awesome CSS to layout.tsx for displaying icons in the footer.

- [x] Adjust the size of the sandwich icon in the header.
- [x] Correct the alignment of menu options within the animated navigation.
## 9. Optimization and Performance
- [ ] Optimize images and assets.
- [ ] Implement lazy loading where appropriate.
- [ ] Analyze and improve page load times.

- [ ] Prepare for deployment.
- [ ] Deploy the site to a hosting platform (e.g., Vercel).

## 11. Testing
- [ ] Test site responsiveness on different devices.
- [ ] Test all links and navigation.
- [ ] Test form submissions.

## 12. Refinement and Polish
- [ ] Review and refine UI/UX.
- [ ] Address any bugs or issues.
- [ ] Make final adjustments based on feedback.

## 13. Authentication and Database Integration
- [x] Install `next-auth` and `@supabase/supabase-js` dependencies.
- [x] Create `.env.local` file for environment variables (NextAuth.js secret, GitHub/Google OAuth credentials, Supabase URL/Anon Key).
- [x] Configure NextAuth.js API route (`src/app/api/auth/[...nextauth]/route.ts`) with GitHub and Google providers.
- [x] Create Supabase client utility (`src/lib/supabase.ts`).
- [x] Add "Admin" login link to the header (`src/components/LayoutClient.tsx`).
- [x] Create Admin Login Page (`src/app/admin/login/page.tsx`) with GitHub and Google sign-in buttons.
- [x] Create Protected Admin Dashboard Page (`src/app/admin/dashboard/page.tsx`) that redirects unauthenticated users.
