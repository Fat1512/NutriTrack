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
import { useAuth } from "../../context/AuthContext";

const Goal = () => {
  const { user } = useAuth();
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold  mb-4 flex items-center gap-2">
        Your Goal
      </h2>

      <ul className="space-y-3">
        <li className="flex justify-between items-center border-b border-blue-200 pb-2">
          <span className="text-gray-600 font-medium">Main Goal</span>
          <span className="text-blue-800 font-semibold">
            {user?.mainGoal || "—"}
          </span>
        </li>

        <li className="flex justify-between items-center border-b border-blue-200 pb-2">
          <span className="text-gray-600 font-medium">Height</span>
          <span className="text-blue-800 font-semibold">
            {user?.height || "—"} cm
          </span>
        </li>

        <li className="flex justify-between items-center border-b border-blue-200 pb-2">
          <span className="text-gray-600 font-medium">Weight</span>
          <span className="text-blue-800 font-semibold">
            {user?.weight || "—"} kg
          </span>
        </li>

        <li className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Specific diet</span>
          <span className="text-blue-800 font-semibold">
            {user?.specificDiet?.join(", ") || "—"}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Goal;
