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
  - **Generate New Post:** A button that triggers an n8n webhook to generate a new blog post, with a confirmation modal.
- **Create Blog Post:** A page at `/admin/blog/new` that allows creating a new blog post.
  - **Slug Generation:** The slug is automatically generated from the title.
  - **Publish/Unpublish:** Buttons to publish or unpublish the blog post.
- **Edit Blog Post:** A dynamic route at `/admin/blog/[slug]` that allows editing the content of a blog post.
  - **Slug Generation:** The slug is automatically generated from the title.
  - **Publish/Unpublish:** Buttons to publish or unpublish the blog post.
  - **Published Date Display:** The published date is displayed below the content editor.
- **Delete Blog Post:** A button on the blog post list to delete a blog post.
- **TipTap Editor:** The create and edit pages use the TipTap editor to modify the `content` field of the blog post, which is stored as JSON. When updating a blog post, the `content` field is converted to HTML and stored in the `content_html` field in the database.
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

### Admin - Project Management

- **Project List:** A page at `/admin/projects` that displays a list of all projects.
  - **Pagination:** A pagination system to navigate through the projects.
- **Create Project:** The `/admin/projects` page includes a form to add new projects.
- **Edit Project:** A dynamic route at `/admin/projects/[projectId]` that allows editing an existing project.
- **Delete Project:** A button on the project list to delete a project.
- **TipTap Editor:** The `ProjectForm` component, used for both creating and editing projects, integrates the full-featured `SimpleEditor` component for the `detailed_description` field. The content is stored as JSON.
- **TipTap Editor Toolbar:** The `SimpleEditor` in `ProjectForm` includes a comprehensive toolbar with various formatting options, consistent with the blog post editor.
- **Server Actions:** The project management pages use server actions to fetch, create, update, and delete project data.
- **SSR Fix:** The `ProjectForm` component is wrapped in a `ClientOnly` component to prevent SSR issues with the Tiptap editor.

### Admin - Service Management

- **Service List:** A page at `/admin/services` that displays a list of all services.
  - **Pagination:** A pagination system to navigate through the services.
- **Create Service:** The `/admin/services` page includes a form to add new services.
- **Edit Service:** A dynamic route at `/admin/services/[serviceId]` that allows editing an existing service.
- **Delete Service:** A button on the service list to delete a service.
- **TipTap Editor:** The `ServiceForm` component, used for both creating and editing services, integrates the full-featured `SimpleEditor` component for the `service_desc` field. The content is stored as JSON.
- **TipTap Editor Toolbar:** The `SimpleEditor` in `ServiceForm` includes a comprehensive toolbar with various formatting options, consistent with the blog post editor.
- **Server Actions:** The service management pages use server actions to fetch, a new section to the `blueprint.md` with the changes I have made.
- **Inverted Publish/Unpublish Icons:** Inverted the `FaEye` and `FaEyeSlash` icons in the blog post list to correctly represent the published status.

## Current Request

- **Remove Image Field from Blog Edit Page:** Removed the image upload field from the blog edit page.
- **Display Published Date:** Added the published date to the blog edit page.
- **Generate New Post Button:** Added a button to the blog admin page to trigger an n8n webhook to generate a new post, with a confirmation modal.
- **Confirmation Modal Fix:** Fixed a z-index issue with the confirmation modal that was causing it to be unresponsive.