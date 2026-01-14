// src/lib/hooks/useAnalytics.ts
export const useAnalytics = () => {
  const trackEvent = (event: string, data?: Record<string, any>) => {
    if (import.meta.env.PROD) {
      // Envoyer à Google Analytics, Mixpanel, etc.
      console.log('Track event:', event, data);
    }
  };

  const trackPageView = (path: string) => {
    trackEvent('page_view', { path });
  };

  return { trackEvent, trackPageView };
};