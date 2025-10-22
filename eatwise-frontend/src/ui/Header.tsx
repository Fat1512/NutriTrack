import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from "@mui/material";
import { LogoutOutlined, PersonOutline } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md rounded-b-lg mb-6">
      {/* Logo */}
      <div
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => navigate("/routine")}
      >
        <img className="h-20" src="/public/logo.png" alt="Logo" />
      </div>

      {/* User Menu */}
      {user && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Account settings">
            <Button
              onClick={handleUserMenuClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textTransform: "none",
                color: "text.primary",
                background: "#f3f4f6",
                px: 2,
                py: 1,
                borderRadius: 2,
                "&:hover": { background: "#e5e7eb" },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#60A5FA",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                <PersonOutline />
              </Avatar>
              <Typography variant="body1" className="font-semibold">
                {user.username}
              </Typography>
            </Button>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                minWidth: 150,
              },
            }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "#F87171",
                  color: "white",
                },
              }}
            >
              <LogoutOutlined sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      )}
    </header>
  );
};

export default Header;
