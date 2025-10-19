import useGetIngredients from "./useGetIngredients";
import Select from "react-select";

const SelectboxIngredients = () => {
  const { isLoading, ingredients } = useGetIngredients();
  if (isLoading) return;

  const options = ingredients.map((i: { id: number; name: string }) => ({
    value: i.id,
    label: i.name,
  }));

  return (
    <Select
      options={options}
      placeholder="Ingredient"
      className="w-full rounded z-100"
      classNamePrefix="react-select"
    />
  );
};

export default SelectboxIngredients;
