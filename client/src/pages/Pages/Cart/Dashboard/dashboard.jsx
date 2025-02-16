import React, { useState } from "react";
import { Container, Table, Button, Card } from "react-bootstrap";
import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [books, setBooks] = useState([
        { id: 1, title: "The Great Gatsby", status: "Available" },
        { id: 2, title: "To Kill a Mockingbird", status: "Issued" },
        { id: 3, title: "1984", status: "Reserved" },
        { id: 4, title: "Harry Potter", status: "Available" },
    ]);

    const updateBookStatus = (id, newStatus) => {
        setBooks(books.map(book => (book.id === id ? { ...book, status: newStatus } : book)));
    };

    const bookStatusData = {
        labels: ["Available", "Issued", "Reserved"],
        datasets: [
            {
                label: "Books Count",
                data: [
                    books.filter(book => book.status === "Available").length,
                    books.filter(book => book.status === "Issued").length,
                    books.filter(book => book.status === "Reserved").length,
                ],
                backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
            },
        ],
    };

    return (
        <Container className="mt-4">
            <motion.h2 className="text-center mb-4" style={{ color: "#673ab7" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>📊 Library Dashboard</motion.h2>

            <div style={{ display: "flex", gap: "100px" }}>
                <Card className="p-3 mb-4 shadow" style={{ width: "500px" }}>
                    <Bar data={bookStatusData} />
                </Card>

                <Link to="/bookManagement"  style={{textDecoration:"none"}}>

                    <Card className="p-3 mb-4 shadow" style={{ width: "200px", backgroundColor: "lightgreen", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {/* <Bar data={bookStatusData}  /> */}
                        <h4>Total Books</h4>
                        <h1>0</h1>
                    </Card>

                </Link>

                <Link to="/usermanagement" style={{textDecoration:"none"}} >

                    <Card className="p-3 mb-4 shadow" style={{ width: "200px", backgroundColor: "lightblue", display: "flex", alignItems: "center", justifyContent: "center"  }}>
                        {/* <Bar data={bookStatusData}  /> */}
                        <h4>Users Count</h4>
                        <h1>0</h1>
                    </Card>
                </Link>

                <Link to="/overdueBooks"  style={{textDecoration:"none"}} >
                <Card className="p-3 mb-4 shadow" style={{ width: "200px", backgroundColor: "lightyellow", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* <Bar data={bookStatusData}  /> */}
                    <h4>Overdue Books</h4>
                    <h1>0</h1>
                </Card>
                </Link>
            </div>

            <Table striped bordered hover className="shadow-lg">
                <thead>
                    <tr style={{ backgroundColor: "#03a9f4", color: "white" }}>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <tr key={book.id} style={{ backgroundColor: index % 2 === 0 ? "#e3f2fd" : "#bbdefb" }}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td><span className={`badge bg-${book.status === "Available" ? "success" : book.status === "Issued" ? "danger" : "warning"}`}>{book.status}</span></td>
                            <td>
                                <FormControl>
                                    <Select
                                        value={book.status}
                                        onChange={(e) => updateBookStatus(book.id, e.target.value)}
                                    >
                                        <MenuItem value="Available">Available</MenuItem>
                                        <MenuItem value="Issued">Issued</MenuItem>
                                        <MenuItem value="Reserved">Reserved</MenuItem>
                                    </Select>
                                </FormControl>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Dashboard;
