import React, { useState, useEffect } from "react";
import { Container, Table, Card } from "react-bootstrap";
import { FormControl, MenuItem, Select } from "@mui/material";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";
import Sidebar from "./sidebar";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [overdueCount, setOverdueCount] = useState(0);

    const fetchData = async () => {
        try {
            const bookRes = await axios.get("http://localhost:5000/allBook");
            const userRes = await axios.get("http://localhost:5000/allUser");
            const borrowRes = await axios.get("http://localhost:5000/borrowedBooks");

            setBooks(bookRes.data.books || []);
            setUsers(userRes.data || []);
            setBorrowedBooks(borrowRes.data || []);

            // Overdue calculation (example: overdue if takenDate < 7 days ago)
            const now = new Date();
            const overdue = borrowRes.data.filter(borrow => {
                const takenDate = new Date(borrow.takenDate);
                const diffInDays = Math.floor((now - takenDate) / (1000 * 60 * 60 * 24));
                return diffInDays > 7;
            });
            setOverdueCount(overdue.length);

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateBookStatus = (id, newStatus) => {
        setBooks(prev =>
            prev.map(book => (book._id === id ? { ...book, status: newStatus } : book))
        );
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
        <>
            <Sidebar />
            <Container className="mt-4">
                <motion.h2
                    className="text-center mb-4"
                    style={{ color: "#673ab7" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    📊 Library Dashboard
                </motion.h2>

                <div style={{ display: "flex", gap: "100px", flexWrap: "wrap" }}>
                    <Card className="p-3 mb-4 shadow" style={{ width: "500px" }}>
                        <Bar data={bookStatusData} />
                    </Card>

                    <Link to="/bookManagement" style={{ textDecoration: "none" }}>
                        <Card className="p-3 mb-4 shadow" style={{ width: "200px", backgroundColor: "lightgreen", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <h4>Total Books</h4>
                            <h1>{books.length}</h1>
                        </Card>
                    </Link>

                    <Link to="/usermanagement" style={{ textDecoration: "none" }}>
                        <Card className="p-3 mb-4 shadow" style={{ width: "200px", backgroundColor: "lightblue", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <h4>Users Count</h4>
                            <h1>{users.length}</h1>
                        </Card>
                    </Link>

                    <Link to="/overdueBooks" style={{ textDecoration: "none" }}>
                        <Card className="p-3 mb-4 shadow" style={{ width: "200px", backgroundColor: "lightyellow", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <h4>Overdue Books</h4>
                            <h1>{overdueCount}</h1>
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
                            <tr key={book._id} style={{ backgroundColor: index % 2 === 0 ? "#e3f2fd" : "#bbdefb" }}>
                                <td>{index + 1}</td>
                                <td>{book.title}</td>
                                <td>
                                    <span className={`badge bg-${book.status === "Available" ? "success" : book.status === "Issued" ? "danger" : "warning"}`}>
                                        {book.status}
                                    </span>
                                </td>
                                <td>
                                    <FormControl>
                                        <Select
                                            value={book.status}
                                            onChange={(e) => updateBookStatus(book._id, e.target.value)}
                                            size="small"
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
        </>
    );
};

export default Dashboard;
