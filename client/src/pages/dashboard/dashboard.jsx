import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const DashboardCard = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card sx={{ minWidth: 200, boxShadow: 4, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    booksBorrowedToday: 0,
    dueBooks: 0,
    topBorrowed: [
      { title: 'Rich Dad Poor Dad', count: 45 },
      { title: 'Harry Potter', count: 39 },
      { title: 'Atomic Habits', count: 28 }
    ],
    borrowStats: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      data: [12, 25, 18, 30, 22]
    }
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        📊 Library Admin Dashboard
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item><DashboardCard title="Total Books" value={stats.totalBooks} /></Grid>
        <Grid item><DashboardCard title="Total Users" value={stats.totalUsers} /></Grid>
        <Grid item><DashboardCard title="Books Borrowed Today" value={stats.booksBorrowedToday} /></Grid>
        <Grid item><DashboardCard title="Due Books" value={stats.dueBooks} /></Grid>
      </Grid>

      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          📈 Borrow Trends This Week
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.borrowStats.labels.map((label, i) => ({
            name: label,
            count: stats.borrowStats.data[i]
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          🔥 Top Borrowed Books
        </Typography>
        <Grid container spacing={2}>
          {stats.topBorrowed.map((book, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6">{book.title}</Typography>
                    <Typography variant="body2">Borrowed: {book.count} times</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
