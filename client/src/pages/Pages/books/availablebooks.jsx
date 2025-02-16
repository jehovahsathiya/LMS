import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { CardMedia, CardContent, Typography, List, ListItem, ListItemText, IconButton, Paper } from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";


const UserDashboard = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", status: "Available", image: "https://via.placeholder.com/150" },
    { id: 2, title: "To Kill a Mockingbird", status: "Issued", image: "https://via.placeholder.com/150" },
    { id: 3, title: "1984", status: "Reserved", image: "https://via.placeholder.com/150" },
    { id: 4, title: "Harry Potter", status: "Available", image: "https://via.placeholder.com/150" },
  ]);

  const user= JSON.parse(localStorage.getItem("user"))

  
  const [cart, setCart] = useState([]);

  const addToCart =  async (book) => {
    if (book.status === "Available") {

      
      const username = user.username;
  
      
      const send = { books: book, username: username };
      console.log(send);
      await axios
        .post(`http://localhost:5000/addToCart`, send, {})
        .then((response) => {
          console.log(response);
        });
      setTimeout(() => {
        window.location.href = "/cart";
      }, 500);
     
  
  } else {
      alert(`${book.title} is not available for checkout.`);
    }
  };

  const removeFromCart = (id) => {

    setCart(cart.filter(book => book._id !== id));

  };


  useEffect(()=>{
   const fetchData= async()=>{

      const { data } = await axios.get("http://localhost:5000/allBook");
  
      setBooks(data.books)
  
      console.log(data);
  
    }

    fetchData()


  },[])

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📚 Book Collection</h2>
      <Row>
        {books.map((book) => (
          <Col key={book._id} md={3} className="mb-4">
            <Card className="shadow-lg">
              <CardMedia component="img" height="200" image={book.image} alt={book.title} />
              <CardContent>
                <Typography variant="h6" gutterBottom>{book.title}</Typography>
                <Typography variant="body2" color="textSecondary">Status: <strong>{book.status}</strong></Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => addToCart(book)}
                disabled={book.status !== "Available"}
              >
                Add to Cart
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Cart Section */}
    
    </Container>
  );
};

export default UserDashboard;
