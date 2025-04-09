import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [user, setUser] = useState({});

  const handleInputs = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    await axios
      .post(`http://localhost:5000/register`, user)
      .then((response) => {
        const message = response.data.msg;
        const status = response.status;

        if (status === 200) {
          toast.success(`${message}`, {
            position: "top-center",
            autoClose: 2000,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: true,
          });
          setTimeout(() => {
            window.location.href = "/signin";
          }, 1500);
        } else if (status === 202) {
          toast.warn(`${message}`, {
            position: "top-center",
            autoClose: 2000,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: true,
          });
        }
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h4" fontWeight={700} gutterBottom>
                bookWise
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" mb={2}>
                Register Your Account
              </Typography>

              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  margin="normal"
                  onChange={handleInputs}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="username"
                  margin="normal"
                  onChange={handleInputs}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  margin="normal"
                  onChange={handleInputs}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  margin="normal"
                  onChange={handleInputs}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, py: 1.5 }}
                  onClick={submitForm}
                >
                  Sign Up
                </Button>
              </Box>

              <Typography variant="body2" mt={2}>
                Already have an account?{" "}
                <a href="/signin" style={{ color: "#1976d2" }}>
                  Sign In
                </a>
              </Typography>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://raw.githubusercontent.com/AnuragRoshan/images/a74c41aa0efd44c9239abed96d88a5ffd11ffe7f/undraw_friendship_mni7.svg"
                alt="signup"
                style={{ width: "100%", height: "auto" }}
              />
            </motion.div>
          </Grid>
        </Grid>
        <ToastContainer />
      </Paper>
    </Container>
  );
};

export default SignUp;
