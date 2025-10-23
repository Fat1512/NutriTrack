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
import { useQuery } from "@tanstack/react-query";

import { getStaticNutrient } from "../../service/routineSerivce";
interface StaticsNutrientParams {
  month: number;
  year: number;
}

function useStaticsNutrient({ month, year }: StaticsNutrientParams) {
  const { isLoading, data } = useQuery({
    queryKey: ["statics", month, year],
    queryFn: () => getStaticNutrient(month, year),
  });

  return { isLoading, data };
}

export default useStaticsNutrient;
