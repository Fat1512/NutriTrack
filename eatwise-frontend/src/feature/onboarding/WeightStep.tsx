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

interface WeightStepProps {
  preferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
}

const WeightStep: React.FC<WeightStepProps> = ({
  preferences,
  updatePreference,
}) => {
  const weightOptions = Array.from({ length: 171 }, (_, i) => i + 10);

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
        This will help us track your progress.
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
          value={preferences.weight}
          onChange={(e) => updatePreference("weight", e.target.value as number)}
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
          {weightOptions.map((weight) => (
            <MenuItem key={weight} value={weight}>
              {weight} kg
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default WeightStep;
