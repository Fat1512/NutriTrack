import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "react-router-dom";
const DatePicker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDate = searchParams.get("pickedDate")
    ? dayjs(searchParams.get("pickedDate"))
    : dayjs();

  const [value, setValue] = useState<Dayjs>(initialDate);

  function handleOnChange(v: Dayjs | null) {
    if (!v) return;

    const formatted = v.format("YYYY-MM-DD");

    setValue(v);
    searchParams.set("pickedDate", formatted);
    setSearchParams(searchParams);
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-white shadow-xl h-full">
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={(v) => handleOnChange(v)}
          sx={{
            ".MuiPickersToolbar-root": {
              color: "#bbdefb",
              borderRadius: "2px",
              padding: "8px",
              borderWidth: "1px",
              borderColor: "#2196f3",
              border: "1px solid",
              backgroundColor: "#67C090",
            },
            ".MuiPickersDay-today": {
              border: "1px solid #67C090",
            },
            ".Mui-selected": {
              backgroundColor: "#67C090 !important",
              color: "#fff !important",
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default DatePicker;
