// tiptap.ts
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

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
];