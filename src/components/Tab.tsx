import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState, forwardRef } from "react";
import { CalendarType } from "../types";
import { useAppDispatch } from "../redux/hooks";
import { setSelectedCalendar } from "../redux/generalSlice";

interface TabProps {
  c: CalendarType;
  i: number;
  selectedCalendar: number;
  deleteHandler: (i: number) => void;
}

export const Tab = forwardRef<HTMLDivElement, TabProps>(
  ({ c, i, selectedCalendar, deleteHandler }, ref) => {
    const dispatch = useAppDispatch();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isLongPress, setIsLongPress] = useState(false);
    const [isPressing, setIsPressing] = useState(false);

    const startLongPress = useCallback(() => {
      // Only on mobile view (width <= 768px as a common breakpoint)
      if (window.innerWidth > 768) return;

      setIsPressing(true);
      setIsLongPress(false);
      timerRef.current = setTimeout(() => {
        deleteHandler(i);
        setIsLongPress(true);
        setIsPressing(false);
      }, 3000);
    }, [deleteHandler, i]);

    const endLongPress = useCallback(() => {
      setIsPressing(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const handleClick = useCallback(() => {
      if (isLongPress) {
        setIsLongPress(false);
        return;
      }
      dispatch(setSelectedCalendar(i));
    }, [dispatch, i, isLongPress]);

    return (
      <motion.div
        ref={ref}
        id={"tab-" + i}
        layout
        initial={{ opacity: 0, x: -50 }}
        animate={{
          opacity: 1,
          x: 0,
          backgroundColor: i === selectedCalendar ? "#f59e0b" : "#737373",
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={
          i !== selectedCalendar ? { backgroundColor: "#ffffff" } : {}
        }
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          opacity: { duration: 0.2 },
          backgroundColor: { duration: 0.3 },
        }}
        onMouseDown={(e) => {
          if (e.button === 1) deleteHandler(i);
        }}
        onTouchStart={startLongPress}
        onTouchEnd={endLongPress}
        onTouchCancel={endLongPress}
        onContextMenu={(e) => {
          if (window.innerWidth <= 768) e.preventDefault();
        }}
        onClick={handleClick}
        className={`${
          i === selectedCalendar ? "opacity-100 font-bold" : "font-normal"
        } shadow-sm flex-none px-2 py-1 text-sm text-black cursor-pointer rounded-sm relative overflow-hidden`}
      >
        <span className="relative z-10">
          {c.title === "" ? "-undefined-" : c.title}
        </span>

        {/* Long press progress indicator */}
        <AnimatePresence>
          {isPressing && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "linear", delay: 2 }}
              className="absolute bottom-0 left-0 h-full bg-red-500/70 z-20"
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

