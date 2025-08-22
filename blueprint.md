# Serendipity Inspire v2 Blueprint

## Overview

This document outlines the project structure, features, and design of the Serendipity Inspire v2 application.

## Features

### Implemented

*   **Authentication:**
    *   OAuth login with Google.
    *   Admin dashboard with a logout button.
*   **Database Integration:**
    *   Contact form submissions are saved to a Supabase database.
    *   Quote request submissions are saved to a Supabase database.

### Current Plan

*   **Admin Dashboard:**
    *   Create a central dashboard for content management.
    *   The dashboard will provide navigation to manage:
        *   Picture Carousel
        *   Projects (Proyectos)
        *   Services (Servicios)
        *   Blog Posts (Future)
        *   Contact Form Submissions
    *   The dashboard will have a modern, card-based design with icons for each section.
*   **Admin Sub-pages:**
    *   Create placeholder pages for each content management section:
        *   `/admin/carousel`
        *   `/admin/projects`
        *   `/admin/services`
        *   `/admin/blog`
        *   `/admin/contacts`