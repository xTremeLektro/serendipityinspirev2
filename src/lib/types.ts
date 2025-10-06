import { JSONContent } from '@tiptap/react';

export interface QuoteRequest {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  project_type?: string;
  service_type?: string;
  spaces_to_address?: string[];
  estimated_budget?: string;
  how_found_us?: string;
  project_details?: string;
  attachments?: string[];
  message?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
}

export interface BlogPost {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  content?: JSONContent; // <--- Changed from string
  content_html?: string;
  excerpt?: string;
  image_url?: string;
  published_at: string;
}

export interface Project {
  id: number;
  project_name: string;
  location: string;
  end_date: string;
}

export interface Service {
  id: string;
  service_name: string;
  service_desc: JSONContent;
  faq_type_list?: { faq_type: string };
  ord: number | null;
}

export interface FaqType {
  id: string;
  faq_type: string;
}