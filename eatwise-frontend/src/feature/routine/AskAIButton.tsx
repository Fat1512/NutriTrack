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
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import useAnalyzeRoutine from "./useAnalyzeRoutine";
interface AskAIProps {
  open: boolean;
  handleClose: () => void;
}

export default function AskAIButton({ open, handleClose }: AskAIProps) {
  const { isLoading, analyzeData } = useAnalyzeRoutine();

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 720,
            maxWidth: "calc(100vw - 48px)",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            p: 3,
            display: "flex",
            flexDirection: "column",
            minHeight: 200,
            border: "1px solid rgba(102, 126, 234, 0.1)",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.8 },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              pb: 2,
              borderBottom: "2px solid",
              borderImage: "linear-gradient(90deg, #667eea, #764ba2) 1",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1.5,
              }}
            >
              <AutoAwesomeIcon sx={{ color: "white" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI Nutrition Summary
            </Typography>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  transform: "rotate(90deg)",
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1 }}>
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 150,
                  gap: 2,
                }}
              >
                <CircularProgress
                  size={48}
                  sx={{
                    color: "#667eea",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#667eea",
                    fontWeight: 500,
                  }}
                >
                  Analyzing nutritional data...
                </Typography>
              </Box>
            )}

            {!isLoading && analyzeData && (
              <>
                <Paper
                  sx={{
                    p: 2.5,
                    mb: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    opacity: 0,
                    animation: "fadeIn 0.6s 0.1s forwards",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.15)",
                    },
                  }}
                  elevation={0}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      mb: 1.5,
                      color: "#667eea",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span style={{ fontSize: "1.2em" }}>💬</span> AI Feedback
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#424242",
                      lineHeight: 1.6,
                    }}
                  >
                    {analyzeData.analysis_remark}
                  </Typography>
                </Paper>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {[
                    {
                      title: "Calories",
                      value: Math.round(analyzeData.daily_total.totalCal),
                      unit: "cal",
                      icon: "🔥",
                      gradient:
                        "linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)",
                      shadowColor: "rgba(255, 167, 38, 0.3)",
                    },
                    {
                      title: "Protein",
                      value: Math.round(analyzeData.daily_total.totalProtein),
                      unit: "g",
                      icon: "🥩",
                      gradient:
                        "linear-gradient(135deg, #66bb6a 0%, #43a047 100%)",
                      shadowColor: "rgba(102, 187, 106, 0.3)",
                    },
                    {
                      title: "Carbs",
                      value: Math.round(analyzeData.daily_total.totalCarb),
                      unit: "g",
                      icon: "🍞",
                      gradient:
                        "linear-gradient(135deg, #ec407a 0%, #d81b60 100%)",
                      shadowColor: "rgba(236, 64, 122, 0.3)",
                    },
                    {
                      title: "Fat",
                      value: Math.round(analyzeData.daily_total.totalFat),
                      unit: "g",
                      icon: "🧈",
                      gradient:
                        "linear-gradient(135deg, #ffee58 0%, #fdd835 100%)",
                      shadowColor: "rgba(255, 238, 88, 0.3)",
                    },
                  ].map((block, index) => (
                    <Paper
                      key={block.title}
                      sx={{
                        flex: 1,
                        minWidth: 150,
                        p: 2.5,
                        borderRadius: 3,
                        background: block.gradient,
                        opacity: 0,
                        animation: `fadeIn 0.6s ${0.2 + 0.1 * index}s forwards`,
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow: `0 12px 24px ${block.shadowColor}`,
                        },
                      }}
                      elevation={2}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                          color: "white",
                          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <span style={{ fontSize: "1.2em" }}>{block.icon}</span>
                        {block.title}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                      >
                        {block.value}
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            ml: 0.5,
                            opacity: 0.9,
                          }}
                        >
                          {block.unit}
                        </Typography>
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
