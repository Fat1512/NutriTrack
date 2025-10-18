import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Box, Menu, MenuItem, Avatar } from "@mui/material";
import { LogoutOutlined, PersonOutline } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const PATH_HEADER: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/profile": "Profile",
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const path = location.pathname;
  const realPath = PATH_HEADER[path]?.split("/") || [];

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex p-4 justify-between border-b border-gray-200">
      <div>
        <span className="text-gray-600">{realPath[0]}</span>
        {realPath.length > 1 && ` / ${realPath.slice(1).join(" / ")}`}
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              onClick={handleUserMenuClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textTransform: "none",
                color: "text.primary",
              }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <PersonOutline />
              </Avatar>
              <Typography variant="body2">{user.username}</Typography>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutOutlined sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </div>
    </div>
  );
};

export default Header;
