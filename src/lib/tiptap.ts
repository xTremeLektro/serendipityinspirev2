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
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
  Image.configure({
    inline: false, // Allows images to be on their own line
    HTMLAttributes: {
        class: 'rounded-lg shadow-md my-4',
    },
  }),
];

export const getTiptapServerExtensions = () => [
  StarterKit.configure({
    link: false,
    underline: false,
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
  Image,
  Typography,
  Superscript,
  Subscript,
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
];