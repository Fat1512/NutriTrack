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
import React from "react";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import type { UserPreferences } from "./StepperComponentModern";

interface EatingHabitsStepProps {
  preferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
}

const EatingHabitsStep: React.FC<EatingHabitsStepProps> = ({
  preferences,
  updatePreference,
}) => {
  const eatingHabitOptions = [
    "3 meals a day",
    "5-6 small meals",
    "2 meals a day",
    "Intermittent fasting",
    "Snacking throughout the day",
    "Irregular meal times",
    "Other",
  ];

  return (
    <Box sx={{ px: { xs: 1, md: 0 } }}>
      <Typography
        variant="body1"
        sx={{
          color: "#666",
          mb: 3,
          fontSize: { xs: "16px", md: "18px" },
          textAlign: "center",
          maxWidth: "500px",
          mx: "auto",
        }}
      >
        Understanding your eating patterns helps us create a sustainable plan
        that fits your lifestyle.
      </Typography>

      <FormControl
        fullWidth
        sx={{
          maxWidth: "400px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Select
          value={preferences.eatingHabits}
          onChange={(e) =>
            updatePreference("eatingHabits", e.target.value as string)
          }
          sx={{
            borderRadius: { xs: 3, md: 4 },
            backgroundColor: "#FFFFFF",
            fontSize: { xs: "16px", md: "18px" },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "2px solid #E0E0E0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "2px solid #000",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "2px solid #000",
            },
            minHeight: { xs: 56, md: 64 },
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 250,
                borderRadius: 16,
                marginTop: 8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              },
            },
          }}
        >
          {eatingHabitOptions.map((habit) => (
            <MenuItem key={habit} value={habit}>
              {habit}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default EatingHabitsStep;
