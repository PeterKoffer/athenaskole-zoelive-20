
import { useEffect } from 'react';
import { initializeJulesIntegration, crossOriginHandler, debugCrossOriginIssues } from '@/utils/CrossOriginHandler';

export function JulesIntegration() {
  useEffect(() => {
    // Initialize Jules integration when component mounts
    initializeJulesIntegration();
    
    // Listen for Jules-specific events
    const handleJulesModification = (event: CustomEvent) => {
      console.log('🤖 Jules modification event received:', event.detail);
      // Handle the modification request here
    };

    window.addEventListener('julesCodeModification', handleJulesModification as EventListener);
    
    // Debug info
    debugCrossOriginIssues();
    
    // Cleanup
    return () => {
      window.removeEventListener('julesCodeModification', handleJulesModification as EventListener);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

export default JulesIntegration;
