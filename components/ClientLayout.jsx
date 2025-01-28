'use client';

import { usePathname } from 'next/navigation';
import SubscriptionModal from './SubscriptionModal';
import { useSubscription } from '../hooks/useSubscription';
import { useEffect } from 'react';

export default function ClientLayout({ children }) {
  const { isSubscribed, handleSubscribe } = useSubscription();
  const pathname = usePathname();

  // List of paths that should show the modal after 30 seconds or 2 button clicks
  const immediateModalPaths = [
    '/tools/tool1',
    '/tools/tool2',
    '/tools/converter',
    '/tools/qrcode',
    '/test'
  ];

  // List of paths that should show modal on scroll
  const scrollModalPaths = [
    '/tools/tool3',
    '/tools/tool4',
    '/about',
    '/tools/interview',
    '/tools//research-analysis',
    '/tools/resume-analysis',
    'tools/business-idea'
  ];

  const shouldShowImmediately = immediateModalPaths.includes(pathname);
  const shouldShowOnScroll = scrollModalPaths.includes(pathname);

  // Debug logs
  useEffect(() => {
    console.log('Current path:', pathname);
    console.log('Should show immediately:', shouldShowImmediately);
    console.log('Is subscribed:', isSubscribed);
  }, [pathname, shouldShowImmediately, isSubscribed]);

  // Don't show modal if path is not in either list
  if (!shouldShowImmediately && !shouldShowOnScroll) {
    return <>{children}</>;
  }

  return (
    <>
      <SubscriptionModal 
        onSubscribe={handleSubscribe} 
        showImmediately={shouldShowImmediately}
      />
      {children}
    </>
  );
} 0