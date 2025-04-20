import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  Avatar,
  Button,
  Divider,
  TextareaAutosize,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = ({ user }) => {
  const dateStr = user.createdAt;
  const date = new Date(dateStr);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const [data, setData] = useState({
    name: user.name,
    username: user.username,
    phone: user.phone,
    address: user.address,
    uniqueId: user.uniqueId,
  });

  const handleInputs = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    await axios
      .post(`http://localhost:5000/updateUser`, data)
      .then((response) => {
        var message = response.data.msg;
        var status = response.status;

        if (status === 200) {
          toast.success(`${message}`, { position: "top-center", autoClose: 2000 });
          setTimeout(() => {
            window.location.href = "/profile";
          }, 1500);
        } else if (status === 202) {
          toast.warn(`${message}`, { position: "top-center", autoClose: 2000 });
        }
      });
  };

  return (
    <Box sx={{ pt: 8 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {/* Left Side */}
        <Box flex={1} m={2}>
          <Card
            sx={{
              p: 2,
              borderRadius: 4,
              backgroundColor: "#3d5a80",
              boxShadow: 5,
              color: "white",
            }}
          >
            <Box display="flex" justifyContent="center">
              <Avatar
                src="https://api.multiavatar.com/Starcrasher.png?apikey=dIwKHchoCn6x9k"
                sx={{ width: 120, height: 120, mb: 2 }}
              />
            </Box>
            <Typography variant="h5" align="center" fontWeight={600}>
              {user.name}
            </Typography>
            <Typography align="center" mt={1}>
              UID: <strong>{user.uniqueId}</strong>
            </Typography>
            <Typography align="center">Email: {user.username}</Typography>
            <Typography align="center">Phone: {user.phone}</Typography>
            <Typography align="center" mt={1}>
              Joined on{" "}
              <span style={{ color: "#a0a2a1" }}>{formattedDate}</span>
            </Typography>

            <Divider sx={{ my: 2, borderColor: "#fff3" }} />
            <Typography fontWeight={600}>Borrowed Books</Typography>

            {user.borrowed.map((book, index) => (
              <Box
                key={index}
                sx={{
                  mt: 1,
                  p: 1,
                  border: "1px solid #fff2",
                  borderRadius: 1,
                }}
              >
                <div>
                  <strong>ISBN:</strong> {book.isbn}
                </div>
                <div>
                  <strong>Taken Date:</strong>{" "}
                  {new Date(book.takenDate).toLocaleString()}
                </div>
              </Box>
            ))}

            <Typography align="center" mt={2}>
              <span style={{ color: "yellow" }}>{user.cart.length}</span> items
              in{" "}
              <a href="/cart" style={{ color: "#539cda", textDecoration: "none" }}>
                cart
              </a>
            </Typography>
          </Card>
        </Box>

        {/* Right Side */}
        <Box flex={3} m={2}>
          {/* Profile Edit Section */}
          <Card sx={{ p: 3, mb: 3, borderRadius: 4, boxShadow: 5 }}>
            <Typography variant="h5" fontWeight={600} mb={2}>
              Edit Your Profile
            </Typography>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                name="name"
                defaultValue={user.name}
                onChange={handleInputs}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                name="username"
                defaultValue={user.username}
                onChange={handleInputs}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Phone"
                type="number"
                variant="outlined"
                name="phone"
                defaultValue={user.phone}
                onChange={handleInputs}
              />
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                name="address"
                defaultValue={user.address}
              />
              <Button variant="contained" color="primary" onClick={submitForm}>
                Update
              </Button>
            </Box>
            <ToastContainer />
          </Card>

          {/* Feedback Section */}
          <Card sx={{ p: 3, borderRadius: 4, boxShadow: 5 }}>
            <Typography variant="h5" fontWeight={600} mb={2}>
              Any Query or Feedback?
            </Typography>
            <TextareaAutosize
              minRows={6}
              style={{
                width: "100%",
                fontFamily: "Poppins",
                fontSize: "16px",
                padding: "1rem",
                borderRadius: "10px",
                borderColor: "#ccc",
              }}
              defaultValue="I like to suggest You ....."
            />
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
