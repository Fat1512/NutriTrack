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
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Card,
  CardContent,
} from "@mui/material";
import type { UserPreferences } from "./StepperComponentModern";

interface DietStepProps {
  preferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
}

const DietStep: React.FC<DietStepProps> = ({
  preferences,
  updatePreference,
}) => {
  const dietOptions = [
    "No specific diet",
    "Vegetarian",
    "Vegan",
    "Keto",
    "Low-carb",
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
        Let us know your dietary preferences so we can personalize your meal
        plans.
      </Typography>

      <FormControl
        component="fieldset"
        sx={{
          maxWidth: "400px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          component="legend"
          sx={{
            fontSize: { xs: "16px", md: "18px" },
            fontWeight: 500,
            mb: 2,
            textAlign: "center",
          }}
        >
          Select your diet preferences
        </Typography>
        <FormGroup sx={{ gap: 2 }}>
          {dietOptions.map((diet) => {
            const isChecked = Array.isArray(preferences.specificDiet)
              ? preferences.specificDiet.includes(diet)
              : false;

            return (
              <Card
                key={diet}
                sx={{
                  cursor: "pointer",
                  border: isChecked ? "2px solid #000" : "2px solid #E0E0E0",
                  borderRadius: { xs: 2, md: 3 },
                  backgroundColor: isChecked ? "#F8F8F8" : "#FFFFFF",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#000",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  },
                }}
                onClick={() => {
                  const currentDiets = Array.isArray(preferences.specificDiet)
                    ? preferences.specificDiet
                    : [];

                  if (isChecked) {
                    updatePreference(
                      "specificDiet",
                      currentDiets.filter((item) => item !== diet)
                    );
                  } else {
                    updatePreference("specificDiet", [...currentDiets, diet]);
                  }
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2, md: 3 },
                    "&:last-child": { pb: { xs: 2, md: 3 } },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        sx={{
                          color: "#666",
                          "&.Mui-checked": {
                            color: "#000",
                          },
                        }}
                      />
                    }
                    label={diet}
                    sx={{
                      margin: 0,
                      width: "100%",
                      "& .MuiFormControlLabel-label": {
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: isChecked ? 600 : 400,
                        color: "#000",
                        flex: 1,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default DietStep;
