import React from "react";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItemStyle = {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "1.5rem",
    transition: "all 0.3s ease",
    textTransform: "capitalize",
  };

  const handleLogout = async () => {
    await axios
      .post(`http://localhost:5000/logout`, null, {
        withCredentials: true,
      })
      .then((response) => {
        const message = response.data.msg;
        if (response.status === 200) {
          toast.success(message, {
            position: "top-center",
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          toast.warn(message, {
            position: "top-center",
            autoClose: 2000,
          });
        }
      });
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: "#1e1e2f", boxShadow: 3 }}>
        <Toolbar sx={{ justifyContent: "space-between", px: 4 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 700, cursor: "pointer", color: "#90caf9" }}
            onClick={() => navigate("/home")}
          >
            bookWise
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {[
              { label: "Books", path: "/home", onClick: () => navigate("/home") },
              {
                label: user.userType === "user" ? "Cart" : "Borrower",
                path: user.userType === "user" ? "/cart" : "/borrower",
                onClick: () =>
                  navigate(user.userType === "user" ? "/cart" : "/borrower"),
              },
              {
                label: user.userType === "user" ? null : "BookManagement",
                path: "/bookManagement",
                onClick: () => {
                  if (user.userType !== "user") {
                    navigate("/bookManagement");
                  }
                },
              },
              {
                label: "Profile",
                path: "/profile",
                onClick: () => navigate("/profile"),
              },
              {
                label: "Logout",
                path: "/",
                onClick: handleLogout,
              },
            ]
              .filter((item) => item.label)
              .map((item, idx) => (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  key={idx}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Button
                    variant={isActive(item.path) ? "contained" : "text"}
                    sx={{
                      ...navItemStyle,
                      backgroundColor: isActive(item.path) ? "#1976d2" : "transparent",
                      "&:hover": {
                        backgroundColor: "#2196f3",
                      },
                    }}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
          </Box>
        </Toolbar>
      </AppBar>
      <ToastContainer />
      <Toolbar /> {/* For spacing below AppBar */}
    </>
  );
};

export default Navbar;
