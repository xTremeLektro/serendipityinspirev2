# Serendipity Inspire v2 Blueprint

## Overview

This document outlines the project structure, features, and design of the Serendipity Inspire v2 application.

## Features

### Implemented

*   **Home Page:**
    *   The "Nuestros Proyectos Destacados" section now displays the first three projects from the Supabase database where the `is_home` property is true.
    *   Each project card displays the project's name, location, short description, and the head picture of the project.
*   **Authentication:**
    *   OAuth login with Google.
    *   Admin dashboard with a logout button.
*   **Database Integration:**
    *   Contact form submissions are saved to a Supabase database.
    *   Quote request submissions are saved to a Supabase database.
*   **Admin Dashboard:**
    *   The blog placeholder has been moved to a new third line.
    *   A new admin section for Frequently Asked Questions (FAQ) configuration has been added.
    *   The dashboard provides navigation to manage:
        *   Picture Carousel
        *   Projects (Proyectos)
        *   Services (Servicios)
        *   Contact Form Submissions
        *   Blog Posts (Future)
        *   FAQ (Future)
    *   The dashboard will have a modern, card-based design with icons for each section.
*   **CRUD Functionality:**
    *   **FAQ Management:**
        *   Admins can create, read, and delete FAQs.
        *   Admins can create, read, and delete FAQ types.
    *   **Services Management:**
        *   Admins can create, read, update, and delete services.
        *   Admins can associate services with a FAQ type.
        *   Admins can upload and delete pictures for each service.

### Current Plan

*   **Admin Sub-pages:**
    *   Create placeholder pages for each content management section:
        *   `/admin/carousel`
        *   `/admin/projects`
        *   `/admin/services`
        *   `/admin/blog`
        *   `/admin/contacts`
        *   `/admin/faq`
