// One-time bucket capability detection for micro-performance optimization

let bucketIsPublic: boolean | null = null;

export async function detectBucketPublic(basePublicUrl: string): Promise<boolean> {
  if (bucketIsPublic !== null) return bucketIsPublic;
  
  try {
    const testUrl = `${basePublicUrl}/__does_not_exist__`;
    const response = await fetch(testUrl, { 
      headers: { Range: 'bytes=0-0' },
      method: 'GET'
    });
    
    // 400 status means "public route on private bucket"
    bucketIsPublic = response.status !== 400;
    return bucketIsPublic;
  } catch {
    // Assume private on network errors
    bucketIsPublic = false;
    return bucketIsPublic;
  }
}

// Reset detection (useful for testing)
export function resetBucketDetection(): void {
  bucketIsPublic = null;
}