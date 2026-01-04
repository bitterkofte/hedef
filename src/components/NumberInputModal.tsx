import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setNIM, setEditingDay, updatePerformed } from '../redux/generalSlice';
import { useClickOutside } from '../hooks/useClickOutside';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose, IoMdCheckmark } from 'react-icons/io';

export const NumberInputModal = () => {
  const { NIM, editingDay, calendars, selectedCalendar } = useAppSelector((s) => s.general);
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>("0");

  const currentDayData = editingDay !== null 
    ? calendars[selectedCalendar].calendar.find(d => d.day === editingDay)
    : null;

  useEffect(() => {
    if (NIM && currentDayData) {
      setValue(currentDayData.goal.performed.toString());
    }
  }, [NIM, currentDayData]);

  useClickOutside({
    ref: modalRef,
    handler: () => {
      dispatch(setNIM(false));
      dispatch(setEditingDay(null));
    }
  });

  const handleEnter = () => {
    if (editingDay !== null) {
      dispatch(updatePerformed({ day: editingDay, performed: Number(value) }));
    }
    dispatch(setNIM(false));
    dispatch(setEditingDay(null));
  };

  const handleCancel = () => {
    dispatch(setNIM(false));
    dispatch(setEditingDay(null));
  };

  const appendNumber = (num: string) => {
    setValue(prev => {
      if (prev === "0") return num;
      // Limit to a reasonable length, e.g., 6 digits
      if (prev.length >= 6) return prev;
      return prev + num;
    });
  };

  const deleteNumber = () => {
    setValue(prev => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const btnFuncitoner = (btn: string) => {
    if(btn === "AC") setValue("0")
    else if(btn === "DEL") deleteNumber()
    else appendNumber(btn)
  }

  const numpad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "AC", "0", "DEL"];

  return (
    <AnimatePresence>
      {NIM && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-md"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-neutral-800/80 border border-white/10 p-8 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] w-[90%] max-w-[320px] overflow-hidden relative"
          >
             {/* Background Gradient Blob */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="text-center mb-6 relative z-10">
              <span className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-black">
                DAY {editingDay} PROGRESS
              </span>
            </div>

            <div className="relative mb-8 z-10">
              <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-20 flex items-center justify-center text-4xl font-black text-gold shadow-inner">
                {value}
              </div>
            </div>

            {/* Custom Numpad */}
            <div className="grid grid-cols-3 gap-3 mb-8 relative z-10">
              {numpad.map((btn) => (
                <motion.button
                  key={btn}
                  // whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => btnFuncitoner(btn)}
                  className={`h-14 rounded-xl flex items-center justify-center text-xl font-bold hover:scale-110 transition-all duration-300 ${
                    btn === "DEL" 
                      ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20" 
                    : btn === "AC" 
                      ? "bg-red-700/30 hover:bg-red-700/50 text-red-500 border border-red-500/20" 
                      : "bg-white/[0.03] hover:bg-white/[0.05] text-white border border-white/5"
                  } `}
                >
                  {btn}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-4 relative z-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/5 flex items-center justify-center gap-2 transition-colors"
              >
                <IoMdClose size={20} />
                <span className="text-xs uppercase tracking-wider">Cancel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.85 }}
                onClick={handleEnter}
                className="flex-1 py-4 rounded-xl bg-gold hover:bg-yellow-400 text-black font-black shadow-[0_10px_20px_rgba(217,119,6,0.2)] flex items-center justify-center gap-2 transition-all"
              >
                <IoMdCheckmark size={20} />
                <span className="text-xs uppercase tracking-wider">Enter</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
