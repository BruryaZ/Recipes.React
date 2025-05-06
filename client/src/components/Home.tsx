"use client"

import { Box, Typography, Grid, Paper, Button, Card, CardMedia, CardContent, Container, Divider } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { detailsContext } from "../context/Provider"
import "../styles/global.css"

// Import images
import milky from "../img/milky.jpg"
import fleshy from "../img/fleshy.jpg"
import petit_fours from "../img/petit_fours3.jpg"
import children from "../img/child_food.jpg"
import cake from "../img/cakes.jpg"
import personal_cups from "../img/personal_cups.png"

const Home = () => {
  const navigate = useNavigate()
  const { id } = useContext(detailsContext)
  const isLoggedIn = id !== -1

  const featuredCategories = [
    { title: "בר חלבי", image: milky, description: "מתכונים חלביים מפנקים לכל אירוע" },
    { title: "בשרים", image: fleshy, description: "מתכוני בשר עסיסיים וטעימים" },
    { title: "פטיפורים", image: petit_fours, description: "קינוחים קטנים ומתוקים" },
    { title: "אוכל שילדים אוהבים", image: children, description: "מתכונים שילדים יאהבו במיוחד" },
    { title: "עוגות", image: cake, description: "עוגות מרשימות לכל אירוע" },
    { title: "כוסות קינוח אישיות", image: personal_cups, description: "קינוחים אישיים מרשימים" },
  ]

  return (
    <Box sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          height: 400,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${personal_cups})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            ברוכים הבאים לאתר המתכונים שלנו
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            מבחר ענק טעים ומרשים של מתכונים בריאים מקלי הכנה ועד להכנה מורכבת
          </Typography>
          {!isLoggedIn && (
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 8,
                  backgroundColor: "linear-gradient(35deg,#1e1e1e ,#90caf9)",
                }}
              >
                התחברות
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/sign-up")}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderColor: "white",
                  },
                }}
              >
                הרשמה
              </Button>
            </Box>
          )}
        </Container>
      </Paper>

      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: "center" }}>
          קטגוריות מתכונים
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {featuredCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                  },
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardMedia component="img" height="200" image={category.image} alt={category.title} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      {isLoggedIn ? (
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "var(--mui-overlays-1)",
          }}
        >
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
            ?רוצים להוסיף מתכון משלכם
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            שתפו את המתכונים האהובים עליכם עם הקהילה שלנו
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/add-recipe")}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 8,
            }}
          >
            הוספת מתכון חדש
          </Button>
        </Paper>
      ) : (
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            backgroundImage: "linear-gradient(135deg,#1e1e1e ,#90caf9)",
            color: "white",
          }}
        >
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
            !הצטרפו אלינו עוד היום
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            הירשמו כדי לקבל גישה למתכונים בלעדיים ולשתף את המתכונים שלכם
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/sign-up")}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 8,
              backgroundColor: "#1e1e1e",
              color: "#1976d2",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            הרשמה עכשיו
          </Button>
        </Paper>
      )}
    </Box>
  )
}

export default Home
