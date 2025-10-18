import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          color: "white",
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: "white",
          fontWeight: "medium",
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
