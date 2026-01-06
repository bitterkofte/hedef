import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addCalendar, setACM, setHType, setHFormat, setHTarget } from '../redux/generalSlice';
import { useClickOutside } from '../hooks/useClickOutside';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

export const AddCalendarModal = () => {
  const { ACM, hType, hFormat, hTarget } = useAppSelector((s) => s.general);
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

  useEscapeKey(() => {
    dispatch(setACM(false));
    dispatch(setHTarget(0));
  }, ACM);

  useClickOutside({
    ref: modalRef,
    handler: () => {
      dispatch(setHTarget(0));
      dispatch(setACM(false));
    }
  });

  const habitTypes: ("daily" | "weekly")[] = ["daily", "weekly"];
  const habitFormats: ("check" | "number" | "time")[] = ["check", "number", "time"];

  return (
    <AnimatePresence>
      {ACM && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-neutral-800/80 border border-white/10 p-8 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] w-[90%] max-w-md overflow-hidden relative"
          >
            {/* Background Gradient Blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />

            <h2 className="text-3xl font-black text-white mb-10 text-center font-grotesque tracking-tight relative z-10">ADD NEW HABIT</h2>
            
            <div className="space-y-10 relative z-10">
              {/* Habit Type Switch */}
              <div className="flex flex-col gap-4">
                <span className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-black ml-1">Habit Type</span>
                <div className="bg-white/[0.03] p-1 rounded-2xl flex relative border border-white/5 h-14">
                  {habitTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => dispatch(setHType(type))}
                      className={`flex-1 rounded-xl text-xs font-black transition-colors duration-200 relative z-10 ${
                        hType === type ? 'text-black' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                  <motion.div 
                    className="absolute top-1 bottom-1 bg-gold rounded-xl shadow-[0_8px_20px_rgba(245,158,11,0.4)]"
                    animate={{
                      width: `calc((100% - 8px) / 2)`,
                      left: `calc(4px + ${habitTypes.indexOf(hType)} * (100% - 8px) / 2)`
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>

              {/* Habit Format Switch */}
              <div className="flex flex-col gap-4">
                <span className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-black ml-1">Habit Format</span>
                <div className="bg-white/[0.03] p-1 rounded-2xl flex relative border border-white/5 h-14">
                  {habitFormats.map((format) => (
                    <button
                      key={format}
                      onClick={() => dispatch(setHFormat(format))}
                      className={`flex-1 rounded-xl text-xs font-black transition-colors duration-200 relative z-10 ${
                        hFormat === format ? 'text-black' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                  <motion.div 
                    className="absolute top-1 bottom-1 bg-gold rounded-xl shadow-[0_8px_20px_rgba(245,158,11,0.4)]"
                    animate={{
                      width: `calc((100% - 8px) / 3)`,
                      left: `calc(4px + ${habitFormats.indexOf(hFormat)} * (100% - 8px) / 3)`
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>

              {/* Habit Target Input */}
              <div className="flex flex-col gap-4">
                <span className={`text-[10px] uppercase tracking-[0.2em] font-black ml-1 transition-colors duration-300 ${hFormat === 'check' ? 'text-neutral-700' : 'text-neutral-500'}`}>
                  Habit Target
                </span>
                <div className="relative group">
                  <input
                    type="number"
                    disabled={hFormat === "check"}
                    value={hFormat === "check" ? 0 : hTarget}
                    // value={hFormat === "check" ? 0 : hTarget === 0 ? null : hTarget}
                    onChange={(e) => dispatch(setHTarget(Number(e.target.value)))}
                    onFocus={(e) => e.target.select()}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-6 text-white selection:bg-gold/80 font-bold outline-none focus:border-gold/50 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed group-hover:bg-white/[0.05] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter target..."
                  />
                  {hFormat !== "check" && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 text-[10px] font-black pointer-events-none">
                      VALUE
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2, transition: {duration: 0.2}}}
                whileTap={{ scale: 0.85 }}
                onClick={() => dispatch(addCalendar())}
                className="w-full bg-gold hover:bg-yellow-400 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.4)] mt-6"
              >
                <IoIosAddCircleOutline size={28} />
                <span className="text-sm tracking-wider">CREATE CALENDAR</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
