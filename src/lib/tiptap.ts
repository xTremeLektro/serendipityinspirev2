// tiptap.ts
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

export const getTiptapExtensions = () => [
  StarterKit.configure({
    link: false,
    underline: false, // This is the new fix for the underline warning
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc pl-5',
      },
    },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
  Image.configure({
    inline: false, // Allows images to be on their own line
    HTMLAttributes: {
        class: 'rounded-lg shadow-md my-4', // Add some default styling
    },
  }),
];