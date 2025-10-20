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
  height: 650,
  border: "transparent",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  overflowY: "scroll",
  padding: "10px 20px",
  color: "black",
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

  const handleCancel = () => {
    setShowInput(false);
    setIngredient(INIT_VALUE_INGREDIENT);
  };
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
  const isOpen = searchParams.get("foodId") ? true : false;

  function handleSelectNameIngredient(selected: IngredientOption) {
    setIngredient((prev) => ({ ...prev, ...selected, name: selected.label }));
  }

  function handleOnClose() {
    searchParams.delete("foodId");
    setSearchParam(searchParams);
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
          toast.success("Succefully log food");
          handleOnClose();
        },
      }
    );
  }
  const { name, image } = food;

  return (
    <Modal open={isOpen} onClose={handleOnClose}>
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
          <Button onClick={handleOnClose} variant="danger">
            Cancel
          </Button>
          <Button onClick={() => handleOnApply()} variant="primary">
            Apply
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default FoodSelectModal;
