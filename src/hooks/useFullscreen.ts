import { useState, useEffect, useCallback } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Sync fullscreen state with browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const fullscreenElem =
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;

      setIsFullscreen(!!fullscreenElem);
      if (!fullscreenElem) {
        // If user pressed ESC or browser exited fullscreen, turn off presentation mode if desired
        setIsPresentationMode(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Enter browser fullscreen mode
  const enterFullscreen = useCallback(async (enablePresentation = true) => {
    try {
      const elem = document.documentElement as any;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
      if (enablePresentation) {
        setIsPresentationMode(true);
      }
    } catch (err) {
      console.warn('Fullscreen API request was blocked or not supported:', err);
      // Fallback: Enable presentation mode inside the tab
      setIsPresentationMode(true);
    }
  }, []);

  // Exit browser fullscreen mode
  const exitFullscreen = useCallback(async () => {
    try {
      const doc = document as any;
      if (
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Error attempting to exit fullscreen:', err);
    }
    setIsFullscreen(false);
    setIsPresentationMode(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen || isPresentationMode) {
      exitFullscreen();
    } else {
      enterFullscreen(true);
    }
  }, [isFullscreen, isPresentationMode, enterFullscreen, exitFullscreen]);

  const togglePresentationMode = useCallback(() => {
    setIsPresentationMode((prev) => !prev);
  }, []);

  return {
    isFullscreen,
    isPresentationMode,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    togglePresentationMode,
  };
}
