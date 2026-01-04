import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { store } from "../redux/store";
import { setSettingsOpen } from "../redux/generalSlice";

export const homeGuide = driver({
  showProgress: true,
  overlayColor: "#f59e0b",
  stagePadding: 10,
  steps: [
    { popover: { title: 'hedef', description: 'A goal tracking app for Ramadan' } },
    { element: '#task-title', popover: { title: 'Title', description: 'You can edit your goal here' } },
    { element: '#task-desc', popover: { title: 'Description', description: 'You can add a description' } },
    { element: '#today', popover: { title: 'Calendar', description: 'Mark your progress by clicking the days' } },
    { element: '#tabs', popover: { title: 'Tabs', description: 'Travel through other calendars with tabs and add more calendars' } },
    { element: '#tab-0', popover: { title: 'Wheel Click', description: 'Tabs can be deleted by wheel-click on desktop or long press on mobile' } },
    { 
      element: '#settings', 
      popover: { title: 'Settings', description: 'You can lock/unlock the past, delete and download your progress here!' },
      onHighlighted: () => {
        store.dispatch(setSettingsOpen(true));
        setTimeout(() => {
          homeGuide.refresh();
        }, 350); // wait for smoother-3 transition (roughly 300-400ms)
      },
      onDeselected: () => store.dispatch(setSettingsOpen(false))
    },
    { element: '#github', popover: { title: 'Github', description: 'Give me a star on Github!' } },
  ]
});