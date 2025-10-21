import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "react-router-dom";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { Badge } from "@mui/material";
import useGetMarkedDay from "./useGetMarkedDay";

const DatePicker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDate = searchParams.get("pickedDate")
    ? dayjs(searchParams.get("pickedDate"))
    : dayjs();

  const [value, setValue] = useState<Dayjs>(initialDate);
  const [month, setMonth] = useState(value.month() + 1);
  const [year, setYear] = useState(value.year());

  const { isLoading, data } = useGetMarkedDay({ month, year });

  const highlightedDates = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data
      .map((item: any) => {
        if (item) {
          return dayjs(item);
        }
        return null;
      })
      .filter(Boolean);
  }, [data, value, isLoading]);

  function handleOnChange(v: Dayjs | null) {
    if (!v) return;

    const formatted = v.format("YYYY-MM-DD");
    setValue(v);
    searchParams.set("pickedDate", formatted);
    setSearchParams(searchParams);
  }

  const handleMonthChange = (newDate: Dayjs) => {
    setMonth(newDate.month() + 1);
    setYear(newDate.year());
  };

  const CustomDay = (props: any) => {
    const { day, ...other } = props;
    const isHighlighted = highlightedDates.some((date) =>
      date.isSame(day, "day")
    );

    return (
      <Badge
        overlap="circular"
        badgeContent={
          isHighlighted ? (
            <span
              style={{
                width: 4,
                height: 4,
                backgroundColor: "#ff8e8e",
                borderRadius: "50%",
              }}
            />
          ) : null
        }
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <PickersDay day={day} {...other} />
      </Badge>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-white shadow-xl h-full">
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={(v) => handleOnChange(v)}
          onMonthChange={(newDate) => handleMonthChange(newDate)}
          slots={{ day: CustomDay }}
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
