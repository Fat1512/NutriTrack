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
import type React from "react";
import { useSearchParams } from "react-router-dom";

export interface FoodItemProps {
  id: string;
  image: string;
  name: string;
  totalCal: number;
}

const FoodItem: React.FC<FoodItemProps> = ({ id, image, name, totalCal }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSelect() {
    searchParams.set("foodId", id);
    setSearchParams(searchParams);
  }

  return (
    <div
      onClick={handleSelect}
      className="group flex w-full items-center gap-4 border border-gray-200 rounded-2xl bg-white shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-3"
    >
      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col justify-between w-full min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-snug">
          {name}
        </h3>

        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium text-gray-800">Calories:</span>{" "}
          {Math.round(totalCal)} cal
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75"
          />
        </svg>
      </div>
    </div>
  );
};

export default FoodItem;
