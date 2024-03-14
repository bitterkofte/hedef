import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const homeGuide = driver({
  showProgress: true,
  overlayColor: "#f59e0b",
  steps: [
    { popover: { title: 'hedef', description: 'A goal tracking app for Ramadan' } },
    { element: '#task-title', popover: { title: 'Title', description: 'You can edit your goal here' } },
    { element: '#task-desc', popover: { title: 'Description', description: 'You can add a description' } },
    { element: '#calendar', popover: { title: 'Calendar', description: 'Mark your progress by clicking the days' } },
    { element: '#tabs', popover: { title: 'Tabs', description: 'Travel through other calendars with tabs and add more calendars' } },
    { element: '#tab-0', popover: { title: 'Wheel Click', description: 'Tabs can be deleted by wheel-click on desktop 🖱' } },
    { element: '#settings', popover: { title: 'Download', description: 'You can download and share your progress here!' } },
    { element: '#github', popover: { title: 'Github', description: 'Give me a star on Github!' } },
  ]
});