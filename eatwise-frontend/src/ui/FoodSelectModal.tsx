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
import { FaRegTrashAlt } from "react-icons/fa";
import Button from "./Button";
import useGetFood from "../feature/food/useGetFood";
import MiniSpinner from "./MiniSpinner";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectboxIngredients, {
  type IngredientOption,
} from "../feature/ingredient/SelectboxIngredients";
import useAddFoodToRoutine, {
  type MealKey,
} from "../feature/routine/useAddFoodToRoutine";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 850,
  maxHeight: 700,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  overflowY: "auto",
  padding: "20px 30px",
};

const INIT_VALUE_INGREDIENT = {
  name: "",
  weight: 0,
  cal: 0,
  fat: 0,
  carb: 0,
  protein: 0,
};

interface FoodSelectModalProps {
  meal: MealKey;
}

function FoodSelectModal({ meal }: FoodSelectModalProps) {
  const { food, isLoading } = useGetFood();
  const [searchParams, setSearchParam] = useSearchParams();
  const [showInput, setShowInput] = useState(false);
  const [totals, setTotals] = useState({
    totalCal: 0,
    totalProtein: 0,
    totalFat: 0,
    totalCarb: 0,
  });
  const { isPending, addFoodToRoutine } = useAddFoodToRoutine();
  const [ingredient, setIngredient] = useState<IngredientOption>(
    INIT_VALUE_INGREDIENT
  );
  const [newIngredient, setNewIngredient] = useState<IngredientOption[]>([]);

  useEffect(() => {
    if (!isLoading && food) {
      setTotals({
        totalCal: food.totalCal,
        totalProtein: food.totalProtein,
        totalFat: food.totalFat,
        totalCarb: food.totalCarb,
      });
      setNewIngredient([...food.ingredients]);
    }
  }, [isLoading, food]);

  if (isLoading) return <MiniSpinner />;
  const isOpen = Boolean(searchParams.get("foodId"));

  function handleSelectNameIngredient(selected: IngredientOption) {
    setIngredient((prev) => ({ ...prev, ...selected, name: selected.label }));
  }

  function handleOnClose() {
    searchParams.delete("foodId");
    setSearchParam(searchParams);
  }

  function handleOnAddIngredient() {
    if (!ingredient.name || ingredient.weight <= 0) return;
    setNewIngredient((prev) => [...prev, ingredient]);
    setTotals((prev) => ({
      totalCal: prev.totalCal + ingredient.cal * ingredient.weight,
      totalProtein: prev.totalProtein + ingredient.protein * ingredient.weight,
      totalFat: prev.totalFat + ingredient.fat * ingredient.weight,
      totalCarb: prev.totalCarb + ingredient.carb * ingredient.weight,
    }));
    setShowInput(false);
    setIngredient(INIT_VALUE_INGREDIENT);
  }

  function handleOnRemoveIngredient(name: string) {
    setNewIngredient((prev) => {
      const ingredientToRemove = prev.find((i) => i.name === name);
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
      return prev.filter((i) => i.name !== name);
    });
  }

  function handleOnApply() {
    addFoodToRoutine(
      {
        foodId: food.id,
        meal,
        ingredientExtra: newIngredient.map((i) => ({
          id: i.id!,
          name: i.name,
          weight: i.weight,
        })),
        pickedDate:
          searchParams.get("pickedDate") || dayjs().format("YYYY-MM-DD"),
      },
      {
        onSuccess: () => {
          toast.success("Successfully logged food");
          handleOnClose();
        },
      }
    );
  }

  const { name, image } = food;

  return (
    <Modal open={isOpen} onClose={handleOnClose}>
      <Box sx={style}>
        <h2 className="text-3xl font-bold text-center mb-5">{name}</h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 rounded overflow-hidden shadow-lg">
            <img src={image} alt={name} className="w-full h-64 object-cover" />
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-semibold">Nutrients</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Calories",
                  value: totals.totalCal,
                  color: "bg-green-100",
                },
                {
                  label: "Protein",
                  value: totals.totalProtein,
                  color: "bg-red-100",
                },
                {
                  label: "Fat",
                  value: totals.totalFat,
                  color: "bg-yellow-100",
                },
                {
                  label: "Carbs",
                  value: totals.totalCarb,
                  color: "bg-blue-100",
                },
              ].map((nutrient) => (
                <div
                  key={nutrient.label}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center shadow-sm ${nutrient.color}`}
                >
                  <span className="font-medium">{nutrient.label}</span>
                  <span className="text-lg font-bold">
                    {Math.round(nutrient.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg p-4 bg-gray-50 shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold">Ingredients</h3>
            <p
              onClick={() => setShowInput(true)}
              className="px-3 py-1 rounded cursor-pointer text-green-700 font-semibold hover:bg-green-100"
            >
              + Add
            </p>
          </div>

          {showInput && (
            <div className="flex flex-col mb-3 space-y-2 p-3 bg-white rounded shadow">
              <div className="flex gap-2 items-center">
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
                  className="border rounded px-2 py-1 w-24"
                />
                <Button onClick={handleOnAddIngredient} variant="primary">
                  Add
                </Button>
                <Button onClick={() => setShowInput(false)} variant="danger">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <ul className="space-y-2">
            {newIngredient.map((item) => (
              <li
                key={item.name}
                className="flex justify-between items-center bg-white rounded shadow-sm p-2 hover:bg-gray-100 transition"
              >
                <div className="flex gap-4 items-center">
                  <span className="capitalize font-medium">{item.name}</span>
                  <span className="text-gray-500 font-medium">
                    {item.weight}g
                  </span>
                </div>
                <button
                  onClick={() => handleOnRemoveIngredient(item.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaRegTrashAlt size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button onClick={handleOnClose} variant="danger">
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleOnApply}
            variant="primary"
            className={`transition-all ${
              isPending ? "bg-gray-400 cursor-not-allowed opacity-70" : ""
            }`}
          >
            {isPending ? <MiniSpinner /> : "Apply"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default FoodSelectModal;
