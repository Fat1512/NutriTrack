import type React from "react";

export interface FoodItemProps {
  image: string;
  name: string;
  calories: number;
}

const FoodItem: React.FC<FoodItemProps> = ({ image, name, calories }) => {
  return (
    <div className="flex w-full border rounded bg-white shadow cursor-pointer">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded mr-3 object-cover"
      />
      <div className="flex flex-col w-full min-w-0">
        <div className="font-semibold text-lg truncate">{name}</div>
        <div className="text-gray-500 text-sm">{calories} cal</div>
      </div>
    </div>
  );
};

export default FoodItem;
