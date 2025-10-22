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
import { useState, useMemo } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import useStaticsNutrient from "./useStaticsNutrient";

export default function NutrientChart() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { isLoading, data } = useStaticsNutrient({
    month: selectedMonth,
    year: selectedYear,
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const xAxis = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const mapByDate = new Map(
      data.map((item) => [
        new Date(item.date).getDate(),
        {
          protein: item.consumeProtein,
          carb: item.consumeCarb,
          fat: item.consumeFat,
          cal: item.consumeCal,
        },
      ])
    );

    const protein = xAxis.map((day) => mapByDate.get(day)?.protein || 0);
    const carb = xAxis.map((day) => mapByDate.get(day)?.carb || 0);
    const fat = xAxis.map((day) => mapByDate.get(day)?.fat || 0);
    const cal = xAxis.map((day) => mapByDate.get(day)?.cal || 0);

    return { xAxis, protein, carb, fat, cal };
  }, [data, selectedMonth, selectedYear]);

  const pieData = useMemo(() => {
    if (!chartData) return [];
    const days = chartData.xAxis.length || 1;
    const avgProtein = chartData.protein.reduce((a, b) => a + b, 0) / days;
    const avgCarb = chartData.carb.reduce((a, b) => a + b, 0) / days;
    const avgFat = chartData.fat.reduce((a, b) => a + b, 0) / days;
    const avgCal = chartData.cal.reduce((a, b) => a + b, 0) / days;

    return [
      {
        id: 0,
        value: avgProtein,
        label: `Protein (${avgProtein.toFixed(1)}g)`,
        color: "#FF6B6B",
      },
      {
        id: 1,
        value: avgCarb,
        label: `Carb (${avgCarb.toFixed(1)}g)`,
        color: "#4ECDC4",
      },
      {
        id: 2,
        value: avgFat,
        label: `Fat (${avgFat.toFixed(1)}g)`,
        color: "#FFE66D",
      },
      {
        id: 3,
        value: avgCal,
        label: `Calory (${avgCal.toFixed(0)}cal/g)`,
        color: "#4ADE80",
      },
    ];
  }, [chartData]);

  const getTitle = () => `${monthNames[selectedMonth - 1]} ${selectedYear}`;

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
      <div className="flex justify-between items-center bg-white rounded-2xl p-5 shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Nutrient Statistics
          </h2>
          <p className="text-gray-500 text-sm mt-1">{getTitle()}</p>
        </div>

        <div className="flex gap-3">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {monthNames.map((month, i) => (
                <MenuItem key={i} value={i + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from(
                { length: 5 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-6">
        <div className="bg-white col-span-5 rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Nutrient Intake Trend
          </h3>

          {isLoading || !chartData ? (
            <p className="text-gray-400 text-center">Loading data...</p>
          ) : (
            <LineChart
              height={320}
              xAxis={[{ scaleType: "point", data: chartData.xAxis }]}
              series={[
                {
                  data: chartData.protein,
                  label: "Protein (g)",
                  color: "#FF6B6B",
                  curve: "catmullRom",
                },
                {
                  data: chartData.carb,
                  label: "Carb (g)",
                  color: "#4ECDC4",
                  curve: "catmullRom",
                },
                {
                  data: chartData.fat,
                  label: "Fat (g)",
                  color: "#FFE66D",
                  curve: "catmullRom",
                },
                {
                  data: chartData.cal,
                  label: "Calory (cal/g)",
                  color: "#4ADE80",
                  curve: "catmullRom",
                },
              ]}
              margin={{ left: 50, right: 20, top: 20, bottom: 40 }}
              grid={{ vertical: true, horizontal: true }}
              slotProps={{
                legend: { hidden: false, position: "bottom-right" },
              }}
            />
          )}
        </div>

        <div className="bg-white col-span-3 rounded-2xl shadow-md p-6 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Monthly Nutrient Average
          </h3>

          {isLoading || !pieData.length ? (
            <p className="text-gray-400 text-center">Loading data...</p>
          ) : (
            <PieChart
              series={[
                {
                  data: pieData,
                  innerRadius: 40,
                  outerRadius: 120,
                  cornerRadius: 5,
                  paddingAngle: 2,
                  cx: 150,
                  cy: 150,
                  label: ({ dataEntry }) => dataEntry.label,
                },
              ]}
              height={320}
              slotProps={{
                legend: { hidden: false, position: "bottom" },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
