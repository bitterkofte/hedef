import { Tooltip } from "react-tooltip";

const Footer = () => {
  return (
    <footer className="w-full py-3 fixed bottom-0 text-center select-none">
      <a
        id="github"
        href="https://github.com/bitterkofte/hedef"
        className="p-2 text-lg text-neutral-600  hover:text-gold bg-neutral-500/10 hover:bg-amber-400/10 smoother-5 cursor-pointer backdrop-blur-sm rounded-full"
        target="_blank"
        data-tooltip-id="github"
        data-tooltip-content="Give me a ⭐"
        data-tooltip-place="top"
      >
        by bitterkofte
      </a>
      <Tooltip id="github" style={{ background: "#8c6000", padding: 15 }} />
    </footer>
  );
};

export default Footer;
