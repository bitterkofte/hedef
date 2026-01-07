import { IoCloudDoneOutline, IoCloudUploadOutline, IoCloudOfflineOutline } from "react-icons/io5";
import { pb } from "../lib/pocketbase";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { pushCalendarsToPB, pushSettingsToPB } from "../redux/pbThunks";
import { toast } from "sonner";

export const CloudStatus = () => {
    const dispatch = useAppDispatch();
    const { cloudSyncStatus, calendars, selectedCalendar, isPastLocked, view } = useAppSelector((s) => s.general);
    const isLoggedIn = pb.authStore.isValid;

    const handleSyncClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (cloudSyncStatus === "success") {
            toast.info("Cloud is already up to date!");
            return;
        }
        dispatch(pushCalendarsToPB(calendars));
        dispatch(pushSettingsToPB({ selectedCalendar, isPastLocked, view }));
    };

    if (!isLoggedIn) {
        return (
            <div className="flex items-center gap-1 text-neutral-600 opacity-50 cursor-help" title="Not logged in to cloud">
                <IoCloudOfflineOutline size={20} />
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={cloudSyncStatus}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-110 active:scale-90"
                onClick={handleSyncClick}
            >
                {cloudSyncStatus === "loading" && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-amber-500"
                        title="Syncing..."
                    >
                        <IoCloudUploadOutline size={30} />
                    </motion.div>
                )}
                {cloudSyncStatus === "success" && (
                    <div className="text-green-500" title="Synced to cloud">
                        <IoCloudDoneOutline size={30} />
                    </div>
                )}
                {cloudSyncStatus === "error" && (
                    <div className="text-red-500" title="Sync error">
                        <IoCloudOfflineOutline size={30} />
                    </div>
                )}
                {cloudSyncStatus === "idle" && (
                    <div className="text-neutral-500 opacity-50" title="Changes not synced">
                        <IoCloudUploadOutline size={30} />
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
