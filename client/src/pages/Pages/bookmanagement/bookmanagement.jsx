import React, { useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { TextField } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const BookManagement = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", genre: "Fiction", publicationDate: "1925", status: "Available", image: "" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", genre: "Classic", publicationDate: "1960", status: "Issued" , image: ""},
    { id: 3, title: "1984", author: "George Orwell", isbn: "9780451524935", genre: "Dystopian", publicationDate: "1949", status: "Available", image: "" },
    { id: 4, title: "Harry Potter", author: "J.K. Rowling", isbn: "9780747532743", genre: "Fantasy", publicationDate: "1997", status: "Reserved", image: "" },
  ]);
  
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [newBook, setNewBook] = useState({ title: "", authors: "", isbn: "", genre: [], publicationDate: "", status: "Available",pageCount:"", longDescription:"",shortDescription:"",image: "",ItemCount:"" });
  const [search, setSearch] = useState("A");

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setNewBook({title: "", authors: "", isbn: "", genre: [], publicationDate: "", status: "Available",pageCount:"", longDescription:"",shortDescription:"",image: "",ItemCount:"" });
  };
  const handleShow = () => setShow(true);

  const addBook = async() => {
    console.log(newBook);

    //http://localhost:5000/addBook
  

  const booksData=  {
       
      title:newBook.title,
      isbn:newBook.isbn,
      pageCount:newBook.pageCount ,
      publishedDate:newBook.publicationDate ,
      longDescription:newBook.longDescription ,
      shortDescription:newBook.shortDescription ,
      status:newBook.status ,
      authors:newBook.authors,
      genre:newBook.genre,
      ItemCount:newBook.ItemCount ,
      image:newBook.image

  }
    
  const formData = new FormData();

  for (const key in booksData) {

    if (key !== "image") { // Avoid appending "image" twice
      formData.append(key, booksData[key]);
    }
  }

  formData.append("image", booksData.image); 

  try {
    const { data } = await axios.post("http://localhost:5000/addBook", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Response:", data);
  } catch (error) {
    console.error("Error uploading book:", error);
  }


  
    handleClose();
  };

  const editBook = (book) => {
    setEditMode(true);
    setCurrentBook(book._id);
    setNewBook(book);
    setShow(true);
  };

  const updateBook = () => {
    setBooks(books.map(book => (book.id === currentBook ? { ...newBook, id: currentBook } : book)));
    handleClose();
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
  if (file) {
    setNewBook({ ...newBook, image: file }); // Store file object directly
  }
  };

  // const filteredBooks = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));
  const filteredBooks = books
  const refereshbooks =async()=>{

    //allBook

    const { data } = await axios.get("http://localhost:5000/allBook");

    setBooks(data.books)

    console.log(data);
    
   
   
  }



  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4" style={{ color: "#4a90e2" }}>📚 Book Management System</h2>
      
      <div className="d-flex justify-content-between mb-3">
        <TextField label="Search Books" variant="outlined" onChange={(e) => setSearch(e.target.value)} style={{ width: "60%" }} />
        <Button variant="success" onClick={handleShow}>➕ Add Book</Button>   <Button variant="warning" onClick={refereshbooks}>Refresh</Button>
      </div>
      
      <Table striped bordered hover className="shadow-lg">
        <thead>
          <tr style={{ backgroundColor: "#f4a261", color: "white" }}>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Genre</th>
            <th>Publication Date</th>
            <th>longDescription</th>
            <th>shortDescription</th>
            <th>Pages</th>
            <th>Item Count</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book, index) => (
            <tr key={book._id} style={{ backgroundColor: index % 2 === 0 ? "#fcd5ce" : "#bde0fe" }}>
              <td>{book._id}</td>
              <td>{book.title}</td>
              <td>{book.authors}</td>
              <td>{book.isbn}</td>
              <td>{book.genre}</td>
              <td>{book.publishedDate}</td>
              <td>{book.longDescription}</td>
              <td>{book.shortDescription}</td>
              <td>{book.pageCount}</td>
              <td>{book.ItemCount}</td>
              <td><span className={`badge bg-${book.status === "Available" ? "success" : book.status === "Issued" ? "danger" : "warning"}`}>{book.status}</span></td>
              <td style={{width:"100px"}} >
                <Button variant="warning" size="sm" onClick={() => editBook(book)}>✏️ Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => deleteBook(book.id)}>🗑️ Delete</Button>
              </td>
              <td>
                <img style={{width:"100px",height:"100px"}} src={`http://localhost:5000/${book.image}`} alt="" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Book" : "Add New Book"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter book title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" placeholder="Enter author" value={newBook.authors} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control type="text" placeholder="Enter ISBN" value={newBook.isbn} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control type="text" placeholder="Enter genre" value={newBook.genre} onChange={(e) => setNewBook({ ...newBook, genre:[ e.target.value ]})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Publication Date</Form.Label>
              <Form.Control type="text" placeholder="Enter publication date" value={newBook.publicationDate} onChange={(e) => setNewBook({ ...newBook, publicationDate: e.target.value })} />
            </Form.Group>
         {/*  */}

            <Form.Group className="mb-3">
              <Form.Label>pageCount</Form.Label>
              <Form.Control type="text" placeholder="Enter publication date" value={newBook.pageCount} onChange={(e) => setNewBook({ ...newBook, pageCount: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>long Description</Form.Label>
              <Form.Control type="text" placeholder="Enter publication date" value={newBook.longDescription} onChange={(e) => setNewBook({ ...newBook, longDescription: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>short Description</Form.Label>
              <Form.Control type="text" placeholder="Enter publication date" value={newBook.shortDescription} onChange={(e) => setNewBook({ ...newBook, shortDescription: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ItemCount</Form.Label>
              <Form.Control type="text" placeholder="Enter publication date" value={newBook.ItemCount} onChange={(e) => setNewBook({ ...newBook, ItemCount: e.target.value })} />
            </Form.Group>

            {/*  */}

            <Form.Group className="mb-3">
              <Form.Label>Book Cover</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={editMode ? updateBook : addBook}>{editMode ? "Update Book" : "Save Book"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookManagement;
