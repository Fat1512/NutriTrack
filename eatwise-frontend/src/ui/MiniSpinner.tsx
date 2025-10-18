import { MoonLoader } from "react-spinners";

function MiniSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <MoonLoader size={30} color="blue" />
    </div>
  );
}

export default MiniSpinner;
