// import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { HiOutlineCog8Tooth } from "react-icons/hi2";
// import { ImportButton } from './ImportButton'
// import { ExportButton } from './ExportButton'
import { useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { LuDownload } from "react-icons/lu";
import html2canvas from "html2canvas";
import { Loading } from "./Loading";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { togglePastLocked, setSettingsOpen } from "../redux/generalSlice";
import { IoLockClosedOutline, IoLockOpenOutline, IoTrashOutline } from "react-icons/io5";

export const Settings = ({ setIsModalVisible }: { setIsModalVisible: (s: boolean) => void }) => {
  const [isExporting, setIsExporting] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { isPastLocked, isSettingsOpen } = useAppSelector((s) => s.general);
  const dispatch = useAppDispatch();

  useClickOutside({
    ref: settingsRef,
    handler: () => dispatch(setSettingsOpen(false)),
  });


  const exportCalendarImage = async () => {
    setIsExporting(true);
    const calendarElement = document.getElementById("my-calendar");
    const canvas = await html2canvas(calendarElement!);
    const imageData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "my-calendar.png"; // Allow filename customization here
    link.click();
    setIsExporting(false);
  };

  const toggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setSettingsOpen(!isSettingsOpen));
  };
  return (
    <div
    id="settings"
    ref={settingsRef}
    className="fixed z-10 right-3 bottom-3 flex flex-col gap-3 items-end"
    >
      
      <div
        className={`flex flex-col gap-3 rounded-lg overflow-hidden smoother-3 ease-in-out ${
          isSettingsOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        {/* <ImportButton />
        <ExportButton /> */}
        <button
          className={`p-3 flex items-center gap-2 text-white smoother-2 rounded-lg disabled:bg-neutral-700 ${isPastLocked ? "bg-amber-600 hover:bg-amber-500" : "bg-green-800 hover:bg-green-700"}`}
          onClick={() => dispatch(togglePastLocked())}
        >
          {isPastLocked ? <IoLockClosedOutline size={20} className={`smoother-3`} /> : <IoLockOpenOutline size={20} className={`smoother-3`} />}
          <span>Past {isPastLocked ? "Locked" : "Unlocked"}</span>
        </button>
        <button
          className="p-3 flex items-center gap-2 text-white bg-red-800 hover:bg-red-700 smoother-2 rounded-lg disabled:bg-neutral-700"
          onClick={() => setIsModalVisible(true)}
        >
          <IoTrashOutline size={20} className={`smoother-3`} />
          <span>Delete calendar</span>
        </button>
        <button
          className="p-3 flex items-center gap-2 text-white bg-sky-800 hover:bg-sky-700 smoother-2 rounded-lg disabled:bg-neutral-700"
          onClick={exportCalendarImage}
          disabled={isExporting}
        >
          {isExporting ? <Loading /> : <LuDownload />}
          {isExporting ? "Exporting..." : "Export Calendar"}
        </button>
      </div>

      <div className="bg-gold rounded-3xl">
        <div className="p-2 squircle cursor-pointer" onClick={toggleSettings}>
          <HiOutlineCog8Tooth
            size={30}
            className={`z-10 smoother-3 ease-in-out ${
              isSettingsOpen ? "rotate-90" : "rotate-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
