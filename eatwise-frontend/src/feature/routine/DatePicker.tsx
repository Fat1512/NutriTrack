import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import dayjs from "dayjs";
const DatePicker = () => {
  const [value, setValue] = useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-white shadow-xl h-full">
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={(newValue) => setValue(newValue)}
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
              border: "1px solid #67C090", // highlight today
            },
            ".Mui-selected": {
              backgroundColor: "#67C090 !important", // selected day color
              color: "#fff !important",
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default DatePicker;
