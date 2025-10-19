import React from "react";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import type { UserPreferences } from "./StepperComponentModern";

interface HeightStepProps {
  preferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
}

const HeightStep: React.FC<HeightStepProps> = ({
  preferences,
  updatePreference,
}) => {
  const heightOptions = Array.from({ length: 81 }, (_, i) => i + 140);

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
        We'll use this to calculate your BMI and calorie needs.
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
          value={preferences.height}
          onChange={(e) => updatePreference("height", e.target.value as number)}
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
            minWidth: "20rem",
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
          {heightOptions.map((height) => (
            <MenuItem key={height} value={height}>
              {height} cm
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default HeightStep;
