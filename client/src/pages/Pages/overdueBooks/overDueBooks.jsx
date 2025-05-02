import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, Button, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";

const OverduePage = ({user}) => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  useEffect(() => {
   const fetchOverdue = async () => {
  try {
    const res = await axios.get("http://localhost:5000/borrowedBooks");
    const now = new Date();
    const overdue = res.data.filter((borrow) => {
      const dueDate = new Date(borrow.dueDate);
      return now > dueDate; // Book is overdue if today is after the due date
    });
    setOverdueBooks(overdue);
  } catch (err) {
    console.error("Error fetching overdue books:", err);
  }
};


    fetchOverdue();
  }, []);

  const handleReminder = (book) => {
    const now = new Date();
    const takenDate = new Date(book.takenDate);
    const diffInDays = Math.floor((now - takenDate) / (1000 * 60 * 60 * 24));
  
    // Set additional data before sending
    const bookWithExtras = {
      ...book,
      email: user.username, // ensure email exists in the book object
      daysOverdue: diffInDays - 7, // overdue beyond 7 days
    };
  
    axios
      .post("http://localhost:5000/sendoveremail", bookWithExtras)
      .then(() => {
        setSnackMsg(`Reminder sent to ${book.borrower} for ${book.title}`);
        setSnackOpen(true);
      })
      .catch((error) => {
        console.error("Error sending reminder:", error);
      });
  };
  

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        📚 Overdue Books List
      </Typography>

      {overdueBooks.length === 0 ? (
        <Typography variant="h6" align="center" color="green">
          No overdue books! ✅
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {overdueBooks.map((book, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    background: "#fff",
                    borderLeft: "6px solid #e53935",
                    boxShadow: 4,
                    borderRadius: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {book.borrower}
                    </Typography>
                    <Typography variant="body2">
                      ISBN: {book.isbn}
                    </Typography>
                    <Typography variant="body2">
                      UID: {book.uid}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Taken on: {new Date(book.takenDate).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      onClick={() => handleReminder(book)}
                    >
                      Send Reminder 🔔
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)} variant="filled">
          {snackMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OverduePage;
