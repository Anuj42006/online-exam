import { useEffect, useRef } from 'react';

export function useExamSecurity(onSecurityViolation: (timeRemaining: number) => void, isSubmitted: boolean) {
  const onSecurityViolationRef = useRef(onSecurityViolation);

  // Update the callback ref when it changes
  useEffect(() => {
    onSecurityViolationRef.current = onSecurityViolation;
  }, [onSecurityViolation]);

  useEffect(() => {
    if (isSubmitted) return;

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable copy, cut, paste
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 'x' || e.key === 'v' || e.key === 'a')
      ) {
        e.preventDefault();
        return false;
      }
      
      // Disable F12, Ctrl+Shift+I, Ctrl+U
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Handle tab switching and window focus loss
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onSecurityViolationRef.current(0);
      }
    };

    const handleBlur = () => {
      onSecurityViolationRef.current(0);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your exam will be submitted.';
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      // Remove event listeners
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Re-enable text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [isSubmitted]);
}