import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";

const Signin = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const handleInputs = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/login`, user, {
        withCredentials: true,
      });

      const message = response.data.message;
      const status = response.data.status;

      if (status === "200") {
        toast.success(message);
        navigate("/profile");
      } else if (status === "202") {
        toast.warn(message);
      } else if (status === "500") {
        toast.error(message);
      }
    } catch (error) {
      if (error.message === "Network Error") {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error("Login failed. Try again later.");
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ minHeight: "100vh" }}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="primary">
                BookWise
              </Typography>
              <Typography variant="subtitle1" align="center" gutterBottom>
                Login to your account
              </Typography>

              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  name="username"
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  onChange={handleInputs}
                />
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  onChange={handleInputs}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
                  onClick={submitForm}
                >
                  Sign In
                </Button>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Don’t have an account? <Link href="/signup">Sign Up</Link>
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.img
            src="https://raw.githubusercontent.com/AnuragRoshan/images/7bba2de48484241154721a9ac693a753e3927570/undraw_notebook_re_id0r.svg"
            alt="login"
            width="100%"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </Grid>
      </Grid>
      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
};

export default Signin;