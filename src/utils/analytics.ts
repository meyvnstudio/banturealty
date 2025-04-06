import { init } from 'plausible-tracker';

// Initialize Plausible Analytics
const plausible = init({
  domain: 'banturealty.vercel.app',
  apiHost: 'https://plausible.io',
});

// Track page views
export const trackPageview = () => {
  plausible.trackPageview();
};

// Track custom events
export const trackEvent = (eventName: string, props?: Record<string, string | number | boolean>) => {
  plausible.trackEvent(eventName, { props });
};