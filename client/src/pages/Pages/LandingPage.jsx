import React from "react";
import { Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { motion } from "framer-motion";


const features = [
  {
    icon: <SchoolIcon color="primary" sx={{ fontSize: 40 }} />,
    title: "Personalized Courses",
    desc: "Get learning paths tailored to your interests & goals.",
  },
  {
    icon: <AccessTimeIcon color="secondary" sx={{ fontSize: 40 }} />,
    title: "Learn Anytime",
    desc: "24/7 platform access to fit your schedule.",
  },
  {
    icon: <AutoGraphIcon color="success" sx={{ fontSize: 40 }} />,
    title: "Track Progress",
    desc: "Smart dashboard with real-time analytics.",
  },
];

const LandingPage = () => {
  return (
    <Box sx={{ overflowX: "hidden", fontFamily: "Poppins, sans-serif" }}>
      {/* Hero Section */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 4,
          py: 10,
          background: "linear-gradient(to right, #fbc2eb, #a6c1ee)",
        }}
      >
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Welcome to <span style={{ color: "#7e57c2" }}>bookWise</span>
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Your smart LMS platform to Discover, Learn, and Grow 🚀
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: "30px",
                px: 4,
                py: 1.5,
                backgroundColor: "#7e57c2",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#5e35b1",
                },
              }}
              component={motion.a}
              href="/home"
              whileHover={{ scale: 1.1 }}
            >
              Get Started
            </Button>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={5}>
          <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            src={"https://i.ibb.co/cPfg3ZP/library-management-system.jpg"}
            alt="LMS illustration"
            style={{
              width: "100%",
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          />
        </Grid>
      </Grid>

      {/* Features Section */}
      <Box sx={{ px: 4, py: 10, textAlign: "center", bgcolor: "#f3f4f6" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📘 Why Choose bookWise?
        </Typography>

        <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
          {features.map((feature, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  elevation={6}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    height: "100%",
                    textAlign: "center",
                  }}
                >
                  <CardContent>
                    {feature.icon}
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          backgroundColor: "#e1bee7",
          color: "#4a148c",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} bookWise LMS | Learn. Empower. Succeed.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
