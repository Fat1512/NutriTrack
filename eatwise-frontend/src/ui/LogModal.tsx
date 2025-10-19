import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import FoodList from "../feature/food/FoodList";
import FoodSelectModal from "./FoodSelectModal";
import { useSearchParams } from "react-router-dom";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  height: 300,
  border: "transparent",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  overflow: "hidden",
  padding: "10px 20px",
  color: "black",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

function LogModal({ open, onClose }: ModalProps) {
  function handleOnClose() {
    onClose();
    setSelection(null);
  }
  const [selection, setSelection] = useState<number | null>(null);
  const height = selection ? 550 : 300;
  const [searhParams] = useSearchParams();

  if (searhParams.get("foodId"))
    return <FoodSelectModal open={open} onClose={() => console.log("ok")} />;

  return (
    <Modal open={open} onClose={handleOnClose}>
      <Box sx={{ ...style, height }}>
        <p
          onClick={handleOnClose}
          className="absolute right-3 cursor-pointer text-xl"
        >
          <span>
            <IoCloseCircleOutline size={30} />
          </span>
        </p>
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold text-2xl">Log Food</p>
        </div>

        {!selection && (
          <>
            <div className="my-5 flex flex-col justify-center">
              <div
                onClick={() => setSelection(1)}
                className="w-full my-2 bg-gray-100 p-5 border border-gray-200 rounded cursor-pointer hover:bg-gray-200"
              >
                Scan food
              </div>
              <div
                onClick={() => setSelection(2)}
                className="w-full my-2 bg-gray-100 p-5 border-gray-200 rounded cursor-pointer hover:bg-gray-200"
              >
                Select food from Eatwise
              </div>
            </div>
          </>
        )}
        {selection == 2 && (
          <div className="mt-10 h-[85%] overflow-y-auto">
            <FoodList />
          </div>
        )}
      </Box>
    </Modal>
  );
}

export default LogModal;
