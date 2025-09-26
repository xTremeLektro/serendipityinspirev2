'use client';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';

// Custom Extensions
import { Link as CustomLink } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";

export const getTiptapClientExtensions = () => [
  StarterKit.configure({
    link: false,
    underline: false, // This is the new fix for the underline warning
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc pl-5',
      },
    },
  }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Underline,
  TaskList,
  TaskItem.configure({ nested: true }),
  Highlight.configure({ multicolor: true }),
  Image.configure({
    inline: false, // Allows images to be on their own line
    HTMLAttributes: {
        class: 'rounded-lg shadow-md my-4',
    },
  }),
  Typography,
  Superscript,
  Subscript,
  CustomLink.configure({
    openOnClick: false,
    autolink: true,
  }),
  Selection,
  ImageUploadNode.configure({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024, // 5MB
    limit: 3,
    upload: async (file) => {
      // This is a client-side placeholder. Server-side will handle actual upload.
      return "/placeholder-image.jpg";
    },
    onError: (error) => console.error("Client-side upload failed:", error),
  }),
  TrailingNode,
];
