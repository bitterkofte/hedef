import { useEffect, useState } from "react";
import { dateFormatter } from "./utils/functions";
import { Tooltip } from "react-tooltip";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { completeDaily } from "./redux/generalSlice";
import html2canvas from "html2canvas";

function App() {
  // const [calendar, setCalendar] = useState(calendarInitializer());
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const { calendars, selectedCalendar } = useAppSelector((s) => s.general);
  const dispatch = useAppDispatch();
  // const [count, setCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const exportCalendarImage = async () => {
    setIsExporting(true);
    const calendarElement = document.getElementById('my-calendar');
    const canvas = await html2canvas(calendarElement!);
    const imageData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'my-calendar.png'; // Allow filename customization here
    link.click();
    setIsExporting(false);
  };

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

  return (
    <>
      <nav className="w-full py-7 fixed top-0 text-center bg-neutral-7500 select-none">
        <h1 className="text-4xl font-extrabold tracking-wider text-gold">
          hedef
        </h1>
      </nav>

      <div id="my-calendar" className="min-h-screen flex flex-col justify-center items-center gap-10 text-white select-none">
        <p>{currentTimestamp}</p>
        {/* <input type='text' className='' value={} onChange={} placeholder='' /> */}
        <div className="grid grid-cols-7 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-3 border-0"></div>
            ))}
          {calendars[selectedCalendar].calendar.map((day) => (
            <button
              key={day.day}
              className={`w-12 h-12 p-3 border-2 flex justify-center items-center rounded-full hover:border-gold hover:text-gold disabled:border-neutral-600 disabled:text-neutral-600 cursor-pointer disabled:cursor-default smoother-2 ${
                day.completed === "yes" ? "border-green-600 text-green-600 hover:border-green-600 hover:text-green-600" : ""
              }`}
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
                className="w-12 h-12 p-3 border-2 flex justify-center items-center rounded-full border-neutral-500 text-neutral-500 hover:border-violet-600 hover:text-violet-600"
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

        <button className="text-red-400" onClick={exportCalendarImage} disabled={isExporting}>
          {isExporting ? 'Exporting...' : 'Export Image'}
        </button>
      </div>

      <footer className="w-full py-3 fixed bottom-0 text-center select-none">
        <a
          href="https://github.com/bitterkofte"
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
