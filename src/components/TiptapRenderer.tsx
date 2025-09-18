'use client';

import { useMemo } from 'react';
import { generateHTML } from '@tiptap/html';
import { JSONContent } from '@tiptap/react';
import { getTiptapExtensions } from '@/lib/tiptap';

interface TiptapRendererProps {
  content: unknown; // Accept unknown to handle various incoming data types
}

const TiptapRenderer: React.FC<TiptapRendererProps> = ({ content }) => {
  const output = useMemo(() => {
    // Check if content is a valid object that looks like a Tiptap document
    if (typeof content === 'object' && content !== null && 'type' in content && 'content' in content) {
      try {
        return generateHTML(content as JSONContent, getTiptapExtensions());
      } catch (error) {
        console.error("Failed to generate HTML from Tiptap object:", error);
        // Return an empty string or an error message if HTML generation fails
        return '<p>Error rendering content.</p>';
      }
    }

    // If it's a string, it might be plain text or pre-rendered HTML
    if (typeof content === 'string') {
      return content;
    }

    // Fallback for any other case
    return '';

  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: output }} className="prose lg:prose-xl max-w-none mx-auto text-slate-700 [&_p:empty]:after:content-['\00a0']" />;
};

export default TiptapRenderer;
