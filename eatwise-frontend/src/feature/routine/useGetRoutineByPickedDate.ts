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
import { useSearchParams } from "react-router-dom";
import { getRoutineByPickedDate } from "../../service/routineSerivce";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";

function useGetRoutineByPickedDate() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const pickedDate =
    searchParams.get("pickedDate") || dayjs().format("YYYY-MM-DD");
  const { isLoading, data: routine } = useQuery({
    queryKey: ["pickedDate", pickedDate],
    queryFn: () => getRoutineByPickedDate(pickedDate),
    enabled: !!user?.id,
  });

  return { isLoading, routine };
}

export default useGetRoutineByPickedDate;
