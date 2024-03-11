import { useEffect } from "react";

interface UseOutsideClickProps {
  ref: React.RefObject<HTMLElement>;
  handler: (event: MouseEvent) => void;
}

export const useClickOutside = ({ ref, handler }: UseOutsideClickProps) => {
  // const [isInside, setIsInside] = useState<boolean>(state);
  // const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handler(event);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, handler]);
  // return [isInside, elementRef];
}