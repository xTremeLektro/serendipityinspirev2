// Este archivo contiene ÚNICAMENTE las extensiones necesarias para renderizar 
// el contenido JSON de Tiptap a HTML en un entorno Node.js (servidor/acciones).
// Se excluyen deliberadamente las extensiones que dependen del navegador (window, document).

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import ImageSSR from '@/lib/ImageSSR';

import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link'; // Incluimos Link por si su CustomLink era una envoltura simple

// --- EXTENSIONES EXCLUIDAS ---
// Hemos excluido las siguientes extensiones ya que son client-side y acceden al objeto 'window':
// - Selection
// - TrailingNode
// - ImageUploadNode
// - CustomLink (Si contiene lógica de editor. Usamos el Link base si es necesario).


export const getTiptapServerExtensions = () => [
  // 1. Starter Kit (Contiene: doc, paragraph, heading, bulletList, bold, italic, code, etc.)
  StarterKit.configure({
    history: false, // 🔥 THIS is what prevents `window is not defined` error
    link: false, // Debe coincidir con su configuración de cliente si lo está reemplazando con CustomLink
    underline: false, 
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc pl-5', // Clases para el renderizado
      },
    },
    // Asegúrese de que cualquier nodo que deshabilitó en el cliente, 
    // pero que necesita para renderizar, esté configurado aquí o importado por separado.
  }),

  // 2. Marcas y Nodos con funcionalidad de renderizado
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Underline,
  TaskList,
  TaskItem.configure({ nested: true }),
  Highlight.configure({ multicolor: true }),
  ImageSSR,

  Typography,
  Superscript,
  Subscript,
  
  // Si su CustomLink no tiene dependencias de cliente en su definición de servidor:
  // Si su CustomLink es solo el Link de tiptap con configuración, use el Link base:
  Link.configure({
    // La configuración de autolink/openOnClick es client-side, 
    // pero necesitamos el Link base para renderizar la marca 'link'.
  })

  // Si su CustomLink define la marca 'link', asegúrese de que la versión que importe aquí sea la pura definición del esquema.
];
