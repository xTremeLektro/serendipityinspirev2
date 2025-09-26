// extensions/ImageSSR.ts
import { Node } from '@tiptap/core'

const ImageSSR = Node.create({
  name: 'image',
  inline: false,
  group: 'block',
  draggable: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      {
        ...HTMLAttributes,
        loading: 'lazy',
        class: 'rounded-lg shadow-md my-4', // Tailwind or any class
      },
    ];
  }

})

export default ImageSSR
