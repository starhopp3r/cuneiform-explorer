'use client';

import { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = window.innerWidth <= 1024; // Consider tablets and mobile devices
      setIsMobile(isMobileDevice);
    };

    // Initial check
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <Monitor className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-4 text-2xl font-bold">Desktop Display Recommended</h1>
        <p className="text-muted-foreground">
          Our rich visuals and multi-column layout shine on larger screens. Switch to a laptop or desktop to see it all.
        </p>
      </div>
    </div>
  );
} 