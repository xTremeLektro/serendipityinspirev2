# Serendipity Inspire v2 - Blueprint

## Overview

This document outlines the structure and features of the Serendipity Inspire v2 application.

## Implemented Features

### Admin - Blog Management

- **Blog Post List:** A page at `/admin/blog` that displays a list of all blog posts from the `public.blog_posts` table, ordered by creation date in descending order.
  - **Search:** A search bar to filter blog posts by title.
  - **Status Filter:** A dropdown to filter blog posts by status (published or draft).
  - **Publish/Unpublish:** A button to publish or unpublish a blog post directly from the list.
  - **Pagination:** A pagination system to navigate through the blog posts.
  - **Multiple Selection and Deletion:** A system to select multiple blog posts and delete them at once.
- **Create Blog Post:** A page at `/admin/blog/new` that allows creating a new blog post.
  - **Slug Generation:** The slug is automatically generated from the title.
  - **Publish/Unpublish:** Buttons to publish or unpublish the blog post.
  - **Image Upload:** A file input to upload an image for the blog post with a preview.
- **Edit Blog Post:** A dynamic route at `/admin/blog/[slug]` that allows editing the content of a blog post.
  - **Slug Generation:** The slug is automatically generated from the title.
  - **Publish/Unpublish:** Buttons to publish or unpublish the blog post.
  - **Image Upload:** A file input to upload an image for the blog post with a preview.
- **Delete Blog Post:** A button on the blog post list to delete a blog post.
- **TipTap Editor:** The create and edit pages use the TipTap editor to modify the `content` field of the blog post, which is stored as JSON.
- **TipTap Editor Toolbar:** The TipTap editor includes a toolbar with the following features:
  - Bold, italic, underline, strike, code, and clear format.
  - Headings of different levels.
  - Bullet lists, ordered lists, and code blocks.
  - Undo and redo changes.
  - Horizontal rule.
  - Blockquote.
  - Hard break.
  - Add image from URL.
  - Set link.
- **Server Actions:** The page uses server actions to fetch, create, update and delete blog post data.
- **SSR Fix:** Wrapped the Tiptap editor in a `ClientOnly` component to prevent SSR issues.
- **Dynamic Route Fix:** Fixed a warning related to the use of `params` in dynamic routes.
