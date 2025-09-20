// IMPORTANT: You need to have the @tiptap/html and other tiptap extensions available for your Edge Function.
// A good way to do this is to add them to a 'deno.json' file for your function.
// e.g. "imports": {
//   "@tiptap/html": "https://esm.sh/@tiptap/html@2.0.0",
//   "@tiptap/extension-document": "https://esm.sh/@tiptap/extension-document@2.0.0",
//   "@tiptap/extension-paragraph": "https://esm.sh/@tiptap/extension-paragraph@2.0.0",
//   "@tiptap/extension-text": "https://esm.sh/@tiptap/extension-text@2.0.0"
// }

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { generateHTML } from "https://esm.sh/@tiptap/html@2.2.4";
import Document from "https://esm.sh/@tiptap/extension-document@2.2.4";
import Paragraph from "https://esm.sh/@tiptap/extension-paragraph@2.2.4";
import Text from "https://esm.sh/@tiptap/extension-text@2.2.4";
import Heading from "https://esm.sh/@tiptap/extension-heading@2.2.4";
import Bold from "https://esm.sh/@tiptap/extension-bold@2.2.4";
import Italic from "https://esm.sh/@tiptap/extension-italic@2.2.4";
import ListItem from "https://esm.sh/@tiptap/extension-list-item@2.2.4";
import OrderedList from "https://esm.sh/@tiptap/extension-ordered-list@2.2.4";
import BulletList from "https://esm.sh/@tiptap/extension-bullet-list@2.2.4";

serve(async (req) => {
  try {
    const { record } = await req.json();
    const tiptapJson = record?.tiptap_json;

    if (!tiptapJson) {
      return new Response(JSON.stringify({ error: "Missing 'tiptap_json' field in record." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Define the extensions you're using. These must match the ones in your editor.
    const htmlOutput = generateHTML(tiptapJson, [
      Document,
      Paragraph,
      Text,
      Heading,
      Bold,
      Italic,
      ListItem,
      OrderedList,
      BulletList,
    ]);

    // Return the HTML in a JSON object
    return new Response(JSON.stringify({ html_content: htmlOutput }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
