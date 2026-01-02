import { useEffect, useState } from "react";
import { dateFormatter, isToday } from "./utils/functions";
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
} from "./redux/generalSlice";
import { Settings } from "./components/Settings";
import { AddCalendarModal } from "./components/AddCalendarModal";
import Logo from "./assets/hedef.svg";
import "driver.js/dist/driver.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";
import { MdOutlineGridView, MdOutlineViewCompact } from "react-icons/md";
import Footer from "./components/Footer";
import InfoGraph from "./components/InfoGraph";
import { days } from "./utils/data";

function App() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const { calendars, selectedCalendar, isPastLocked, view, ACM, hType, hFormat } = useAppSelector(
    (s) => s.general
  );
  const dispatch = useAppDispatch();
  const scrollHorRef = useHorizontalScroll();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentTimestamp(Date.now()),
      10000
    );
    console.log(Date.now());
    return () => clearInterval(intervalId);
  }, []);

  const completeHandler = (day: number) => {
    dispatch(completeDaily(day));
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
      {isModalVisible && (
        <div className="backdrop-blur-xl fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-amber-700 p-4 rounded-lg drop-shadow-xl">
            <p className="mb-5">
              Are you sure you want to delete this calendar?
            </p>
            <div className="flex gap-2 justify-between">
              <button
                className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500"
                onClick={() => setIsModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500"
                onClick={() => {
                  setIsModalVisible(false);
                  dispatch(deleteSelectedCalendar(selectedCalendar));
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
          {/* <div className='absolute p-5 bg-lime-600 z-50'>
            
          </div> */}
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
        </div>

        {/* GRID VIEW {#b300ff, 95} */}
        {view === "grid" && (
          <div id="calendar" className="px-5 sm:px-3 md:px-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, monthIndex) => {
              const currentCalendarData = calendars[selectedCalendar].calendar;
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
                        className={`w-8 h-8 text-xs p-1 border flex justify-center items-center rounded-full  disabled:border-neutral-600 disabled:text-neutral-600 md:disabled:border-neutral-600 md:disabled:text-neutral-600 disabled:cursor-default smoother-2 
                        ${
                          isPastLocked &&
                          day.timestamp < currentTimestamp &&
                          !isToday(day.timestamp, currentTimestamp)
                            ? "cursor-default opacity-60"
                            : "cursor-pointer opacity-100 md:hover:border-green-600 md:hover:text-green-600"
                        }
                        ${
                          day.goal.completed === "yes"
                            ? "border-green-600 text-green-600 hover:border-green-600 hover:text-green-600"
                            : ""
                        } ${
                          isToday(day.timestamp, currentTimestamp) &&
                          day.goal.completed !== "yes"
                            ? "border-gold text-gold"
                            : ""
                        } ${
                          day.goal.completed === "no" &&
                          !isToday(day.timestamp, currentTimestamp)
                            ? "border-neutral-400 text-neutral-400"
                            : ""
                        }`}
                        data-tooltip-id="date"
                        data-tooltip-content={dateFormatter(day.timestamp)}
                        data-tooltip-place="top"
                        onClick={() => {
                          if (
                            isPastLocked &&
                            day.timestamp < currentTimestamp &&
                            !isToday(day.timestamp, currentTimestamp)
                          ) {
                            return;
                          }
                          completeHandler(day.day);
                        }}
                        disabled={day.timestamp > currentTimestamp}
                      >
                        {day.day}
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
                className={`w-8 h-8 text-xs p-1 border flex justify-center items-center rounded-full  disabled:border-neutral-600 disabled:text-neutral-600 md:disabled:border-neutral-600 md:disabled:text-neutral-600 disabled:cursor-default smoother-2 
                        ${
                          isPastLocked &&
                          day.timestamp < currentTimestamp &&
                          !isToday(day.timestamp, currentTimestamp)
                            ? "cursor-default opacity-60"
                            : "cursor-pointer opacity-100 md:hover:border-green-600 md:hover:text-green-600"
                        }
                        ${
                          day.goal.completed === "yes"
                            ? "border-green-600 text-green-600 hover:border-green-600 hover:text-green-600"
                            : ""
                        } ${
                  isToday(day.timestamp, currentTimestamp) &&
                  day.goal.completed !== "yes"
                    ? "border-gold text-gold"
                    : ""
                } ${
                  day.goal.completed === "no" &&
                  !isToday(day.timestamp, currentTimestamp)
                    ? "border-neutral-400 text-neutral-400"
                    : ""
                }`}
                data-tooltip-id="date"
                data-tooltip-content={dateFormatter(day.timestamp)}
                data-tooltip-place="top"
                onClick={() => {
                  if (
                    isPastLocked &&
                    day.timestamp < currentTimestamp &&
                    !isToday(day.timestamp, currentTimestamp)
                  ) {
                    return;
                  }
                  completeHandler(day.day);
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
      <Settings setIsModalVisible={setIsModalVisible} />
      <InfoGraph />
      <Footer />
    </>
  );
}

export default App;
