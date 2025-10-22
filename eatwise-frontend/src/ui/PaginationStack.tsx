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
import { Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useSearchParams } from "react-router-dom";
interface PaginationStackProps {
  currentPage: number;
  totalPage: number;
}

function PaginationStack({ currentPage, totalPage }: PaginationStackProps) {
  const [searchParams, setSerachParams] = useSearchParams();
  if (totalPage <= 1) return null;
  function handleOnClickPagniation(e, v: number) {
    searchParams.set("page", `${v - 1}`);
    setSerachParams(searchParams);
  }

  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPage}
        page={currentPage + 1}
        shape="rounded"
        onChange={(e, v) => handleOnClickPagniation(e, v)}
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "16px",
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "#4ADE80",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#247943",
            },
          },
        }}
      />
    </Stack>
  );
}

export default PaginationStack;
