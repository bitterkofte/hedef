import { useEffect, useState } from "react";
import { dateFormatter, isToday } from "./utils/functions";
import { Tooltip } from "react-tooltip";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { completeDaily, updateTitle } from "./redux/generalSlice";
import { Settings } from "./components/Settings";
import Logo from '../public/hedef.svg'

function App() {
  // const [calendar, setCalendar] = useState(calendarInitializer());
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const { calendars, selectedCalendar } = useAppSelector((s) => s.general);
  const dispatch = useAppDispatch();
  // const [count, setCount] = useState(0);
  

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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <>
      <nav className="w-full py-7 fixed top-0 flex justify-center items-center bg-neutral-7500 select-none">
        {/* <h1 className="text-4xl font-extrabold tracking-wider text-gold">
          hedef
        </h1> */}
        <img className='w-40 lg:w-72' src={Logo} alt='hedef' />
      </nav>

      <div id="my-calendar" className="min-h-screen flex flex-col justify-center items-center gap-10 bg-neutral-800 text-white select-none">
        {/* <h2 className="text-2xl font-bold">{calendars[selectedCalendar].title}</h2> */}
        <input type='text' className='w-fit bg-transparent text-2xl font-bold text-center outline-none' value={calendars[selectedCalendar].title} onChange={(e) => dispatch(updateTitle(e.target.value))} placeholder='' />
        <div className="px-5 sm:px-3 md:px-2 grid grid-cols-7 gap-3 md:gap-4">
          {days.map((d) => (
              <div key={d} className="border-0 text-neutral-500 text-xs text-center font-grotesque">{ d.slice(0,3) }</div>
          ))}
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-3 border-0"></div>
          ))}
          {calendars[selectedCalendar].calendar.map((day) => (
            <button
              key={day.day}
              className={`w-10 h-10 md:w-12 md:h-12 p-3 border-2 flex justify-center items-center rounded-full hover:border-green-600 hover:text-green-600 disabled:border-neutral-600 disabled:text-neutral-600 cursor-pointer disabled:cursor-default smoother-2 ${
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

      <Settings/>

      <footer className="w-full py-3 fixed bottom-0 text-center select-none">
        <a
          href="https://github.com/bitterkofte/hedef"
          className="text-lg font- text-neutral-600  hover:text-gold smoother-5 cursor-pointer"
          target="_blank"
        >
          by bitterkofte
        </a>
      </footer>
    </>
  );
}

export default App;
