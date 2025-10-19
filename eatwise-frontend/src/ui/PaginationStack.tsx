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
