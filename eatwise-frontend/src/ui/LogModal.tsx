import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import FoodList from "../feature/food/FoodList";
import FoodSelectModal from "./FoodSelectModal";
import { useSearchParams } from "react-router-dom";
import type { MealKey } from "../feature/routine/useAddFoodToRoutine";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  border: "none",
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  overflow: "hidden",
  color: "black",
  transition: "all 0.3s ease",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  mealKey: MealKey;
}

function LogModal({ open, onClose, mealKey }: ModalProps) {
  const [selection, setSelection] = useState<number | null>(null);
  const [searchParams] = useSearchParams();

  const height = selection ? 550 : 320;

  function handleOnClose() {
    setSelection(null);
    onClose();
  }

  if (searchParams.get("foodId")) return <FoodSelectModal meal={mealKey} />;

  return (
    <Modal open={open} onClose={handleOnClose}>
      <Box sx={{ ...style, height }}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 bg-gradient-to-r from-blue-50 to-green-50">
          <h2 className="text-xl font-semibold text-gray-800">Log Food</h2>
          <button
            onClick={handleOnClose}
            className="text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
          >
            <IoCloseCircleOutline size={28} />
          </button>
        </div>

        <div className="p-6">
          {!selection && (
            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={() => setSelection(1)}
                className="w-full cursor-pointer py-4 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-gray-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Scan food
              </button>

              <button
                onClick={() => setSelection(2)}
                className="w-full py-4 rounded-xl cursor-pointer border border-gray-200 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-gray-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Select food from EatWise
              </button>
            </div>
          )}

          {selection === 2 && (
            <div className="mt-4 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-xl border border-gray-100 p-2">
              <FoodList />
            </div>
          )}

          {selection === 1 && (
            <div className="flex flex-col  items-center justify-center h-[400px] text-gray-500">
              <p className="text-sm italic">
                Camera scan feature coming soon...
              </p>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
}

export default LogModal;
