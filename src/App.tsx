import { useEffect, useState, useRef } from "react";
import { dateFormatter, isToday, dayViewHandler } from "./utils/functions";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "./hooks/useClickOutside";
import { useEscapeKey } from "./hooks/useEscapeKey";
import { Tooltip } from "react-tooltip";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  completeDaily,
  deleteSelectedCalendar,
  setSelectedCalendar,
  toggleView,
  updateDescription,
  updateTitle,
  setACM,
  setEditingDay,
  setNIM,
  updatePerformed,
} from "./redux/generalSlice";
import { Settings } from "./components/Settings";
import { AddCalendarModal } from "./components/AddCalendarModal";
import { NumberInputModal } from "./components/NumberInputModal";
import { Tab } from "./components/Tab";
import Logo from "./assets/hedef.svg";
import "driver.js/dist/driver.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";
import { MdAccountCircle } from "react-icons/md";
import Footer from "./components/Footer";
import InfoGraph from "./components/InfoGraph";
import { days } from "./utils/data";
import { dayStyles, dayProgressStyle } from "./styles";

function App() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const { calendars, selectedCalendar, isPastLocked, view, ACM, NIM } = useAppSelector(
    (s) => s.general
  );
  const dispatch = useAppDispatch();
  const scrollHorRef = useHorizontalScroll();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: deleteModalRef,
    handler: () => setIsModalVisible(false),
  });

  useEscapeKey(() => setIsModalVisible(false), isModalVisible);

  useEffect(() => {
    if (isModalVisible || ACM || NIM) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalVisible, ACM, NIM]);

  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentTimestamp(Date.now()),
      10000
    );
    console.log(Date.now());
    return () => clearInterval(intervalId);
  }, []);

  const completeHandler = (day: number, calendar: any, button: number = 0) => {
    if (calendar.habitFormat === "check") {
      dispatch(completeDaily(day));
    }
    else if (calendar.habitFormat === "number") {
      dispatch(setEditingDay(day));
      dispatch(setNIM(true));
    }
    else if (calendar.habitFormat === "time") {
      const currentDay = calendar.calendar.find((d: any) => d.day === day);
      if (!currentDay) return;
      const currentPerformed = currentDay.goal.performed;
      if (button === 0) {
        dispatch(updatePerformed({ day, performed: currentPerformed + 1 }));
      } else if (button === 2) {
        dispatch(updatePerformed({ day, performed: Math.max(0, currentPerformed - 1) }));
      }
    }
  };

  const handleSwipe = (day: any, calendar: any, info: any) => {
    if (window.innerWidth >= 768 || calendar.habitFormat !== "time") return;

    if (
      isPastLocked &&
      
      !isToday(day.timestamp, currentTimestamp) || 
      day.timestamp > currentTimestamp 
    ) {
      return;
    }

    const threshold = 20;
    if (info.offset.y < -threshold) {
      completeHandler(day.day, calendar, 0); // Increase
    } else if (info.offset.y > threshold) {
      completeHandler(day.day, calendar, 2); // Decrease
    }
  };


  const deleteHandler = (i: number) => {
    dispatch(setSelectedCalendar(i));
    setIsModalVisible(true);
    // dispatch(deleteSelectedCalendar(i));
  };

  // const addCalendarHandler = () => {
  //   dispatch(setACM(true));
  // };

  // const isDayZero = !!calendars[selectedCalendar].calendar.find(
  //   (d) => d.day === 0
  // );

  // useEffect(() => {
  //   const isDayZero = !!calendars[selectedCalendar].calendar.find(d => d.day === 0)
  // }, [])

  // const deleteSelected = (
  //   e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //   i: number
  // ) => {
  //   if (e.button === 1) dispatch(deleteSelectedCalendar(i));
  // };

  return (
    <>
    {/* MODAL {#ffb727, 55} */}
      <AnimatePresence>
        {isModalVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
          >
            <motion.div
              ref={deleteModalRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-neutral-800/80 border border-white/10 p-8 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] w-[90%] max-w-md overflow-hidden relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

              <h2 className="text-2xl font-black text-white mb-6 text-center font-grotesque tracking-tight relative z-10">
                DELETE CALENDAR?
              </h2>

              <p className="mb-10 text-neutral-300 text-center relative z-10 font-medium leading-relaxed">
                Are you sure you want to delete this calendar? This action cannot be undone.
              </p>

              <div className="flex gap-4 justify-between relative z-10">
                <motion.button
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors"
                  onClick={() => setIsModalVisible(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.85 }}
                  className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-600 text-black font-black shadow-[0_2px_30px_rgba(217,27,6,0.891)]"
                  onClick={() => {
                    setIsModalVisible(false);
                    dispatch(deleteSelectedCalendar(selectedCalendar));
                  }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER {#989898} */}
      <nav className="w-full px-10 flex justify-between items-center text-gold bg-neutral-7500 select-none">
        <button
          className="cursor-pointer text-4xl w-10 h-10 flex items-center justify-center"
          onClick={() => dispatch(toggleView())}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {[
              // Path 1: Top Left Grid -> Top Bar Left Compact
              { 
                grid: "M3 11h8V3H3z", 
                compact: "M3 11h9V7H3z" 
              },
              // Path 2: Top Right Grid -> Top Bar Right Compact
              { 
                grid: "M13 11h8V3H13z", 
                compact: "M12 11h9V7H12z" 
              },
              // Path 3: Bottom Left Grid -> Bottom Left Compact
              { 
                grid: "M3 21h8v-8H3z", 
                compact: "M3 17h7v-4H3z" 
              },
              // Path 4: Bottom Right Grid -> Bottom Right Compact
              { 
                grid: "M13 21h8v-8H13z", 
                compact: "M11 17h10v-4H11z" 
              }
            ].map((p, i) => (
              <motion.path
                key={i}
                animate={{ d: view === "grid" ? p.grid : p.compact }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            ))}
          </svg>
        </button>
        <img className="w-40 lg:w-72 py-7" id="logo" src={Logo} alt="hedef" />
        <MdAccountCircle
          size={40}
          className="cursor-pointer"
        />
      </nav>

      <div
        id="my-calendar"
        className="pt-2 pb-10 mb-10 flex flex-col justify-center items-center gap-8 bg-neutral-800 text-white select-none"
      >
        {/* TABS {#08c9ff} */}
        <div
          id="tabs"
          ref={scrollHorRef}
          className="sticky top-0 z-50 w-full overflow-x-auto overflow-y-hidden flex items-center gap-3 bg-neutral-750 self-start shadow-xl shadow-black/20"
        >
          <AnimatePresence mode="popLayout">
            {calendars.map((c, i) => (
              <Tab
                key={c.id}
                c={c}
                i={i}
                selectedCalendar={selectedCalendar}
                deleteHandler={deleteHandler}
              />
            ))}
          </AnimatePresence>
          <IoIosAddCircleOutline
            className="flex-none mr-2 text-white hover:text-gold opacity-40 hover:opacity-100 smoother-2 cursor-pointer ml-1"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setACM(true));
            }}
          />
        </div>

        {/* TITLE & DESC {#fbfd6e} */}
        <div className="flex flex-col items-center gap-3 d-sm:mt-16?">
          <input
            type="text"
            id="task-title"
            className="w-fit bg-transparent text-2xl font-bold text-center outline-none"
            value={calendars[selectedCalendar].title}
            onChange={(e) => dispatch(updateTitle(e.target.value))}
            placeholder="Goal"
            maxLength={20}
          />
          <input
            type="text"
            id="task-desc"
            className="w-fit bg-transparent text-sm font-light text-center opacity-30 outline-none"
            value={calendars[selectedCalendar].description || ""}
            onChange={(e) => dispatch(updateDescription(e.target.value))}
            placeholder="description"
            maxLength={20}
          />
          {/* <p className="text-sm text-gold">
            {new Date(
              calendars[selectedCalendar].calendar[0].timestamp
            ).getFullYear()}
          </p> */}
          {/* <div className="flex items-center gap-2">
            <p className="text-sm text-gold">{calendars[selectedCalendar].habitFormat} - </p>
            <p className="text-sm text-gold">{calendars[selectedCalendar].target}</p>
          </div> */}
        </div>

        {/* GRID VIEW {#b300ff, 100} */}
        {view === "grid" && (
          <div id="calendar" className="px-5 sm:px-3 md:px-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, monthIndex) => {
              const selCal = calendars[selectedCalendar];
              const currentCalendarData = calendars[selectedCalendar].calendar;
              // console.log('currentCalendarData: ', currentCalendarData)
              const monthDays = currentCalendarData.filter(
                (day) => new Date(day.timestamp).getMonth() === monthIndex
              );

              if (monthDays.length === 0) return null;

              const date = new Date(monthDays[0].timestamp);
              const monthName = date.toLocaleString("default", {
                month: "long",
              });

              // Calculate offset for Monday start (0=Mon, ..., 6=Sun)
              const firstDayOfWeek = date.getDay();
              const offset = (firstDayOfWeek + 6) % 7;

              return (
                <div key={monthIndex} className="flex flex-col gap-2">
                  <h3 className="text-center font-bold text-lg text-gold">
                    {monthName}
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {/* Month headers */}
                    {days.map((d) => (
                      <div
                        key={d}
                        className="text-neutral-500 text-[10px] text-center font-grotesque"
                      >
                        {d.slice(0, 2)}
                      </div>
                    ))}

                    {/* Spacers */}
                    {Array(offset)
                      .fill(0)
                      .map((_, i) => (
                        <div key={`spacer-${i}`} />
                      ))}

                    {/* Days */}
                    {monthDays.map((day) => (
                      <motion.button
                        key={day.day}
                        id={isToday(day.timestamp, currentTimestamp) ? "today" : ""}
                        className={dayStyles(isPastLocked, day, currentTimestamp, selCal)}
                        data-tooltip-id="date"
                        data-tooltip-content={dateFormatter(day.timestamp)}
                        data-tooltip-place="top"
                        onPanEnd={(_, info) => handleSwipe(day, selCal, info)}
                        onContextMenu={(e) => {
                          if (selCal.habitFormat === "time") e.preventDefault();
                        }}
                        onMouseDown={(e) => {
                          if (
                            e.button === 2 &&
                            selCal.habitFormat === "time"
                          ) {
                            if (
                              isPastLocked &&
                              day.timestamp < currentTimestamp &&
                              !isToday(day.timestamp, currentTimestamp)
                            ) {
                              return;
                            }
                            completeHandler(day.day, selCal, 2);
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            isPastLocked &&
                            day.timestamp < currentTimestamp &&
                            !isToday(day.timestamp, currentTimestamp)
                          ) {
                            return;
                          }
                          completeHandler(day.day, selCal, 0);
                        }}
                        style={{ touchAction: selCal.habitFormat === 'time' ? 'none' : 'auto' }}
                        disabled={day.timestamp > currentTimestamp}
                      >
                        {(selCal.habitFormat === "number" || selCal.habitFormat === "time") && (
                          <div 
                            className="absolute bottom-0 left-0 w-full transition-all duration-300 ease-in-out pointer-events-none"
                            style={dayProgressStyle(day, selCal)}
                          />
                        )}
                        <span className="relative z-10">{dayViewHandler(selCal, day, currentTimestamp)}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
            <Tooltip id="date" className="tooltip" border="1px solid #8c6000" style={{ borderRadius: 9 }}/>
          </div>
        )}

        {/* LIST VIEW {#b300ff} */}
        {/* <div className="flex flex-wrap gap-3 md:px-20 px-5"> */}
        {view === "list" && (
          <div id="calendar" className="w-full grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-3 md:px-20 px-5">
            {calendars[selectedCalendar].calendar.map((day) => (
              <motion.button
                key={day.day}
                id={isToday(day.timestamp, currentTimestamp) ? "today" : ""}
                className={dayStyles(isPastLocked, day, currentTimestamp, calendars[selectedCalendar])}
                data-tooltip-id="date"
                data-tooltip-content={dateFormatter(day.timestamp)}
                data-tooltip-place="top"
                onPanEnd={(_, info) => handleSwipe(day, calendars[selectedCalendar], info)}
                onContextMenu={(e) => {
                  if (calendars[selectedCalendar].habitFormat === "time") e.preventDefault();
                }}
                onMouseDown={(e) => {
                  const selCal = calendars[selectedCalendar];
                  if (
                    e.button === 2 &&
                    selCal.habitFormat === "time"
                  ) {
                    if (
                      isPastLocked &&
                      day.timestamp < currentTimestamp &&
                      !isToday(day.timestamp, currentTimestamp)
                    ) {
                      return;
                    }
                    completeHandler(day.day, selCal, 2);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    isPastLocked &&
                    day.timestamp < currentTimestamp &&
                    !isToday(day.timestamp, currentTimestamp)
                  ) {
                    return;
                  }
                  completeHandler(day.day, calendars[selectedCalendar], 0);
                }}
                style={{ touchAction: calendars[selectedCalendar].habitFormat === 'time' ? 'none' : 'auto' }}
                disabled={day.timestamp > currentTimestamp}
              >
                {(calendars[selectedCalendar].habitFormat === "number" || calendars[selectedCalendar].habitFormat === "time") && (
                  <div 
                    className="absolute bottom-0 left-0 w-full transition-all duration-300 ease-in-out pointer-events-none"
                    style={dayProgressStyle(day, calendars[selectedCalendar])}
                  />
                )}
                <span className="relative z-10">{dayViewHandler(calendars[selectedCalendar], day, currentTimestamp)}</span>
              </motion.button>
            ))}
            <Tooltip id="date" className="tooltip" border="1px solid #8c6000" style={{ borderRadius: 9 }} />
          </div>
        )}
      </div>

      <AddCalendarModal />
      <NumberInputModal />
      <Settings setIsModalVisible={setIsModalVisible} />
      <InfoGraph />
      <Footer />
    </>
  );
}

export default App;
