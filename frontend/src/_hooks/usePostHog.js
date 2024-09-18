// usePostHog.js
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { useLocation } from 'react-router-dom';

const usePostHog = (enabledRoutes) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize PostHog only on specific routes
    posthog.init('phc_mZDeXFq67iB9VeXwmsn3JpRMBUkHxsf4WSUsuPsL4m9', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      autocapture: true,
      session_recording: true,
    });
    posthog.capture('pageview', { path: location.pathname });

    // Cleanup function to avoid multiple initializations
    return () => {
      posthog.reset(); // Reset PostHog when leaving the route
    };
  }, []);
};

export default usePostHog;
