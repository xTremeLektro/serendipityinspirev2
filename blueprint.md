# Website Development Blueprint

## 1. Project Setup and Initialization
- [ ] Set up Next.js project.
- [ ] Configure Tailwind CSS.
- [ ] Initialize Git repository.
- [ ] Set up ESLint and Prettier.

## 2. Component Development
- [ ] Create `LayoutClient` component for consistent page structure.
- [ ] Develop `SandwichMenu` component for mobile navigation.
- [ ] Implement `ThemeToggle` and `ThemeProvider` for theme switching.
- [ ] Create a `ThemeContext` for managing theme state.

## 3. Page Development
- [ ] Create `Home` page (`page.tsx`).
- [ ] Create `About` page (`about/page.tsx`).
- [ ] Create `Contact` page (`contact/page.tsx`).
- [ ] Create `Portfolio` page (`portfolio/page.tsx`).
- [ ] Create `Services` page (`services/page.tsx`).
- [ ] Create `Project Detail` page (`portfolio/[projectId]/page.tsx`).

## 4. Styling and Theming
- [ ] Apply global styles in `globals.css`.
- [ ] Implement dark mode styling.
- [ ] Implement a more radical color scheme change for light and dark modes (white/light grey in light mode, black/dark grey in dark mode).
- [ ] Apply dark mode styles to all components and elements in `src/app/page.tsx`, `src/app/layout.tsx`, all files in `src/app/*/page.tsx`, and `src/components/Footer.tsx`. Ensure proper color changes for background, text, and border properties using Tailwind's `dark:` utility classes.

## 5. API Routes
- [ ] Create basic contact form API route (`api/contact/basic/route.ts`).
- [ ] Create quote request form API route (`api/contact/quote/route.ts`).

## 6. Navigation and Routing
- [ ] Implement main navigation links.
- [ ] Ensure proper routing between pages.

## 7. Content Integration
- [ ] Add content to each page.
- [ ] Integrate project details into the portfolio pages.

## 8. Footer Implementation
- [ ] Add a footer component.
- [ ] Clone the style and content of the footer from http://127.0.0.1:5500/serendipity-inspire-v1/main/index.html.
- [ ] Update footer links to correspond to site navigation: Inicio, Portafolio, Servicios, Sobre Nosotros, and Contacto.
- [ ] Add Font Awesome CSS to layout.tsx for displaying icons in the footer.

## 9. Optimization and Performance
- [ ] Optimize images and assets.
- [ ] Implement lazy loading where appropriate.
- [ ] Analyze and improve page load times.

## 10. Deployment
- [ ] Prepare for deployment.
- [ ] Deploy the site to a hosting platform (e.g., Vercel).

## 11. Testing
- [ ] Test site responsiveness on different devices.
- [ ] Test all links and navigation.
- [ ] Test form submissions.
- [ ] Test theme switching functionality.

## 12. Refinement and Polish
- [ ] Review and refine UI/UX.
- [ ] Address any bugs or issues.
- [ ] Make final adjustments based on feedback.