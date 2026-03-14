/**
 * Tawk.to Live Chat Integration
 * 
 * Provides embeddable live chat widget for customer support.
 * Requires: NEXT_PUBLIC_TAWKTO_PROPERTY_ID and NEXT_PUBLIC_TAWKTO_WIDGET_ID.
 * 
 * Status: SCAFFOLD — not active until Tawk.to account is created.
 */

export function isTawktoConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID &&
    process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID
  );
}

/**
 * Returns the Tawk.to embed script tag.
 * Add this to your root layout or a client component.
 * 
 * Usage in Next.js layout:
 * ```tsx
 * import Script from 'next/script';
 * import { getTawktoScript } from '@/lib/tawkto/embed';
 * 
 * // In your layout:
 * {getTawktoScript() && <Script id="tawkto" dangerouslySetInnerHTML={{ __html: getTawktoScript()! }} />}
 * ```
 */
export function getTawktoScript(): string | null {
  const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;
  if (!propertyId || !widgetId) return null;
  return `
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function(){
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/${propertyId}/${widgetId}';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  `;
}

/**
 * Programmatically control the Tawk.to widget
 */
export const tawktoActions = {
  show: () => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.showWidget();
    }
  },
  hide: () => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.hideWidget();
    }
  },
  maximize: () => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.maximize();
    }
  },
  minimize: () => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.minimize();
    }
  },
  setVisitor: (name: string, email: string) => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      (window as any).Tawk_API.setAttributes({ name, email });
    }
  },
};
