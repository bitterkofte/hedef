import { useEffect, useState, useRef } from "react";
import { dateFormatter, isToday, dayViewHandler } from "./utils/functions";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "./hooks/useClickOutside";
import { Tooltip } from "react-tooltip";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  addCalendar,
  completeDaily,
  deleteSelectedCalendar,
  setSelectedCalendar,
  toggleView,
  updateDescription,
  updateTitle,
  setACM,
  setEditingDay,
  setNIM,
} from "./redux/generalSlice";
import { Settings } from "./components/Settings";
import { AddCalendarModal } from "./components/AddCalendarModal";
import { NumberInputModal } from "./components/NumberInputModal";
import Logo from "./assets/hedef.svg";
import "driver.js/dist/driver.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";
import { MdOutlineGridView, MdOutlineViewCompact } from "react-icons/md";
import Footer from "./components/Footer";
import InfoGraph from "./components/InfoGraph";
import { days } from "./utils/data";
import { dayStyles } from "./styles";

function App() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const { calendars, selectedCalendar, isPastLocked, view, ACM, NIM, hType, hFormat } = useAppSelector(
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

  const completeHandler = (day: number, calendar: any) => {
    if (calendar.habitFormat === "check") {
      dispatch(completeDaily(day));
    }
    else if (calendar.habitFormat === "number") {
      dispatch(setEditingDay(day));
      dispatch(setNIM(true));
    }
    else if (calendar.habitFormat === "time") {
      return;
    }
  };

  const deleteHandler = (i: number) => {
    setSelectedCalendar(i);
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
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.85 }}
                  className="flex-1 py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-black font-black shadow-[0_10px_30px_rgba(217,119,6,0.2)]"
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
          className="cursor-pointer text-4xl"
          onClick={() => dispatch(toggleView())}
        >
          {view === "grid" ? <MdOutlineGridView /> : <MdOutlineViewCompact />}
        </button>
        <img className="w-40 lg:w-72 py-7" src={Logo} alt="hedef" />
        <MdOutlineGridView
          size={40}
          className="cursor-pointer"
          onClick={() => dispatch(toggleView())}
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
          className="w-full overflow-x-auto overflow-y-hidden flex items-center gap-3 bg-neutral-750 self-start"
        >
          {calendars.map((c, i) => (
            <div
              id={"tab-" + i}
              key={c.id}
              // onMouseDown={(e) => e.button === 1 && deleteSelected(e, i)}
              onMouseDown={(e) => e.button === 1 && deleteHandler(i)} //basılı tutma penceresi
              onClick={() => dispatch(setSelectedCalendar(i))}
              className={`${
                i === selectedCalendar
                  ? "bg-gold opacity-100"
                  : "bg-white opacity-25 hover:opacity-100"
              } flex-none px-2 py-1 text-sm text-black smoother-3 cursor-pointer`}
            >
              {c.title === "" ? "-undefined-" : c.title}
            </div>
          ))}
          <IoIosAddCircleOutline
            className="flex-none mr-2 text-white hover:text-gold opacity-40 hover:opacity-100 smoother-2 cursor-pointer"
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
          <p className="text-sm text-gold">
            {new Date(
              calendars[selectedCalendar].calendar[0].timestamp
            ).getFullYear()}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gold">{calendars[selectedCalendar].habitFormat} - </p>
            <p className="text-sm text-gold">{calendars[selectedCalendar].target}</p>
          </div>
        </div>

        {/* GRID VIEW {#b300ff, 76} */}
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
                      <button
                        key={day.day}
                        id={isToday(day.timestamp, currentTimestamp) ? "today" : ""}
                        className={dayStyles(isPastLocked, day, currentTimestamp, selCal)}
                        data-tooltip-id="date"
                        data-tooltip-content={dateFormatter(day.timestamp)}
                        data-tooltip-place="top"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            isPastLocked &&
                            day.timestamp < currentTimestamp &&
                            !isToday(day.timestamp, currentTimestamp)
                          ) {
                            return;
                          }
                          completeHandler(day.day, calendars[selectedCalendar]);
                        }}
                        disabled={day.timestamp > currentTimestamp}
                      >
                        {dayViewHandler(calendars[selectedCalendar], day, currentTimestamp)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            <Tooltip id="date" border="1px solid #8c6000" style={{ borderRadius: 9 }}/>
          </div>
        )}

        {/* LIST VIEW {#b300ff} */}
        {/* <div className="flex flex-wrap gap-3 md:px-20 px-5"> */}
        {view === "list" && (
          <div id="calendar" className="w-full grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-3 md:px-20 px-5">
            {calendars[selectedCalendar].calendar.map((day) => (
              <button
              key={day.day}
              id={isToday(day.timestamp, currentTimestamp) ? "today" : ""}
                className={dayStyles(isPastLocked, day, currentTimestamp, calendars[selectedCalendar])}
                data-tooltip-id="date"
                data-tooltip-content={dateFormatter(day.timestamp)}
                data-tooltip-place="top"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    isPastLocked &&
                    day.timestamp < currentTimestamp &&
                    !isToday(day.timestamp, currentTimestamp)
                  ) {
                    return;
                  }
                  completeHandler(day.day, calendars[selectedCalendar]);
                }}
                disabled={day.timestamp > currentTimestamp}
              >
                {day.day}
              </button>
            ))}
            <Tooltip id="date" border="1px solid #8c6000" style={{ borderRadius: 9 }} />
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
