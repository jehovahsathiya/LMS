import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Button, CircularProgress, Input, Box } from '@mui/material';

const BookPDFSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      const books = response.data.docs.slice(0, 12); // Limit to 12 results

      const formatted = books.map((book) => {
        const identifier = book.ia?.[0] || null;
        const pdfLink = identifier
          ? `https://archive.org/download/${identifier}/${identifier}.pdf`
          : null;

        const coverImg = book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : 'https://via.placeholder.com/150x200?text=No+Image';

        return {
          title: book.title,
          author: book.author_name?.join(', ') || 'Unknown',
          year: book.first_publish_year || 'N/A',
          language: book.language?.join(', ').toUpperCase() || 'N/A',
          pdf: pdfLink,
          image: coverImg,
        };
      });

      setResults(formatted);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gray-100 py-8 px-4">
      <Box className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">📚 Book PDF Search</h1>

        <Box className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <Input
            placeholder="Search for a book (e.g., Story Books)"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white px-4 py-2 rounded shadow-md"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={searchBooks}
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center" style={{display:"flex",flexWrap:"wrap",padding:"50px",gap:"50px"}}>
          {results.map((book, index) => (
            <>
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 5,
                  height: '100%',
                  width: '250px',
            
                }}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  style={{ height: '200px', width: '150px', objectFit: 'cover', marginBottom: '1rem' }}
                />
                <CardContent className="text-center">
                  <Typography variant="h6" className="font-semibold">{book.title}</Typography>
                  <Typography variant="body2" color="textSecondary">👤 {book.author}</Typography>
                  <Typography variant="body2" color="textSecondary">📅 Year: {book.year}</Typography>
                  <Typography variant="body2" color="textSecondary">🌐 Language: {book.language}</Typography>

                  {book.pdf ? (
                    <a
                      href={book.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium mt-2 block"
                    >
                      📥 Download PDF
                    </a>
                  ) : (
                    <Typography color="error">❌ No PDF Available</Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            {
                
                index==4?<br/>:null
              
            }
            {
                  console.log(index)
            }
            </>

            

          ))}
        </div>
      </Box>
    </Box>
  );
};

export default BookPDFSearch;
