import MiniSpinner from "../../ui/MiniSpinner";
import PaginationStack from "../../ui/PaginationStack";

import FoodItem, { type FoodItemProps } from "./FoodItem";
import useGetFoods from "./useGetFoods";

const FoodList = () => {
  const { isLoading, foods, totalPages, page } = useGetFoods();
  if (isLoading) return <MiniSpinner />;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {foods.map(({ id, name, image, totalCal }: FoodItemProps) => (
          <FoodItem
            key={id}
            id={id}
            name={name}
            image={image}
            totalCal={totalCal}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <PaginationStack currentPage={page} totalPage={totalPages} />
      </div>
    </div>
  );
};

export default FoodList;
