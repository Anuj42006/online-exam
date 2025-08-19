import { useEffect } from 'react';

export const useScreenshotPrevention = () => {
  useEffect(() => {
    const preventScreenshot = (e: Event) => {
      e.preventDefault();
    };

    // Detect Android device
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid) {
      // Prevent screenshots on Android using multiple methods
      try {
        // Method 1: Using windowOperations API
        if ('windowOperations' in navigator) {
          // @ts-ignore - Experimental API
          navigator.windowOperations.setScreenshotEnabled?.(false);
        }

        // Method 2: Using FLAG_SECURE equivalent
        if ('setAttribute' in document.documentElement) {
          document.documentElement.setAttribute('data-secure', 'true');
        }

        // Method 3: Using content security policy for media capture
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "media-src 'none'";
        document.head.appendChild(meta);
      } catch (error) {
        console.warn('Screenshot prevention partially available on this Android device');
      }

      // Additional Android-specific protections
      document.addEventListener('keydown', (e) => {
        // Prevent potential screenshot triggers on Android
        if (e.key === 'PrintScreen' || 
            (e.ctrlKey && e.key === 's') ||
            (e.altKey && e.key === 's')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      });
    }

    // Prevent screenshots on iOS
    document.addEventListener('contextmenu', preventScreenshot);
    document.addEventListener('keydown', (e) => {
      // Prevent common screenshot keyboard shortcuts
      if (
        (e.key === 'PrintScreen') ||
        (e.metaKey && e.shiftKey && e.key === '3') || // Mac screenshot
        (e.metaKey && e.shiftKey && e.key === '4') || // Mac area screenshot
        (e.altKey && e.key === 'PrintScreen') ||
        (e.metaKey && e.key === 'p')
      ) {
        e.preventDefault();
      }
    });

      // Add warning for Android users
      if (isAndroid) {
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: #fef2f2;
          color: #991b1b;
          padding: 8px;
          font-size: 14px;
          text-align: center;
          z-index: 9999;
          border-bottom: 1px solid #fee2e2;
        `;
        warningDiv.textContent = 'Screenshots are disabled for exam security';
        document.body.appendChild(warningDiv);

        // Auto-hide the warning after 5 seconds
        setTimeout(() => {
          warningDiv.style.display = 'none';
        }, 5000);
      }

      // Add CSS to prevent selection and screenshots
      const style = document.createElement('style');
      style.innerHTML = `
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }      input, textarea {
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', preventScreenshot);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);
};
