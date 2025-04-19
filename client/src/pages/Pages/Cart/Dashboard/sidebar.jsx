import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { NavLink } from "react-router-dom";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Book Management", icon: <LibraryBooksIcon />, path: "/bookManagement" },
  { text: "User Management", icon: <PeopleIcon />, path: "/usermanagement" },
  { text: "Overdue Books", icon: <AccessTimeIcon />, path: "/overdueBooks" },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1e1e2f",
          color: "#fff",
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: "center", borderBottom: "1px solid #444" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
          📖 Library Admin
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => (
          <NavLink
            key={item.text}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#90caf9" : "#fff",
            })}
          >
            <ListItemButton
              sx={{
                "&:hover": {
                  backgroundColor: "#34344e",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
}
