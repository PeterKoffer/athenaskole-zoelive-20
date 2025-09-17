-- DELETE ALL CLASSROOM IMAGES FROM ADVENTURES TABLE
-- Clear out any existing classroom images that might be cached
UPDATE adventures 
SET 
  image_url = NULL,
  image_url_child = NULL, 
  image_url_teen = NULL,
  image_url_adult = NULL,
  image_generated = false,
  image_generated_child = false,
  image_generated_teen = false,
  image_generated_adult = false
WHERE image_url IS NOT NULL 
   OR image_url_child IS NOT NULL
   OR image_url_teen IS NOT NULL 
   OR image_url_adult IS NOT NULL;

-- Clear any cached AI images that might contain classroom content
DELETE FROM ai_images 
WHERE prompt ILIKE '%classroom%' 
   OR prompt ILIKE '%school%'
   OR prompt ILIKE '%teacher%'
   OR prompt ILIKE '%student%'
   OR prompt ILIKE '%desk%'
   OR prompt ILIKE '%chalkboard%'
   OR prompt ILIKE '%whiteboard%';

-- Clear any cached cover images that might contain classroom content  
DELETE FROM cover_images
WHERE prompt ILIKE '%classroom%'
   OR prompt ILIKE '%school%' 
   OR prompt ILIKE '%teacher%'
   OR prompt ILIKE '%student%'
   OR prompt ILIKE '%desk%'
   OR prompt ILIKE '%chalkboard%'
   OR prompt ILIKE '%whiteboard%';