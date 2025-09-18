# Serendipity Inspire V2 Blueprint

## Overview

This is a Next.js application for Serendipity Inspire, a web platform to showcase projects and services. It includes an admin panel for managing content.

## Implemented Features

### General

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Supabase for database and authentication
- Tiptap for rich text editing

### Admin Panel

- **Services Management:**
  - Add, edit, and delete services.
  - Update service order.
  - Manage service images.
- **FAQ Management:**
  - Add, edit, and delete FAQs.
  - Update FAQ order.
  - Manage FAQ types.
  - Rich text editor for answers.

### Blog

- **Supabase Table:**
  - Created `blog_posts` table with columns for `id`, `created_at`, `title`, `slug`, `content`, `excerpt`, `image_url`, and `published_at`.
- **Data Fetching:**
  - Created `src/lib/blog.ts` with functions to fetch the latest, all, and single blog posts.
- **UI Components:**
  - Created `src/components/BlogPostCard.tsx` to display a blog post in a card format.
- **Homepage Integration:**
  - Added a new section to the homepage to display the latest 3 blog posts.
- **Blog Pages:**
  - Created a main blog page at `src/app/blog/page.tsx` to display all blog posts.
  - Created a dynamic page at `src/app/blog/[slug]/page.tsx` to display the full content of a single blog post.

## Current Task: Enhance FAQ Management

### Plan

1.  **Update `src/app/admin/faq/actions.ts`**:
    - Add `updateFaqOrder` server action to modify the `ord` of an FAQ.
    - Ensure `updateFaq` action can handle all editable fields, including `ord`.

2.  **Create `src/app/admin/faq/FaqOrderUpdater.tsx`**:
    - A client component to provide a UI for updating the FAQ order, similar to `ServiceOrderUpdater.tsx`.

3.  **Create `src/app/admin/faq/FaqListClient.tsx`**:
    - A client component to display the list of existing FAQs.
    - It will handle the state for inline editing of each FAQ (question, answer, type, and order).
    - It will use the Tiptap editor for editing the `answer` field.

4.  **Create `src/app/admin/faq/AddFaqForm.tsx`**:
    - A client component containing the form to add a new FAQ, using the Tiptap editor.

5.  **Refactor `src/app/admin/faq/page.tsx`**:
    - Convert the page to a Next.js Server Component.
    - Fetch initial data (`faqs` and `faqTypes`) on the server.
    - Use the new `AddFaqForm` and `FaqListClient` components to render the page.

6.  **Linting**:
    - Run `npm run lint -- --fix` to ensure code quality.