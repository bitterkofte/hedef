import { useEffect, useState } from "react";
import { dateFormatter, isToday } from "./utils/functions";
import { Tooltip } from "react-tooltip";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { addCalendar, completeDaily, setSelectedCalendar, updateDescription, updateTitle } from "./redux/generalSlice";
import { Settings } from "./components/Settings";
import Logo from './assets/hedef.svg'
import { homeGuide } from "./utils/guides";
import { IoInformationSharp } from "react-icons/io5";
import "driver.js/dist/driver.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";


function App() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const { calendars, selectedCalendar } = useAppSelector((s) => s.general);
  const dispatch = useAppDispatch();
  const scrollHorRef = useHorizontalScroll();
  
  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentTimestamp(Date.now()),
      10000
    );
    return () => clearInterval(intervalId);
  }, []);

  const completeHandler = (day: number) => {
    dispatch(completeDaily(day));
  };

  const isDayZero = !!calendars[selectedCalendar].calendar.find(d => d.day === 0)
  // useEffect(() => {
  //   const isDayZero = !!calendars[selectedCalendar].calendar.find(d => d.day === 0)
  // }, [])

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <>
      <nav className="w-full flex justify-center items-center bg-neutral-7500 select-none">
        <img className='w-40 lg:w-72 py-7' src={Logo} alt='hedef' />
      </nav>

      <div id="my-calendar" className="pt-2 mb-20 flex flex-col justify-center items-center gap-8 bg-neutral-800 text-white select-none">
        <div ref={scrollHorRef} className='w-full overflow-x-auto flex items-center gap-3 bg-neutral-750 self-start'>
          {calendars.map((c,i) => (
            <div key={c.id} onClick={() => dispatch(setSelectedCalendar(i))} className={`${i === selectedCalendar ? "bg-gold opacity-100" : "bg-white opacity-25 hover:opacity-100"} flex-none px-2 py-1 text-sm text-black smoother-3 cursor-pointer`}>
              { c.title }
            </div>
          ))}
          <IoIosAddCircleOutline className="flex-none mr-2 text-white hover:text-gold opacity-40 hover:opacity-100 smoother-2 cursor-pointer" size={20} onClick={() => dispatch(addCalendar())}/>
        </div>
        <div className='flex flex-col items-center gap-3 d-sm:mt-28'>
          <input type='text' id="task-title" className='w-fit bg-transparent text-2xl font-bold text-center outline-none' value={calendars[selectedCalendar].title} onChange={(e) => dispatch(updateTitle(e.target.value))} placeholder='Goal' maxLength={20} />
          <input type='text' id="task-desc" className='w-fit bg-transparent text-sm font-light text-center opacity-30 outline-none' value={calendars[selectedCalendar].description || ""} onChange={(e) => dispatch(updateDescription(e.target.value))} placeholder='description' maxLength={20} />
        </div>
        <div id="calendar" className="px-5 sm:px-3 md:px-2 grid grid-cols-7 gap-3 md:gap-4">
          {days.map((d) => (
              <div key={d} className="border-0 text-neutral-500 text-xs text-center font-grotesque">{ d.slice(0,3) }</div>
          ))}
          {isDayZero && Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-3 border-0"></div>
          ))}
          {calendars[selectedCalendar].calendar.map((day) => (
            <button
              key={day.day}
              className={`w-10 h-10 md:w-12 md:h-12 p-3 border-2 flex justify-center items-center rounded-full md:hover:border-green-600 md:hover:text-green-600 disabled:border-neutral-600 disabled:text-neutral-600 md:disabled:border-neutral-600 md:disabled:text-neutral-600 cursor-pointer disabled:cursor-default smoother-2 ${
                day.completed === "yes" ? "border-green-600 text-green-600 hover:border-green-600 hover:text-green-600" : ""
              } ${(isToday(day.timestamp, currentTimestamp) && day.completed !== "yes") ? "border-gold text-gold" : "" }`}
              data-tooltip-id="date"
              data-tooltip-content={dateFormatter(day.timestamp)}
              data-tooltip-place="top"
              onClick={() => completeHandler(day.day)}
              disabled={day.timestamp > currentTimestamp}
            >
              {day.day}
            </button>
          ))}
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 md:w-12 md:h-12 p-3 border-2 flex justify-center items-center rounded-full border-neutral-500 text-neutral-500 hover:border-violet-600 hover:text-violet-600"
                data-tooltip-id="bayram"
                data-tooltip-content={dateFormatter(
                  1712696400000 + i * 86400000
                )}
                data-tooltip-place="top"
              >
                {i + 1}
              </div>
            ))}
          <Tooltip id="date" />
          <Tooltip id="bayram" style={{ background: "#581c87" }} />
        </div>
      </div>

      <div className='fixed z-10 left-3 bottom-3 p-2 squircle cursor-pointer' onClick={() => homeGuide.drive()}>
        <IoInformationSharp size={30}/>
      </div>
      <Settings/>

      <footer className="w-full py-3 fixed bottom-0 text-center select-none">
        <a
          id="github"
          href="https://github.com/bitterkofte/hedef"
          className="p-2 text-lg text-neutral-600  hover:text-gold smoother-5 cursor-pointer"
          target="_blank"
          data-tooltip-id="github"
          data-tooltip-content="Give me a ⭐"
          data-tooltip-place="top"
        >
          by bitterkofte
        </a>
        <Tooltip id="github" style={{ background: "#0a2a63", padding: 15 }} />
      </footer>
    </>
  );
}

export default App;
