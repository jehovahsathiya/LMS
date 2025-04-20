import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";

const MyBorrowedBooks = () => {
  const [user, setUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  const fetchLoggedInUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/logedinuser/", {
        withCredentials: true,
      });
      setUser(data.user);
      setBorrowedBooks(data.user.borrowed || []);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (isbn) => {
    try {
      const payload = {
        uniqueId: user.uniqueId,
        isbn: [isbn], // send as array
      };

      const { data } = await axios.post(
        "http://localhost:5000/returnBooks",
        payload
      );

      alert(data.msg);
      // Refresh the user data
      fetchLoggedInUser();
    } catch (error) {
      console.error("Return failed:", error);
      alert("Failed to return book.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Borrowed Books
      </Typography>
      <Grid container spacing={2}>
        {borrowedBooks.length === 0 ? (
          <Typography>No borrowed books found.</Typography>
        ) : (
          borrowedBooks.map((book, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">ISBN: {book.isbn}</Typography>
                  <Typography variant="body2">
                    Taken On: {new Date(book.takenDate).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: 10 }}
                    onClick={() => handleReturn(book.isbn)}
                  >
                    Return Book
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default MyBorrowedBooks;
