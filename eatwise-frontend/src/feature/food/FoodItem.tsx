import type React from "react";
import { useSearchParams } from "react-router-dom";

export interface FoodItemProps {
  id: string;
  image: string;
  name: string;
  totalCal: number;
}

const FoodItem: React.FC<FoodItemProps> = ({ id, image, name, totalCal }) => {
  const [searchParams, setSearhParams] = useSearchParams();
  function handleSelect() {
    searchParams.set("foodId", id);
    setSearhParams(searchParams);
  }
  return (
    <div
      onClick={handleSelect}
      className="flex w-full border rounded bg-white shadow cursor-pointer"
    >
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded mr-3 object-cover"
      />
      <div className="flex flex-col w-full min-w-0">
        <div className="text-md line-clamp-3 min-h-[3.6rem]">{name}</div>
        <div className="text-sm mt-auto">
          <span className="font-medium">Total calories</span>: {totalCal} cal
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
