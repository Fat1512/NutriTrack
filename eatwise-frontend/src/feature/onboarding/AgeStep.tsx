import React from "react";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import type { UserPreferences } from "./StepperComponentModern";

interface AgeStepProps {
  preferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
}

const AgeStep: React.FC<AgeStepProps> = ({ preferences, updatePreference }) => {
  const ageOptions = Array.from({ length: 100 }, (_, i) => i + 3);

  return (
    <Box
      sx={{ px: { xs: 1, md: 0 }, display: "flex", flexDirection: "column" }}
    >
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
        This helps us calculate your daily nutritional needs and calorie
        requirements.
      </Typography>

      <FormControl fullWidth sx={{ maxWidth: "400px", mx: "auto" }}>
        <Select
          value={preferences?.age}
          onChange={(e) => updatePreference("age", e.target.value as number)}
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
          {ageOptions.map((age) => (
            <MenuItem key={age} value={age}>
              {age}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default AgeStep;
