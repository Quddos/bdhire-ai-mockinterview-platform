import { useState, useEffect } from 'react';

export const useSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    try {
      const subscriptionStatus = localStorage.getItem('youtubeSubscribed');
      setIsSubscribed(subscriptionStatus === 'true');
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  }, []);

  const handleSubscribe = () => {
    setIsSubscribed(true);
  };

  return { isSubscribed, handleSubscribe };
}; 