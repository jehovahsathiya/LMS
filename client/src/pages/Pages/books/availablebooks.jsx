import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
} from "react-bootstrap";
import {
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const user = JSON.parse(localStorage.getItem("user"));

  const addToCart = async (book) => {
    if (book.status === "Available") {
      const username = user.username;
      const send = { books: [book], username: username };
      await axios.post(`http://localhost:5000/addToCart`, send);
      setTimeout(() => {
        window.location.href = "/cart";
      }, 500);
    } else {
      alert(`${book.title} is not available for checkout.`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:5000/allBook");
      setBooks(data.books);
    };
    fetchData();
  }, []);

  // 🔍 Filter & Search Logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📚 Book Collection</h2>

      {/* 🔎 Search and Filter */}
      <Row className="mb-4">
        <Col md={6}>
          <TextField
            fullWidth
            label="Search by Title"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <TextField
            select
            fullWidth
            label="Filter by Status"
            variant="outlined"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Issued">Issued</MenuItem>
            <MenuItem value="Reserved">Reserved</MenuItem>
          </TextField>
        </Col>
      </Row>

      <Row>
        {filteredBooks.length === 0 ? (
          <Col>
            <Typography variant="h6" align="center">
              No books found.
            </Typography>
          </Col>
        ) : (
          filteredBooks.map((book) => (
            <Col key={book._id} md={3} className="mb-4">
              <Card className="shadow-lg">
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000/${book.image}`}
                  alt={book.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Status: <strong>{book.status}</strong>
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => addToCart(book)}
                  disabled={book.status !== "Available"}
                  sx={{ borderRadius: 2, fontWeight: "bold", mb: 1 }}
                >
                  Add to Cart
                </Button>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default UserDashboard;
