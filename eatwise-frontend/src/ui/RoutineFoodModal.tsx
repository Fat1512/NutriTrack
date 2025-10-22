/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Box, Modal } from "@mui/material";

import Button from "./Button";
import MiniSpinner from "./MiniSpinner";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import SelectboxIngredients, {
  type IngredientOption,
} from "../feature/ingredient/SelectboxIngredients";
import useAddFoodToRoutine from "../feature/routine/useAddFoodToRoutine";
import { FaRegTrashAlt } from "react-icons/fa";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 850,
  height: 650,
  border: "transparent",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  overflowY: "scroll",
  padding: "10px 20px",
  color: "black",
};

export interface Ingredient {
  id: number;
  name: string;
  weight: number;
  cal: number;
  fat: number;
  carb: number;
  protein: number;
}
export interface Food {
  id: string;
  image: string;
  name: string;
  totalCal: number;
  totalProtein: number;
  totalFat: number;
  totalCarb: number;
  ingredients: Ingredient[];
}
interface RoutineFoodModal {
  foodRoutine: Food;
  isOpen: boolean;
  onClose: () => void;
}

const INIT_VALUE_INGREDIENT = {
  name: "",
  weight: 0,
  cal: 0,
  fat: 0,
  carb: 0,
  protein: 0,
};

const RoutineFoodModal: React.FC<RoutineFoodModal> = ({
  foodRoutine,
  isOpen,
  onClose,
}) => {
  const [searchParams] = useSearchParams();
  const [totals, setTotals] = useState({
    totalCal: foodRoutine.totalCal,
    totalProtein: foodRoutine.totalProtein,
    totalFat: foodRoutine.totalFat,
    totalCarb: foodRoutine.totalCarb,
  });

  const [showInput, setShowInput] = useState(false);
  const { isPending, addFoodToRoutine } = useAddFoodToRoutine();
  const [newIngredient, setNewIngredient] = useState<IngredientOption[]>(
    foodRoutine.ingredients
  );
  const [ingredient, setIngredient] = useState<IngredientOption>(
    INIT_VALUE_INGREDIENT
  );

  const handleCancel = () => {
    setShowInput(false);
  };
  function handleSelectNameIngredient(selected: IngredientOption) {
    setIngredient((prev) => ({ ...prev, ...selected, name: selected.label }));
  }

  function handleOnApply() {
    addFoodToRoutine({
      foodId: foodRoutine.id,
      meal: "BREAKFAST",
      pickedDate: searchParams.get("pickedDate")!,
    });
  }
  function handleOnAddIngredient() {
    setNewIngredient((prev) => [...prev, ingredient]);
    console.log(ingredient);
    setTotals((prev) => ({
      totalCal: prev.totalCal + ingredient.cal * ingredient.weight,
      totalProtein: prev.totalProtein + ingredient.protein * ingredient.weight,
      totalFat: prev.totalFat + ingredient.fat * ingredient.weight,
      totalCarb: prev.totalCarb + ingredient.carb * ingredient.weight,
    }));

    setShowInput(false);
  }
  function handleOnRemoveIngredient(name: string) {
    setNewIngredient((prev) => {
      const ingredientToRemove = prev.find((item) => item.name === name);
      if (!ingredientToRemove) return prev;
      setTotals((totals) => ({
        totalCal:
          totals.totalCal - ingredientToRemove.cal * ingredientToRemove.weight,
        totalProtein:
          totals.totalProtein -
          ingredientToRemove.protein * ingredientToRemove.weight,
        totalFat:
          totals.totalFat - ingredientToRemove.fat * ingredientToRemove.weight,
        totalCarb:
          totals.totalCarb -
          ingredientToRemove.carb * ingredientToRemove.weight,
      }));

      return prev.filter((item) => item.name !== name);
    });
  }

  const { name, image } = foodRoutine;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold text-2xl">{name}</p>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden">
          <img
            src={image}
            alt="Salmon Quinoa Salad"
            className="w-full object-cover"
          />
          <div className="rounded p-4 mt-2 shadow">
            <h2 className="text-xl font-semibold mb-3">Nutrient</h2>
            <div className=" grid grid-cols-4 gap-4">
              <div className="border-green-400 border-2 rounded p-2 font-bold ">
                <p>Total Calories</p>
                <p>{Math.round(totals?.totalCal)} cal</p>
              </div>
              <div className="border-red-400 border-2 rounded p-2 font-bold">
                <p>Total Protein</p>
                <p>{Math.round(totals?.totalProtein)} cal</p>
              </div>
              <div className="border-yellow-400 border-2 rounded p-2 font-bold">
                <p>Total Fat</p>
                <p>{Math.round(totals?.totalFat)} cal</p>
              </div>
              <div className="border-blue-400 border-2 rounded p-2 font-bold">
                <p>Total Carbon</p>
                <p>{Math.round(totals?.totalCarb)} cal</p>
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
              {newIngredient.map((item: IngredientOption) => (
                <li
                  key={item.name}
                  className="grid grid-cols-12 items-center font-bold pb-1 gap-4"
                >
                  <div className="flex items-center justify-between border-b col-span-11 pb-1">
                    <span className="capitalize">{item.name}</span>
                    <span className="text-gray-500 font-medium">
                      {item.weight}g
                    </span>
                  </div>

                  <button
                    onClick={() => handleOnRemoveIngredient(item.name)}
                    className="flex cursor-pointer justify-center items-center text-red-500 hover:text-red-700 transition-colors col-span-1"
                  >
                    <FaRegTrashAlt size={18} />
                  </button>
                </li>
              ))}
              {showInput && (
                <div className="flex flex-col space-y-2 mb-4 border rounded-lg p-3 bg-gray-50">
                  <div className="flex space-x-2">
                    <SelectboxIngredients
                      handleSelectNameIngredient={handleSelectNameIngredient}
                    />
                    <input
                      type="number"
                      placeholder="Weight (g)"
                      value={ingredient.weight || ""}
                      onChange={(e) =>
                        setIngredient((prev) => ({
                          ...prev,
                          weight: Number(e.target.value),
                        }))
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
                      onClick={handleOnAddIngredient}
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
          <Button onClick={onClose} variant="danger">
            Cancel
          </Button>
          <Button onClick={() => handleOnApply()} variant="primary">
            Apply
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RoutineFoodModal;
