import { IoInformationSharp } from "react-icons/io5";
import { homeGuide } from "../utils/guides";

const InfoGraph = () => {
  return (
    <div
      className="fixed z-10 left-3 bottom-3 p-2 squircle cursor-pointer"
      onClick={() => homeGuide.drive()}
    >
      <IoInformationSharp size={30} />
    </div>
  );
};

export default InfoGraph;
