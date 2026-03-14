'use client';

import { useEffect } from 'react';

// Driver.js integration wrapper
// Import: import { driver } from 'driver.js'; import 'driver.js/dist/driver.css';

interface ProductTourProps {
  run: boolean;
  onComplete: () => void;
}

export default function ProductTour({ run, onComplete }: ProductTourProps) {
  useEffect(() => {
    if (!run) return;

    // Dynamic import to avoid SSR issues
    import('driver.js').then(({ driver }) => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: 'rgba(0,0,0,0.7)',
        popoverClass: 'sf-tour-popover',
        steps: [
          { element: 'nav a[href="/dashboard"]', popover: { title: 'Dashboard', description: 'Your command center with KPIs, charts, and activity feed.', side: 'right' } },
          { element: 'nav a[href="/contacts"]', popover: { title: 'Contacts', description: 'Manage all your clients and leads in one place.', side: 'right' } },
          { element: 'nav a[href="/pipeline"]', popover: { title: 'Pipeline', description: 'Drag and drop deals through your sales stages.', side: 'right' } },
          { element: 'nav a[href="/automations"]', popover: { title: 'Automations', description: 'Build no-code workflows to save time.', side: 'right' } },
          { element: 'nav a[href="/invoices"]', popover: { title: 'Invoices', description: 'Create, send, and track invoices with Square.', side: 'right' } },
        ],
        onDestroyStarted: () => {
          driverObj.destroy();
          onComplete();
        },
      });
      driverObj.drive();
    });
  }, [run, onComplete]);

  return null;
}
