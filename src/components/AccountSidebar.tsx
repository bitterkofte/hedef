import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "../hooks/useClickOutside";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setAccountOpen } from "../redux/generalSlice";
import { Auth } from "./Auth";
import { IoCloudUploadOutline, IoCloseOutline } from "react-icons/io5";
import { pushCalendarsToPB, pushSettingsToPB } from "../redux/pbThunks";
import { pb } from "../lib/pocketbase";
import { Loading } from "./Loading";

export const AccountSidebar = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const { isAccountOpen, calendars, selectedCalendar, isPastLocked, view, cloudSyncStatus } = useAppSelector((s) => s.general);

    useClickOutside({
        ref: sidebarRef,
        handler: () => dispatch(setAccountOpen(false)),
    });

    useEscapeKey(() => dispatch(setAccountOpen(false)), isAccountOpen);

    useEffect(() => {
        if (isAccountOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isAccountOpen]);

    const handleSync = () => {
        dispatch(pushCalendarsToPB(calendars));
        dispatch(pushSettingsToPB({ selectedCalendar, isPastLocked, view }));
    };

    return (
        <AnimatePresence>
            {isAccountOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    
                    {/* Sidebar */}
                    <motion.div
                        ref={sidebarRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-neutral-900 border-l border-white/10 z-[101] p-8 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black text-white tracking-tight font-grotesque">
                                ACCOUNT & CLOUD
                            </h2>
                            <button 
                                onClick={() => dispatch(setAccountOpen(false))}
                                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                            >
                                <IoCloseOutline size={28} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Auth Section */}
                            <Auth />

                            {/* Cloud Actions Section */}
                            {pb.authStore.isValid && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4"
                                >
                                    <h3 className="text-lg font-bold text-gold">Sync Data</h3>
                                    <p className="text-sm text-neutral-400 leading-relaxed">
                                        Back up your calendars and settings to the cloud so you can access them from any device.
                                    </p>
                                    
                                    <button
                                        className="w-full p-4 flex items-center justify-center gap-3 text-black bg-gold hover:scale-[1.02] active:scale-95 transition-all rounded-2xl font-black disabled:opacity-50"
                                        onClick={handleSync}
                                        disabled={cloudSyncStatus === "loading"}
                                    >
                                        {cloudSyncStatus === "loading" ? <Loading /> : <IoCloudUploadOutline size={24} />}
                                        <span>{cloudSyncStatus === "loading" ? "Syncing..." : "Sync to CloudNow"}</span>
                                    </button>
                                </motion.div>
                            )}

                            {!pb.authStore.isValid && (
                                <div className="p-6 bg-amber-500/10 rounded-[2rem] border border-amber-500/20">
                                    <p className="text-sm text-amber-200 text-center">
                                        Sign in to enable cloud synchronization and never lose your progress.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
