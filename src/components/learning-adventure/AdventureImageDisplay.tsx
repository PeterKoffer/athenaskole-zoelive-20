import React, { useEffect, useMemo } from 'react';
import { useAdventureImage } from '@/hooks/useAdventureImage';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ImageOff } from 'lucide-react'; // Icons for error/empty states

interface AdventureImageDisplayProps {
  imagePrompt?: string;
  altText?: string;
  className?: string; // For custom styling of the container/image
  imageClassName?: string; // For specific styling of the img tag itself
  aspectRatio?: string; // e.g., "aspect-video", "aspect-square" for Tailwind
  triggerRefetch?: any; // Can be any value that changes to trigger a refetch
}

const AdventureImageDisplay: React.FC<AdventureImageDisplayProps> = ({
  imagePrompt,
  altText = "Adventure visual",
  className = "w-full h-48", // Default container size
  imageClassName = "w-full h-full object-cover", // Default image styling
  aspectRatio,
  triggerRefetch
}) => {
  const { imageUrl, isLoading, error, fetchImage, currentFetchedPrompt } = useAdventureImage();

  useEffect(() => {
    // Fetch image if prompt is provided and either:
    // 1. It's different from the currently fetched/fetching prompt.
    // 2. There was an error previously (allowing a retry for the same prompt).
    // 3. A triggerRefetch prop has changed.
    if (imagePrompt && (imagePrompt !== currentFetchedPrompt || error || triggerRefetch !== undefined)) {
      fetchImage(imagePrompt);
    } else if (!imagePrompt) {
      // If prompt becomes empty, clear current image (handled in useAdventureImage)
      fetchImage('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePrompt, fetchImage, triggerRefetch]); // currentFetchedPrompt is not needed here as fetchImage handles its own logic

  const containerClasses = useMemo(() => {
    let classes = className;
    if (aspectRatio) {
      classes = \`\${classes} \${aspectRatio}\`;
    }
    return classes;
  }, [className, aspectRatio]);

  if (isLoading || (imagePrompt && imagePrompt !== currentFetchedPrompt && !error)) {
    // Show skeleton if loading OR if a new prompt has been set but fetchImage hasn't updated currentFetchedPrompt yet
    // (prevents flash of old image or error for a new prompt)
    return <Skeleton className={containerClasses} />;
  }

  if (error) {
    return (
      <div className={\`\${containerClasses} flex flex-col items-center justify-center bg-slate-700 text-red-400 border border-red-500/50 rounded-md p-2\`}>
        <AlertTriangle className="w-10 h-10 mb-2" />
        <p className="text-sm font-semibold">Image Error</p>
        <p className="text-xs text-center max-w-xs truncate" title={error}>{error}</p>
        {/* Fallback to placeholder.svg if direct imageUrl is also erroring or not set by hook */}
        <img src="/placeholder.svg" alt="Error placeholder" className="w-12 h-12 mt-2 opacity-60" />
      </div>
    );
  }

  if (imageUrl && imagePrompt && imagePrompt === currentFetchedPrompt) {
    // Only display the image if it corresponds to the current requested prompt
    return (
      <div className={containerClasses}>
        <img src={imageUrl} alt={altText} className={imageClassName} />
      </div>
    );
  }

  // If no prompt, or image hasn't loaded yet and not loading/error (e.g., initial state before prompt is set)
  return (
    <div className={\`\${containerClasses} flex flex-col items-center justify-center bg-slate-800 border border-slate-700/50 rounded-md\`}>
      <ImageOff className="w-10 h-10 text-slate-500" />
      <p className="text-xs text-slate-500 mt-1">{imagePrompt ? "Waiting for image..." : "No image prompt"}</p>
    </div>
  );
};

export default AdventureImageDisplay;
