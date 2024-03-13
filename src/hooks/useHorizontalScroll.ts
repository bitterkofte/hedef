import { useRef, useEffect } from 'react';

export function useHorizontalScroll() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return; // Ignore vertical scrolling
      e.preventDefault();
      // el?.scrollTo({ left: el.scrollLeft + e.deltaY, behavior: 'smooth' });
      el!.scrollLeft += e.deltaY;
    };
    el?.addEventListener('wheel', onWheel);
    return () => el?.removeEventListener('wheel', onWheel);
  }, []);

  return elRef;
}
