import { Box, Modal } from "@mui/material";

import Button from "./Button";
import useGetFood from "../feature/food/useGetFood";
import MiniSpinner from "./MiniSpinner";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import SelectboxIngredients from "../feature/ingredient/SelectboxIngredients";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  height: 650,
  border: "transparent",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  overflowY: "scroll",
  padding: "10px 20px",
  color: "black",
};

interface Ingredient {
  name: string;
  weight: number;
}
interface Food {
  id: string;
  name: string;
  totalCal: number;
  totalProtein: number;
  totalFat: number;
  totalCarb: number;
  ingredients: Ingredient[];
}

function FoodSelectModal() {
  const { food, isLoading } = useGetFood();
  const [searchParams, setSearchParam] = useSearchParams();
  const [showInput, setShowInput] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    weight: 0,
  });

  const handleOk = () => {
    if (!newIngredient.name || newIngredient.weight <= 0) return;
    setShowInput(false);
  };

  const handleCancel = () => {
    setShowInput(false);
  };
  if (isLoading) return <MiniSpinner />;
  const isOpen = searchParams.get("foodId") ? true : false;
  function handleOnClose() {
    searchParams.delete("foodId");
    setSearchParam(searchParams);
  }
  const { name, totalCal, totalProtein, totalFat, totalCarb, ingredients } =
    food;
  console.log(showInput);
  return (
    <Modal open={isOpen} onClose={handleOnClose}>
      <Box sx={style}>
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold text-2xl">{name}</p>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden">
          <img
            src="https://eatwise-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg"
            alt="Salmon Quinoa Salad"
            className="w-full h-fit object-cover"
          />
          <div className="rounded p-4 mt-2 shadow">
            <h2 className="text-xl font-semibold mb-3">Nutrient</h2>
            <div className=" grid grid-cols-4 gap-4">
              <div className="border-green-400 border-2 rounded p-2 font-bold ">
                <p>Total Calories</p>
                <p>{Math.round(totalCal)} cal</p>
              </div>
              <div className="border-red-400 border-2 rounded p-2 font-bold">
                <p>Total Protein</p>
                <p>{Math.round(totalProtein)} cal</p>
              </div>
              <div className="border-yellow-400 border-2 rounded p-2 font-bold">
                <p>Total Fat</p>
                <p>{Math.round(totalFat)} cal</p>
              </div>
              <div className="border-blue-400 border-2 rounded p-2 font-bold">
                <p>Total Carbon</p>
                <p>{Math.round(totalCarb)} cal</p>
              </div>
            </div>
          </div>
          <div className="rounded p-4 mt-2 shadow mb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
              <p
                onClick={() => setShowInput(true)}
                className="border px-2 py-1 text-center rounded font-medium text-gray-600 cursor-pointer"
              >
                {" "}
                +Add
              </p>
            </div>

            <ul className="space-y-2">
              {ingredients.map((item: Ingredient) => (
                <li
                  key={item.name}
                  className="flex justify-between font-bold border-b pb-1"
                >
                  <span className="capitalize">{item.name}</span>
                  <span className="">{item.weight}g</span>
                </li>
              ))}
              {showInput && (
                <div className="flex flex-col space-y-2 mb-4 border rounded-lg p-3 bg-gray-50">
                  <div className="flex space-x-2">
                    <SelectboxIngredients />
                    <input
                      type="number"
                      placeholder="Weight (g)"
                      value={newIngredient.weight || ""}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          weight: Number(e.target.value),
                        })
                      }
                      className="border rounded px-2 py-1 w-28"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 border rounded cursor-pointer text-gray-600 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleOk}
                      className="px-3 py-1 bg-green-500 cursor-pointer text-white rounded hover:bg-green-600"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
            </ul>
          </div>
        </div>
        <div className="space-x-5 flex justify-end">
          <Button onClick={handleOnClose} variant="danger">
            Cancel
          </Button>
          <Button variant="primary"> Apply</Button>
        </div>
      </Box>
    </Modal>
  );
}

export default FoodSelectModal;
