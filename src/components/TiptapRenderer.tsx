'use client';

import React, { FC, useEffect, useState } from 'react';
import { generateHTML } from '@tiptap/core';
import { JSONContent } from '@tiptap/react';
import { getTiptapClientExtensions as getTiptapExtensions } from '@/lib/tiptap.client';

const TiptapRenderer: FC<{ content: JSONContent | string | null }> = ({ content }) => {
  const [renderedHtml, setRenderedHtml] = useState('');

  useEffect(() => {
    if (!content) {
      setRenderedHtml('');
      return;
    }

    let tiptapContent = content;

    if (typeof tiptapContent === 'string') {
      try {
        tiptapContent = JSON.parse(tiptapContent);
      } catch {
        setRenderedHtml(tiptapContent);
        return;
      }
    }

    if (typeof tiptapContent === 'object' && tiptapContent?.type === 'doc') {
      setRenderedHtml(generateHTML(tiptapContent, getTiptapExtensions()));
    } else if (typeof content === 'string') {
      setRenderedHtml(content);
    } else {
      setRenderedHtml(JSON.stringify(content));
    }
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: renderedHtml }} className="prose prose-lg max-w-none text-slate-600 [&_p:empty]:after:content-['\00a0']" />;
};

export default TiptapRenderer;