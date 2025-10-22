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
