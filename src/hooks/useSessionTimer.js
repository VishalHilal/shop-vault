import { useState, useEffect } from 'react';
import { formatTimeRemaining } from '../utils/auth';

export function useSessionTimer(session) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    if (!session) return;

    const update = () => {
      const remaining = session.expiresAt - Date.now();
      setTimeLeft(formatTimeRemaining(session.expiresAt));
      setIsExpiringSoon(remaining < 60000 && remaining > 0);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [session?.expiresAt]);

  return { timeLeft, isExpiringSoon };
}
