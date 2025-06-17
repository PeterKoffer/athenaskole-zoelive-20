
import { useEffect } from 'react';
import { useClassroomImagePreloader } from './hooks/useImagePreloader';

const GlobalImagePreloader = () => {
  const { allImagesLoaded } = useClassroomImagePreloader();

  useEffect(() => {
    if (allImagesLoaded) {
      console.log('🎨 All classroom images have been preloaded for faster navigation');
    }
  }, [allImagesLoaded]);

  // This component doesn't render anything, it just preloads images
  return null;
};

export default GlobalImagePreloader;
