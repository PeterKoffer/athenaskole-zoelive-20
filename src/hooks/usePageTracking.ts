
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Log page views for analytics/tracking purposes
    console.log('Page view:', location.pathname);
    
    // You can extend this to send data to analytics services
    // Example: analytics.track('page_view', { path: location.pathname });
  }, [location.pathname]);
};
