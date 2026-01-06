import { useEffect } from 'react';

/**
 * Custom hook that listens for the Escape key and executes a handler.
 * @param handler - The function to call when the Escape key is pressed.
 * @param active - Optional boolean to enable/disable the listener (default: true).
 */
export const useEscapeKey = (handler: () => void, active: boolean = true) => {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handler, active]);
};
