import { MoonLoader } from "react-spinners";

function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
      <MoonLoader size={80} color="blue" />
    </div>
  );
}

export default FullPageSpinner;
