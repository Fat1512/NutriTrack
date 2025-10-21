import React, { useState } from "react";
import useGetIngredients from "./useGetIngredients";
import Select, { type SingleValue } from "react-select";

export interface IngredientOption {
  id?: number;
  weight: number;
  name: string;
  cal: number;
  fat: number;
  carb: number;
  protein: number;
}

interface SelectboxIngredientProps {
  handleSelectNameIngredient: (select: IngredientOption) => void;
}

const SelectboxIngredients: React.FC<SelectboxIngredientProps> = ({
  handleSelectNameIngredient,
}) => {
  const { isLoading, ingredients } = useGetIngredients();
  const [selectedOption, setSelectedOption] = useState<IngredientOption | null>(
    null
  );

  if (isLoading) return null;

  const options: IngredientOption[] = ingredients.map((i) => ({
    id: i.id,
    value: i.id,
    label: i.name,
    cal: i.cal,
    fat: i.fat,
    carb: i.carb,
    protein: i.protein,
  }));

  const handleChange = (selected: SingleValue<IngredientOption>) => {
    setSelectedOption(selected);
    if (selected) handleSelectNameIngredient(selected);
  };

  return (
    <Select
      value={selectedOption}
      options={options}
      placeholder="Ingredient"
      className="w-full rounded z-100"
      classNamePrefix="react-select"
      onChange={handleChange}
    />
  );
};

export default SelectboxIngredients;
