'use client';

import { useMemo } from 'react';
import { generateHTML } from '@tiptap/html';
import { JSONContent } from '@tiptap/react';
import { getTiptapExtensions } from '@/lib/tiptap';

interface TiptapRendererProps {
  content: unknown; // Accept unknown to handle various incoming data types
}

// Helper function to transform legacy list formats
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformLegacyContent = (node: any): any => {
  if (!node || typeof node !== 'object') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(transformLegacyContent);
  }

  // Transform legacy list to standard bulletList
  if (node.type === 'list' && Array.isArray(node.items)) {
    return {
      type: 'bulletList',
      content: node.items.map((item: { text: string }) => ({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: item.text || '' }],
          },
        ],
      })),
    };
  }

  if (node.content) {
    return { ...node, content: transformLegacyContent(node.content) };
  }

  return node;
};

const TiptapRenderer: React.FC<TiptapRendererProps> = ({ content }) => {
  const output = useMemo(() => {
    if (!content) {
      return '';
    }

    const processedContent = content;

    // Check if content is a valid object that looks like a Tiptap document
    if (typeof processedContent === 'object' && processedContent !== null && 'type' in processedContent && 'content' in processedContent) {
      try {
        // First, transform any legacy structures within the content
        const transformed = transformLegacyContent(processedContent);
        return generateHTML(transformed as JSONContent, getTiptapExtensions());
      } catch (error) {
        console.error("Failed to generate HTML from Tiptap object:", error);
        return '<p>Error rendering content.</p>';
      }
    }

    // If it's a string, it might be plain text or pre-rendered HTML
    if (typeof processedContent === 'string') {
      return processedContent;
    }

    // Fallback for any other case
    return '';

  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: output }} className="prose lg:prose-xl max-w-none mx-auto text-slate-700 [&_p:empty]:after:content-['\00a0']" />;
};

export default TiptapRenderer;
