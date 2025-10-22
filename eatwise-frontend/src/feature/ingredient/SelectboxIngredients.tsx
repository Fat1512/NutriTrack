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
