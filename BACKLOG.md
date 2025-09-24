## Here I'm going to include all what is in my mind right now for Serendipity Inspire v2
-- New Feature / Being or Partially Implemented

~~-- Implemented Feature~~
 
## General Features
~~-- When the system is processing change the icon to a sand clock for better user feedback~~
~~-- Include a modal for the contact pages~~
-- Include a modal to tell the user that the operation to the DB was successfully completed. (will define which operations require this)
~~-- Fix the problem with the visualization of the pagination bar in those pages that require pagination.~~

## Rich Text Editing
-- Implement a rich text editor full featured (tiptap sample isolated and then tell gemini to integrate it) - Key to multiple parts of the app

## Blog Management and Communications
-- Change the n8n process that generates the blog to, 
    - Improve the content for every blog post.
    - Make sure every post is stored in the database when create with the flag of draft.
-- Functionalities asociated to the Admin Page
    - Implement the ability in the admin blog page to publish/unpublish a post.
    - Implement the ability in the admin blog page to delete a post
    - Although the post runs once per week, have the ability to manually launch the post generation process (n8n) from the admin page)
    - Have the ability to launch the publishing by mail once draft is reviewed in the admin page.
-- General access to posts
    - Change the visualization in the home page and in the blog list page to show only non-draft posts.
-- New n8n to deliver communications    
    - Implement the n8n process to evaluate subscribed people and send the blog by mail.
    - Evaluate other publishing options like Instagram, X, etc. (future work)
