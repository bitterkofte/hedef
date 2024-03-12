// import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { HiOutlineCog8Tooth } from "react-icons/hi2";
// import { ImportButton } from './ImportButton'
// import { ExportButton } from './ExportButton'
import { useRef, useState } from 'react';
import { useClickOutside } from "../hooks/useClickOutside";
import { LuDownload } from "react-icons/lu";
import html2canvas from "html2canvas";
import { Loading } from "./Loading";

export const Settings = () => {
  const [isSettings, setIsSettings] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  useClickOutside({
    ref: settingsRef,
    handler: () => setIsSettings(false)
  });

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

  const toggleSettings = () => setIsSettings(s => !s)
  return (
    <div ref={settingsRef} className='fixed z-10 right-3 bottom-3 flex flex-col gap-3 items-end'>
      <div className={`flex flex-col gap-3 rounded-lg overflow-hidden smoother-3 ease-in-out ${isSettings ? "max-h-10" : "max-h-0"}`}>
        {/* <ImportButton />
        <ExportButton /> */}
        <button className="p-3 flex items-center gap-2 text-white bg-sky-800 hover:bg-sky-700 smoother-2 rounded-lg disabled:bg-neutral-700" onClick={exportCalendarImage} disabled={isExporting}>
          {isExporting ? <Loading/> : <LuDownload/>}
          {isExporting ? 'Exporting...' : 'Export Calendar'}
        </button>
      </div>

      <div className='bg-gold rounded-3xl'>
      <div className='p-2 squircle cursor-pointer' onClick={toggleSettings}>
        <HiOutlineCog8Tooth size={30} className={`z-10 smoother-3 ease-in-out ${isSettings ? "rotate-90" : "rotate-0"}`} />
      </div>
      </div>
    </div>
  )
}