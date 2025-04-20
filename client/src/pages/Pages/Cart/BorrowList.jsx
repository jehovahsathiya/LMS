import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BorrowList = () => {
  const [data, setData] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordPerPage = 10;
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await axios.get("http://localhost:5000/borrowedBooks");
    setData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const currentDate = new Date();
    const date = new Date(dateStr);
    const options = { day: "numeric", month: "long", year: "numeric" };

    const diffDays = Math.ceil(
      Math.abs(currentDate - date) / (1000 * 3600 * 24)
    );

    return diffDays > 8
      ? `Due by ${diffDays} days`
      : date.toLocaleDateString("en-US", options);
  };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedBooks([...selectedBooks, id]);
    } else {
      setSelectedBooks(selectedBooks.filter((bookId) => bookId !== id));
    }
  };

  const addToCart = async () => {
    // Future logic to save changes
    console.log("Selected Returned Books:", selectedBooks);
  };

  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const record = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordPerPage);

  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Borrowed Book List
          </Typography>

          {data.length > 0 ? (
            <>
              <Table>
                <TableHead sx={{ backgroundColor: "#1976d2" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}>#</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Borrower</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Book Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Author</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Due/Borrowed Date</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Returned</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record.map((d, i) => (
                    <TableRow key={d.isbn}>
                      <TableCell>{(currentPage - 1) * 10 + i + 1}</TableCell>
                      <TableCell>{d.borrower}</TableCell>
                      <TableCell>{d.title}</TableCell>
                      <TableCell>{d.author}</TableCell>
                      <TableCell>{formatDate(d.takenDate)}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedBooks.includes(d.isbn)}
                          onChange={(e) => handleCheckboxChange(e, d.isbn)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 4,
                }}
              >
                <Pagination
                  count={npage}
                  page={currentPage}
                  onChange={(e, value) => setCurrentPage(value)}
                  color="primary"
                />
                <Box>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={addToCart}
                    sx={{ mr: 2 }}
                  >
                    Save Changes
                  </Button>
                  <Typography variant="caption">
                    Save Returned Status of Borrower
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <Box textAlign="center" mt={5}>
              <img
                src="https://raw.githubusercontent.com/AnuragRoshan/images/71611a64e2b0acde9f0527b4f2341fabd7bf9555/undraw_process_re_gws7.svg"
                alt="loading"
                width="250"
              />
              <Typography variant="body1" mt={2}>
                Loading borrowed books...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BorrowList;
