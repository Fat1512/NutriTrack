import { Fab } from "@mui/material";
import { useState } from "react";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AskAIButton from "./AskAIButton";
const AskAIWrapper = () => {
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleOnClose() {
    setOpen(false);
  }
  return (
    <div>
      <Fab
        aria-label="chat"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 64,
          height: 64,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            transform: "scale(1.1) rotate(5deg)",
            boxShadow: "0 12px 32px rgba(102, 126, 234, 0.6)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        <AutoAwesomeIcon fontSize="large" />
      </Fab>
      {open && <AskAIButton open={open} handleClose={handleOnClose} />}
    </div>
  );
};

export default AskAIWrapper;
