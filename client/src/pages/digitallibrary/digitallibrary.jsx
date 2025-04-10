import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, Card, CardContent, Typography,
  Box, CircularProgress, CardMedia, Chip, Grid, Stack
} from '@mui/material';
import { motion } from 'framer-motion';

const DigitalLibrary = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [totalFound, setTotalFound] = useState(0);

  const fetchBooks = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://openlibrary.org/search.json?q=${query}&page=${page}`);
      setBooks(res.data.docs);
      setTotalFound(res.data.numFound);
    } catch (error) {
      console.error('Error fetching books', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [page]); // Fetch books when page changes

  const handleSearch = () => {
    setPage(1); // Reset to page 1 for new search
    fetchBooks();
  };

  return (
    <Box sx={{ p: 10 }}>
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        📚 Digital Library - Find Your Books
      </motion.h2>

      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <TextField
          label="Search books..."
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>

      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center">
            {books.map((book, index) => {
              const coverImg = book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                : 'https://via.placeholder.com/150x200?text=No+Cover';

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={coverImg}
                        alt={book.title}
                      />
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          👤 {book.author_name?.join(', ') || 'Unknown'}
                        </Typography>
                        <Typography variant="body2">
                          🗓️ {book.first_publish_year || 'N/A'}
                        </Typography>
                        <Box mt={1}>
                          🌍 Languages:
                          {book.language?.map((lang, i) => (
                            <Chip key={i} label={lang.toUpperCase()} size="small" sx={{ mx: 0.5 }} />
                          ))}
                        </Box>
                        <Box mt={2}>
                          <a
                            href={`https://openlibrary.org${book.key}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button size="small" variant="outlined">🔗 View Book</Button>
                          </a>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>

          {books.length > 0 && (
            <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
              <Button
                variant="contained"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                ⬅️ Prev
              </Button>
              <Typography variant="body1" mt={1.3}>Page {page}</Typography>
              <Button
                variant="contained"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page * 100 >= totalFound}
              >
                Next ➡️
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default DigitalLibrary;
